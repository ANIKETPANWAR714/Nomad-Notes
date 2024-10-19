import React from 'react';
import LOGO from '../assets/images/logo.svg';
import ProfileInfo from './cards/ProfileInfo';
import { useNavigate } from 'react-router-dom';
import SearchBar from './input/SearchBar';

const NavBar = ({
  userinfo,
  searchBarQuery,
  setSearchQuery,
  setAllStories,
  onSearchNote, 
  handleClearSearch // Prop to update allStories in Home component
}) => {
  const isToken = localStorage.getItem('token');
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleSearch = async () => {
    if (searchBarQuery) {
      await onSearchNote(searchBarQuery); // Call the search function with the query
    }
  };

  const onClearSearch = () => {
    handleClearSearch(); // Reset the stories to the original list
    setSearchQuery(''); // Clear the search input
  };

  return (
    <div className='bg-white flex justify-between items-center px-6 py-2 drop-shadow sticky top-0 z-10'>
      <img src={LOGO} alt="Logo" className='h-[70px] w-[120px]' />
      {isToken && (
        <>
          <SearchBar
            value={searchBarQuery}
            onChange={({ target }) => {
              setSearchQuery(target.value); // Update search query as user types
            }}
            handleSearch={handleSearch} // Handle search on button click
            onClearSearch={onClearSearch} // Handle clear search action
          />
          <ProfileInfo userinfo={userinfo} onLogout={onLogout} /> {/* User profile info and logout */}
        </>
      )}
    </div>
  );
};

export default NavBar;
