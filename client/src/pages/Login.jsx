import React, { useEffect, useState } from 'react'
import AppLogo from '../assets/Union.svg'
import AppSolgan from '../assets/solgan.svg'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import toast from 'react-hot-toast';

function Login() {
  const token = localStorage.getItem('token');

  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const isalldatapresent=()=>{
    if( email==="" || password===""  ){
      toast.error("Please fill all the fields")
      return false
    }
    return true
  }
  const handlelogin=async(e)=>{
    e.preventDefault()
    if(isalldatapresent()){
      try{
        const response= await axios.post('/api/v1/users/login',{
          email:email,
          password:password,
        })
        if(response.data.success){
          localStorage.setItem("token", response.data.token);
          toast.success(response.data.message)
          navigate('/')
        }
        else{
          toast.error("login Failed")
        }
      }
      catch(error){
        console.log(error)
        toast.error(error.response.data.message)
      }
      finally{
         setEmail('')
         setPassword('')
      }
    
     
    }

    
  }

  return (
    <div className='h-dvh flex flex-col items-center'>
      <div className='w-full bg-cyan-600  flex justify-center flex-col items-center h-1/5'>
      <img src={AppLogo} className="h-20" alt="App logo" />
      <img src={AppSolgan} className="h-4" alt=" AppSolgan" />
    </div>
    <div className='relative w-full h-4/5 flex justify-center pt-10'>
       <div className='px-6 pt-9 pb-14 bg-black/25 rounded-lg w-[90%] md:w-[60%] lg:w-[42%] h-fit'>
       <div className='text-center text-4xl font-bold font-dancing'>Login</div>
       <div className='text-center text-xl font-bold font-dancing '>Do not have an account ? <span className='text-cyan-600 cursor-pointer' onClick={()=>{ navigate('/register')}}>Signup</span></div>
        <form  className='flex flex-col w-[90%] md:w-[80%] lg:w-[70%] mx-auto mt-5' onSubmit={handlelogin}>
        <input className='py-2 px-3 mt-3 rounded-lg focus:outline-none bg-white/80'  placeholder='enter your email' type='email' value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
        <input className='py-2 px-3 mt-3 rounded-lg focus:outline-none bg-white/80'  placeholder='enter your password' type='password' value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
        <button className='py-2 px-3  rounded-lg mt-7 bg-cyan-600 font-dancing hover:bg-cyan-500 text-2xl text-white'>Login</button>
      </form>
       </div>
    </div>
   
      
    </div>
  )
}

export default Login
