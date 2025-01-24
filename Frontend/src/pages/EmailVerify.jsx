import React, { useEffect, useRef } from 'react'
import { assets } from '../assets/assets'
import { useNavigate} from'react-router-dom';
import { toast } from'react-toastify';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import {useContext} from 'react';

const Emailverify = () => {
  axios.defaults.withCredentials = true;
  const {backendUrl, isLoggedin, userData,getUserData}= useContext(AppContext);
const navigate= useNavigate();
  //store otp 
  const inputRefs= useRef([]);   // Array to hold references to input fields
  const handleInput=(e,index)=>{
    if(e.target.value.length > 0 && index < inputRefs.current.length-1){
      inputRefs.current[index+1].focus();  // Move focus to the next input field
    }
  }
  const handleKeyDown=(e,index)=>{
    if(e.key === 'Backspace'  && e.target.value === '' && index > 0){
     inputRefs.current[index-1].focus(); // Move focus to the
    }
  }
 const handlePaste =(e)=>{
    const paste= e.clipboardData.getData('text');
    const pasteArray= paste.split('');
    pasteArray.forEach((data,index)=>{
      if(inputRefs.current[index]){
        inputRefs.current[index].value=data;
      }
    })
 }
 const onSubmitHandler =async (e)=>{
   
   try{
    e.preventDefault();
    const otp= inputRefs.current.map(input=>input.value).join('');
     const {data} = await axios.post(`${backendUrl}/auth/verify-account`, { otp });
     if(data.success){
        toast.success(data.message);
        getUserData();
        navigate('/');
     }else{
       toast.error(data.message);
     }
   }catch(error){
     toast.error('Something went wrong');
   }
 }
 useEffect(()=>{
  isLoggedin && userData && userData.isAccountVerified && navigate('/');
 },[isLoggedin,userData])
  return (
    <div className='bg-gradient-to-br from-blue-200 to-purple-400
    flex flex-col items-center justify-center min-h-screen
   px-6 sm:px-0 bg-purple-400'>
 <img onClick={()=>navigate('/')} src={assets.logo} className='absolute left-5 sm:left-20
      top-5 w-28 sm:w-32 cursor-pointer'/>

      <form className='bg-slate-900 p-8 rounded-lg w-full sm:w-96 text-sm'>
      <h1 className='text-white text-center text-2xl font-semibold mb-4'>Email Verify  OTP</h1>
   <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent to your email id. </p>
   <div className='flex justify-between mb-8' onPaste={handlePaste}>
     {Array(6).fill(0).map((_,index)=>(
      <input type='text' maxLength='1' 
      ref={e=>inputRefs.current[index]=e}
      onInput={(e)=>handleInput(e,index)} key={index} required 
      onKeyDown={(e)=>handleKeyDown(e,index)}
       className=' rounded-md w-12 h-12 bg-[#333a5c] text-white text-xl text-center'/>
     ))}
   </div>
    <button onClick={onSubmitHandler} className='w-full py-3 text-white rounded-full bg-blue-500 hover:bg-blue-700 transition-all'>Verify email</button>
      </form>
     
    </div>
  )
}

export default Emailverify
