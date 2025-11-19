import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Test from './Test'
import Layout from './components/Layout'
import Booking from './components/Booking'
import Appointments from './components/Appointments'
import Payments from './components/Payments'
import Profile from './components/Profile'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/test" element={<Test />} />
        <Route path="/book" element={<Layout><Booking /></Layout>} />
        <Route path="/appointments" element={<Layout><Appointments /></Layout>} />
        <Route path="/payments" element={<Layout><Payments /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
