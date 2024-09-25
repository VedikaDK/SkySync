// src/HomePage.js
import React from 'react';
import './HomePage.css';
import logo from './airplane-logo.png'; // Replace with your logo image
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function HomePage() {
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
              <input type="text" placeholder="Delhi, DEL" />
            </div>
            <div className="form-group">
              <label>To</label>
              <input type="text" placeholder="Going to?" />
            </div>
            <div className="form-group">
              <label>Departure</label>
              <input type="date" />
            </div>
            <div className="form-group">
              <label>Return</label>
              <input type="date" placeholder="Add return" />
            </div>
            <div className="form-group">
              <label>Passengers</label>
              <input type="number" value="1" />
            </div>
            <div className="form-group">
              <button className="promo-btn">+ ADD PROMOCODE</button>
              <button className="search-btn">Search</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default HomePage;