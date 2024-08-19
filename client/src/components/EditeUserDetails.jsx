import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { RxCross2 } from 'react-icons/rx';
import uploadfile from '../helper/uploadimage';
import toast from 'react-hot-toast';
import Avatar from './Avatar';
import {login} from "../redux/userSlice.js"

function EditUserDetails({ onchange }) {
  const dispatch = useDispatch();
  const username = useSelector((state) => state.auth.name);
  const email = useSelector((state) => state.auth.email);
  const imgURL=useSelector((state)=>state.auth.profile_pic)
  const [name, setName] = useState(username);
  const [profile_pic, setProfilePic] = useState('');
  const [uploadphoto, setUploadPhoto] = useState('');

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const uploadedPhoto = await uploadfile(file);
        setProfilePic(uploadedPhoto);
        setUploadPhoto(file);
      } catch (error) {
        toast.error('Failed to upload photo');
      }
    }
  };

  const handleClearUploadImage = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setUploadPhoto(null);
    setProfilePic('');
  };

  async function updateuserdetails(e) {
    e.preventDefault();

    const data = uploadphoto ? { name, profile_pic } : { name };

    try {
      const response = await axios.patch('/api/v1/users/update', data);

      toast.success(response.data.message);
      dispatch(login(response.data.user))
      onchange()
    } catch (error) {
      toast.error('Failed to update user details');
      console.log(error);
    }
    finally{
        setUploadPhoto('')
        setProfilePic('')
    }
  }

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 bg-black/75 flex justify-center items-center z-20'>
      <div className='w-[90%] md:w-[60%] lg:w-[30%] px-4 pt-8 pb-16 bg-black/50 rounded-xl'>
        <div className='text-center font-dancing text-2xl text-cyan-600 mb-4'>Profile Details</div>
        <form className='flex flex-col gap-3 w-full' onSubmit={updateuserdetails}>
          <div className='w-[90%] mx-auto '>
            <label htmlFor='email' className='w-full text-white'>Email:</label>
            <input type="email" id="email" value={email} disabled className='w-full py-2 px-3 rounded-xl bg-white focus:outline-none' />
          </div>
          <div className='w-[90%] mx-auto '>
            <label htmlFor='name' className='w-full text-white'>Username:</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter new name" className='w-full py-2 px-3 rounded-xl bg-white focus:outline-none' />
          </div>
          <div className='w-[90%] mx-auto'>
            <div className='text-white'>Profile Photo:</div>
            <label htmlFor='profile' className='w-full bg-white py-2 rounded-xl flex items-center px-2 gap-2'>
              <div className='w-[42px] h-[42px] mr-4'>
                <Avatar name={username} imageUrl={imgURL}/>
              </div>
              {uploadphoto ? uploadphoto.name : "Change your profile pic"}
              {uploadphoto && (
                <button onClick={handleClearUploadImage}>
                  <RxCross2 className='text-black/50 hover:text-black' />
                </button>
              )}
            </label>
            <input className='py-2 px-3 mt-3 rounded-lg focus:outline-none bg-white/80 hidden' type='file' id='profile' onChange={handleUploadPhoto} />
          </div>
          <div className='flex items-center justify-between py-1 px-2 w-[90%] mx-auto'>
            <button type="button" className='py-1 px-3 rounded-lg bg-cyan-600 font-dancing hover:bg-cyan-500 text-white text-lg' onClick={onchange}>Cancel</button>
            <button type='submit' className='py-1 px-3 rounded-lg bg-cyan-600 font-dancing hover:bg-cyan-500 text-white text-lg'>Update</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUserDetails;
