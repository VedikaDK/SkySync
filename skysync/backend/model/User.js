const mongoose = require('mongoose')

const {Schema} = mongoose;

const HistorySchema = new Schema({
    flightID: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    from: {
        type: String,
        required: true,
    },
}, { _id: false });

const UserSchema = new Schema({
    firebaseUid: {
        type: String,
        required: true,
        unique: true,
    },
    firstname:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required: true,
        unique:true,
        index:true
    },
    password:{
        type: String,
        required:true
    },
    contact:{
        type: Number,
        required: true,
        unique: true ,
        index:true
    },
    gender:{
        type: String,
        required:true
    },
    history: {
        type: [HistorySchema], // Array of HistorySchema
        default: [], // Default to an empty array if no history exists
    },

},{timestamps:true});

module.exports = mongoose.model('user',UserSchema)