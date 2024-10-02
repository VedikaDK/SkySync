
const mongoose = require('mongoose'); // Add this line
const express = require('express');
const router = express.Router();
const Flight = require('../model/FlightDatabase'); // Ensure this path is correct

// POST route to create a new flight
router.post('/flights', async (req, res) => {
  try {
    // Create a new flight instance using the request body
    const flight = new Flight(req.body);
    
    // Save the flight to the database
    await flight.save();
    
    // Respond with the created flight data
    res.status(201).json(flight);
  } catch (error) {
    // Handle errors and respond with a 400 status code
    res.status(400).json({ error: error.message });
  }
});

router.post('/search-flights', async (req, res) => {
    const { from, to } = req.body;
  
    console.log("Received Search Parameters:", { from, to });
  
    try {
  
      mongoose.connection.on('connected', () => {
        console.log('Mongoose connected to DB');
      });
      const flightsCount = await mongoose.connection.collection('flights').countDocuments();
      console.log("Total flights in database:", flightsCount);
  
      console.log("Querying flights with:", { DepartingCity: from, ArrivingCity: to });
      // Find flights matching the criteria
      const flights = await mongoose.connection.collection('flights').find({
        DepartingCity: from,
        ArrivingCity: to
      }).toArray();
  
      console.log("Query Result:", flights); // Log query result
  
      if (flights.length === 0) {
        console.log("No flights found for the given criteria.");
        return res.status(404).json({ message: "No flights found." });
      }
  
      res.status(200).json(flights);
    } catch (error) {
      console.error('Error fetching flights:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
module.exports = router;