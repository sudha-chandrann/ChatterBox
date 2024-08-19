import { Chat } from "../models/chat.model.js";


const getchatHistory=async(userid)=>{
   if(userid){
    const chatHistory=await Chat.find({
        $or: [
            { sender: userid },
            { receiver: userid }
        ]
    }).sort({updatedAt:-1}).populate('messages').populate('sender').populate('receiver')
    const chats=chatHistory.map((chat)=>{
        const countunseen=chat?.messages?.reduce((prev,curr)=>{
            const sendermsg=curr?.sender?.toString()
            if(sendermsg !== userid){
                return prev+(curr?.seen ? 0 :1)
            }
            else{
                return prev
            }
        },0)
        return{
            _id:chat?._id,
            sender:chat?.sender,
            receiver:chat?.receiver,
            unseenmsg:countunseen,
            lastmsg:chat.messages[chat?.messages?.length-1]
        }
    })
    return chats
   }
   else{
       return []
   }


}
export default getchatHistory