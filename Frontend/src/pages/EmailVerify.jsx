import React from 'react'
import { assets } from '../assets/assets'

const Emailverify = () => {
  return (
    <div className='bg-gradient-to-br from-blue-200 to-purple-400
    flex flex-col items-center justify-center min-h-screen
   px-6 sm:px-0 bg-purple-400'>
 <img  onClick={()=>navigate('/')} src={assets.logo} className='absolute left-5 sm:left-20
      top-5 w-28 sm:w-32 cursor-pointer'/>

      <form className='bg-slate-900 p-8 rounded-lg w-full sm:w-96 text-sm'>
      <h1 className='text-white text-center text-2xl font-semibold mb-4'>Email Verify  OTP</h1>
   <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent to your email id. </p>
      </form>
     
    </div>
  )
}

export default Emailverify
