import React from 'react';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { IoMdClose } from 'react-icons/io';

const SearchBar = ({ value, onChange, onClearSearch, handleSearch }) => {
  return (
    <div className='w-80 flex items-center px-4 bg-slate-100 rounded-md'>
      <input
        type="text"
        placeholder='Search Stories' // Updated placeholder for better context
        className='w-full text-xs bg-transparent py-[11px] outline-none'
        value={value}
        onChange={onChange} // Update value as user types
      />
      {value && (
        <IoMdClose
          className='text-xl text-slate-500 cursor-pointer hover:text-black mr-3'
          onClick={onClearSearch} // Clear search input on click
        />
      )}
      <FaMagnifyingGlass
        className='text-slate-400 cursor-pointer hover:text-black'
        onClick={handleSearch} // Trigger search action on click
      />
    </div>
  );
};

export default SearchBar;
