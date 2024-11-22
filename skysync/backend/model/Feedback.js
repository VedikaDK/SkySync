const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    contactName: { type: String, required: true },
    phone: { type: String, required: true },
    countryCode: { type: String, required: true },
    email: { type: String, required: true },
    pnr: { type: String },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    voiceOfCustomer: { type: String, required: true },
    touchPoint: { 
        type: String, 
        required: function() {
            return this.voiceOfCustomer !== 'appreciation' && this.voiceOfCustomer !== 'suggestion';
        } 
    },
    reason: { 
        type: String, 
        required: function() {
            return this.voiceOfCustomer !== 'appreciation' && this.voiceOfCustomer !== 'suggestion';
        } 
    },
    description: { type: String, required: true },
    rating: { type: Number, required: true }
});

const Feedback = mongoose.model('Feedback', FeedbackSchema);

module.exports = Feedback;
