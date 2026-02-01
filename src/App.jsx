import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from "react-router-dom";
import Preloader from './components/Preloader'
import Pnf from './components/Pnf';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './user/pages/Home';
import Contact from './user/pages/Contact';
function App() {

  return (
    <>
 

      <Routes>
    
        <Route path='/' element={<Home/>} />
        {/* {/* <Route path='/h' element={} /> */}
        <Route path='/contact' element={<Contact/>} /> 
        <Route path='*' element={<Pnf />} />
      </Routes>

    </>

  )
}

export default App
