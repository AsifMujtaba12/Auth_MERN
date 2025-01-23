import React, { useContext } from 'react'
import { useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import {toast} from 'react-toastify'

const Login = () => {
    // login form here with email and password inputs and login button
const navigate = useNavigate();
const {backendUrl, setIsLoggedin,getUserData}= useContext(AppContext);
const [state, setState] = useState('Sign Up');
const [name,setName]=useState('');
const [email,setEmail]=useState('');
const [password,setPassword]=useState('');

const onSubmitHandler= async (e)=>{
    try{
        e.preventDefault(); 
        axios.defaults.withCredentials = true;   // send cookies with tis request
        if(state === 'Sign Up' ){
        const {data} = await axios.post(`${backendUrl}/auth/register`, { name, email, password });
         if(data.success){
            setIsLoggedin(true);
            getUserData(); //user is logid in
            navigate('/');
         }else{
            toast.error(data.message);
     }
        }
        else{
            const {data} = await axios.post(`${backendUrl}/auth/login`, { email, password }, {withCredentials: true});

         if(data.success){
            setIsLoggedin(true);
            getUserData(); //user is logid in
            navigate('/');
         }else{
            toast.error(data.message);
     }
              
        }
        

    }catch(error){
        toast.error('Something went wrong');
        console.error(error);
    }
}

  return (
    <div className='bg-gradient-to-br from-blue-200 to-purple-400
     flex flex-col items-center justify-center min-h-screen
    px-6 sm:px-0 bg-purple-400'>
      <img  onClick={()=>navigate('/')} src={assets.logo} className='absolute left-5 sm:left-20
      top-5 w-28 sm:w-32 cursor-pointer'/>
      <div className='bg-slate-900 p-10 text-indigo-300 rounded-lg w-full sm:w-96
      text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center
        mb-3'>{state === "Sign Up" ? 'Create Account': 'Login'}</h2>
        <p className=' text-center mb-3 text-sm'>{state === "Sign Up" ? 'Create your Account': 'Login to your account'}</p>

    <form onSubmit={onSubmitHandler}>
    {state === "Sign Up"  && (
        <div className='flex mb-4 items-center gap-3 w-full px-5 
         py-2.5 rounded-full bg-[#333a5c]'>
        <img src={assets.person_icon} />

        <input onChange={(e)=>setName(e.target.value)}
        value={name} className='outline-none bg-transparent text-white' type='text' placeholder='Full Name' required/>
        </div>)}
    
    <div className='flex mb-4 items-center gap-3 w-full px-5 
    py-2.5 rounded-full bg-[#333a5c]'>
        <img src={assets.mail_icon} />
        <input 
        onChange={(e)=>setEmail(e.target.value)} 
        value={email} className='outline-none bg-transparent text-white' type='Email' placeholder='Email id' required/>
        </div>
        <div className='flex mb-4 items-center gap-3 w-full px-5 
    py-2.5 rounded-full bg-[#333a5c]'>
        <img src={assets.lock_icon} />
        <input onChange={(e)=>setPassword(e.target.value)}
        value={password} className='outline-none bg-transparent text-white' type='password' placeholder='Password' required/>
        </div>

        {/* Forgot Password */}
        <p onClick={()=>navigate('/reset-password')} className='text-indigo-500 cursor-pointer mb-4'>Forgot password</p>

        {/* Sign Up and Login In button click */}
        <button className='w-full px-5 py-3 text-white rounded-full
        bg-[#4c60d0] hover:bg-[#41518c] font-medium'>{state === "Sign Up"? 'Sign Up': 'Log In'}</button>
      </form>

      {/* Switch between Sign Up and Login */}
      {state === "Sign Up" ? (<p className='text-gray-400 text-center text-xs mt-4'>Already have an account?{' '}
        <span onClick={()=>setState('Login')} className='text-blue-400 cursor-pointer 
        underline'>Login here</span></p>
        ):(
            <p className='text-gray-400 text-center text-xs mt-4'>Don't have an account?{' '}
            <span onClick={()=>setState('Sign Up')} className='text-blue-400 cursor-pointer underline'>Sign Up</span></p>
         )}
      
      
    




      </div>
    </div>
  )
}

export default Login
