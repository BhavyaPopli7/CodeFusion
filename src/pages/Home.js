import React, { useState } from 'react'
import { FaLaptopCode } from "react-icons/fa";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
const Home = () => {
   const navigate = useNavigate();
   const [roomid,setRoomid] = useState('');
   const [username,setUsername] = useState('');

   const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidv4();
        setRoomid(id);
        toast.success('Created a new room');
   }
   
   const joinRoom = (e) =>{
           e.preventDefault();
           if(!roomid){
             toast.error('ROOM ID is required');
             return;
           }

           if(!username){
             toast.error('Username is required');
             return;
           }

           navigate(`/editor/${roomid}`,{
             state:{
                username,
             }
           })
   }
  return (
    <div>
         <div className='min-h-screen flex justify-center items-center'>
              <div className='w-[500px] h-[400px] bg-[#003366] rounded-xl'>
                  <div className='flex items-center gap-4'>
                    <FaLaptopCode className='text-[90px] text-yellow-400 pt-4 pl-4' />

                    <div className='pt-3'>
                      <h1 className='text-[25px] text-white font-semibold leading-7'>Code Fusion</h1>
                      <p className='text-yellow-400 text-sm'>Realtime Collaboration</p>
                    </div>
                  </div> 


                  <p className='text-white font-normal mt-10 pl-6 text-[17px]'>Paste Invitation ROOM ID</p>

                  <form className='w-full items-center mt-5'>
                        <input className='w-[90%] h-11 pl-3 rounded-md ml-[25px]' type='text' placeholder='ROOM ID' value={roomid} onChange={(e)=>setRoomid(e.target.value)} />
                        <input className='w-[90%] h-11 pl-3 rounded-md ml-[25px] mt-4' type='text' placeholder='USERNAME' value={username} onChange={(e)=>setUsername(e.target.value)}/>

                        <button onClick={joinRoom} className='bg-yellow-400 w-28 rounded-lg font-semibold h-10 text-[18px] mt-4 ml-[362px] transition-all ease-in-out duration-200 hover:bg-yellow-300'>
                           Join
                        </button>
                  </form>

                  <div className='flex gap-2 w-[470px] justify-center items-center mt-4 items-center'>
                  <p className='text-white text-[16px]'>if you don't have an invite then create</p> 
                  <a onClick={createNewRoom} href='' className='text-yellow-400 underline text-[16px] hover:text-yellow-100 transition-all ease-in-out duration-200'>new room</a>
                  </div>

              </div>
         </div>
    </div>
  )
}

export default Home
