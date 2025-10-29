import React from 'react'
import YTPlayer from './Player/YTPlayer';

const Layout = () => {
  return (
    <div className="grid grid-cols-3 grid-flow-col gap-10 p-8 ">
        <div className='col-span-2 h-auto p-4 rounded-xl'>
            <YTPlayer/>
        </div>
        <div>
            <div className='h-[70vh] w-full border-2 border-amber-100 rounded-3xl'>

            </div>
        </div>
    </div>
  )
}

export default Layout;
