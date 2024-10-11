/***import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FlightSearch.css';

function FlightSearch({ from, to }) {
  const [flights, setFlights] = useState([]); // State to store flight data
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    // Function to fetch flights based on departing and arriving cities
    const fetchFlights = async () => {
      try {
        // Send GET request to the backend with 'from' and 'to' as query parameters
        const response = await axios.get('http://localhost:5000/api/flights', {
          params: { from, to }
        });
        
        // Set the flight data in state
        setFlights(response.data);
      } catch (error) {
        console.error('Error fetching flight data:', error);
        setError('Could not fetch flight data. Please try again.');
      }
    };

    // Only call fetchFlights if both 'from' and 'to' are available
    if (from && to) {
      fetchFlights();
    }
  }, [from, to]); // Fetch flights when 'from' or 'to' changes ****/
  // FlightSearch.js
  import React, { useEffect, useState } from 'react';
  import { useLocation } from 'react-router-dom';
  import './FlightSearch.css';
  import luggage from './image.png'; 

  //import editIcon from './edit.png';  // Replace this with the path to your edit icon
  
  function FlightSearch() { 
    const location = useLocation();
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
  
    // Retrieve search parameters from the location state
    const { from, to, departureDate, returnDate, passengers } = location.state || {};
  
    useEffect(() => {
      const fetchFlights = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/search-flights', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from,
              to,
              departureDate,
              returnDate,
              passengers,
            }),
          });
  
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
  
          const data = await response.json();
          setFlights(data);
        } catch (error) {
          console.error('Error fetching flights:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchFlights();
    }, [from, to, departureDate, returnDate, passengers]);
  
    return (
      <div className="flight-search">
        <div className="flight-info-container">
          <div className="flight-info-item">{from} - {to}</div>
          <div className="flight-info-divider"></div>
          <div className="flight-info-item">{departureDate}</div>
          <div className="flight-info-divider"></div>
          <div className="flight-info-item">{passengers} {passengers > 1 ? 'Passengers' : 'Passenger'}</div>
          <div className="flight-info-divider"></div>
          
        </div>
  
        <h2>Available Flights:</h2>
        {loading ? (
          <p>Loading...</p>
        ) : flights.length > 0 ? (
          flights.map((flight) => (
            <div key={flight._id} className="flight-result">
               <div className="flight-details-left">
               <h3>{flight.FlightName} ({flight.FlightCode})</h3>
              
                 </div> 
                 <div className='flight-info-between'>
                 <p className="time">{flight.DepartingTime}</p>
                 </div> 
              <div className="flight-info-center">
                <p>{flight.DepartingCity} &rarr; {flight.ArrivingCity}</p>
                  <p className="flight-duration">Duration: {flight.Duration}</p>
                  
                 </div>
                <div className='flight-between'>
                <p className="time">{flight.ArrivingTime}</p>
                </div>
                 <div className="flight-details-right">
                  <div className="flight-price">
                   <h3>Rs {flight.Price}</h3>
                  <button className="book-button">Book Flight</button>
                  </div>
                </div>
               </div>

          
          ))
        ) : (
          <p>No flights found for the given criteria.</p>
        )}
      </div>
    );
  }
  
  export default FlightSearch; 
  