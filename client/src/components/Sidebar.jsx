import React, { useEffect, useState } from "react";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaImage, FaUserPlus, FaVideo } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { RiLogoutCircleLine } from "react-icons/ri";
import axios from "axios";
import { FiArrowUpLeft } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { logout as authlogout } from "../redux/userSlice.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Avatar from "./Avatar.jsx";
import EditeUserDetails from "./EditeUserDetails.jsx";
import SearchUser from "./SearchUser.jsx";
import socket from "../helper/socket.js";
import date from "../helper/datecreater.js";
function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const name = useSelector((state) => state.auth.name);
  const myid = useSelector((state) => state.auth.id);
  const myimg=useSelector((state) => state.auth.profile_pic);
  const [allUser, setAllUser] = useState([]);
  const [opensearchuser, setopensearchuser] = useState(false);
  const [edituserdetails, setedituserdetails] = useState(false);

  async function logout() {
    try {
      const response = await axios.get("/api/v1/users/logout");
      console.log(response.data.message);
      localStorage.removeItem("token");
      dispatch(authlogout());
      navigate("/login");
      toast.success(response.data.message);
    } catch (error) {
      console.log("error", error.message || error);
    }
  }

  useEffect(() => {
    if (myid) {
      socket.emit("chat-history", myid);
    }
    socket.on("chats", (data) => {
      const chatData = data.map((chatUser) => {
        if (chatUser?.sender?._id === myid) {
          return {
            ...chatUser,
            userdetails: chatUser?.receiver,
          };
        } else {
          return {
            ...chatUser,
            userdetails: chatUser?.sender,
          };
        }
      });
      setAllUser(chatData);
    });

    socket.on("conversation",(data)=>{
      const chatData = data.map((chatUser) => {
        if (chatUser?.sender?._id === myid) {
          return {
            ...chatUser,
            userdetails: chatUser?.receiver,
          };
        } else {
          return {
            ...chatUser,
            userdetails: chatUser?.sender,
          };
        }
      });
      setAllUser(chatData);
    })
    socket.on("conversations",(data)=>{
      const chatData = data.map((chatUser) => {
        if (chatUser?.sender?._id === myid) {
          return {
            ...chatUser,
            userdetails: chatUser?.receiver,
          };
        } else {
          return {
            ...chatUser,
            userdetails: chatUser?.sender,
          };
        }
      });
      setAllUser(chatData);
    })
  }, [myid]);
  return (
    <div className="w-full h-full grid grid-cols-[48px,1fr] bg-white">
      {edituserdetails && (
        <EditeUserDetails
          onchange={() => {
            setedituserdetails(false);
          }}
        />
      )}
      {opensearchuser && (
        <SearchUser
          onchange={() => {
            setopensearchuser(false);
          }}
        />
      )}
      <div className="w-12 h-full  bg-slate-100 flex flex-col items-center py-5  text-slate-600 justify-between">
        <div className="w-full pt-7 ">
          <NavLink
            to="/" // Make sure this is correct
            className={({ isActive }) =>
              `w-full flex items-center justify-center py-3 rounded-md hover:bg-slate-200  ${
                isActive ? "bg-slate-200" : ""
              }`
            }
            title="chat"
          >
            <IoChatbubbleEllipses className="text-[28px]" />
          </NavLink>
          <div
            onClick={() => {
              setopensearchuser(true);
            }}
            className={`w-full flex items-center justify-center py-3 rounded-md hover:bg-slate-200 `}
            title="add friend"
          >
            <FaUserPlus className="text-[28px]" />
          </div>
        </div>
        <div className="w-full py-7">
          <div
            className={`w-full flex items-center justify-center py-3 rounded-md hover:bg-slate-200 `}
            title={name}
            onClick={() => {
              setedituserdetails(true);
            }}
          >
            <Avatar name={name} imageUrl={myimg} />
          </div>
          <div
            className={`w-full flex items-center justify-center py-3 rounded-md hover:bg-slate-200 `}
            title="logout"
            onClick={logout}
          >
            <RiLogoutCircleLine className="text-[28px]" />
          </div>
        </div>
      </div>
      <div className="w-full h-dvh  relative">
        <div className="sticky top-0 z-10">
          <div className="h-16 flex items-center">
            <h2 className="text-xl font-dancing font-extrabold p-4 text-slate-700">
              Message
            </h2>
          </div>
          <div className="bg-slate-200 p-[0.5px]"></div>
        </div>

        <div className="h-[calc(100dvh-70px)] overflow-x-hidden overflow-y-auto w-full">
          {allUser.length === 0 && (
            <div className="mt-12">
              <div className="flex justify-center items-center my-4 text-slate-500 ">
                <FiArrowUpLeft className="text-lg" />
              </div>
              <p className="text-lg text-center text-slate-400">
                Explore users to start a conversation with .
              </p>
            </div>
          )}
          {allUser.map((chat, index) => {
            return (
              <NavLink
                key={index}
                to={`/${chat?.userdetails?._id}`}
                className={`flex items-center gap-2 py-2 px-2 border border-transparent hover:border-cyan-300 rounded hover:bg-slate-100 cursor-pointer`}
              >
                <Avatar
                  name={chat?.userdetails.name}
                  imageUrl={chat?.userdetails?.profile_pic}
                />

                <div>
                  <h3 className="text-ellipsis line-clamp-1 font-semibold text-base">
                    {chat?.userdetails?.name}
                  </h3>
                  <div className="text-slate-500 text-xs flex items-center gap-1">
                    <div className="flex items-center gap-1">
                      {chat?.lastmsg?.imageurl && (
                        <div className="flex items-center gap-1">
                          <span>
                            <FaImage/>
                          </span>
                          {!chat?.lastmsg?.text && <span>Image</span>}
                        </div>
                      )}
                      {chat?.lastmsg?.videourl && (
                        <div className="flex items-center gap-1">
                          <span>
                            <FaVideo />
                          </span>
                          {!chat?.lastmsg?.text && <span>Video</span>}
                        </div>
                      )}
                    </div>
                    <p className="text-ellipsis line-clamp-1">
                      {chat?.lastmsg?.text}
                    </p>
                  </div>
                </div>
                 
                  <div className="ml-auto">
                    <p className="text-sm text-slate-500">{date(chat?.lastmsg?.updatedAt)}</p>
                  {
                    chat?.unseenmsg!==0 &&(
                      <div className="bg-cyan-300 px-2 py-1 rounded-full  text-sm ml-auto w-fit">
                        {chat?.unseenmsg}
                      </div>
                    )
                   }
                  </div>
                   
                




              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
