import React from "react"
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import Users from "./user/pages/Users"
import MainNavigation from "./shared/components/Navigation/MainNavigation"

const App =() => {

  return (
    <>
  <Router>
  <MainNavigation/>
    <div className="mt-[64px]">
    <Routes>
    <Route path="/" element={<Users />} />
    <Route path="*" element={<Navigate to="/" />} />
    </Routes>
    </div>
  </Router>
  </>
  )
}

export default App
