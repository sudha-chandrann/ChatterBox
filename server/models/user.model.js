import mongoose,{Schema} from "mongoose";

const UserSchema=new Schema({
    name:{
        type:String,
        required:[true,"name is required"]
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"password is required"]
    },
    profile_pic:{
        type:String,
        default:''
    }
    
},{timestamps:true})

export const User=mongoose.model("User",UserSchema)