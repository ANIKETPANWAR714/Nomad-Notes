import moment from "moment";
import React from "react";
import { GrMapLocation } from "react-icons/gr";
import { MdAdd, MdDeleteOutline, MdUpdate, MdClose } from "react-icons/md";

const ViewTravelStory = ({ storyinfo , onClose  , onEditClick , onDeleteClick}) => {
    const imageUrl = storyinfo.imageUrl ? storyinfo.imageUrl.replace('https://', 'http://') : null;
    return (
        <div className="relative">
            <div className="flex items-center justify-end m-[10px] ">
                <div>
                    <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-lg">
                        <button className="btn-small" onClick={onEditClick}>
                            <MdUpdate className="text-lg" /> UPDATE STORY
                        </button>
                        <button className="btn-small btn-delete" onClick={onDeleteClick}>
                            <MdDeleteOutline className="text-lg" /> Delete
                        </button>
                        <button className="" onClick={onClose}>
                            <MdClose className="text-xl text-slate-400" />
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex-1 flex flex-col gap-2 py-4 m-[10px] ">
                <h1 className="text-2xl text-slate-950 ">
                    {storyinfo && storyinfo.title}
                </h1>
                <div className="flex items-center justify-between gap-3  ">
                    <span className="text-xs text-slate-500">
                        {storyinfo && moment(storyinfo.visitedDate).format("Do MMM YYYY")}
                    </span>
                    <div className="inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded px-2 py-1">
                        <GrMapLocation 
                        className="text-sm"/>
                        {storyinfo && storyinfo.visitedLocation.map((item , index)=>storyinfo.visitedLocation.length==index+1 ? `${item}`:`${item}`)}
                    </div>
                </div>
               
                <img src={storyinfo && imageUrl} alt="Selected" className="w-full h-[300px] object-cover rounded-lg"/>
            </div>
            <div className="mt-4">
                <p className="text-sm text-slate-950 leading-6 text-justify whitespace-pre-line">{storyinfo.story}</p>
            </div>
        </div>
    );
};

export default ViewTravelStory;
