import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
const Header = () => {
    const{userData}=useContext(AppContext);
    
  return (
    <div className='flex flex-col items-center mt-20
    px-4 text-center text-gray-800'>
      <img className='w-36 h-36 rounded-full mb-6' src={assets.header_img}/>
      <h1 className='flex items-center gap-2 text-xl sm:text-3xl
      font-medium mb-2'>Hey {userData? userData.name:'Developer'} <img src={assets.hand_wave}  className='w-8 aspect-square'/></h1>
      <h1 className='text-3xl sm:text-5xl font-semibold mb-4
      '>Welcome to our Website</h1>
      <p className='mb-8 max-w-md'>This is a simple website created using MERN Stack and Tailwind CSS.</p>
      <button className='border broder-gray-500 bg-blue-500 hover:bg-blue-700 transition-all
       text-white 
      font-bold py-2.5 px-8 rounded-full'>Get Started</button>
    </div>
  )
}

export default Header
