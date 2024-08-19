import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../helper/socket.js";
import Avatar from "./Avatar.jsx";
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { BsImageFill } from "react-icons/bs";
import { RiFolderVideoFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import uploadfile from "../helper/uploadimage.js";
import { RxCross2 } from "react-icons/rx";
import { IoSend } from "react-icons/io5";
import { useSelector } from "react-redux";
import moment from "moment";
import date from "../helper/datecreater.js";
import axios from "axios";
import { IoCheckmarkDoneOutline } from "react-icons/io5";

function MessagePage() {
  const navigate = useNavigate();
  const Param = useParams();
  const myname = useSelector((state) => state.auth.name);
  const myid = useSelector((state) => state.auth.id);
  const myavatarurl = useSelector((state) => state.auth.profile_pic);
  const userid = Param.userId;
  const [frienddata, setfrienddata] = useState({});
  const [message, setMessage] = useState({
    text: "",
    imageurl: "",
    videourl: "",
  });
  const [isadding, setisadding] = useState(false);
  const [loading, setloading] = useState(false);
  const [chatmessages, setchatmessages] = useState([]);

  useEffect(() => {
    if (userid) {
      socket.emit("message-page", userid);
    }

   
    socket.on("message-user", (data) => {
      setfrienddata(data);
    });
    socket.on("chatmessages", (data) => {
      console.log(data);
      setchatmessages(data);
    });
    return () => {
      socket.off("message-user");
    };
  }, [userid]);

  useEffect(()=>{
    if(userid){
      socket.emit("markseen",userid);
    }
    socket.on("updatechatmessages", (data) => {
      console.log(data);
      setchatmessages(data);
    });
  },[userid,chatmessages])

  const handleuploadvideo = async (e) => {
    const file = e.target.files[0];

    setloading(true);
    const uploadedphoto = await uploadfile(file);
    setMessage({ ...message, videourl: uploadedphoto });
    setloading(false);
    setisadding(false);
  };
  const handleuploadimage = async (e) => {
    const file = e.target.files[0];
    setloading(true);
    const uploadedphoto = await uploadfile(file);
    setMessage({ ...message, imageurl: uploadedphoto });
    setloading(false);
    setisadding(false);
  };

  const handlesendingmessage = async () => {
    if (message.text || message.imageurl || message.videourl) {
      socket.emit("send-newmessage", {
        sender: myid,
        receiver: userid,
        text: message.text,
        imageurl: message.imageurl,
        videourl: message.videourl,
      });
      setMessage({ text: "", imageurl: "", videourl: "" });
    } else {
      alert("Please add a message");
    }
  };
  
const getallthemesages=async()=>{
    try{
      const response =await axios.post("/api/v1/messages/get-chats",{
        receiver:userid
      })
      setchatmessages(response.data.data)
    }
    catch(error){
      setchatmessages(error.response.data.data)
    }
  }

  useEffect(()=>{
   getallthemesages()
  },[userid])
  return (
    <div className="h-full w-full relative">
      <div className="sticky z-5 top-0 bottom-0 w-full bg-gray-200 py-2 px-4 flex items-center justify-between h-14">
        <div className="flex items-center gap-2">
          <FaAngleLeft
            onClick={() => {
              navigate("/");
            }}
            className="text-3xl text-black/55 hover:bg-slate-300 p-1 rounded-full"
          />
          <Avatar
            name={frienddata.name}
            imageUrl={frienddata.profile_pic}
          />
          <div className=" font-semibold">
            <span className="text-lg text-black ">{frienddata.name}</span>
            <br />
            {frienddata.onlineStatus ? (
              <span className="text-sm text-cyan-900 relative bottom-2">
                Online
              </span>
            ) : (
              <span className="text-sm text-black/75 relative bottom-2">
                Offline
              </span>
            )}
          </div>
        </div>
        <div className="hover:bg-slate-300 p-2 rounded-full">
          <HiDotsVertical className="text-2xl hover:text-cyan-900" />
        </div>
      </div>
      <section className="h-[calc(100dvh-112px)] w-full overflow-y-auto  ">
        
        <div className="px-2 py-1">
          {chatmessages.map((msg, index) => {
            return (
              <div
                className={`flex gap-2 w-fit my-2 ${
                  myid === msg?.sender ? "ml-auto flex-row-reverse" : ""
                }`}
                key={index}
              >
                <div>
                  {msg.sender === myid ? (
                    <Avatar name={myname} imageUrl={myavatarurl} />
                  ) : (
                    <Avatar
                      name={frienddata.name}
                      imageUrl={frienddata.profile_pic}
                    />
                  )}
                </div>

                <div
                  className={` px-2 py-1 mb-1 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${
                    myid === msg?.sender ? "bg-teal-100" : "bg-white"
                  }`}
                >

                  <p className="text-xs mr-auto w-fit ">
                   {
                    msg.sender === myid ? myname : frienddata.name
                   }
                  </p>
                  {msg?.imageurl && (
                    <img
                      src={msg?.imageurl}
                      className="w-full h-72 mt-1"
                    />
                  )}
                  {msg?.videourl && (
                    <video
                      src={msg.videourl}
                      className="w-full h-72"
                      controls
                    />
                  )}
                  {msg?.text && <p className="px-2">{msg.text}</p>}
                  <p className="text-xs ml-auto w-fit">
                     {date(msg.createdAt)}
                  </p>
                  <p className="text-xs ml-auto w-fit">
                    {moment(msg.createdAt).format("hh:mm")}
                  </p>
                  {
                    msg.sender === myid &&(
                      <p className="text-xs ml-auto w-fit">
                      <IoCheckmarkDoneOutline className={`font-extrabold text-xl ${msg.seen?'text-green-500':'text-black/50'}`}/>
                    </p>
                    )
                  }
                  
                </div>
              </div>
            );
          })}
        </div>

        {message.imageurl && (
          <div className="sticky bottom-0 bg-slate-300 h-full w-full left-0 z-20 backdrop-blur-3xl flex items-center justify-center">
            <RxCross2
              className="absolute top-4 right-4 bg-white/50 p-1 text-2xl rounded-full"
              onClick={() => {
                setMessage({ ...message, imageurl: "" });
              }}
            />
            <img src={message.imageurl} alt="image" className="h-[60%]" />
          </div>
        )}
        {message.videourl && (
          <div className="sticky bottom-0 bg-slate-300 h-full w-full left-0 z-20 backdrop-blur-3xl flex items-center justify-center">
            <RxCross2
              className="absolute top-4 right-4 bg-white/50 p-1 text-2xl rounded-full"
              onClick={() => {
                setMessage({ ...message, videourl: "" });
              }}
            />
            <video
              src={message.videourl}
              className="h-[60%]"
              controls
              muted
              autoPlay
            />
          </div>
        )}
        {loading && (
          <div className="absolute top-0 bg-slate-300 h-full w-full left-0 z-20 backdrop-blur-3xl flex items-center justify-center">
            <div className="text-4xl font-dancing font-extrabold  text-cyan-800">
              Loading.....
            </div>
          </div>
        )}

      </section>

      <div className=" bg-slate-200 w-full h-14 flex items-center px-2 gap-1">
        <FiPlus
          className="hover:bg-cyan-500 rounded-full p-1 text-3xl hover:text-white"
          onClick={() => {
            setisadding(!isadding);
          }}
        />
        {isadding && (
          <div className="absolute bottom-16 left-3  bg-white rounded-lg z-10 overflow-hidden">
            <label
              className="w-full px-3 py-2 hover:bg-black/20 flex items-center gap-2"
              htmlFor="image"
            >
              <BsImageFill className="text-2xl text-cyan-500" />
              <p>Images</p>
            </label>
            <input
              type="file"
              className="hidden"
              id="image"
              onChange={handleuploadimage}
            />
            <label
              className="w-full px-3 py-2 hover:bg-black/20 flex items-center gap-2"
              htmlFor="video"
            >
              <RiFolderVideoFill className="text-2xl text-purple-500" />
              <p>Videos</p>
            </label>
            <input
              type="file"
              className="hidden"
              id="video"
              onChange={handleuploadvideo}
            />
          </div>
        )}
        <input
          type="text"
          placeholder="enter the message"
          value={message.text}
          onChange={(e) => {
            setMessage({ ...message, text: e.target.value });
          }}
          className="w-[80%] px-2 py-1 text-lg focus:outline-none rounded-xl "
        />
        <IoSend
          className="text-5xl text-cyan-600 ml-3 px-2 py-1 rounded-full hover:bg-slate-100 hover:text-cyan-800"
          onClick={() => {
            handlesendingmessage();
          }}
        />
      </div>
    </div>
  );
}

export default MessagePage;
