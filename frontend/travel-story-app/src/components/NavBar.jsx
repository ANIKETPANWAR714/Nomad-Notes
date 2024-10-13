import React from 'react'
import LOGO from '../assets/images/logo.svg'
import ProfileInfo from './cards/ProfileInfo';

const NavBar = ({userinfo}) => {
  return (
    <div className='bg-white flex justify-between items-center px-6 py-2 drop-shadow sticky top-0 z-10'>
        <img src={LOGO} alt="" className='h-[70px] w-[120px] ' />

        <ProfileInfo />
    </div>
  )
}

export default NavBar;