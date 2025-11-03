import React from 'react'
import Footer from '../Layout/Footer'
import Layout from '@/Layout'


const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* center the app content into a max-width container */}
      <div className="w-full max-w-7xl">
        <Layout />
        <Footer />
      </div>
    </div>
  )
}

export default Home
