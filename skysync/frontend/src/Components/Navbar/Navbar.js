
import React, { useState, useEffect } from 'react';

import './Navbar.css'; // Separate CSS for Navbar
import logo from './airplane-logo.png'; // Adjust the path as needed
import { useNavigate } from 'react-router-dom'; // Import useNavigate



const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const navigate = useNavigate(); // Hook to navigate programmatically

  

  // Check login status from local storage on mount
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

//  // Handle button click based on login status
//  const handleAuthClick = () => {
//   if (isLoggedIn) {
//     // Perform logout
//     localStorage.removeItem('isLoggedIn');
//     setIsLoggedIn(false);
//     alert('Logged out successfully');
//   } else {
//     // Simulate login process
//     localStorage.setItem('isLoggedIn', 'true'); // Set login state in local storage
//     setIsLoggedIn(true); // Update state to logged in
//     // Navigate to login page
//     navigate('/Main');
//   }
// };
const handleAuthClick = async () => {
  if (isLoggedIn) {
      // Perform logout
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('firebaseUid'); // Clear UID on logout
      setIsLoggedIn(false);
      alert('Logged out successfully');
  } else {
      // Simulate login process
      // Replace the following with your actual Firebase login logic to get the UID
      const uid = await loginUser(); // Assume loginUser() returns the logged-in user's UID

      if (uid) {
          localStorage.setItem('isLoggedIn', 'true'); // Set login state in local storage
          localStorage.setItem('firebaseUid', uid); // Store the Firebase UID
          setIsLoggedIn(true); // Update state to logged in
          // Navigate to main page or wherever needed
          navigate('/Main');
      }
  }
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
      {/* <button id="LoginButton" className="login-btn1" onClick={handleLoginClick}>Login</button> */}
      <button
        id="AuthButton"
        className="auth-btn"
        onClick={handleAuthClick}
      >
        {isLoggedIn ? 'Logout' : 'Login'}
      </button>
    </header>
  );
};

export default Navbar;

