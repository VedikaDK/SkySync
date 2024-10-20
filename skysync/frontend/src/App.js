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
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "./Components/HomePage/HomePage.js";
//import LoginPage from "./Components/LoginPage/Login.js";
import FlightSearch from "./Components/FlightSearch/FlightSearch.js"; 
import Main from "./Components/LoginPage/Main.js";
import About from "./Components/AboutPage/AboutPage.js";
import Signup from './Components/LoginPage/Signup.js';
import { UserAuthContextProvider } from './context/UserAuthContext';



function App() {
  return (
     <UserAuthContextProvider>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Main" element={<Main/>}/>
        <Route path='/Main/signup' element={<Signup/>}/>
        <Route path='/About' element={<About/>}/>
       <Route path="/FlightSearch" element={<FlightSearch />} /> 
        {/* Add more routes here as needed */}
      </Routes>
    </Router>
    </UserAuthContextProvider>
  );
}


export default App;
