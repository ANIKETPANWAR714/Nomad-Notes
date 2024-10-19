import React, { useState } from 'react';
import { MdAdd, MdClose, MdDeleteOutline, MdUpdate } from 'react-icons/md';
import DateSelector from '../../components/input/DateSelector';
import ImageSelector from '../../components/input/ImageSelector';
import TagInput from '../../components/input/TagInput';
import uploadImage from '../../utils/uploadImage';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axiosInstance';
import moment from 'moment';

const AddEditStory = ({ storyinfo, type, onClose, getAllTravelStories }) => {
  const [title, setTitle] = useState(storyinfo ? storyinfo.title : "");
  const [storyImg, setStoryImg] = useState(storyinfo?.imageUrl );
  const [story, setStory] = useState(storyinfo ? storyinfo.story : "");
  const [visitedLocation, setVisitedLocation] = useState(storyinfo ? storyinfo.visitedLocation : []);
  const [visitedDate, setVisitedDate] = useState(storyinfo ? moment(storyinfo.visitedDate) : null);
  const [error, setError] = useState("");

  const addNewTravelStory = async () => {
    try {
      let imageUrl = "";

      // Upload image if present
      if (storyImg) {
        const imgUploadRes = await uploadImage(storyImg);
        imageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post("/add-travel-story", {
        title,
        story,
        imageUrl: imageUrl || "",
        visitedLocation,
        visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf(),
      });

      if (response.data && response.data.story) {
        toast.success("Story Added Successfully");
        getAllTravelStories();
        onClose();
      }
    } catch (error) {
      console.error("An unexpected error occurred", error);
      toast.error("Failed to add story");
    }
  };

  const updateTravelStory = async () => {
    try {
      let postData = {
        title,
        story,
        imageUrl: storyinfo.imageUrl || "",
        visitedLocation,
        visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf(),
      };

      // Upload new image if one is selected
      if (storyImg && typeof storyImg === 'object') {
        const imageUploadRes = await uploadImage(storyImg);
        postData.imageUrl = imageUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.put('/edit-story/' + storyinfo._id, postData);

      if (response.data && response.data.story) {
        toast.success("Story Updated Successfully");
        getAllTravelStories();
        onClose();
      }
    } catch (error) {
      console.error("An unexpected error occurred", error);
      toast.error("Failed to update story");
    }
  };

  const handleAddOrUpdateClick = () => {
    console.log("Input Data:", { title, storyImg, story, visitedLocation, visitedDate });
    
    if (!title) {
      setError("Please enter the title");
      return;
    }
    if (!story) {
      setError("Please enter the story");
      return;
    }

    setError("");
    if (type === "edit") {
      updateTravelStory();
    } else {
      addNewTravelStory();
    }
  };

  const handleDeleteImage = async () => {
    

      // Call the delete API
      const deleteImgRes = await axiosInstance.delete('/delete-image', {
        params: {
          imageUrl: storyinfo.imageUrl,
        },
      });

      // Check if the delete was successful
      if (deleteImgRes.data) {
        let postData1 = {
          title,
          story,
          visitedLocation,
          visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf(),
          imageUrl: "", // Set the imageUrl to empty string
        };

        // Update the story on the server after deleting the image
        const response = await axiosInstance.put('/edit-story/' + storyinfo._id, postData1);
        setStoryImg(null);
   
  };
}

  return (
    <div>
      <div className='flex items-center justify-between m-[20px]'>
        <h5 className='text-xl text-slate-700 font-medium m-[5px]'>
          {type === 'add' ? "Add Story" : "Update Story"}
        </h5>
        <div>
          <div className='flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg'>
            {type === 'add' ? (
              <button className='btn-small' onClick={handleAddOrUpdateClick}>
                <MdAdd className='text-lg' /> ADD STORY
              </button>
            ) : (
              <>
                <button className='btn-small' onClick={handleAddOrUpdateClick}>
                  <MdUpdate className='text-lg' /> UPDATE STORY
                </button>
                <button className='btn-small btn-delete' onClick={onClose}>
                  <MdDeleteOutline className='text-lg' /> DELETE
                </button>
              </>
            )}
            <button onClick={onClose}>
              <MdClose className='text-xl text-slate-400' />
            </button>
          </div>
        </div>
      </div>
      {error && <div className="text-red-500">{error}</div>} {/* Error message display */}
      <div className='flex flex-1 flex-col gap-2 pt-4 m-[17px]'>
        <label className='input-label'>TITLE</label>
        <input
          type="text"
          className='text-2xl text-slate-950 outline-none'
          placeholder='A Day at the Great Wall'
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />

        <div className='my-4'>
          <DateSelector date={visitedDate} setDate={setVisitedDate} />
        </div>
        <ImageSelector image={storyImg} setImage={setStoryImg} handleDeleteImage={handleDeleteImage} />
        <div className='flex flex-col gap-2 mt-4'>
          <label className='input-label'>ADD STORY</label>
          <textarea
            className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
            placeholder='Your Story'
            rows={10}
            value={story}
            onChange={({ target }) => setStory(target.value)}
          />
        </div>

        <div className='pt-3'>
          <label className='input-label'>VISITED LOCATIONS</label>
          <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
        </div>
      </div>
    </div>
  );
};

export default AddEditStory;
