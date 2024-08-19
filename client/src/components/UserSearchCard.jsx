import React from 'react'
import {Link} from 'react-router-dom'
import  SearchUserAvatar from './SearchUserAvatar.jsx'
function UserSearchCard({onclose,user}) {
  return (

       <Link to={"/"+user?._id} onClick={onclose} className='flex items-center gap-5  hover:bg-cyan-400 px-2 rounded cursor-pointer py-1'>
        <div>
            <SearchUserAvatar
                name={user?.name}
                userId={user?._id}
                imageUrl={user?.profile_pic}
            />
        </div>
        <div>
            <div className='font-semibold text-ellipsis line-clamp-1'>
                {user?.name}
            </div>
            <p className='text-sm text-ellipsis line-clamp-1'>{user?.email}</p>
        </div>
    </Link>
    
  )
}

export default UserSearchCard
