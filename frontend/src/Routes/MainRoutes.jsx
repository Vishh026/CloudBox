import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Register from '../components/pages/Register'
import Login from '../components/pages/Login'
import Home from '../components/pages/Home'

const MainRoutes = () => {
  return (
    <div>
      <Routes>
          {/* <Route path="/" element={<Dashboard />} /> */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={<Home/>} />
        
      </Routes>
    </div>
  )
}

export default MainRoutes
