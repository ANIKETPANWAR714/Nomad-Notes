import React, { useEffect } from 'react'
import NavBar from '../../components/NavBar'
import { useState  } from 'react';
import { useNavigate} from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'

const Home = () => {
  const navigate = useNavigate();
  const [userinfo , setuserinfo ] = useState();
  const getUserInfo =async () =>{
    try{
      const response = await axiosInstance.get('/get-user');
      if(response.data && response.data.user){
        setuserinfo(response.data.user);
      }
    } catch(error){
      if(error.response.status==401)
      {
        localStorage.clear();
        navigate('/login');
      }
    }

  };
  useEffect(()=>{
    getUserInfo();

    return ()=>{}


  } , []);
  return (
    <>
      <NavBar userinfo={userinfo} />
    </>
  )
}

export default Home;