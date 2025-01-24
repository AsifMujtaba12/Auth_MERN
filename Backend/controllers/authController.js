import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodeMailer.js";

export const register = async (req, res) => {
  // Add code to register user
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.json({
      success: false,
      message: "Missing Details",
    });
  }
  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({
        success: false,
        message: "Email already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    //send this token to users in the response using cokkie
    res.cookie("token", token, {
      sceure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", //localhost=strict
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    //sending welcome email
    const mailOptions={
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Welcome to My Website',
      text: 'Welcome to My Website , Hi i am Asif Mujtaba'
  }
  console.log(mailOptions);

    await transporter.sendMail(mailOptions);
    return res.json({success: true});
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};


export const login = async(req, res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        return res.json({
            success: false,
            message: "Email and password are required"
        })
    }
    try{
const user = await userModel.findOne({email})
        if(!user) {
            return res.json({
                success: false,
                message: "Invalid email"
            })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.json({
                success: false,
                message: "Invalid password"
            })
            // login in authenticated
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
          });
          //send this token to users in the response using cokkie
          res.cookie("token", token, {
            sceure: process.env.NODE_ENV === "production",
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", //localhost=strict
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });

          return res.json({
            success: true,
            message: "Logged In successfully"
          })
    }catch(error){
        res.json({success: false,message: error.message})
    }
}


export const logout = async (req, res) => {
    try{
         res.clearCookie("token", {
            sceure: process.env.NODE_ENV === "production",
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production"? "none" : "strict", //localhost=strict
            maxAge: 0,
          });
         return res.json({success: true, message: "Logged Out successfully"});
    }catch(error){
     return res.json({success: false, message: error.message});
    }
}

//user's emial id verification function
export const sendVerifyOtp = async (req, res) => {  //send otp to emial
  try{
  const {userId} = req.body;  // Extracting userId from request body
  const user = await userModel.findById(userId);  // Fetching the user from the database using the userId
  if(user.isAccountVerified){
    return res.json({success: false, message: "Account Already verified"})
  }
  const otp = String(Math.floor(100000 + Math.random() * 900000)); // 6digit 
  user.verifyOtp = otp;
  user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: user.email,
    subject: 'Verify your email',
    text: `Your verification code is ${otp}`
  }
  await transporter.sendMail(mailOptions);
  return res.json({success: true, message: "Verification code sent to your email"})
  }catch(error){
    res.json({success: false, message: error.message})
  
}
}
// verify users otp function 
export const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;  // Extract userId and otp from request body
  
  if (!userId || !otp) {
    return res.json({ success: false, message: "Missing Details" });  // If userId or otp is missing
  }

  try {
    const user = await userModel.findById(userId);  // Find user by userId from the database
    
    if (!user) {
      return res.json({ success: false, message: "User not found" });  // If user is not found
    }

    if (user.verifyOtp === '' || user.verifyOtp !== otp) { 
      return res.json({ success: false, message: "Invalid OTP" });  // If OTP is invalid or not match
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });  // If OTP is expired
    }

    // If OTP is valid, expire time is not reached, and OTP matches
    user.isAccountVerified = true;  // Mark the account as verified
    user.verifyOtp = '';  // Clear the OTP after successful verification
    user.verifyOtpExpireAt = 0;  // Reset OTP expiry time

    await user.save();  // Save the updated user details to the database

    return res.json({ success: true, message: "Email verified successfully" });  // Return success message
  } catch (error) {
    return res.json({ success: false, message: error.message });  // Handle any errors
  }
};


// Check is user authenticated or not  
export const isAuthenticated= async (req, res) => {
  try{
   return res.json({
      success: true,
    })

  }catch(error){
    res.json({success: false, message: error.message});
  }
}


//Send password Reset otp
export const sendResetOtp= async(req, res)=>{
  const {email}= req.body;   // Extract the email from the request body.

  if(!email){  // Check if the email is provided.
    return res.json({success: false, message: "email is required"});
  }
  try{
const user = await userModel.findOne({email});   // Find the user in the database with the given email.
if(!user){  // Check if the user does not exist.
  return res.json({success: false, message: "User not found"})
}
// Generate a 6-digit OTP.
const otp = String(Math.floor(100000 + Math.random() * 900000)); // 6digit 
user.resetOtp = otp;
user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // 15 minutes
await user.save();
const mailOptions = {
  from: process.env.SENDER_EMAIL,
  to: user.email,
  subject: 'Password Reset Otp',
  text: `Your otp for reseting password is  ${otp}`
}
await transporter.sendMail(mailOptions); // Send the OTP email.

return res.json({success: true, message: "Reset Otp sent to your email"})

  }catch(error){
    return res.json({success: false, message: error.message})
  }

}

//reset user password

export const resetPassword= async(req, res)=>{
 const {email, otp, newPassword}= req.body;  // Extract email, OTP, and new password from the request body.
 if(!email || !otp || !newPassword){   // Check if all fields are provided.
   return res.json({success: false, message: "All fields are required"})
 }
 try{
  const user= await userModel.findOne({email});  // // Find the user in the database with the given email.
  if(!user){
    return res.json({success: false, message: "User not found"})
  }
  if(user.resetOtp === '' || user.resetOtp !== otp){ // Check if OTP is invalid or empty.
    return res.json({success: false, message: "Invalid OTP"})
  }
  if(user.resetOtpExpireAt < Date.now()){
    return res.json({success: false, message: "OTP expired"})
  }
    // Hash the new password using bcrypt with a salt of 10 rounds.
  const hashedPassword= await bcrypt.hash(newPassword, 10);
  user.password= hashedPassword;// Update the user's password in the database with the hashed password.
  user.resetOtp = ''; // Clear the OTP.
  user.resetOtpExpireAt = 0; // Reset the OTP expiration time.
  await user.save(); // Save the updated user document.
  return res.json({success: true, message: "Password reset successfully"})
  
 }catch(error){
   return res.json({success: false, message: error.message})
 }
}