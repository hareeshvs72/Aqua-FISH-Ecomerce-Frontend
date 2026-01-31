import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {  Routes, Route } from "react-router-dom";
import Preloader from './components/Preloader'
import Pnf from './components/Pnf';
import Header from './components/Header';
import Footer from './components/Footer';
function App() {

  return (
   <>
          <Routes>
        <Route path='/' element={<Preloader />} />
        <Route path='/h' element={<Header />} />
          <Route path='/f' element={<Footer />} />
        <Route path='*' element={<Pnf />} />
      </Routes>
   
   </>
  
  )
}

export default App
