const mongoose = require('mongoose'); // Add this line
const express = require('express');
const router = express.Router();
const FlightSchedule = require('../model/FlightSchedule'); // Ensure this path is correct

// Route to get available seat availability for a specific flight and date
router.get('/available-seats/:flightID/:date', async (req, res) => {
    const { flightID, date } = req.params;

    // Format the date (ensure it matches the format used in your FlightSchedule model)
    const flightDate = new Date(date);

    try {
        // Find the flight schedule for the given flightID and date
        const flightSchedule = await FlightSchedule.findOne({
            FlightID: flightID,
            Date: flightDate,
        });

        if (!flightSchedule) {
            return res.status(404).json({ error: 'Flight schedule not found for the given date' });
        }

        // Get the available seats
        const availableSeats = flightSchedule.SeatAvailability.filter(seat => seat.status === 'available');

        // Send the available seats and total count
        res.json({
            availableSeats,
            totalAvailableSeats: availableSeats.length
        });
    } catch (error) {
        console.error('Error fetching available seats:', error);
        res.status(500).json({ error: 'Error fetching available seats' });
    }
});


// Route to get reserved seat availability for a specific flight and date
router.get('/reserved-seats/:flightID/:date', async (req, res) => {
    const { flightID, date } = req.params;

    // Format the date (ensure it matches the format used in your FlightSchedule model)
    const flightDate = new Date(date);

    try {
        // Find the flight schedule for the given flightID and date
        const flightSchedule = await FlightSchedule.findOne({
            FlightID: flightID,
            Date: flightDate,
        });

        if (!flightSchedule) {
            return res.status(404).json({ error: 'Flight schedule not found for the given date' });
        }

        // Get the reserved seats
        const reservedSeats = flightSchedule.SeatAvailability.filter(seat => seat.status === 'reserved');

        // Send the reserved seats and total count
        res.json({
            reservedSeats,
            totalReservedSeats: reservedSeats.length
        });
    } catch (error) {
        console.error('Error fetching reserved seats:', error);
        res.status(500).json({ error: 'Error fetching reserved seats' });
    }
});


 // POST route to create a flight schedule
router.post('/flight-schedule', async (req, res) => {
    console.log('Received POST request for /flight-schedule');
    
    try {
        // Log the request body
        console.log('Request Body:', req.body);

        // Check if body is empty or not
        if (!req.body) {
            console.log('No body found in the request');
            return res.status(400).json({ error: 'Request body is missing' });
        }

        // Create a new flight schedule
        const flightSchedule = new FlightSchedule(req.body);

        // Log the data being saved to the database
        console.log('Saving the flight schedule:', flightSchedule);

        // Save to the database
        await flightSchedule.save();

        // Log success
        console.log('Flight schedule saved successfully');
        return res.status(201).json(flightSchedule);
    } catch (error) {
        // Log error details
        console.error('Error while saving flight schedule:', error);
        return res.status(400).json({ error: 'Unable to create flight schedule' });
    }
});


///PART 1 FINAL 


// router.post('/flight-schedule/update-seat-status', async (req, res) => {
//     console.log("Received request to update seat status");
//     const { flightID, date, seats } = req.body;
  
//     // Check for missing fields
//     if (!flightID || !date || !seats || seats.length === 0) {
//       console.error("Missing required fields in request body:", req.body);
//       return res.status(400).json({ error: "Flight ID, date, and seat data are required", received: req.body });
//     }
  
//     try {
//       const flightDate = new Date(date);
  
//       // Log the initial findOne operation
//       console.log(`Finding FlightSchedule for FlightID: ${flightID}, Date: ${flightDate}`);
      
//       const flightSchedule = await FlightSchedule.findOne({ FlightID: flightID, Date: flightDate });
//       if (!flightSchedule) {
//         console.log(`No flight schedule found for FlightID: ${flightID}, Date: ${flightDate}`);
//         return res.status(404).json({ error: "Flight schedule not found" });
//       }
  
//       // Update each seat status in SeatAvailability
//       seats.forEach(({ seatNumber, status }) => {
//         const seatIndex = flightSchedule.SeatAvailability.findIndex(seat => seat.seatNumber === seatNumber);
//         if (seatIndex >= 0) {
//           flightSchedule.SeatAvailability[seatIndex].status = status;
//           console.log(`Seat ${seatNumber} status updated to ${status}`);
//         } else {
//           console.warn(`Seat ${seatNumber} not found in SeatAvailability`);
//         }
//       });
  
