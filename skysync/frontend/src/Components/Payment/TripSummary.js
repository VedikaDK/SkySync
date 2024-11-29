import React from 'react';
import './TripSummary.css';
import Payment from './PaymentGateway';

const TripSummary = ({ details }) => {
  //handlepayment fun
  const handlePayment = () => {
    console.log("Details sent to Payment function:", details); // Debugging
    Payment(details);
  };

  return (
    <div className="trip-summary-container">
      <h2>Trip Summary</h2>
      <div className="summary-section1">
        <div>
          {/* Pay button */}
          <button id="fare" onClick={() => handlePayment(details.price, details.flightID)}>
            Pay
          </button>
          <p id="price">₹ {details.price}</p>
        </div>
        <div className="flight-info">
          <p><strong>Flight ID:</strong> {details.flightID}</p>
          <p><strong>Departure:</strong> {details.deptCity}</p>
          <p><strong>Arrival:</strong> {details.arrCity}</p>
          <p><strong>Date:</strong> {details.date}</p>
          <p><strong>Time:</strong> {details.time}</p>
          <p><strong>Seats:</strong> {details.seats.join(',')}</p>
        </div>
      </div>
     
    </div>
  );
};

export default TripSummary;