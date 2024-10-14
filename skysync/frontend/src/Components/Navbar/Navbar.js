import React from 'react';
import './Navbar.css'; // Separate CSS for Navbar
import logo from './airplane-logo.png'; // Adjust the path as needed

const Navbar = () => {
  return (
    <header className="navbar-header">
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
      <button className="login-btn">Login</button>
    </header>
  );
};

export default Navbar;
