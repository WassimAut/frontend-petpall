import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Landing from './components/Landing/Landing'
import { Routes,Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import History from './pages/History/History'
import Login from './pages/Login/Login'

const App = () => {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/history" element={<History/>}/>
        <Route path="/login" element={<Login/>}/>
      </Routes>
    </div>
  )
}

export default App