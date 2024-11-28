const express = require('express')
const app = express()
const dotenv = require("dotenv");
// const session = require('express-session');
// const bodyParser = require('body-parser');
// const bcrypt = require('bcrypt');
const mongoose = require("mongoose");
const cors = require('cors');

dotenv.config();
//Middelware
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from your frontend
}))
app.use(express.json()); // Add this line to parse JSON requests

const UserRoute = require("./Routes/CreateUser");
const FlightRoute = require("./Routes/FlightRoute"); 
const FlightSchedule = require("./Routes/FlightScheduleRoutes");
const Feedback = require("./Routes/FeedbackRoutes");
const Payment = require("./Routes/Payments_routes");
const Contact = require("./Routes/contactRoutes");

mongoose.connect(process.env.URI).
then(()=>{
    console.log("Connected");
    app.listen(process.env.PORT || 8000 , (err)=>{
        if(err) console.log("Error " ,err)
        console.log("Running Successfully at ", process.env.PORT )
    });
}
).catch((error)=>{
  console.log("Error" , error);
})

app.use(UserRoute);
app.use('/api', FlightRoute);
app.use('/api',FlightSchedule);
app.use('/api/feedback',Feedback);
app.use('/api',Payment);
app.use("/api",Contact);







