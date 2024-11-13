


import React, { useState } from 'react';
import './HomePage.css'; // Import the new CSS file
//import logo from './airplane-logo.png';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import PageOne from './PageOne';
import PageTwo from './PageTwo';
import Footer from '../Footer/Footer';



function HomePage() {
  // State to manage form data
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const navigate = useNavigate();




  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!from || !to || !departureDate || passengers <= 0) {
      alert("Please fill in all required fields.");
      return;
    }
    
    const trimmedFrom = from.trim();
    const trimmedTo = to.trim();

    navigate('/FlightSearch', {
      state: { 
        from: trimmedFrom,
        to: trimmedTo,
        departureDate,
        returnDate,
        passengers 
      }
    });
    
   
  };

  return (
    <div className="homepage">
     <Navbar />

      <main className="homepage-main-content">
        <h2 className='line'>Elevate Your Travel Experience with SkySync!</h2> 
        <div className="homepage-booking-form">

          <div className="homepage-tabs">
            <button className="homepage-tab active"  >Book a flight</button>
          </div>

          <form className="homepage-form" onSubmit={handleSubmit}>
            <div className="homepage-form-group">
              <label>From</label>
              <select 
                value={from} 
                onChange={(e) => setFrom(e.target.value)} 
                required
              >
                <option value="">Select departure city</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="New Delhi">New Delhi</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Kolkata">Kolkata</option> 
                <option value="Mumbai">Mumbai</option>
              </select>
            </div>
            <div className="homepage-form-group">
              <label>To</label>
              <select 
                value={to} 
                onChange={(e) => setTo(e.target.value)} 
                required
              >
                <option value="">Select destination city</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="New Delhi">New Delhi</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Mumbai">Mumbai</option> 
              </select>
            </div>
            <div className="homepage-form-group">
              <label>Passengers</label>
              <input 
                type="number" 
                value={passengers} 
                onChange={(e) => setPassengers(Number(e.target.value))}
                min="1"
                required 
              />
            </div>
            <div className="homepage-form-group">
              <label>Departure</label>
              <input 
                type="date" 
                value={departureDate} 
                onChange={(e) => setDepartureDate(e.target.value)} 
                required 
              />
            </div>
            <div className="homepage-form-group">
              <label>Return</label>
              <input 
                type="date" 
                value={returnDate} 
                onChange={(e) => setReturnDate(e.target.value)} 
                placeholder="Optional return date"
              />
            </div>
            
            <div className="homepage-form-group">
              <button className="homepage-search-btn" type="submit">Search</button>
            </div>
          </form>
        </div>
        <PageOne/>
        <PageTwo/>
        <Footer/>
      </main>
    </div>
  );
}

export default HomePage;