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
import About from './user/pages/About';
import MainLayout from './user/component/MainLayout';
function App() {

  return (
    <>


      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />

        </Route>

        <Route path="*" element={<Pnf />} />
      </Routes>

    </>

  )
}

export default App
