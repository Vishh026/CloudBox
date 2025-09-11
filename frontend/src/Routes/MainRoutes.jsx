import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Register from '../pages/Register'
import Login from '../pages/Login'
import MyDrive from '../pages/MyDrive'
import Dashboard from '../pages/Dashboard'
import Home from '../pages/Home'

const MainRoutes = () => {
  return (
   
      <Routes>
          <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
         <Route path="/mydrive" element={<MyDrive />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
         
      </Routes>
  )
}

export default MainRoutes
