//Main page where all section are there including section 2


import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import SeatBook from './SeatBook';
import SelectSeat from './SelectSeat';
import { useLocation } from 'react-router-dom';

import './SeatBook.css';


const SeatBookMain = () => {
    const [step, setStep] = useState(0); // Track the current step
    
  const location = useLocation();
  const { from, to, departureDate, returnDate, passengers ,flightID ,DepartingTime,ArrivingTime, FlightPrice } = location.state || {};// Default to empty object if no state is passed
 // State to manage progress step
 console.log(location.state);
 console.log('Received FlightPrice:', FlightPrice);
  
    // Step handlers
    const goToNextStep = () => setStep(prev => prev + 1);
    const completeBooking = () => {
      console.log('Booking complete!');
      // Additional actions (e.g., redirect, confirmation message)
    };

     // Render the current step's content
  const renderStepContent = () => {
    switch (step) {
      case 0:
        return <SeatBook onNext={goToNextStep} />;
      case 1:
          // Pass flightID and departureDate as props to SelectSeat
          return <SelectSeat onNext={goToNextStep} flightID={flightID} date={departureDate}  departingTime={DepartingTime} arrivingTime={ArrivingTime} FlightPrice={FlightPrice}/>;
    //   case 2:
    //     return <PaymentDetails onComplete={completeBooking} />;
      default:
        return null;
    }
  };
  // Function to move to the next step
 const handleNextClick = () => {
    if (step < 3) {
      setStep(step + 1); // Move to next step
    }else {
     // Handle form submission if it's the last step
     console.log('Booking complete!');
   }
 };
  return (
    <div className='seatpage'>
      <div className='navbar-container'>
        <Navbar />
      </div>

      <div className='content'>
        {/* Render the current step's content */}
        <div className='Section1'>{renderStepContent()}</div>

        {/* Section 2 - Common Progress Bar and Trip Summary */}
        <div className='Section2'>

        <div className='FormTrace'>
        <span>Next: {step === 0 ? 'Add On' : 'Complete'}</span>
                <div className='progress-bar'>
                <div className={`progress-step ${step >= 0 ? 'active' : ''}`}></div>
              <div className={`progress-step ${step >= 1 ? 'active' : ''}`}></div>
              <div className={`progress-step ${step >= 2 ? 'active' : ''}`}></div>
              <div className={`progress-step ${step >= 3 ? 'active' : ''}`}></div>
                </div>
            </div>
            <div className='trip-summary'>
                <div className='summary-header'>
                    <h3>Trip Summary</h3>
                    <a href='#' className='details-link'>DETAILS</a>
                </div>
                <div className='summary-section'>
                <p className="summary-label">{passengers} Adult{passengers > 1 ? 's' : ''}</p>
                </div>
                <div className='flight-summary'>
                    <p className='summary-title'>Flight Summary</p>
                    <div className='flight-details'>
                    <p className="route">{from} --- {to}</p>
                    <p className="schedule">
                    Departure: {departureDate} | Return: {returnDate}
                    </p>
                    <p className="baggage">Check-in: 15KG | Hand: Up to 7KG</p>
                    <p className="FlightID">FlightId : {flightID}
                      DepartingTime:{DepartingTime}
                      ArrivingTime:{ArrivingTime}
                      
                    </p>
                    <p>Price:{FlightPrice}</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

             <div>
                <button className='NextButton' onClick={handleNextClick}>Next</button>
             </div>

      <div className='footer-container'>
        <Footer />
      </div>
    </div>
  );
};


export default SeatBookMain;
