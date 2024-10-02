const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  FlightID: { type: String, required: true, unique: true }, // Unique identifier for each flight
  FlightName: { type: String, required: true },            // Airline name
  FlightCode: { type: String, required: true },            // Flight code (e.g., AI 621)
  DepartingCity: { type: String, required: true },         // City of departure
  ArrivingCity: { type: String, required: true },          // City of arrival
  DepartingTime: { type: String, required: true },         // Departure time as string (e.g., "03:55")
  ArrivingTime: { type: String, required: true },          // Arrival time as string (e.g., "05:50")
  Duration: { type: String, required: true },              // Duration of the flight
  Price: { type: Number, required: true },                 // Price of the ticket
 
});

const Flight = mongoose.model('Flight', flightSchema);
module.exports = Flight; 