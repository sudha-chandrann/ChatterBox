import React, { useEffect, useState } from 'react'
import AppLogo from '../assets/Union.svg'
import AppSolgan from '../assets/solgan.svg'
import { useNavigate } from 'react-router-dom'
import { RxCross2 } from "react-icons/rx";
import uploadfile from '../helper/uploadimage';
import axios from 'axios';
import toast from 'react-hot-toast';


function Register() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [profile_pic,setprofilepic]=useState('')
  const [uploadphoto,setuploadphoto]=useState('')

  const handleuploadphoto=async(e)=>{
    const file=e.target.files[0]
    const uploadedphoto=await uploadfile(file)
    setprofilepic(uploadedphoto)
    setuploadphoto(file)
  }
  const handleclearuploadimage =  (e) => {
    e.stopPropagation(); 
    e.preventDefault()
    setuploadphoto(null)
    setprofilepic('')
  }
  const isalldatapresent=()=>{
    if(name==="" || email==="" || password==="" || profile_pic ==='' ){
      toast.error("Please fill all the fields")
      return false
    }
    return true
  }
  const handleregistersubmit=async(e)=>{
    e.preventDefault()
    if(isalldatapresent()){
      try{
        const response= await axios.post('/api/v1/users/register',{
          name:name,
          email:email,
          password:password,
          profile_pic:profile_pic
        })
        if(response.data.success){
          toast.success(response.data.message)
          navigate('/login')
        }
        else{
          toast.error("Registration Failed")
        }
      }
      catch(error){
        toast.error(error.response.data.message)
      }
      finally{
         setName('')
         setEmail('')
         setPassword('')
         setprofilepic('')
         setuploadphoto(null)
      }
    
     
    }
    
  }

  return (
    <div className='h-dvh flex flex-col items-center'>
      <div className='w-full bg-cyan-600  flex justify-center flex-col items-center h-1/5'>
      <img src={AppLogo} className="h-20" alt="App logo" />
      <img src={AppSolgan} className="h-4" alt=" AppSolgan" />
    </div>
    <div className='relative w-full h-4/5 flex justify-center  pt-10'>
       <div className='px-6 pt-9 pb-14 bg-black/25 rounded-lg w-[90%] md:w-[60%] lg:w-[42%] h-fit '>
       <div className='text-center text-4xl font-bold font-dancing'>Register</div>
       <div className='text-center text-xl font-bold font-dancing '>Already have an account ? <span className='text-cyan-600 cursor-pointer' onClick={()=>{ navigate('/login')}}>Login</span></div>
        <form  className='flex flex-col w-[90%] md:w-[80%] lg:w-[70%] mx-auto mt-5' onSubmit={handleregistersubmit}>
        <input className='py-2 px-3 mt-3 rounded-lg focus:outline-none bg-white/80' placeholder='enter your name' type='text' value={name} onChange={(e)=>{setName(e.target.value)}}/>
        <input className='py-2 px-3 mt-3 rounded-lg focus:outline-none bg-white/80'  placeholder='enter your email' type='email' value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
        <input className='py-2 px-3 mt-3 rounded-lg focus:outline-none bg-white/80'  placeholder='enter your password' type='password' value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
        <label htmlFor='profile' className='w-full bg-white/80  py-2 px-3 mt-3 rounded-lg focus:outline-none flex justify-center items-center gap-3'>
        <div className=' text-center  cursor-pointer'>
        {  
        uploadphoto ? uploadphoto?.name  :"upload your profile pic"
        }
        </div>
        {
          uploadphoto? <button > 
            <RxCross2 className='text-black/50 hover:text-black' onClick={handleclearuploadimage}/>
          </button>:""
        }
        </label>
        <input className='py-2 px-3 mt-3 rounded-lg focus:outline-none bg-white/80 hidden' type='file' id='profile' onChange={handleuploadphoto}/>
        <button className='py-2 px-3  rounded-lg mt-7 bg-cyan-600 font-dancing hover:bg-cyan-500 text-white text-2xl'>Register</button>
      </form>
       </div>
    </div>
   
      
    </div>
  )
}

export default Register
