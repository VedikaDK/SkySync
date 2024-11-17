const mongoose = require('mongoose'); // Add this line
const express = require('express');
const router = express.Router();
const FlightSchedule = require('../model/FlightSchedule'); // Ensure this path is correct





///Route which adds the new flight and make changes in exixting one 
router.post('/flight-schedule/book-seat', async (req, res) => {
    const { FlightID, date, SeatAvailability, FlightPrice, DepartingTime, ArrivingTime, BookingStatus } = req.body;

    console.log(FlightID, date, SeatAvailability, FlightPrice, DepartingTime, ArrivingTime, BookingStatus);
   
    // Check for missing fields
    if (!FlightID || !date || !SeatAvailability || !FlightPrice || !DepartingTime || !ArrivingTime) {
        return res.status(400).json({
            error: "Missing required fields: FlightID, Date, SeatAvailability, FlightPrice, DepartingTime, ArrivingTime",
            received: req.body
        });
    }

    try {
        // Convert date to proper Date format
        const BookingDate = new Date(date);

        // Check if flight schedule exists for the given FlightID and Date
        let flightSchedule = await FlightSchedule.findOne({ FlightID: FlightID, Date: BookingDate });

        // If no flight schedule exists, create a new one using the dynamically passed data
        if (!flightSchedule) {
            console.log(`No flight schedule found for FlightID: ${FlightID}, Date: ${BookingDate}. Creating new schedule.`);

            // Create a new flight schedule based on the request body
            flightSchedule = new FlightSchedule({
                FlightID,
                Date: BookingDate,
                SeatAvailability: SeatAvailability.map(seat => ({
                    seatNumber: seat.seatNumber,
                    status: 'reserved'  // Default status is 'available' if not provided
                })),
                FlightPrice,
                DepartingTime,
                ArrivingTime,
                BookingStatus
            });



            

            // Save the newly created flight schedule
            await flightSchedule.save();
            console.log('New flight schedule created:', flightSchedule);
        } else {
            // If schedule exists, update the seat availability with newly selected seats
            console.log(`Flight schedule found for FlightID: ${FlightID}, Date: ${BookingDate}. Updating seat availability.`);

            // Iterate through the incoming SeatAvailability and update statuses
            SeatAvailability.forEach(seat => {
                const seatIndex = flightSchedule.SeatAvailability.findIndex(s => s.seatNumber === seat.seatNumber);
                if (seatIndex !== -1) {
                    // If the seat exists, mark it as reserved if it's available
                    if (flightSchedule.SeatAvailability[seatIndex].status === 'available') {
                        flightSchedule.SeatAvailability[seatIndex].status = 'reserved';
                        console.log(`Seat ${seat.seatNumber} marked as reserved`);
                    } else {
                        console.log(`Seat ${seat.seatNumber} is already reserved`);
                    }
                } else {
                    // If seat doesn't exist, add it as a new reserved seat
                    flightSchedule.SeatAvailability.push({ seatNumber: seat.seatNumber, status: 'reserved' });
                    console.log(`New seat ${seat.seatNumber} added and marked as reserved`);
                }
            });

            // Update dynamic fields (price, time, status)
            flightSchedule.FlightPrice = FlightPrice;      // Update flight price
            flightSchedule.DepartingTime = DepartingTime;  // Update departing time
            flightSchedule.ArrivingTime = ArrivingTime;    // Update arriving time

            // Check if all seats are reserved
            const allSeatsReserved = flightSchedule.SeatAvailability.every(seat => seat.status === 'reserved');
            if (allSeatsReserved) {
                flightSchedule.BookingStatus = 'fully booked';
            } else {
                flightSchedule.BookingStatus = 'open';
            }

            // Save the updated flight schedule
            await flightSchedule.save();
            console.log('Flight schedule updated:', flightSchedule);
        }

        // Return the updated or newly created flight schedule
        res.status(200).json({
            message: 'Seats successfully booked or updated!',
            flightSchedule
        });

    } catch (error) {
        console.error("Error processing flight booking:", error);
        res.status(500).json({ message: 'Something went wrong!' });
    }
});







