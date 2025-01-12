import React, { useEffect, useRef, useState } from 'react'
import {FaRegFileImage} from 'react-icons/fa'
import { MdDeleteOutline } from 'react-icons/md';

const ImageSelector = ({image , setImage , handleDeleteImage}) => {
    const inputref = useRef(null);
    const [previewurl , setpreviewurl ] = useState(null);
    const handleImageChange =(event)=>{
        const file = event.target.files[0];
        if(file){
            setImage(file);
        }

    }

    const onChooseFile = () =>{
        inputref.current.click();
    }

    const handleRemoveImage = ()=>{
        setImage(null);
        handleDeleteImage();
    }

    useEffect(()=>{
        if(typeof image ==='string'){
            setpreviewurl(image);
        }
        else if(image){
            setpreviewurl(URL.createObjectURL(image));
        }
        else{
            setpreviewurl(null);
        }

        return () =>{
            if(previewurl && typeof previewurl==='string' && !image){
                URL.revokeObjectURL(previewurl);
            }
        }

    } , [image])

  return (
    <div>
        <input type="file"
        accept='image/*'
        ref={inputref}
        onChange={handleImageChange}
        className='hidden'
         />


         {!image ? <button className='w-full h-[200px] flex flex-col items-center justify-center gap-4 bg-slate-50 rounded border border-slate-200/70 ' onClick={()=>onChooseFile()}>
            <div className='w-14 h-14 flex items-center justify-center bg-cyan-50 rounded-full border border-cyan-100'>
                <FaRegFileImage  className='text-xl text-cyan-500'/>
            </div>

            <p className='text-sm text-slate-500 '>Browse File to Upload</p>

         </button> :(
            <div className='w-full relative'>
                <img src={previewurl} alt="Selected" className='w-full rounded-lg object-cover'/>

                <button className='btn-small btn-delete absolute top-2 right-2'
                onClick={handleRemoveImage}
                >
                    <MdDeleteOutline className='text-lg '/>


                </button>

            </div>
   ) }
    </div>
  )
}

export default ImageSelector