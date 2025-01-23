// To store the details of user in dataBase
import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, default: 'user'},
    verifyOtp:{type: String, default:''},
    verifyOtpExpireAt:{type: Number, default:0},
   isAccountVerified:{type: Boolean, default:true},
   resetOtp:{type: String, default:''},
   resetOtpExpireAt:{type: Number, default:''},

   


});


 const userModel= mongoose.model('User', userSchema);
 export default userModel;