///ROUTE to GET the DETAILS of OBJECT 


// Route to GET(POST) flight details for booking based on flightID and Date
// Route to get flight details by FlightID and Date
router.post("/flightdetails", async (req, res) => {
    try {
        // Log the incoming request body for debugging
        console.log("Request body received:", req.body);

        // Extract flightID and date from the request body
        const { flightID, date } = req.body;

        // Log the extracted fields for debugging
        console.log("Extracted FlightID:", flightID);
        console.log("Extracted Date:", date);

        // Validate that both fields are present
        if (!flightID || !date) {
            console.log("Missing required fields: FlightID or Date");
            return res.status(400).json({ error: "FlightID and Date are required" });
        }

        // Convert the date to a JavaScript Date object
        const bookingDate = new Date(date);

        // Log the booking date after conversion
        console.log("Converted Booking Date:", bookingDate);

        // Check if the date is valid
        if (isNaN(bookingDate.getTime())) {
            console.log("Invalid date format received:", date);
            return res.status(400).json({ error: "Invalid date format" });
        }

        // Fetch the flight schedule based on FlightID and date
        console.log("Fetching flight details for FlightID:", flightID, "and Date:", bookingDate);
        const flightDetails = await FlightSchedule.findOne({
            FlightID: flightID,
            Date: bookingDate
        });

        // Check if flight schedule exists
        if (flightDetails) {
            console.log("Flight details found:", flightDetails);
            return res.status(200).json(flightDetails);
        } else {
            console.log("Flight not found for the given date");
            return res.status(404).json({ error: "Flight not found for the given date" });
        }
    } catch (error) {
        // Log the full error and its stack for debugging purposes
        console.error("Error fetching flight details:", error.message);
        console.error("Error stack:", error.stack);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});







// Endpoint to fetch all the reserved seats for a specific flight and date

router.post("/reserved-seats", async (req, res) => {
    try {
        // Log the incoming request body for debugging
        console.log("Request body received:", req.body);

        // Extract flightID and date from the request body
        const { flightID, date } = req.body;

        // Log the extracted fields for debugging
        console.log("Extracted FlightID:", flightID);
        console.log("Extracted Date:", date);

        // Validate that both fields are present
        if (!flightID || !date) {
            console.log("Missing required fields: FlightID or Date");
            return res.status(400).json({ error: "FlightID and Date are required" });
        }

        // Convert the date to a JavaScript Date object
        const bookingDate = new Date(date);

        // Log the booking date after conversion
        console.log("Converted Booking Date:", bookingDate);

        // Check if the date is valid
        if (isNaN(bookingDate.getTime())) {
            console.log("Invalid date format received:", date);
            return res.status(400).json({ error: "Invalid date format" });
        }

        // Print the full flight schedule object for debugging
        console.log("Fetching flight details for FlightID:", flightID, "and Date:", bookingDate);

        // Fetch the flight schedule based on FlightID and date
        const flightDetails = await FlightSchedule.findOne({
            FlightID: flightID,
            Date: bookingDate
        });

        // Check if flight schedule exists
        if (!flightDetails) {
            console.log("Flight not found for the given date");
            return res.status(404).json({ error: "Flight not found for the given date" });
        }

        // Log the flight details before proceeding
        console.log("Flight details found:", flightDetails);

        // Fetch the reserved seats from the flight details
        const reservedSeats = flightDetails.SeatAvailability.filter(seat => seat.status === "reserved");

        // Log the reserved seats found
        console.log("Reserved Seats Found:", reservedSeats);
        
        // Return the reserved seats or an empty array if none found
        return res.status(200).json({ 
            reservedSeats: reservedSeats,
         });

          
    } catch (error) {
        // Log the full error and its stack for debugging purposes
        console.error("Error fetching reserved seats:", error.message);
        console.error("Error stack:", error.stack);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
















router.post("/reserved-seats-count", async (req, res) => {
    try {
        // Log the incoming request body for debugging
        console.log("Request body received:", req.body);

        // Extract flightID and date from the request body
        const { flightID, date } = req.body;

        // Log the extracted fields for debugging
        console.log("Extracted FlightID:", flightID);
        console.log("Extracted Date:", date);

        // Validate that both fields are present
        if (!flightID || !date) {
            console.log("Missing required fields: FlightID or Date");
            return res.status(400).json({ error: "FlightID and Date are required" });
        }

        // Convert the date to a JavaScript Date object
        const bookingDate = new Date(date);

        // Log the booking date after conversion
        console.log("Converted Booking Date:", bookingDate);

        // Check if the date is valid
        if (isNaN(bookingDate.getTime())) {
            console.log("Invalid date format received:", date);
            return res.status(400).json({ error: "Invalid date format" });
        }

        // Print the full flight schedule object for debugging
        console.log("Fetching flight details for FlightID:", flightID, "and Date:", bookingDate);

        // Fetch the flight schedule based on FlightID and date
        const flightDetails = await FlightSchedule.findOne({
            FlightID: flightID,
            Date: bookingDate
        });

        // Check if flight schedule exists
        if (!flightDetails) {
            console.log("Flight not found for the given date");
            return res.status(404).json({ error: "Flight not found for the given date" });
        }

        // Log the flight details before proceeding
        console.log("Flight details found:", flightDetails);

        // Fetch the reserved seats from the flight details
        const reservedSeats = flightDetails.SeatAvailability.filter(seat => seat.status === "reserved");
        const reservedSeatsCount = reservedSeats.length;

        // Log the reserved seats found
        console.log("Reserved Seats Found:", reservedSeats);
        
        // Return the reserved seats or an empty array if none found
        return res.status(200).json({ 
            reservedSeatsCount
         });

          
    } catch (error) {
        // Log the full error and its stack for debugging purposes
        console.error("Error fetching reserved seats:", error.message);
        console.error("Error stack:", error.stack);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});





















// Route to get available seat count
router.post("/available-seats", async (req, res) => {
    try {
        // Log the incoming request body for debugging
        console.log("Request body received for available seat :", req.body);

        // Extract flightID and date from the request body
        const { flightID, date ,totalSeats} = req.body;

        // Log the extracted fields for debugging
        console.log("Extracted FlightID:", flightID);
        console.log("Extracted Date:", date);
        console.log("Extracted Totalseat :",totalSeats)

        // Validate that both fields are present
        if (!flightID || !date) {
            console.log("Missing required fields: FlightID or Date");
            return res.status(400).json({ error: "FlightID and Date are required" });
        }

        // Convert the date to a JavaScript Date object
        const bookingDate = new Date(date);

        // Log the booking date after conversion
        console.log("Converted Booking Date:", bookingDate);

        // Check if the date is valid
        if (isNaN(bookingDate.getTime())) {
            console.log("Invalid date format received:", date);
            return res.status(400).json({ error: "Invalid date format" });
        }

        // Fetch the flight schedule based on FlightID and date
        const flightDetails = await FlightSchedule.findOne({
            FlightID: flightID,
            Date: bookingDate
        });

        // Check if flight schedule exists
        let reservedSeatsCount = 0;
        if (flightDetails) {
            // Calculate reserved seats
            reservedSeatsCount = flightDetails.SeatAvailability.filter(seat => seat.status === "reserved").length;
            console.log("Reserved seats found:", reservedSeatsCount);
        } else {
            console.log("Flight not found for the given date, assuming 0 reserved seats.");
        }

        // Calculate available seats
        const availableSeatsCount = totalSeats - reservedSeatsCount;
        console.log(availableSeatsCount);

        // Return the available seat count

        return res.status(200).json({ availableSeatsCount });
    } catch (error) {
        // Log the full error and its stack for debugging purposes
        console.error("Error fetching available seats:", error.message);
        console.error("Error stack:", error.stack);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});





















module.exports = router;



