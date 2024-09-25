/****import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./Components/Navbar.js";
import Navbar from "./Components/Navbar.js";
import LandingPage from "./Pages/LandingPage.js"
function App() {
  return (
    // <Router>
    //   <div className="App">
    //     <Rotes>
    //       <Route exact path="/" element ={<></>}/>
    //     </Rotes>
    //   </div>
    // </Router>
    <div><LandingPage/></div>
  );
}

export default App;***/
import React from 'react';
import HomePage from "./Components/HomePage/HomePage.js";
import LoginPage from "./Components/LoginPage/Login.js";



function App() {
  return (
    <div className="App">
      <HomePage />
    </div>
  );
}


export default App;
