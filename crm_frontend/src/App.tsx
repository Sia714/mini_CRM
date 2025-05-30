import {
  BrowserRouter as Router,
  Routes,
  Route,
  // Navigate,
} from "react-router-dom";
// import { useState } from 'react'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'

import './App.css'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Auth/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>

        </Routes>
      </Router>
    </>
  )
}

export default App
