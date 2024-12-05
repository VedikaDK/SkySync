import React from 'react';
import './PageTwo.css';
import airplaneImage from './PageTwo.jpg'; // Replace with your airplane image
import { useNavigate } from "react-router-dom";

const PageTwo = () => {
     
  const navigate = useNavigate();

  const handleNavigation = () => {
      navigate("/CustomerFeedbacks");


  };
  return (
    <div className="page-two">
      <div className="page-two-left">
        <h1>"Discover the SkySync Journey: Where Every Flight Tells a Story"</h1>
        <p>
        At SkySync, we transform your travel dreams into reality, delivering seamless and personalized flight experiences. Discover how we are redefining air travel,
         one journey at a time!
        </p>


        <button className="page-two-btn" onClick={handleNavigation}>Get Started</button>
        <p>
          Want to know more? <a href="/About">Learn More</a>
        </p>
      </div>
      <div className="page-two-right">
        <img src={airplaneImage} alt="Airplane" className="page-two-image" />
      </div>
    </div>
  );
};

export default PageTwo;
