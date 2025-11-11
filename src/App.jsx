import React from 'react'
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Layout from './Layout';
import Search from './components/Search';
import Privacy from './components/Privacy/Privacy';

// import Search from './components/Search';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import About from './components/About/About';
import Home from './components/Home/Home';
import Help from './components/Help/Help';

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/help" element={<Help />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </Router>
    </>
  )
}
export default App;
