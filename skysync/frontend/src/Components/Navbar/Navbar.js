

import React from 'react';
import './Navbar.css'; // Separate CSS for Navbar
import logo from './airplane-logo.png'; // Adjust the path as needed
import { useNavigate } from 'react-router-dom'; // Import useNavigate


const Navbar = () => {
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Function to handle login button click
  const handleLoginClick = () => {
    navigate('/Main'); // Navigate to the login route
  };

  return (
    <header className="navbar-header">
      <div className="logo-container">
        <img src={logo} alt="SkySync Logo" className="logo" />
      </div>
      <nav className="navbar">
        <ul>
          <li><a href="/">Home</a></li> {/* Make sure the href is correct for your routes */}
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contacts</a></li>
        </ul>
      </nav>
      <button id="LoginButton" className="login-btn1" onClick={handleLoginClick}>Login</button>
    </header>
  );
};

export default Navbar;

