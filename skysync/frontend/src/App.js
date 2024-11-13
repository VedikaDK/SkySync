
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "./Components/HomePage/HomePage.js";
//import LoginPage from "./Components/LoginPage/Login.js";
import FlightSearch from "./Components/FlightSearch/FlightSearch.js"; 
import Main from "./Components/LoginPage/Main.js";
import About from "./Components/AboutPage/AboutPage.js";
import Signup from './Components/LoginPage/Signup.js';
import SeatBook from './Components/SeatBookingPage/SeatBook.js';
import SelectSeat from './Components/SeatBookingPage/SelectSeat.js';
import { UserAuthContextProvider } from './context/UserAuthContext';
import SeatBookMain from './Components/SeatBookingPage/SeatBookMain.js';



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
       <Route path="/SeatBookMain" element={<SeatBookMain/>}/>
       <Route path="/SeatBook" element={<SeatBook />}/> 
       <Route path="/SelectSeat" element={<SelectSeat />}/> 
        {/* Add more routes here as needed */}
      </Routes>
    </Router>
    </UserAuthContextProvider>
  );
}


export default App;
