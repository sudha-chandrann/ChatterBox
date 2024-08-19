import { User } from "../models/user.model.js";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
const RegisterUser=async(req,res)=>{
    try {
        const {name,email,password,profile_pic}=req.body;
        const checkEmail=await User.findOne({email})
        if(checkEmail){
            return res.status(400).json({
                message:"Email already exists",
                success:false
            })
        }

        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)
        const user=new User({
            name,
            email,
            password:hashedPassword,
            profile_pic
        })
        await user.save()
        if(!user){
            return res.status(500).json({
                message:"failed to create newuser",
                success:false
            })
        }
        return res.status(200).json({
            message:"user is created successfully",
            token:{},
            success:true,
        })

    }
    catch (error) {
        return res.status(500).json({
            message: error.message||error|| "Error registering user",
            success:false
        })
       
    }

}
const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Input validation
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
                success: false,
            });
        }

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Email does not exist",
                success: false,
            });
        }

        // Validate the password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({
                message: "Invalid password",
                success: false,
            });
        }

        // Generate JWT token
        const token = await jwt.sign(
            { id: user._id, email: user.email },
            process.env.SECRET_KEY,
            { expiresIn: "1d" }
        );

        // Set cookie options
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Set secure flag only in production
            sameSite: "Strict", // Helps prevent CSRF attacks
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        };

        // Send response with token in cookie
        return res
            .cookie('token', token, cookieOptions)
            .status(200).json({
                message: "User logged in successfully",
                token: token,
                success: true,
            });

    } catch (error) {
        console.error("Error in LoginUser:", error); // Log the error for debugging
        return res.status(500).json({
            message: error.message || "Error logging in user",
            success: false,
        });
    }
};

const getuserDetails=async(req,res)=>{
    try {
     const user=await User.findById(req.user._id).select("-password ")
     if(!user){
        return res.status(400).json({
            message:"User not found",
            success:false
            })
     }
     return res.status(201).json({
        message:"User details fetched successfully",
        data:user,
        success:true
    })

    }
    catch (error) {
        return res
        .status(500).json({
            message: error.message||error,
            success:false
        })
       
    }

}
const logout=async(req,res)=>{
    try {
        const options={
            httpOnly:true,
            secure:true
        }
     return res
     .clearCookie("token",options)
     .status(201).json({
        message:"User is logout successfully",
        data:{},
        success:true
    })

    }
    catch (error) {
        return res
        .status(500).json({
            message: error.message||error,
            success:false
        })
       
    }

}
const updateuserdetails=async(req,res)=>{
    try {

     const {name,profile_pic}=req.body;
     const user=await User.findByIdAndUpdate(req.user._id,{
        name:name,
        profile_pic
     },{
        new:true
     }).select('-password')
     if(!user){
        return res
        .status(404).json({
            message:"User not found",
            success:false
        })   
     }
    
     return res.status(201).json({
        message:"User details is updated successfully",
        user,
        success:true
    })

    }
    catch (error) {
        return res
        .status(500).json({
            message: error.message||error,
            success:false
        })
       
    }

}

const Searchuser=async(req,res)=>{
    try {
        const {search}=req.body;
        const query=new RegExp(search,"i","g")
        const user=await User.find({$or:[{name:query},{email:query}]}).select('-password')
      
        return res.status(201).json({
            message:"all users",
            data:user,
            success:true
        })
    } 
    catch(error){
        return res
        .status(500).json({
            message: error.message||error,
            success:false
        })
    }
}


export {
    RegisterUser,
    LoginUser,
    getuserDetails,
    logout,
    updateuserdetails,
    Searchuser
}