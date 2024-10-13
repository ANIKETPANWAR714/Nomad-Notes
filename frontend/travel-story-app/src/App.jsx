import React from 'react'
import {BrowserRouter as Router , Routes , Route , Navigate} from "react-router-dom"

import Login from "../src/pages/Auth/Login.jsx"
import Signup from "../src/pages/Auth/Signup.jsx"
import Home from "../src/pages/Home/Home.jsx"


const App = () => {
  return (
    <div>
      <Router>
        <Routes>
        <Route path="/" exact element= { <Root />} />
          
          <Route path="/dashboard" exact element= { <Home />} />
          <Route path="/login" exact element= { <Login/>} />
          <Route path="/signup" exact element= { <Signup />} />
          
        </Routes>
      </Router>
      
    </div>
  )
}

const Root =() =>{
  const isAuthenticated = !!localStorage.getItem('token')
  return isAuthenticated?(
    <Navigate to='/dashboard' />


  ):(
    <Navigate to='/login' />
  )

}

export default App