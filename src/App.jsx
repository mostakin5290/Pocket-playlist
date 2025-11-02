import React from 'react'
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Layout from './Layout';

// import Search from './components/Search';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import About from './components/About/About';
import Home from './components/Home/Home';

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/about" element={<About/>} />
        </Routes>
      </Router>
    </>
  )
}
export default App;
