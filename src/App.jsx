import React from 'react'
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Layout from './Layout';
import Search from './components/Search';
import Privacy from './components/Layout/Privacy';

const App = () => {
  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* center the app content into a max-width container */}
      <div className="w-full max-w-7xl">
        <Header />
        <Layout />
        <Footer />
      </div>
    </div>
  )
}
export default App;
