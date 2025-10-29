import React from 'react'
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Layout  from './components/Layout';
import Search from './components/Search';

const App = () => {
  return (
    <div>
      <Header/>
      <Search/>
      <Layout/>
      <Footer />
    </div>
  )
}
export default App;
