import React from 'react'

const Search = () => {
  return (
    <div className='w-full flex items-center justify-center'>
        <div className='flex items-center justify-between p-2 pl-5 pr-0 border-1 border-amber-50 w-120 h-12 rounded-full overflow-hidden'>
        <input type="text" placeholder='Add Playlist...' className='w-90 h-8  outline-0'/>
        <button className='bg-amber-50 text-black font-bold p-3 rounded-md'>
            Add
        </button>
        </div>
    </div>
  )
}

export default Search;
