import React, { useState, useEffect } from "react";

import "./Navbar.css"; // Separate CSS for Navbar
import logo from "./airplane-logo.png"; // Adjust the path as needed
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Check login status from local storage on mount
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  // Handle button click based on login status
  const handleAuthClick = () => {
    if (isLoggedIn) {
      // Perform logout
      localStorage.removeItem("isLoggedIn");
      setIsLoggedIn(false);
      alert("Logged out successfully");
    } else {
      // Simulate login and set isLoggedIn to true
      localStorage.setItem("isLoggedIn", "true"); // Simulate successful login
      setIsLoggedIn(true);
      navigate("/Main");
    }
  };


  const handleProfileClick = ()=>{
    window.location.href = "/profile";
  };

  return (
    <header className="navbar-header">
      <div className="logo-container">
        <img src={logo} alt="SkySync Logo" className="logo" />
      </div>
      <nav className="navbar">
        <ul>
          <li>
            <a href="/">Home</a>
          </li>{" "}
          {/* Make sure the href is correct for your routes */}
          <li>
            <a href="/about">About</a>
          </li>
          <li>
            <a href="/ContactPage">Contacts</a>
          </li>
        </ul>
      </nav>
      {/* <button id="LoginButton" className="login-btn1" onClick={handleLoginClick}>Login</button> */}
      <div className="button-group">
        <button id="AuthButton" className="auth-btn" onClick={handleAuthClick}>
          {isLoggedIn ? "Logout" : "Login"}
        </button>
        {isLoggedIn && (
          <button
            className="profile-btn"
            onClick={handleProfileClick}
            title="Profile"
          >
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
