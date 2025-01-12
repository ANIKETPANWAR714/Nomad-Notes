import React from 'react';
import { FaHeart } from "react-icons/fa6";
import { GrMapLocation } from 'react-icons/gr';
import moment from 'moment';

const TravelStoryCard = ({
  _id, // Add _id prop for the story ID
  imgUrl,
  title,
  date,
  story,
  visitedLocation,
  isFavourite,
  onFavouriteClick,
  onClick
}) => {
  // Convert https to http if needed
  const fixedImgUrl = imgUrl.startsWith('https') ? imgUrl.replace('https://', 'http://') : imgUrl;

  // Handle click event to include story ID
  const handleCardClick = () => {
    if (onClick) {
      onClick(_id); // Pass the story ID when the card is clicked
    }
  };

  return (
    <div className='relative border rounded-lg overflow-hidden bg-white hover:shadow-lg transition-all ease-in-out cursor-pointer'>
      <div className="relative">
        <img
          src={fixedImgUrl}  // Using the corrected URL
          alt={title}
          className='w-full h-56 object-cover rounded-lg'
          onClick={handleCardClick} // Use handleCardClick to handle the click
        />

        <div className="absolute inset-0 flex justify-end items-start p-4">
          <button
            className='w-10 h-10 flex items-center justify-center bg-white/70 rounded-full border border-white/30 transition-colors duration-200'
            onClick={(e) => {
              e.stopPropagation(); // Prevent the click from bubbling up to the card
              onFavouriteClick();
            }}
          >
            <FaHeart
              className={`text-xl ${isFavourite ? 'text-red-500' : 'text-gray-500'} hover:text-red-500 transition duration-200`}
            />
          </button>
        </div>
      </div>

      <div className='p-4' onClick={handleCardClick}> {/* Use handleCardClick for the title and description */}
        <div className='flex items-center gap-3'>
          <div className='flex-1'>
            <h6 className='text-sm font-medium'>{title}</h6>
            <span className='text-xs text-slate-500'>
              {date ? moment(date).format('Do MMM YYYY') : '-'}
            </span>
          </div>
        </div>
        <p className='text-xs text-slate-600 mt-2'>{story?.slice(0, 60)}{story?.length > 60 ? '...' : ''}</p>
        <div className='inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded mt-3 px-2 py-1'>
          <GrMapLocation className='text-sm' />
          {visitedLocation.join(', ')} {/* Concatenating visited locations */}
        </div>
      </div>
    </div>
  );
};

export default TravelStoryCard;

