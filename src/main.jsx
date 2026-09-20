import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { AmbianceProvider } from './context/AmbianceContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AmbianceProvider>
          <App />
        </AmbianceProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
