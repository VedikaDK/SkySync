/****import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';
import logo from './airplane-logo.png'; // Replace with your logo image

function HomePage() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departure, setDeparture] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input fields (e.g., ensure dates are valid)

    try {
      const response = await axios.post('/api/search', {
        from,
        to,
      });

      const flightData = response.data;
     // Redirect to SearchPage with flight data as props
     navigate('/FlightSearch', { state: { flightData } });
    } catch (error) {
      console.error('Error fetching flight data:', error);
      // Handle error gracefully (e.g., display error message)
    }
  };

  return (
    <div className="homepage">
      <header className="header">
        <div className="logo-container">
          <img src={logo} alt="SkySync Logo" className="logo" />
        </div>
        <nav className="navbar">
          <ul>
            <li><a href="#">Book</a></li>
            <li><a href="#">Trips</a></li>
            <li><a href="#">Check-in</a></li>
            <li><a href="#">6E Rewards</a></li>
            <li><a href="#">Loyalty</a></li>
          </ul>
        </nav>
        <button id="LoginButton" className="login-btn">Login</button>
      </header>
      <main className="main-content">
        <h2>Ready to take flight with SkySync?</h2>
        <div className="booking-form">
          <div className="tabs">
            <button className="tab active">Book a flight</button>
          </div>
          <form className="form">
            <div className="form-group">
              <label>From</label>
              <input
                type="text"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="Delhi, DEL"
              />
            </div>
            <div className="form-group">
              <label>To</label>
              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="Going to?"
              />
            </div>
            <div className="form-group">
              <label>Departure</label>
              <input
                type="date"
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Return</label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Passengers</label>
              <input
                type="number"
                value={passengers}
                onChange={(e) => setPassengers(e.target.value)}
              />
            </div>
            <div className="form-group">
              <button type="button" className="promo-btn">+ ADD PROMOCODE</button>
               <form onSubmit={handleSubmit}>
                {/* ... input fields for fromCity, toCity, departureDate, returnDate, passengers, and promoCode ...  }
                 <button type="submit">Search</button>
              </form>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default HomePage;***/ 

// HomePage.js
// HomePage.js
import React, { useState } from 'react';
import './HomePage.css';
import logo from './airplane-logo.png';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  // State to manage form data
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const navigate = useNavigate();

  // Handle Login Button click
  const handleLoginClick = () => {
    navigate("/Main");
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    // Perform form validation (e.g., check if fields are filled in)
    if (!from || !to || !departureDate || passengers <= 0) {
      alert("Please fill in all required fields.");
      return;
    }
    
    // Trim inputs to avoid leading/trailing spaces
    const trimmedFrom = from.trim();
    const trimmedTo = to.trim();

    // Navigate to FlightSearch page with search parameters
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
      <header className="header">
        <div className="logo-container">
          <img src={logo} alt="SkySync Logo" className="logo" />
        </div>
        <nav className="navbar">
          <ul>
            <li><a href="#">Home</a></li> 
            <li><a href="#">About</a></li>
            <li><a href="#">Contacts</a></li>
          </ul>
        </nav>
        <button id="LoginButton" className="login-btn" onClick={handleLoginClick}>Login</button>
      </header>

      <main className="main-content">
        <h2>Elevate Your Travel Experience with SkySync!</h2> 
        <div className="booking-form">
          <div className="tabs">
            <button className="tab active">Book a flight</button>
            </div>
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>From</label>
              <select 
                value={from} 
                onChange={(e) => setFrom(e.target.value)} // Controlled input
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
            <div className="form-group">
              <label>To</label>
              <select 
                value={to} 
                onChange={(e) => setTo(e.target.value)} // Controlled input
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
            <div className="form-group">
              <label>Passengers</label>
              <input 
                type="number" 
                value={passengers} 
                onChange={(e) => setPassengers(Number(e.target.value))}// Controlled input
                min="1"
                required 
              />
            </div>
            <div className="form-group">
              <label>Departure</label>
              <input 
                type="date" 
                value={departureDate} 
                onChange={(e) => setDepartureDate(e.target.value)} // Controlled input
                required 
              />
            </div>
            <div className="form-group">
              <label>Return</label>
              <input 
                type="date" 
                value={returnDate} 
                onChange={(e) => setReturnDate(e.target.value)} // Controlled input
                placeholder="Optional return date"
              />
            </div>
            
            <div className="form-group">
             
              <button className="search-btn" type="submit">Search</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default HomePage;
