import express from 'express';
import { register,login, logout, sendVerifyOtp, verifyEmail, isAuthenticated, sendResetOtp, resetPassword } from '../controllers/authController.js';
import { userAuth } from '../middleware/userAuth.js';


const authRouter= express.Router();
authRouter.post('/register', register)
authRouter.post('/login',login)
authRouter.post('/logout',logout)
authRouter.post('/send-verify-otp',userAuth, sendVerifyOtp)  // add uderId
authRouter.post('/verify-account',userAuth, verifyEmail)  // add uderId
authRouter.get('/is-auth',userAuth, isAuthenticated)  // add uderId
authRouter.post('/send-reset-otp', sendResetOtp)  // add uderId
authRouter.post('/reset-password', resetPassword)  // add uderId




export default authRouter;