import {
  BrowserRouter as Router,
  Routes,
  Route,
  // Navigate,
} from "react-router-dom";
// import { useState } from 'react'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Campaign from './pages/campaign'

import './App.css'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Auth/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/campaign" element={<Campaign/>}/>
 1        <Route
              path="/campaign/:id"
            />
        </Routes>
      </Router>
    </>
  )
}

export default App