//       // Save the updated document
//       await flightSchedule.save();
//       console.log("Flight schedule updated successfully:", flightSchedule);
  
//       res.status(200).json({ message: "Seat statuses updated successfully", flightSchedule });
//     } catch (error) {
//       console.error("Error updating seat statuses:", error);
//       res.status(500).json({ error: "Error updating seat statuses" });
//     }
//   });
  




//   // Endpoint to book seats
// router.post('/book-seat', async (req, res) => {
//     const { flightID, date, selectedSeats, flightPrice, departingTime, arrivingTime, bookingStatus } = req.body;
  
//     try {
//       // Convert date to proper Date format (if it's a string)
//       const bookingDate = new Date(date);
  
//       // Check if flight schedule exists for the given FlightID and Date
//       let flightSchedule = await FlightSchedule.findOne({ flightID, date: bookingDate });
  
//       // If no flight schedule exists, create a new one using the dynamically passed data
//       if (!flightSchedule) {
//         flightSchedule = new FlightSchedule({
//           flightID,
//           date: bookingDate,
//           departingTime: departingTime, // Dynamic departing time
//           arrivingTime: arrivingTime, // Dynamic arriving time
//           seatAvailability: selectedSeats.map(seat => ({ seatNumber: seat, status: 'reserved' })), // Reserved seats from user selection
//           flightPrice, // Dynamic flight price
//           bookingStatus: bookingStatus || 'open', // Default is 'open', can be dynamically passed
//         });
//         await flightSchedule.save();
//         console.log('New flight schedule created:', flightSchedule);
//       } else {
//         // If schedule exists, update the seat availability with newly selected seats
//         // Update the seat availability based on user selection
//         selectedSeats.forEach(seat => {
//           const seatIndex = flightSchedule.seatAvailability.findIndex(s => s.seatNumber === seat);
//           if (seatIndex !== -1) {
//             flightSchedule.seatAvailability[seatIndex].status = 'reserved'; // Mark seat as reserved
//           } else {
//             // If seat doesn't exist, add it as a new reserved seat
//             flightSchedule.seatAvailability.push({ seatNumber: seat, status: 'reserved' });
//           }
//         });
  
//         // Update dynamic fields (price, time, status)
//         flightSchedule.flightPrice = flightPrice; // Update flight price
//         flightSchedule.departingTime = departingTime; // Update departing time
//         flightSchedule.arrivingTime = arrivingTime; // Update arriving time
//         flightSchedule.bookingStatus = bookingStatus || flightSchedule.bookingStatus; // Update booking status if passed
  
//         await flightSchedule.save();
//         console.log('Flight schedule updated:', flightSchedule);
//       }
  
//       // Return the updated flight schedule
//       res.status(200).json({
//         message: 'Seats successfully booked!',
//         flightSchedule
//       });
  
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Something went wrong!' });
//     }
//   });







router.post('/flight-schedule/book-seat', async (req, res) => {
    const { FlightID, date, SeatAvailability, FlightPrice , DepartingTime, ArrivingTime, BookingStatus } = req.body;

    //console.log("Received request body:", req.body); // Log the incoming request
    console.log(FlightID,date,SeatAvailability,FlightPrice,DepartingTime,ArrivingTime, BookingStatus);
   // Check for missing fields
    if (!FlightID || !date || !SeatAvailability || !FlightPrice || !DepartingTime || !ArrivingTime) {
        return res.status(400).json({
          error: "Missing required fields: FlightID, Date1, selectedSeats, FlightPrice, DepartingTime, ArrivingTime",
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
                const flightSchedule = new FlightSchedule({
                    FlightID,
                    Date :BookingDate,
                    SeatAvailability: SeatAvailability.map(seat => ({
                    seatNumber: seat.seatNumber,
                    status: seat.status || 'available'  // Default status is 'available' if not provided
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

            selectedSeats.forEach(seat => {
                const seatIndex = flightSchedule.SeatAvailability.findIndex(s => s.seatNumber === seat);
                if (seatIndex !== -1) {
                    // If the seat exists, mark it as reserved
                    flightSchedule.SeatAvailability[seatIndex].status = 'reserved';
                    console.log(`Seat ${seat} marked as reserved`);
                } else {
                    // If seat doesn't exist, add it as a new reserved seat
                    flightSchedule.SeatAvailability.push({ seatNumber: seat, status: 'reserved' });
                    console.log(`New seat ${seat} added and marked as reserved`);
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

  module.exports = router;

