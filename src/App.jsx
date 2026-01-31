import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Preloader from './components/Preloader'
function App() {
  const [count, setCount] = useState(0)

  return (
   <>
    <Preloader/>
   </>
  
  )
}

export default App
