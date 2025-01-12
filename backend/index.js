require("dotenv").config();

const bcrypt = require("bcryptjs");
const config = require("./config.json");
const mongoose = require("mongoose");
const express = require("express");
const jwt = require("jsonwebtoken");

const upload = require('./multer');
const fs = require('fs');
const path = require('path');
const cors = require("cors");
const User = require("./models/usermodel");
const TravelStory = require("./models/travelStory.model");
const { authenticateToken } = require("./utilities");



mongoose.connect(config.connectionString);


const app = express();
app.use(express.json());
app.use(cors({origin:"*"}));

app.post("/create-account", async(req,res)=>{
    const {fullName , email , password } = req.body;
    
    if(!fullName || !email || !password )
    {
        return res
               .status(400)
               .json({error:true , message:"all fields are necessary"});
    }
    const isUser = await User.findOne({email});
    if(isUser)
    {
        return res.status(400).json({error:true , message:"user already exists"});
    }


    const hashedPassword = await bcrypt.hash(password , 10);
    const user = new User({
        fullName,
        email,
        password:hashedPassword,

    });
    await user.save();
    const accessToken = jwt.sign(
    {userID:user._id},
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:"72h",
    }


    );

    return res.status(201).json({
        error:false,
        user:{fullName:user.fullName , email:user.email},
        accessToken,
        message:"Registeration Successful",
    });
   
});

app.post("/login" , async(req , res) => {
    const { email , password} = req.body;

    if(!email || !password )
    {    return res.status(400).json({message:'Email and Password are required'});

    }
    const user = await User.findOne({ email });

    if(!user)
    {
        return res.status(400).json({message:'User not found'});

    }
    const isPasswordValid = await bcrypt.compare(password , user.password);

    if(!isPasswordValid)
    {
        return res.status(400).json({message:'Invalid Credentials'});

    }

    const accessToken = jwt.sign(
        {userId:user._id},
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:"72h",
        }
    );

    return res.json({
        error:false,
        message:'login successful',
        user:{ fullName:user.fullName , email:user.email},
        accessToken,

    });
        

})

app.get('/get-user' ,authenticateToken, async (req , res)=>{
    const {userId} = req.user
    
    const isUser = await User.findOne({ _id : userId });

    if(!isUser)
    {
        return res.sendStatus(401);
    }
    return res.json({
        user:isUser,
        message:"",

    });


})

app.post('/add-travel-story' , authenticateToken , async (req , res)=>{

    const {title , story , visitedLocation ,imageUrl , visitedDate} = req.body;
    const { userId} = req.user;
    if(!title || !story || !visitedLocation || !imageUrl || !visitedDate)
    {
        return res.status(400).json({message:"All fields are required"});

    }
    const parseVisitedDate = new Date(parseInt(visitedDate));

    try{
        const travelStory = new TravelStory({
            title,
            story,
            visitedLocation,
            userId,
            imageUrl,
            visitedDate:parseVisitedDate,

        });

        await travelStory.save();
        res.status(201).json({story:travelStory , message:"added successfully"});
    }
    catch(error){
        res.status(400).json({error:true , message:error.message});
    }


});

app.get('/get-all-stories' , authenticateToken , async (req,res)=>{
    const { userId} = req.user;

    try{
        const travelstories = await TravelStory.find({userId:userId}).sort({
            isFavourite :-1,
        })
        res.status(200).json({stories:travelstories});
    }
    catch(error){
        res.status(400).json({error:true , message:error.message});
    }


})

app.post('/image-upload' , upload.single('image') , async(req , res)=>{
    try{
        if(!req.file){
            return res.status(400).json({error:true , message:'no image uploaded'});
        }
        const imageUrl = `http://localhost:8080/uploads/${req.file.filename}`;

        res.status(200).json({imageUrl});
    }
    catch(error){
        res.status(500).json({error:true , message:error.message});
    }


})

app.delete('/delete-image' ,async(req , res)=>{
    const { imgUrl }= req.query;
    if(!imgUrl){
        return res.status(400).json({error:true , message:'imageUrl parameter is required'});

    }
    try{
        const filename = path.basename(imgUrl);
        const filepath = path.join(__dirname , 'uploads' , filename);

        if(fs.existsSync(filepath)){
            fs.unlinkSync(filepath);
            res.status(200).json({message:'image deleted successfully'});

        }
        else{
            res.status(200).json({error:true , message:'image not found'});


        }
    }
    catch(error)
    {
        res.status(500).json({eror:true , message:error.message});
    }

} )

