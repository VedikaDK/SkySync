const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true },  // e.g., "1A"
  status: { 
    type: String, 
    enum: ['available', 'reserved', 'selected'], 
    default: 'available' 
  },
  expiresAt: { type: Date, default: null } // Expiration time for "selected" status
});

const flightScheduleSchema = new mongoose.Schema({
  FlightID: { type: String, required: true, ref: 'Flight' },  // Reference to the Flight collection
  Date: { type: Date, required: true },  // Specific date for the flight
  DepartingTime: { type: String, required: true },  // Departure time as string (e.g., "03:55")
  ArrivingTime: { type: String, required: true },  // Arrival time as string (e.g., "05:50")
  SeatAvailability: [seatSchema],  // Array of seats with status
  FlightPrice: { type: Number, required: true },  // Price for the flight on this specific date
  BookingStatus: { 
    type: String, 
    enum: ['open', 'closed', 'fully booked'],
    default: 'open' 
  }
}, { timestamps: true });  // Automatically adds CreatedAt and UpdatedAt fields

const FlightSchedule = mongoose.model('FlightSchedule', flightScheduleSchema);

module.exports = FlightSchedule;