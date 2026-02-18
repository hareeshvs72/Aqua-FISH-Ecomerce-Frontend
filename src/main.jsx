import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import ScrollToTop from './user/component/ScrollToTop.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
import { dark } from "@clerk/themes";

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

createRoot(document.getElementById('root')).render(

  <ClerkProvider 
    appearance={{
        baseTheme: dark,
          variables: {
      colorPrimary: "#00bcd4",       // Primary color
      colorBackground: "#0b1c2d",    // Background color
      colorText: "#ffffff"          // Primary text color
    }
      }}
  publishableKey={PUBLISHABLE_KEY}>

    <BrowserRouter>
      <ScrollToTop />
      <App />

    </BrowserRouter>

  </ClerkProvider>
  
)
