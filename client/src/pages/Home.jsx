import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import {login} from "../redux/userSlice.js"
import axios from 'axios';
import Sidebar from '../components/Sidebar.jsx';
import { useLocation } from 'react-router-dom';
import AppLogo from '../assets/Union.svg'
import socket from "../helper/socket.js"
import { setonlineuser } from '../redux/userSlice.js';
function Home() {
  const name=useSelector((state)=>state.auth.name);
  const dispatch = useDispatch();
  const navigate=useNavigate()
  const location = useLocation();


  useEffect(()=>{
   getuser()
  },[getuser])

  const basePath=location.pathname==='/'

  async function getuser() {
    try{
      const response= await axios.get('/api/v1/users/getuser');
       dispatch(login(response.data.data))
       
      }
      catch(error){
        console.log("error",error.message||error)
        navigate('/login')
      }
    
  }

  useEffect(() => {
   
    socket.on('onlineUser', (data) => {
      dispatch(setonlineuser(data));
    });

  
    return () => {
      socket.off('onlineUser');
    };
  }, [dispatch]);


  return (
    <div className='grid lg:grid-cols-[300px,1fr] md:grid-cols-[240px,1fr] h-screen max-h-screen bg-slate-100'>
    <section className={`bg-white ${!basePath && "hidden"} md:block`}>
       <Sidebar/>
    </section>

    {/**message component**/}
    <section className={`${basePath && "hidden"}`} >
        <Outlet/>
    </section>


    <div className={`justify-center items-center flex-col gap-2 hidden ${!basePath ? "hidden" : "md:flex" }`}>
        <div>
        <img src={AppLogo} className="h-28 lg:h-32" alt=" AppSolgan" />
        </div>
        <p className='text-3xl font-bold mt-2 text-cyan-600 font-dancing'>Where Conversations Comes Alive</p>
    </div>
</div>
  );
}

export default Home;



