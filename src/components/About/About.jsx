import React from 'react'
import ProfileCard from '../ui/ProfileCard'
import Footer from '../Layout/Footer'

const About = () => {
  return (
    <div>
      <div className='m-5 flex flex-col flex-center items-center gap-7'>
        <div className='w-[50vw] text-center'>
          <h1 className='font-bold text-4xl'>Pocket Playlist : A Background Youtube Music Player Without Ads...</h1>
        </div>
        <div className='text-gray-300 w-[55vw] text-center'>
          We deliver smooth, high-quality background music experiences powered by YouTube. you enjoy the rhythm of creativity that bring music to life.
        </div>
      </div>
    

        <div className='flex justify-center items-center flex-col  p-3 text-center '>
          <div className='m-10 font-bold text-4xl'>Core Features</div>

          <div className=' flex flex-center items-center gap-5'>
           <div className='p-7 border-2 border-white rounded-2xl'>
              <img src="./bg play.jpeg" alt="" className='w-[75px] '/>
              <div >Backgroud Play</div>
            </div>

            <div className='p-7 border-2 border-white rounded-2xl'>
              <img src="./playlist.png" alt="" className='w-[50px] '/>
              <div >Custom Playlist</div>
            </div>

            <div className='p-3 border-2 border-white rounded-2xl'>
              <img src="./ads.png" alt="" className='w-[75px] '/>
              <div >No Ads.</div>
            </div>
          </div>
        </div>



      <div className='flex flex-col items-center gap-10'>
        <div className='font-bold text-4xl'>
          Meet Our Teams
        </div>
        <div className='flex justify-center gap-3'>
          <ProfileCard Fname="Mostakin Mondal"/>
          <ProfileCard Fname="Sandipan Pal"/>
          <ProfileCard Fname="Sk Asfar Ali"/>
        </div>
      </div>
      
      <Footer/>
    </div>
  )
}

export default About


