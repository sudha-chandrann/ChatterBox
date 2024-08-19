import React from 'react'
import { useSelector } from 'react-redux';

function SearchUserAvatar({userId,name,imageUrl}) {
  const nameinitials = name ? name.split(' ') : [];
    const onlineusers=useSelector((state)=>state.auth.onlineUser);
    let initials = '';
    if (nameinitials.length > 1) {
      initials = nameinitials[0].charAt(0).toUpperCase() + nameinitials[1].charAt(0).toUpperCase();
    } else if (nameinitials.length === 1) {
      initials = nameinitials[0].charAt(0).toUpperCase();
    }
    const isOnline = onlineusers.includes(userId)
  return (
    <div className='flex flex-col items-center justify-center'>
        <div className={`w-10 h-10 `}>
      {imageUrl ? (
        <img src={imageUrl} alt="Avatar" className={`avatar rounded-full object-cover w-full h-full`} />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-gray-300 rounded-full">
          { <div className='text-lg font-bold'>{initials}</div> || <LuUserCircle2 className='w-[42px] h-[42px]' />}
        </div>
      )}

    </div>
    <div>
      {
        isOnline ? <div className="text-green-600">online</div> : ''
      }
    </div>
    </div>
  
   
  )
}

export default SearchUserAvatar
