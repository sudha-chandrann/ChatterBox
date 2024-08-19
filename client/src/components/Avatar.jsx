import React from 'react';

function Avatar({name,imageUrl}) {
    const nameinitials = name ? name.split(' ') : [];
    let initials = '';
    if (nameinitials.length > 1) {
      initials = nameinitials[0].charAt(0).toUpperCase() + nameinitials[1].charAt(0).toUpperCase();
    } else if (nameinitials.length === 1) {
      initials = nameinitials[0].charAt(0).toUpperCase();
    }
   
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
    </div>
  
   
  )
}

export default Avatar



