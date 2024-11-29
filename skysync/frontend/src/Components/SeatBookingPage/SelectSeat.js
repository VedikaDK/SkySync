import React, { useState , useEffect} from 'react';
import './SelectSeat.css';

const totalRows = 20; // Total number of rows in the airplane
const businessClassRows = 5; // Number of rows for business class
const economyClassStartRow = 6; // The row after which economy class starts


const seatStatuses = {
  AVAILABLE: 'available',
  RESERVED: 'reserved',
  SELECTED: 'selected',
};

function SelectSeat({ flightID, date ,departingTime,arrivingTime,FlightPrice ,onBookingConfirm }) {

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatMapData, setSeatMapData] = useState([]);


 //array to hold reserved seats IDs from database 
  const [reservedSeats, setReservedSeats] = useState([]);
  //array to hold available seats which is (avaibale - reserved)
  const [availableSeatCount, setAvailableSeatCount] = useState(0);
  //To  hold count to reserved seats
  const [reservedSeatsCount, setReservedSeatsCount] = useState(0); 
 
  //To hold Recent Selected Seat by user 
  const [RecentSelected , setrecentselected] = useState([]);
  
  useEffect(() => {

  //Generate SeatArray
    const generateSeatArray = () => {
      const allSeats = [];
      // Business class (rows 1 to 5)
      for (let row = 1; row <= businessClassRows; row++) {
        const seatsInRow = 4; // 2-2 configuration in business class
        for (let seatNum = 0; seatNum < seatsInRow; seatNum++) {
          const seatLetter = String.fromCharCode(65 + seatNum); // A, B, C, D
          const seatId = `${row}${seatLetter}`;
          allSeats.push({ SeatNumber: seatId, Status: seatStatuses.AVAILABLE });
        }
      }
  
      // Economy class (rows 6 to 20)
      for (let row = economyClassStartRow; row <= totalRows; row++) {
        const seatsInRow = 6; // 3-3 configuration in economy class
        for (let seatNum = 0; seatNum < seatsInRow; seatNum++) {
          const seatLetter = String.fromCharCode(65 + seatNum); // A, B, C, D, E, F
          const seatId = `${row}${seatLetter}`;
          allSeats.push({ SeatNumber: seatId, Status: seatStatuses.AVAILABLE });
        }
      }
      return allSeats;
    };




  
    
    // Set the generated SeatArray
    const initialSeatArray = generateSeatArray();
    setSeatMapData(initialSeatArray);
   


    // Call function to get available seat count
    const fetchAvailableSeatsCount = async () => {
      const count = await getAvailableSeatsCount(flightID, date);
      setAvailableSeatCount(count); // Store the reserved seat count in state
      console.log("Available seat count in render:", availableSeatCount);
    };



    // Call function to get reserved seat count
    const fetchReservedSeatsCount = async () => {
      const count = await getReservedSeatsCount(flightID, date);
      setReservedSeatsCount(count); // Store the reserved seat count in state
      
    };

    //TO fetch the reserved seats the seats that are marked reserved into database
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


  //function to get selected seat that has been marked as selected into db
  const fetchSelectedSeats = async (flightID, date) => {
    console.log("In reserved seat array function flightID:", flightID, "date:", date);
    try {
        const response = await fetch("http://localhost:5000/api/selected-seats", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ flightID, date }),
        });
        if (!response.ok) {
            throw new Error("Failed to fetch selected  seats");
        }
        const data = await response.json();
        // Extract seat numbers from the response
        const SelectedSeatNumbers = data.RecentSelected.map(seat => seat.seatNumber);
        console.log("Selected seat array : ", SelectedSeatNumbers);
        // Update state with the extracted seat numbers
        setrecentselected(SelectedSeatNumbers);
    } catch (error) {
        console.error("Error fetching Selected seats:", error.message);
    }
}; 
 

if (flightID && date) {
  fetchReservedSeatsCount();
  fetchAvailableSeatsCount();
  fetchReservedSeats(flightID,date);
  fetchSelectedSeats(flightID,date);
}
  }, [flightID, date]); // Run the effect whenever flightID or date changes
  


  

































  
  // Use useEffect to log the updated available seat count whenever it changes
  useEffect(() => {
    console.log("Updated available seat count:", availableSeatCount);
  }, [availableSeatCount]); // Runs when availableSeatCount changes

  // Use useEffect to log the updated reserved seat count whenever it changes
  useEffect(() => {
    console.log("Updated reserved seat count:", reservedSeatsCount);
  }, [reservedSeatsCount]); // Runs when reservedSeatsCount changes

  //Calculate total no of seats
  const calculateTotalSeats = () => {
    const businessSeats = businessClassRows * 4; // 4 seats per row in business class
    const economySeats = (totalRows - businessClassRows) * 6; // 6 seats per row in economy class
    return businessSeats + economySeats;
  };


