
import jwt from 'jsonwebtoken'
import { User } from "../models/user.model.js";

export const verifyJWT=async (req,res,next)=>{
  try{
    const token= req.cookies?.token || req.header("Authorization")?.replace("Bearer","");
   if(!token){
    return res.status(401).json({
        message:"invalid token",
        success:false
    })
   }
   const decodedToken=jwt.verify(token,process.env.SECRET_KEY)
   const user= await User.findById(decodedToken?.id).select(" -password")
   if(!user){
      return res.status(401).json({
        message:"user does not exists",
        success:false
    })
   }
  req.user =user;
  next()
  }
  catch(error){
    return res.status(401).json({
        message:error.message||error,
        success:false
    })
  }
}

const getUserDetailsFromToken = async (token) => {
  try {
      if (!token) {
          return {
              message: "Session expired or token missing",
              logout: true,
          };
      }

      // Decode the token
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
      if (!decodedToken?.id) {
          return {
              message: "Invalid token",
              logout: true,
          };
      }

      // Fetch the user details excluding the password
      const user = await User.findById(decodedToken.id).select("-password");

      if (!user) {
          return {
              message: "User not found",
              logout: true,
          };
      }

      return user;
  } catch (error) {
      console.error("Error in getUserDetailsFromToken:", error.message);

      if (error.name === 'TokenExpiredError') {
          return {
              message: "Token expired",
              logout: true,
          };
      }

      return {
          message: "Authentication error",
          logout: true,
      };
  }
};


export default getUserDetailsFromToken