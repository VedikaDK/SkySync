import React from 'react';
import { useLocation } from 'react-router-dom';
import './ThankYou.css'; // Import the CSS file
import Navbar from '../Navbar/Navbar'

const ThankYou = () => {
  const location = useLocation();
  const { details } = location.state || {};

  return (
    <div  id= "body" style={{
      textAlign: 'center',
      backgroundImage: 'url("./bg.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
    }}>
      <Navbar/>
      <h1 id="heading">Thank You For Booking With Us! 😊</h1>
      <p id="head2">Your booking has been confirmed</p>
      {details && (
        <div>
          <h3>Booking Details</h3>
          <p>Flight: {details.Flight}</p>
          <p>Price: {details.price}</p>
          <p>Departure City: {details.deptCity}</p>
          <p>Arrival City: {details.arrCity}</p>
          <p>Date: {details.date}</p>
          <p>Time: {details.time}</p>
          <p>Seats: {details.seat.join(', ')}</p>
        </div>
      )}
    </div>
  );
};

export default ThankYou;