app.put('/edit-story/:id' , authenticateToken , async (req , res)=>{
    const { id } = req.params;
   

    const { title , story , visitedLocation,imageUrl , visitedDate} = req.body;
    const { userId} = req.user;

    if(!title || !story || !visitedLocation || !visitedDate)
    {
        return res.status(400).json({ error:true , message:'all fields are necessdary'});
    }
    const parseVisitedDate = new Date(parseInt(visitedDate));

    try{
        const travelStory = await TravelStory.findOne({_id:id ,userId:userId} );

        if(!travelStory)
        {
            return res.status(400).json({ error:true , message:'Travel Story not found'});

        }

        const placeholderUrl = `https://localhost:8080/assets/placeholder.png`;
        travelStory.title = title;
        travelStory.story = story;
        travelStory.visitedLocation = visitedLocation;
        travelStory.imageUrl = imageUrl || placeholderUrl;

        travelStory.visitedDate = parseVisitedDate;
        await travelStory.save();
        res.status(200).json({story:travelStory , message:'Update Successful'});

    }
    catch(error){
        res.status(500).json({eror:true , message:error.message});

    }


})

app.delete('/delete-story/:id' , authenticateToken , async(req , res)=>{
    const { id } = req.params;
    const { userId} = req.user;

    try{
            const travelStory = await TravelStory.findOne({_id:id ,userId:userId} );
    
            if(!travelStory)
            {
                return res.status(400).json({ error:true , message:'Travel Story not found'});
    
            }

            await travelStory.deleteOne({_id:id , userId:userId});

            const imageUrl = travelStory.imageUrl;
            const filename = path.basename(imageUrl);
            const filepath = path.join(__dirname , 'uploads' , filename);

            fs.unlink(filepath , (err)=>{
                if(err){
                    console.error('Failed to delete file:' , err);
                }
            });

            res.status(200).json({message:'Travel Story deleted successfully'});

    }
    catch(error){
        res.status(500).json({eror:true , message:error.message});

    }




})

app.put('/update-isFavourite/:id' , authenticateToken , async(req , res)=>{
    const { id } = req.params;
    const { userId} = req.user;
    const { isFavourite} = req.body;

    try{
        const travelStory = await TravelStory.findOne({_id:id ,userId:userId} );

        if(!travelStory)
        {
            return res.status(400).json({ error:true , message:'Travel Story not found'});

        }

        travelStory.isFavourite = isFavourite;
        await travelStory.save();
        res.status(200).json({story:travelStory , message:'Updated successfully'});

    }
    catch(error){
        res.status(500).json({eror:true , message:error.message});

    }
    





})

app.get('/search' , authenticateToken , async(req , res)=>{
    const { query } = req.query;
    const { userId} = req.user;

    if(!query){
        return res.status(401).json({error:true , message:'query is required'});
    }
    try{
        const searchResults = await TravelStory.find({
            userId:userId,
            $or:[
                {title:{$regex:query , $options:"i"}},
                {story:{$regex:query , $options:"i"}},
                {visitedLocation:{$regex:query , $options:"i"}},
            ],

        }).sort({isFavourite:-1});

        res.status(200).json({story:searchResults});


    }
    catch(error){
        res.status(500).json({eror:true , message:error.message});

    }

})

app.get('/travel-stories/filter' , authenticateToken , async(req , res)=>{
    const { startDate , endDate } = req.query;
    const { userId } = req.user;
    try{
        const start = new Date(parseInt(startDate));
        const end = new Date(parseInt(endDate));
        const filteredStories = await TravelStory.find({
            userId:userId,
            visitedDate:{$gte:start , $lte:end},

        }).sort({isFavourite:-1});

        res.status(200).json({stories:filteredStories});

    }
    catch(error){
        res.status(500).json({eror:true , message:error.message});

    }


})

app.use('/uploads' , express.static(path.join(__dirname , 'uploads')));
app.use('/uploads' , express.static(path.join(__dirname , 'assets')));

app.listen(8080 , ()=>{
    
    console.log("server started ");
});
module.exports = app;