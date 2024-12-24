
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
import Feedback from './Components/Feedback/FeedbackForm.js';
import CustomerFeedbacks from './Components/CustomerFeedback/CustomerFeedbacks.js';
import TripSummary from './Components/Payment/TripSummary.js';
import PaymentGateway from './Components/Payment/PaymentGateway.js';
import BookingForm from './Components/SeatBookingPage/BookingForm.js';
import Contact from './Components/ContactPage/ContactPage.js';
import ThankYou from './Components/Payment/ThankYou.js' 
import Profile from './Components/Navbar/Profile.js';


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
       <Route path="/Feedback" element={<Feedback/>}/>
       <Route path="/CustomerFeedbacks" element={<CustomerFeedbacks/>}/>
       <Route path="/TripSummary" element={<TripSummary/>}/>
       <Route path="/PaymentGateway" element={<PaymentGateway/>}/>
       <Route path="/BookingForm" element={<BookingForm/>}/>
       <Route path="/ContactPage" element={<Contact/>}/>
       <Route path="/thank-you" element={<ThankYou/>}/>
       <Route path="/profile" element={<Profile/>}/>
        {/* Add more routes here as needed */}
      </Routes>
    </Router>
    </UserAuthContextProvider>
  );
}


export default App;
