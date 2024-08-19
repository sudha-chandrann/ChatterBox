import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoSearchOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import UserSearchCard from "../components/UserSearchCard.jsx"
function SearchUser({ onchange }) {
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const handlesearchuser=async()=>{
    try{
      setLoading(true);
      const response= await axios.post('/api/v1/users/search-user',{
        search
      }) 
      setSearchUser(response.data.data)
    }
    catch(error){
      console.log("error",error)
    }
    finally{
      setLoading(false);
    }
  }
  useEffect(()=>{
    handlesearchuser()
  },[search])

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-black/75  z-20">
      <div
        className="top-4 absolute right-6 hover:bg-white/70 p-2 rounded-full bg-white/50"
        onClick={onchange}
      >
        <RxCross2 className="text-xl " />
      </div>

      <div className="flex flex-col items-center mt-12 bg-black/50 rounded-lg p-3 w-[80%] md:w-[60%] lg:w-[50%] mx-auto pb-10">
        <h1 className="text-white font-extrabold font-dancing text-2xl">
          Search User
        </h1>
        <div className="bg-white w-[90%] mx-auto px-2 py-1  rounded-xl mt-4 flex justify-between items-center">
          <input
           type="text"
            placeholder="Search user by name or email .... "
            className="w-[80%] py-1 px-2 text-lg text-black  focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="bg-cyan-600 p-2 rounded-full hover:bg-cyan-400" onClick={handlesearchuser}>
            <IoSearchOutline className="text-lg hover:text-xl transition-all " />
          </div>
        </div>
        <div className="bg-white w-[90%] mx-auto px-2 py-1  rounded-xl mt-4 flex   flex-col gap-2">
          {loading && <div> Loading.... </div>}
          {searchUser.length === 0 && !loading && (
            <p className="text-center text-slate-500 px-3 py-2 ">
              no user found!
            </p>
          )}
          {
          searchUser.length !== 0 &&
            !loading &&
            searchUser.map((user) => {
              return (
                <UserSearchCard key={user._id} user={user} onclose={onchange} />
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default SearchUser;
