//how we get userId 
// find token from cookie and from that token it find userId
import jwt from 'jsonwebtoken';

export const userAuth = async (req, res, next) => {  //whenever we hit api endpoint  this middleware will be excuted and it will get token from the token and decode

const { token } = req.cookies; // Extract token from cookies
 // If token is not present in cookies
if(!token){
    return res.json({success: false, message: 'Not authenticated, Login Again'})
}
try{
    // Verifying and decoding the token
  const tokenDecode=jwt.verify(token, process.env.JWT_SECRET);
   // If the token is valid and contains a userId, we add it to  the request body
  if(tokenDecode.id){
    req.body.userId = tokenDecode.id // Attach userId to the request body
  }else{
    return res.json({success: false, message: 'Not authenticated, Login Again'})
  }
  next();  //call controller fxn 
}catch(errors) {
    return res.status.json({success: false, message: errors.message})
}
}
