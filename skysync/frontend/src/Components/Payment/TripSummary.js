import React from 'react';
import './TripSummary.css';
import Payment from './PaymentGateway';

const TripSummary = () => {
  const handlePayment = (price, itemName) => {
    console.log(price);
    console.log(itemName);
    Payment(price, itemName);
  };

  return (
    <div className="trip-summary-container">
      <h2>Trip Summary</h2>
      <div className="summary-section">
        <div>
          {/* Pay button */}
          <button id="fare" onClick={() => handlePayment(5450, 'SG720')}>Pay</button>
          <p id="price">₹ 5,450</p>
        </div>
        <div className="flight-info">
          <p><strong>Departing:</strong> 6E 6576, A321</p>
          <p><strong>Saver fare</strong></p>
          <p><strong>Delhi - Goa</strong></p>
          <p>Fri, 16 Aug 2024 | 18:00 - 20:25 | 02h 25m | Non-Stop</p>
          <p>Check-in: 15KG | Hand: Up to 7KG</p>
        </div>
      </div>
      <div className="passenger-info">
        <p><strong>1 Passenger travelling</strong></p>
      </div>
    </div>
  );
};

export default TripSummary;