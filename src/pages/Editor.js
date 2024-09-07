import React, { useEffect } from 'react'
import { useState, useRef } from 'react';
import { FaLaptopCode } from "react-icons/fa";
import Client from '../components/Client'
import Texteditor from '../components/Texteditor';
import { initSocket } from '../socket';
import ACTIONS from '../Actions';
import toast from 'react-hot-toast';
import { useLocation , useNavigate , Navigate ,useParams} from 'react-router-dom';

const Editor = () => {

   const socketRef = useRef(null);
   const location = useLocation();
   const {roomid} = useParams();
   const reactNavigator = useNavigate();
   const codeRef = useRef(null);
   const [clients, setClients] = useState([]);
   
   useEffect(() =>{
       const init = async ()=>{
           socketRef.current = await initSocket();
           socketRef.current.on('connect_error',(err) => handleErrors(err));
           socketRef.current.on('connect_failed',(err) => handleErrors(err));

           function handleErrors(e){
            console.log('socket error', e);
            toast.error('Socket connection failed, try again later.');
            reactNavigator('/');
           }
            socketRef.current.emit(ACTIONS.JOIN,{
            roomid,
            username: location.state?.username,
           });

           //Listening for joined event 

           socketRef.current.on(ACTIONS.JOINED,({clients,username,socketId}) =>{
                if(username !== location.state?.username){
                    toast.success(`${username} joined the room`);
                    console.log(`${username} joined`)
                }
              
                setClients(clients);
               socketRef.current.emit(ACTIONS.SYNC_CODE, {
                code:codeRef.current,
                socketId,
              });
           });

           //Listening for disconnected

           socketRef.current.on(
            ACTIONS.DISCONNECTED,
            ({ socketId, username }) => {
                toast.success(`${username} left the room.`);
                setClients((prev) => {
                    return prev.filter(
                        (client) => client.socketId !== socketId
                    );
                });
            }
        );
       }; 
       init();

       return () => {
        socketRef.current.disconnect();
        socketRef.current.off(ACTIONS.JOINED);
        socketRef.current.off(ACTIONS.DISCONNECTED);
       };
   },[])

   async function copyRoomId(){
    try{
          await navigator.clipboard.writeText(roomid);
          toast.success("Room ID has been copied to you clipboard")      
    }catch(err){
      toast.error('Could not copy the Room ID');
      console.error(err);
    }
   }

   function leaveRoom(){
     reactNavigator('/')
   }

   if(!location.state){
    return <Navigate to="/" />
   }

  return (
    <div>
        <div className='h-[100vh] flex'>
             <div className='w-[250px] bg-[#003366] h-full'>
             <div className='flex items-center gap-2 pr-1'>
                    <FaLaptopCode className='text-[90px] text-yellow-400 pt-4 pl-3' />

                    <div className='pt-3'>
                      <h1 className='text-[25px] text-white font-semibold leading-7'>Code Fusion</h1>
                      <p className='text-yellow-400 text-sm'>Realtime Collaboration</p>
                    </div>
                  </div> 

                  <div className='w-[85%] bg-yellow-400 h-[3px] ml-[18.75px] mt-4'></div>

                  <p className='text-white ml-4 mt-2'>Connected</p>

                  <div className='grid grid-cols-3 gap-y-3 gap-x-3 place-items-center mt-5 absolute left-6'> 
                      { clients.map((client) => (<Client key={client.socketId} username = {client.username}></Client>)) }
                  </div>

                   
                   <button className='w-[85%] h-[40px] bg-white font-medium ml-[18.75px] text-[16px] rounded-lg mt-[460px]' onClick={copyRoomId}>Copy ROOM ID</button>
                   <button className='w-[85%] h-[40px] bg-yellow-400 font-medium text-[17px] ml-[18.75px] rounded-lg mt-6' onClick={leaveRoom}>Leave</button>
             </div>

             <div>
                    <Texteditor socketRef={socketRef}
                    roomid={roomid}
                    onCodeChange={(code) => {
                    codeRef.current = code;
                    }}></Texteditor>
             </div>
        </div>
    </div>
  )
}

export default Editor; 