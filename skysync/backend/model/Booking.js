const mongoose = require("mongoose");

// Subschema for individual seat bookings
const SeatBookingSchema = new mongoose.Schema({
  seat: { 
    type: [String], // Allow an array of seats for flexibility 
    required: true, 
    validate: [arrayLimit, "At least one seat must be specified"] 
  },
  passengerNames: { 
    type: [{
      seatNumber: { type: String, required: true },
      name: { type: String, required: true },
      age: { type: Number, required: true },
      gender: { type: String, required: true }
    }], 
    required: true, 
    validate: [arrayLimit, "At least one passenger must be specified"] 
  },
  contact: { 
    type: String, 
    required: true, 
    validate: {
      validator: function (v) {
        // Basic phone number validation (10 digits for example)
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!,`
    },
  },
});

// Ensure there is at least one seat and one passenger name
function arrayLimit(val) {
  return val.length > 0;
}

// Main schema for booking details
const BookingSchema = new mongoose.Schema({
  Flight: { type: String, required: true },
  date: { type: String, required: true },
  deptCity: { type: String, required: true },
  arrCity: { type: String, required: true },
  bookings: {
    type: [SeatBookingSchema], // Embed the SeatBooking schema
    default: [],
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Model export
module.exports = mongoose.model("Booking", BookingSchema);