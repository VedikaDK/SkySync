const mongoose = require('mongoose'); // Add this line
const express = require('express');
const router = express.Router();
const FlightSchedule = require('../model/FlightSchedule'); // Ensure this path is correct







//For Selected seats to be in database  MAIN CODE

// router.post('/flight-schedule/book-seat', async (req, res) => {
//     const { FlightID, date, SeatAvailability, FlightPrice, DepartingTime, ArrivingTime } = req.body;

//     console.log(FlightID, date, SeatAvailability, FlightPrice, DepartingTime, ArrivingTime);

//     if (!FlightID || !date || !SeatAvailability || !FlightPrice || !DepartingTime || !ArrivingTime) {
//         return res.status(400).json({
//             error: "Missing required fields: FlightID, Date, SeatAvailability, FlightPrice, DepartingTime, ArrivingTime",
//             received: req.body
//         });
//     }

//     try {
//         const BookingDate = new Date(date);

//         // Check if flight schedule exists for the given FlightID and Date
//         let flightSchedule = await FlightSchedule.findOne({ FlightID: FlightID, Date: BookingDate });

//         if (!flightSchedule) {
//             // Create a new flight schedule
//             flightSchedule = new FlightSchedule({
//                 FlightID,
//                 Date: BookingDate,
//                 SeatAvailability: SeatAvailability.map(seat => ({
//                     seatNumber: seat.seatNumber,
//                     status: 'selected'  // Mark as 'selected' for initial selection
//                 })),
//                 FlightPrice,
//                 DepartingTime,
//                 ArrivingTime,
//                 BookingStatus: 'open'
//             });

//             await flightSchedule.save();
//             console.log('New flight schedule created:', flightSchedule);
//         } else {
//             // Update existing flight schedule
//             SeatAvailability.forEach(seat => {
//                 const seatIndex = flightSchedule.SeatAvailability.findIndex(s => s.seatNumber === seat.seatNumber);

//                 if (seatIndex !== -1) {
//                     if (flightSchedule.SeatAvailability[seatIndex].status === 'available') {
//                         flightSchedule.SeatAvailability[seatIndex].status = 'selected';
//                         console.log(Seat ${seat.seatNumber} marked as selected);
//                     } else {
//                         console.log(Seat ${seat.seatNumber} is not available);
//                     }
//                 } else {
//                     flightSchedule.SeatAvailability.push({ seatNumber: seat.seatNumber, status: 'selected' });
//                     console.log(New seat ${seat.seatNumber} added and marked as selected);
//                 }
//             });

//             await flightSchedule.save();
//             console.log('Flight schedule updated with selected seats:', flightSchedule);
//         }

//         res.status(200).json({
//             message: 'Seats successfully selected!',
//             flightSchedule
//         });

//     } catch (error) {
//         console.error("Error processing seat selection:", error);
//         res.status(500).json({ message: 'Something went wrong!' });
//     }
// });



//CODE NO 2


router.post('/flight-schedule/book-seat', async (req, res) => {
    const { FlightID, date, SeatAvailability, FlightPrice, DepartingTime, ArrivingTime } = req.body;

    console.log(FlightID, date, SeatAvailability, FlightPrice, DepartingTime, ArrivingTime);

    // Validate required fields
    if (!FlightID || !date || !SeatAvailability || !FlightPrice || !DepartingTime || !ArrivingTime) {
        return res.status(400).json({
            error: "Missing required fields: FlightID, Date, SeatAvailability, FlightPrice, DepartingTime, ArrivingTime",
            received: req.body
        });
    }

    try {
        const BookingDate = new Date(date);

        // Atomic operation: Find flight schedule or create it if not exists
        const flightSchedule = await FlightSchedule.findOneAndUpdate(
            { FlightID, Date: BookingDate },
            { 
                $setOnInsert:{
                    FlightID, 
                    Date: BookingDate, 
                    SeatAvailability: [],
                    FlightPrice,
                    DepartingTime,
                    ArrivingTime,
                    BookingStatus: 'open'
                } 
            },
            { new: true, upsert: true } // Ensure it returns the updated document and performs upsert if no match
        );

        const seatUpdates = [];
        SeatAvailability.forEach(seat => {
            const seatIndex = flightSchedule.SeatAvailability.findIndex(s => s.seatNumber === seat.seatNumber);

            if (seatIndex !== -1) {
                const existingSeat = flightSchedule.SeatAvailability[seatIndex];
                if (existingSeat.status === 'available') {
                    // Mark seat as selected and set expiration time (5 minutes)
                    flightSchedule.SeatAvailability[seatIndex].status = 'selected';
                    flightSchedule.SeatAvailability[seatIndex].expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 5 minutes expiration
                    seatUpdates.push(seat.seatNumber);
                }
            } else {
                // Add new seat as selected
                flightSchedule.SeatAvailability.push({
                    seatNumber: seat.seatNumber,
                    status: 'selected', // Set as selected for initial state
                    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // Set expiration time for the seat
                });
                seatUpdates.push(seat.seatNumber);
            }
        });

        // Save the updated flight schedule with seat selections
        await flightSchedule.save();

        // Respond with success and details of updated seats
        res.status(200).json({
            message: 'Seats successfully selected!',
            updatedSeats: seatUpdates,
            flightSchedule,
        });

    } catch (error) {
        console.error("Error processing seat selection:", error);
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



//ROUTE TO get the Selected seat from database

router.post("/selected-seats", async (req, res) => {
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

        // Fetch the SelectedSeats from the flight details
        const SelectedSeats = flightDetails.SeatAvailability.filter(seat => seat.status === "selected");

        // Log the SelectedSeats found
        console.log("Selected Seats Found:", SelectedSeats);
        
        // Return the SelectedSeats or an empty array if none found
        return res.status(200).json({ 
            SelectedSeats: SelectedSeats,
         });

          
    } catch (error) {
        // Log the full error and its stack for debugging purposes
        console.error("Error fetching Selected  seats:", error.message);
        console.error("Error stack:", error.stack);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});












































































//Route to count no of reserved seats
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