//Main page where all section are there including section 2


import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import SeatBook from './SeatBook';
import SelectSeat from './SelectSeat';
import TripSummary from '../Payment/TripSummary';
import BookingForm from '../SeatBookingPage/BookingForm';
import { useLocation } from 'react-router-dom';
import { onPayment } from '../Payment/PaymentGateway';

import './SeatBook.css';


const SeatBookMain = () => {


    const [step, setStep] = useState(0); // Track the current step
    const [reservedSeatNumbers, setReservedSeats] = useState(0); 

    const [SelectedSeatData,setSelectedData] = useState([]);

    const[passengersData,setPassengerDetails]=useState([]);

    const[userdata,setUserDetails]=useState({ });

    
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

  
    const fetchReservedSeats = async (flightID, date) => {
      console.log("In reserved seat array function flightID:", flightID, "date:", date);
      try {
          const response = await fetch("http://localhost:5000/api/reserved-seats", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({ flightID, date }),
          });
          if (!response.ok) {
              throw new Error("Failed to fetch reserved seats");
          }
          const data = await response.json();
          // Extract seat numbers from the response
          const reservedSeatNumbers = data.reservedSeats.map(seat => seat.seatNumber);
          console.log("Reserved seat array : ", reservedSeatNumbers);
          // Update state with the extracted seat numbers
          setReservedSeats(reservedSeatNumbers);
      } catch (error) {
          console.error("Error fetching reserved seats:", error.message);
      }
  };


//Call back function for selected seat data
  const handleBookingData = (data) => {
    setSelectedData(data); // Set the data received from the child component
    console.log(" Seat Booking confirmed with data:", data);
  };

//call back for passsanger details
const handleDetailsChange = (updatedDetails) => {
  console.log('Passenger details updated:', updatedDetails);
  // Update state or perform other actions with the updated details
  setPassengerDetails(updatedDetails);
};

const handleUserDetails = (formData) => {
  setUserDetails(formData );
  console.log("Received User details: ", formData);
};

     // Render the current step's content
  const renderStepContent = () => {
    switch (step) {
      case 0:
        return <SeatBook onNext={goToNextStep}  onDetailsChange={handleUserDetails} />;
      case 1:
          // Pass flightID and departureDate as props to SelectSeat
          return <SelectSeat onNext={goToNextStep} flightID={flightID} date={departureDate}  departingTime={DepartingTime} arrivingTime={ArrivingTime} FlightPrice={FlightPrice}  onBookingConfirm={handleBookingData}  />;
        
     case 2:  
     // fetchReservedSeats(flightID,departureDate);
     console.log("Sending Data to Booking form : ",SelectedSeatData);
     //I need to do a callback function here to acess the data
     return <BookingForm    onNext={goToNextStep} SelectedSeatData={SelectedSeatData}   onDetailsChange={handleDetailsChange}/>;
      
     case 3:
      // Convert the object to an array of its values
      console.log("Sending Data to Trip summary (Passanger Data)",passengersData);
      console.log("Sending the User data to trip summary(One who is booking)",userdata);
      let totalPrice = FlightPrice * SelectedSeatData.length;

      // Loop through each selected seat and check if it starts with a letter
        SelectedSeatData.forEach((seat) => {
          const seatLetter = seat.charAt(0); // Get the first character of the seat number (e.g., "A" from "A1")
          if (['1', '2', '3', '4'].includes(seatLetter)) {
            totalPrice += 100; // Add ₹100 for seats starting with A, B, C, or D
          }
      })
      // Log the length of the resulting array
      const flightDetails = {
        flightID: flightID,
        deptCity: from,
        arrCity: to,
        date: departureDate,
        time: DepartingTime,
        seats: SelectedSeatData.length > 0 ? SelectedSeatData : ['No seats selected'], // Ensure valid seats
        passengerNames: passengersData,//object
        contact: userdata.phone,
        price: totalPrice, // Calculate price dynamically
      };
      console.log("Length of array:", FlightPrice * SelectedSeatData.length);
      return <TripSummary details={flightDetails} />;
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
                    <p className="Seats-Selected">Seats Selected: {SelectedSeatData.join(', ')}</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

          {step < 3 && (
            <div>
              <button className='NextButton' onClick={handleNextClick}>Next</button>
            </div>
          )}

      <div className='footer-container'>
        <Footer />
      </div>
    </div>
  );
};


export default SeatBookMain;
