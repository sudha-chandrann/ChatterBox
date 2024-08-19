import { User } from "../models/user.model.js"
import { Chat } from "../models/chat.model.js"
import { Message } from "../models/message.model.js"

const getallMessages=async(req,res)=>{
    try {
     const {receiver } = req.body;
     let chat = await Chat.findOne({
        "$or" : [
            { sender :req.user._id , receiver : receiver},
            { sender : receiver, receiver :  req.user._id}
        ]
     }).populate('messages').sort({ updatedAt : -1 })
     if(!chat){
        return res.status(404).json({ 
            message: "No chat found" ,
            data:[],
            success:false
        })
     }
     return res.status(201).json({
        message:"User details fetched successfully",
        data:chat.messages,
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

export {
    getallMessages
}