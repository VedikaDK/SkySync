
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './FlightSearch.module.css'; // Import the CSS module
//import luggage from './image.png'; 
import Navbar from '../Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import { FaFilter } from 'react-icons/fa'

function FlightSearch() { 
  const location = useLocation();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false); // State to toggle dropdown visibility
  const [timeFilter, setTimeFilter] = useState(''); // State to hold the time filter
  const navigate = useNavigate();

  // Retrieve search parameters from the location state
  const { from, to, departureDate, returnDate, passengers  } = location.state || {};

  const handleBookNow = (flightID,DepartingTime,ArrivingTime,FlightPrice) => {
    console.log(FlightPrice)
    // Navigate to SeatBook page with the search and booking data
    navigate('/SeatBookMain', {
      state: {
        from,
        to,
        departureDate,
        returnDate,
        passengers,
        flightID,
        DepartingTime,
        ArrivingTime,
        FlightPrice
      }
    });
  }
  

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
            passengers
          
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setFlights(data);
        setFilteredFlights(data);
      } catch (error) {
        console.error('Error fetching flights:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [from, to, departureDate, returnDate, passengers]);


  //Function to extract the hour from the time string (HH:mm)
    const getHourFromTime = (time) => {
      return parseInt(time.split(':')[0], 10); // Extract the hour part from "HH:mm"
      
    };
  
    // Filter flights based on time of day
    const handleTimeFilter = (timePeriod) => {
      console.log('Applying Time Filter:', timePeriod);
      setTimeFilter(timePeriod);
  
      const filtered = flights.filter((flight) => {
        const departingHour = getHourFromTime(flight.DepartingTime); // Get the hour from flight time
  
        if (timePeriod === 'Morning') {
          return departingHour >= 5 && departingHour < 12;
        } else if (timePeriod === 'Afternoon') {
          return departingHour >= 12 && departingHour < 17;
        } else if (timePeriod === 'Evening') {
          return departingHour >= 17 && departingHour < 21;
        } else if (timePeriod === 'Night') {
          return departingHour >= 21 || departingHour < 5;
        }
        return true; // If no filter is applied
      });
  
      setFilteredFlights(filtered);
      
      setShowDropdown(false); // Close the dropdown after selecting
    };
  
    // Sort flights based on price (low to high)
    const handlePriceSort = () => {
      const sortedFlights = [...filteredFlights].sort((a, b) => a.Price - b.Price);
      setFilteredFlights(sortedFlights);
      setShowDropdown(false); // Close the dropdown after selecting
    };
  
    // Toggle the dropdown visibility
    const toggleDropdown = () => {
      setShowDropdown(!showDropdown);
};

  return (
    <div className={styles.flightSearch}>
        <div className={styles.backgroundImageSection}> 
        <Navbar /> 
      <div className={styles.flightInfoContainer}>
        <div className={styles.flightInfoItem}>{from} - {to}</div>
        <div className={styles.flightInfoDivider}></div>
        <div className={styles.flightInfoItem}>{departureDate}</div>
        <div className={styles.flightInfoDivider}></div>
        <div className={styles.flightInfoItem}>{passengers} {passengers > 1 ? 'Passengers' : 'Passenger'}</div>
        <div className={styles.flightInfoDivider}></div>
      </div>
      <h2>Available Flights</h2> 




      <div className={styles.filterSection}>
            <button className={styles.filterButton} onClick={toggleDropdown}>
              Filter
              <FaFilter className={styles.filterButtonIcon} />
            </button>
            {showDropdown && (
              <div className={styles.dropdown}>
                <p>Sort by Time:</p>
                <button onClick={() => handleTimeFilter('Morning')}>Morning</button>
                <button onClick={() => handleTimeFilter('Afternoon')}>Afternoon</button>
                <button onClick={() => handleTimeFilter('Evening')}>Evening</button>
                <button onClick={() => handleTimeFilter('Night')}>Night</button>
                <hr />
                <p>Sort by Price:</p>
                <button onClick={handlePriceSort}>Low to High</button>
              </div>
            )}
          </div>
     
      </div>
     
      {loading ? (
        <p>Loading...</p>
      ) : filteredFlights.length > 0 ? (
        filteredFlights.map((flight) => (
          <div key={flight._id} className={styles.flightResult}>

            <div className={styles.flightDetailsLeft}>
              <h3>{flight.FlightName} ({flight.FlightCode})</h3>
            </div> 
            
            <div className={styles.flightInfoBetween}>
              <p className={styles.time}>{flight.DepartingTime}</p>
            </div>
            <div className={styles.flightInfoCenter}>
              <p>{flight.DepartingCity} &rarr; {flight.ArrivingCity}</p>
              <p className={styles.flightDuration}>Duration: {flight.Duration}</p>
            </div>
            <div className={styles.flightBetween}>
              <p className={styles.time}>{flight.ArrivingTime}</p>
            </div>
            <div className={styles.flightDetailsRight}>
              <div className={styles.flightPrice}>
                <h3>Rs {flight.Price}</h3>
                <button className={styles.bookButton} onClick={() => handleBookNow(flight.FlightCode,flight.DepartingTime,flight.ArrivingTime,flight.Price)} >Book Flight</button>
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
