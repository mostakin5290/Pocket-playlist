import React from 'react'
import YTPlayer from './components/Player/YTPlayer';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';

const App = () => {
  return (
    <div>
      <Header/>
      <YTPlayer/>
      <Footer />
    </div>
  )
}
export default App;
