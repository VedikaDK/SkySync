const mongoose = require("mongoose");

// Schema for revenue collection
const RevenueSchema = new mongoose.Schema({
  flightId: { 
    type: String, 
    required: true 
  },
  dateOfJourney: { 
    type: Date, 
    required: true 
  },
  totalPrice: { 
    type: Number, 
    required: true, 
  },
  commissionRate: { 
    type: Number, 
    required: true, 
    default: 0.05, // Default to 5% commission
  },
  commissionAmount: { 
    type: Number, 
    required: true,
    set: (value) => Math.round(value * 100) / 100,
  },
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Model export
module.exports = mongoose.model("Revenue", RevenueSchema);
