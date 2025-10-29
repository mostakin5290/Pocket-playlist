import React from 'react'

const Header = () => {
  return (
    <div className='flex justify-center '>
      <div className='h-[10vh] w-[85vw] flex justify-between items-center'>
        <div>Pocket Playlist</div>
        <div className='flex gap-3'>
          <button>Video</button>
          <button>Audio</button>
        </div>
      </div>
    </div>
  )
}

export default Header
