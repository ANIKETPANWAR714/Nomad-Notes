import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import PasswordInput from '../../components/input/PasswordInput';

const Login = () => {

  const [email , setEmail ] = useState("");
  const [password , setPassword ] = useState("");
  const [error , setError ] = useState(null);

  const navigate = useNavigate();
  const handleLogin = async (e)=>{
    e.preventDefault();

    if(!validateEmail(email)){
      setError("Please enter valid email");
      return ;
    }
    if(!password){
      setError('Please enter the password');
      return ;
    }

    try{
      const response = await axiosInstance.post('/login' , {
        email:email,
        password:password
      });

      if(response.data && response.data.accessToken){
        localStorage.setItem("token" , response.data.accessToken);
        navigate("/dashboard");
      }
    }
    catch (error) {
      // Check for error response from the backend
      if (error.response && error.response.status === 401) {
        setError("Invalid email or password");
      } else if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred, please try again.");
      }
    }
  }
  
  return (
    <div className='h-screen bg-cyan-50  overflow-hidden relative'>
      <div className='login-ui-box right-10 -top-40' />
      <div className='login-ui-boxbg-cyan-200 -bottom-40 right-1/2' />

         <div className='container h-screen flex justify-center items-center px-20 mx-auto '>
             <div className='w-2/4 h-[90vh] flex items-end bg-login-bg-img bg-cover bg-center rounded-lg p-5 z-50'>
              <div>
                <h4 className='text-4xl text-white font-semibold leading-[45px]'>
                  Capture Your <br /> Journeys

                </h4>
                <p className='text-[15px] text-white leading-7 pr-7 mt-4'>
                  Record your travel experiences and your memories in your personal 
                  travel journal
                </p>
              </div>
             </div>
             <div className='bg-white w-2/4 h-[75vh]  rounded-r-lg relative p-16 shadow-lg shadow-cyan-200/20'>
              <form onSubmit={handleLogin}>
              
                <h4 className='text-2xl font-semibold mb-7'>Login</h4>
                <input type="text" placeholder='Email' className='input-box'
                value={email}
                onChange={({target})=>{setEmail(target.value)}} />
                <PasswordInput 
                value={password}
                onChange={({target})=>{setPassword(target.value)}}/>

                {error && <p className='text-red-500 test-xs pb-1'>{error}</p>}
                <button type='submit' className='btn-primary' >LOGIN</button>


                <p className='text-sm text-slate-500 text-center my-4'>or</p>
                <button
                type='submit'
                className='btn-primary btn-light'
                onClick={()=>{
                  navigate("/signup")
                }}>
                  CREATE ACCOUNT

                </button>
              </form>
             </div>
         </div>
    </div>
  )
}

export default Login