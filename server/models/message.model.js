import mongoose,{Schema} from "mongoose";

const MessageSchema=new Schema({
  sender:{
    type:mongoose.Types.ObjectId,
    ref:"User"
  },
  receiver:{
    type:mongoose.Types.ObjectId,
    ref:"User"
  },
  text:{
    type:String,
    default:""
  },
  imageurl:{
    type:String,
    default:""
  },
  videourl:{
    type:String,
    default:""
  },
  seen:{
    type:Boolean,
    default:false
  }

    
},{timestamps:true})

export const Message=mongoose.model("Message",MessageSchema)