//To count the no of reserved seats from database
const getReservedSeatsCount = async (flightID, date) => {
  console.log("Sending date to server:", date); // Log the date format
  console.log("Inside getReservedSeatsCount - flightID:", flightID, "date:", date);

  try {
    const response = await fetch("http://localhost:5000/api/reserved-seats-count", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ flightID, date }),
    });

    console.log("Response Status Code:", response.status); // Log response status

    if (!response.ok) {
      const errorText = await response.text();  // Capture error text from response
      console.error("Error Response Body:", errorText);  // Log error response body
      throw new Error(`Failed to fetch reserved seats count. Status: ${response.status}, Response: ${errorText}`);
    }

    const data = await response.json();
    console.log("Server response data:", data);  // Log the full response data

    // Ensure the response contains the expected data structure
    if (data.reservedSeatsCount !== undefined) {
      return data.reservedSeatsCount;
    } else {
      throw new Error("Reserved seats count not found in response");
    }
  } catch (error) {
    console.error("Error in getReservedSeatsCount:", error);  // Log any errors
    return 0;  // Return 0 as fallback if there is an error
  }
};


  //to get the count of  avaiable seat
      const getAvailableSeatsCount = async (flightID, date ) => {
        const totalSeats = calculateTotalSeats();
        console.log("Total seats : ", totalSeats);
        
            
        console.log("Inside getAvailableSeatsCount - flightID:", flightID, "date:", date);
        
            
            try {
              // Send a POST request to the backend with the flightID and date
              const response = await fetch("http://localhost:5000/api/available-seats", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ flightID, date , totalSeats }), // Convert requestData to JSON string
              });
    
              // Check if the response was successful
              if (response.ok) {
                const data = await response.json();
                console.log("Received available count =", data.availableSeatsCount); // Log here
                return data.availableSeatsCount;
              } else {
                console.error("Failed to fetch available seats.");
              }
            } catch (error) {
              console.error("Error fetching available seats:", error);
            }
          };

























  const toggleSeatSelection = (seatId) => {

    if (reservedSeats.includes(seatId)) return; // Prevent actions on reserved seats
  
    // Toggle the seat status
    setSelectedSeats((prevSelected) => {
      const isSelected = prevSelected.includes(seatId);
  
      const updatedSelectedSeats = isSelected
        ? prevSelected.filter((seat) => seat !== seatId) // Deselect the seat
        : [...prevSelected, seatId]; // Select the seat
  
      // Update the seat map to reflect the current selection state
      setSeatMapData((prevSeatMapData) =>
        prevSeatMapData.map((seat) => {
          if (seat.SeatNumber === seatId) {
            return {
              ...seat,
              Status: isSelected ? seatStatuses.AVAILABLE : seatStatuses.SELECTED , // Set to AVAILABLE when deselected
            };
          }
          return seat;
        })
      );
  
      return updatedSelectedSeats; // Return the updated selected seats
    });
  };
  

  const confirmBooking = async () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }
    console.log("Selected seats",selectedSeats);
    try {
      const requestBody = {
        FlightID: flightID,
        date: date,
        SeatAvailability: selectedSeats.map(seatId => ({
          seatNumber: seatId,
          status: seatStatuses.SELECTED.toLowerCase() // Ensure the status matches the server's expected format (e.g., "reserved").
        })),
        FlightPrice,
        DepartingTime: departingTime,
        ArrivingTime: arrivingTime,
        BookingStatus: "open"
      };
  
      console.log("Request Body:", JSON.stringify(requestBody)); // Debug log to check the final request body.
  
      const response = await fetch('http://localhost:5000/api/flight-schedule/book-seat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();
      console.log("Data sent to  Booking Form Page :" );

      if (response.ok) {
        onBookingConfirm(
          selectedSeats,
        );
        // Update reservedSeats and SeatArray to reflect the reserved seats
        setrecentselected([...reservedSeats, ...selectedSeats]);
        setSeatMapData((prevSeatMapData) =>
          prevSeatMapData.map((seat) =>
            selectedSeats.includes(seat.SeatNumber)
              ? { ...seat, Status: seatStatuses.SELECTED }
              : seat
          )
        );
        setSelectedSeats([]); // Clear selected seats after confirmation
      } else {
        console.error("Error confirming booking:", data.error);
      }
    } catch (error) {
      console.error("Error during booking:", error);
    }
  };
  



//Testing for get status
const getSeatStatus = (seatId) => {
  if (reservedSeats.includes(seatId)) return seatStatuses.RESERVED;
  if (selectedSeats.includes(seatId)) return seatStatuses.SELECTED;
  const seatData = seatMapData.find(seat => seat.SeatNumber === seatId);
  return seatData ? seatData.Status : seatStatuses.AVAILABLE;
};


  

  // Generate seat layout
  //SEAT GENERATION CODE (SEAT MAP)
  //DO NOT CHANGE THIS



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
      const isReserved = reservedSeats.includes(seatId);
      seats.push(
        <button
      key={seatId}
      className={`seat ${isReserved ? "reserved" : getSeatStatus(seatId)} ${isBusinessClass ? "business-seat" : "economy-seat"}`}
      onClick={() => toggleSeatSelection(seatId)}
      disabled={isReserved} // Disable reserved seats
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
      <div className="Seat-Count">
        <h4>Available Seats: {availableSeatCount}</h4>
         
        <h4>Total Seats: {calculateTotalSeats()}</h4>

        <h4>Reserved Seats: {reservedSeatsCount}</h4>
      </div>

      {seatLayout}
      <div className="summary">
        <h3>Selected Seats</h3>
        <p>{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'No seats selected'}</p>
      </div>
      <button onClick={confirmBooking} className="confirm-button">
        Confirm Selected Seat
      </button>
    </div>
  );
}

export default SelectSeat;
