const mongoose = require('mongoose')


const {Schema} = mongoose;
const UserSchema = new Schema({
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
    }

},{timestamps:true});

module.exports = mongoose.model('user',UserSchema)