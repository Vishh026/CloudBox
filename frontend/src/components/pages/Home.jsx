import React from 'react'
import TopNav from '../Topnav'
import Sidebar from '../Sidebar'
import Dashboard from '../Dashboard'


const Home = () => {
  return (
    <div className="flex flex-col h-screen">
      <TopNav />
      <div className="flex flex-1">
        <Sidebar />
        <Dashboard />
      </div>
    </div>
  )
}

export default Home
