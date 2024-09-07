import React from 'react'
import Avatar from 'react-avatar';
const Client = ({username}) => {
  return (
    <div>
         <div className='flex flex-col'>
            <Avatar name={username} size={50} round="14px"></Avatar>
             <span className='text-white text-sm'>{username.length > 8 ? `${username.substring(0, 8)}...` : username}</span>
         </div>
    </div>
  )
}

export default Client
