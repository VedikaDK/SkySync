import React from 'react';
import './PageOne.css';

import { useNavigate } from 'react-router-dom';
import airplaneImage from './PageOne.jpg'; // Replace with your airplane image

const PageOne = () => {
  const navigate = useNavigate();
  const handleBookNow = () => {
    navigate('/SeatBook'); // Navigate to the SeatBook page
  };

  return (
    <div className="page-one">
      <div className="page-one-left">
        <img src={airplaneImage} alt="Airplane" className="page-one-image" />
      </div>
      <div className="page-one-right">
        <h1>Fly Whenever You Want, Wherever You Want</h1>
        <p>
          Experience the freedom to fly on your schedule. Book flights easily and 
          choose from a wide range of destinations. SkySync makes your journey 
          seamless and comfortable.
        </p>
        {/* <button className="page-one-btn">Book Now</button> */}
        <button className="page-one-btn" onClick={handleBookNow}>Book Now</button>
        <p>
          Already have an account? <a href="/Main">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default PageOne;
