import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { ThemeProvider } from '@/contexts/ThemeContext'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
        <ToastContainer
newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
theme="colored"
        toastClassName="theme-transition"
      />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
)