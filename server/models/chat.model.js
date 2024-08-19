import mongoose,{Schema} from "mongoose";

const ChatSchema=new Schema({
  sender:{
    type:mongoose.Types.ObjectId,
    ref:"User"
  },
  receiver:{
    type:mongoose.Types.ObjectId,
    ref:"User"
  },
  messages:[
    {
        type:mongoose.Types.ObjectId,
        ref:"Message"  
    }
  ]

    
},{timestamps:true})

export const Chat=mongoose.model("Chat",ChatSchema)