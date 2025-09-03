import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Register from '../components/pages/Register'
import Login from '../components/pages/Login'
import Dashboard from '../components/pages/Dashboard'

const MainRoutes = () => {
  return (
    <div>
      <Routes>
          <Route path="/" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login/>} />
      </Routes>
    </div>
  )
}

export default MainRoutes
