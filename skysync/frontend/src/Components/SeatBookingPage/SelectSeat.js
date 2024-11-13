import React, { useState , useEffect} from 'react';
import './SelectSeat.css';

const totalRows = 20; // Total number of rows in the airplane
const businessClassRows = 5; // Number of rows for business class
const economyClassStartRow = 12; // The row after which economy class starts

const seatStatuses = {
  AVAILABLE: 'available',
  RESERVED: 'reserved',
  SELECTED: 'selected',
};

function SelectSeat({ flightID, date ,departingTime,arrivingTime,FlightPrice}) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [reservedSeats, setReservedSeats] = useState([]);
  const [seatMapData, setSeatMapData] = useState([]);
  const [availableSeatCount, setAvailableSeatCount] = useState(0);

  // Fetch seat map data from backend
  useEffect(() => {
    console.log("Received flightID:", flightID);  // Log the flightID
    console.log("Received date:", date);  // Log the date
    console.log(FlightPrice);
    const fetchSeatMapData = async () => {
      try {
        const response = await fetch(`/api/seat-map/${flightID}/${date}`);
        const data = await response.json();
        if (data.seatAvailability) {
          setSeatMapData(data.seatAvailability);
          const availableSeats = data.seatAvailability.filter(seat => seat.status === seatStatuses.AVAILABLE);
          setAvailableSeatCount(availableSeats.length);
        }else {
          // If no seat availability data is found, assume all seats are available
          const allSeats = [];
          for (let row = 1; row <= totalRows; row++) {
            const isBusinessClass = row <= businessClassRows;
            const seatsInRow = isBusinessClass ? 4 : 6; // 2-2 for business, 3-3 for economy

            for (let seatNum = 0; seatNum < seatsInRow; seatNum++) {
              const seatLetter = String.fromCharCode(65 + seatNum);
              const seatId = `${row}${seatLetter}`;
              allSeats.push({ seatId, status: seatStatuses.AVAILABLE });
            }
          }
          setSeatMapData(allSeats);
          setAvailableSeatCount(allSeats.length); // All seats are available
        }
      }  catch (error) {
        console.error("Error fetching seat map:", error);
      }
    };

    if (flightID && date) {
      fetchSeatMapData();
    }
  }, [flightID, date]);

  const toggleSeatSelection = (seatId) => {
    if (reservedSeats.includes(seatId)) return;
    setSelectedSeats((prevSelected) =>
      prevSelected.includes(seatId)
        ? prevSelected.filter((seat) => seat !== seatId)
        : [...prevSelected, seatId]
    );
  };

  const confirmBooking = async () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/flight-schedule/book-seat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          FlightID: flightID,  // Change flightID to FlightID (capital F)
          date: date,         // Change 'Date' to 'Date1' to match the backend
          selectedSeats: selectedSeats.map(seatId => ({
            seatNumber: seatId,
            status: seatStatuses.RESERVED
          })),
          FlightPrice,         // Ensure this is defined
          DepartingTime: departingTime,    // Ensure this is defined
          ArrivingTime: arrivingTime,      // Ensure this is defined
          BookingStatus: "open"            // Booking status as needed
      
        }),
      });
      const data = await response.json();
  
      if (response.ok) {
        console.log("Booking confirmed:", data);
        setReservedSeats([...reservedSeats, ...selectedSeats]);
        setSelectedSeats([]);
      } else {
        console.error("Error confirming booking:", data.error);
      }
    } catch (error) {
      console.error("Error during booking:", error);
    }
  };

  const getSeatStatus = (seatId) => {
    if (reservedSeats.includes(seatId)) return seatStatuses.RESERVED;
    if (selectedSeats.includes(seatId)) return seatStatuses.SELECTED;

    // Check if seatMapData is available and find the seat status
    const seatData = seatMapData.find(seat => seat.seatId === seatId);
    if (seatData) {
        return seatData.status === seatStatuses.RESERVED ? seatStatuses.RESERVED : seatStatuses.AVAILABLE;
    }
    // Default to available if seat data is not found
    return seatStatuses.AVAILABLE;
  };

  // Generate seat layout
  const seatLayout = [];
  for (let row = 1; row <= totalRows; row++) {
    // Add a visual divider after the 12th row
    if (row === economyClassStartRow) {
      seatLayout.push(
        <div key="divider" className="row-divider">
          <span></span>
        </div>
      );
    }

    const seats = [];
    const isBusinessClass = row <= businessClassRows;
    const seatsInRow = isBusinessClass ? 4 : 6; // 2-2 for business, 3-3 for economy

    for (let seatNum = 0; seatNum < seatsInRow; seatNum++) {
      const seatLetter = String.fromCharCode(65 + seatNum);
      const seatId = `${row}${seatLetter}`;
      seats.push(
        <button
          key={seatId}
          className={`seat ${getSeatStatus(seatId)} ${isBusinessClass ? 'business-seat' : 'economy-seat'}`}
          onClick={() => toggleSeatSelection(seatId)}
          disabled={reservedSeats.includes(seatId)}
        >
          {seatId}
        </button>
      );
    }

    seatLayout.push(
      <div key={row} className="seat-row">
        <div className="seat-block left">
          {isBusinessClass
            ? seats.slice(0, 2) 
            : seats.slice(0, 3)} 
        </div>
        <div className="aisle"></div> {/* Aisle between left and right seats */}
        <div className="seat-block right">
          {isBusinessClass
            ? seats.slice(2, 4) 
            : seats.slice(3, 6)} 
        </div>
      </div>
    );
  }

  return (
    <div className="seat-map">
      <div className="seat-legend">
        <span className="seat available">Available</span>
        <span className="seat selected">Selected</span>
        <span className="seat reserved">Reserved</span>
      </div>

      {/* Display Available Seat Count */}
      <div className="available-seats">
        <h4>Available Seats: {availableSeatCount}</h4>
      </div>

      {seatLayout}
      <div className="summary">
        <h3>Selected Seats</h3>
        <p>{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'No seats selected'}</p>
      </div>
      <button onClick={confirmBooking} className="confirm-button">
        Confirm Booking
      </button>
    </div>
  );
}

export default SelectSeat;
