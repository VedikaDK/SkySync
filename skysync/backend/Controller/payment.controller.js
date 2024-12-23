const { createRazorpayInstance } = require("../Config/Razorpay_config");
require("dotenv").config();
const path = require("path");
const crypto = require("crypto");
const PDFDocument = require("pdfkit");
const Booking = require("../model/Booking");
const FlightSchedule = require("../model/FlightSchedule");
const razorpayInstance = createRazorpayInstance();
const User=require("../model/User");
const Revenue = require("../model/Revenue");

exports.bookTicket = async (req, res) => {
  const { Flight, price, deptCity, arrCity, date, time, seat, passengerNames, contact, email } = req.body;
  if (!Flight || !price || !deptCity || !arrCity || !date || !time || !seat || !passengerNames || !contact || !email) {
    return res.status(400).json({
      success: false,
      message: "All flight details, passenger name, and contact are required",
    });
  }

  const options = {
    amount: price * 100, // Amount in paisa
    currency: "INR",
    receipt: `receipt_${Flight}_${Date.now()}`,
  };

  razorpayInstance.orders.create(options, (err, order) => {
    if (err) {
      console.error("Error creating Razorpay order:", err);
      return res.status(500).json({ success: false, message: "Something went wrong" });
    }

    order.flightDetails = { Flight, deptCity, arrCity, date, time, seat, passengerNames, contact };
    res.status(200).json(order);
  });
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, payment_id, signature, flightDetails } = req.body;
    const secret = process.env.RAZORPAY_KEY_SECRET;
    
    console.log("Passanger name ",flightDetails.passengerNames);
    if (!razorpay_order_id || !payment_id || !signature || !flightDetails) {
      return res.status(400).json({ success: false, message: "Invalid request data" });
    }

    // Validate Razorpay signature
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(razorpay_order_id + "|" + payment_id);
    const gensignature = hmac.digest("hex");

    if (gensignature !== signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    // Ensure seat and passengerNames are arrays
    const seatArray = Array.isArray(flightDetails.seat) ? flightDetails.seat : [flightDetails.seat];
    const passengerNamesArray = Array.isArray(flightDetails.passengerNames)
      ? flightDetails.passengerNames
      : [flightDetails.passengerNames];

    // Save booking details in database
    const existingBooking = await Booking.findOne({ Flight: flightDetails.Flight, date: flightDetails.date });
    if (existingBooking) {
      existingBooking.bookings.push({
        seat: seatArray,
        passengerNames: passengerNamesArray,
        contact: flightDetails.contact,
      });
      await existingBooking.save();
    } else {
      const newBooking = new Booking({
        Flight: flightDetails.Flight,
        date: flightDetails.date,
        deptCity: flightDetails.deptCity,
        arrCity: flightDetails.arrCity,
        bookings: [{
          seat: seatArray,
          passengerNames: passengerNamesArray,
          contact: flightDetails.contact,
        }],
      });
      await newBooking.save();
    }

    try {
      const newrevenue = new Revenue({
        flightId: flightDetails.Flight,
        dateOfJourney: flightDetails.date,
        totalPrice: flightDetails.price,
        commissionRate: 0.05,
        commissionAmount: flightDetails.price * 0.05,
      });
      await newrevenue.save();
      console.log("Revenue record saved successfully:", newrevenue);
    } catch (error) {
      console.error("Error saving revenue record:", error);
    }

    // Update seat availability
    const flightSchedule = await FlightSchedule.findOne({ FlightID: flightDetails.Flight, Date: flightDetails.date });
    if (flightSchedule) {
      seatArray.forEach(seat => {
        flightSchedule.SeatAvailability.push({ seatNumber: seat, status: "reserved" });
      });
      await flightSchedule.save();
    }
    const userhistory = await User.findOne({ email: flightDetails.email });
    if (userhistory) {
      userhistory.history.push({
          flightID: flightDetails.Flight,
          date: flightDetails.date,
          to: flightDetails.arrCity,
          from: flightDetails.deptCity,
      });
    await userhistory.save();
    }
 
    // Generate ticket PDF
    const doc = new PDFDocument();
    const pdfFileName = `ticket_${razorpay_order_id}.pdf`;

    // Set headers for PDF response
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${pdfFileName}"`);

    // Stream the PDF to the response
    doc.pipe(res);

    // Path to ticket background image (ensure this file exists)
    const backgroundPath = path.join(__dirname, "ticket.png");

    doc.image(backgroundPath, 0, 0, { width: 600, height: 240 })
    .fontSize(14)
    .text(`${flightDetails.Flight}`, 75, 92)
    .text(`${flightDetails.deptCity}`, 120, 121)
    .text(`${flightDetails.arrCity}`, 110, 165)
    .text(`${flightDetails.date}`, 120, 209)
    .text(`${flightDetails.time}`, 195, 92)
    .fontSize(16)
    .text(`${flightDetails.seat}`, 344, 92)
    .text(`${flightDetails.seat}`, 430, 92)
    .fontSize(18)
    .text("Flight Details", 100, 280, { align: "center" })
    .fontSize(16)
    // .text(`Passenger Name: ${flightDetails.passengerNames}`, 100, 330)
    
                // Add passenger details dynamically
    let yPosition = 330; // Starting y-coordinate for passenger details
    const lineSpacing = 40;
    flightDetails.passengerNames.forEach((passenger, index) => {
      doc.text(
        `Passenger ${index + 1}: Name - ${passenger.name}, Age - ${passenger.age}, Gender - ${passenger.gender}, Seat - ${passenger.seatNumber}`,
        100,
        yPosition
      );
      yPosition += lineSpacing; // Move down for the next passenger
      
    })























    // Add remaining details
doc.text(`Contact Number: ${flightDetails.contact}`, 100, yPosition + 10)
.text(`Flight: ${flightDetails.Flight}`, 100, yPosition + 35)
.text(`Departing City: ${flightDetails.deptCity}`, 100, yPosition + 60)
.text(`Arriving City: ${flightDetails.arrCity}`, 100, yPosition + 85)
.text(`Date: ${flightDetails.date}`, 100, yPosition + 110)
.text(`Time: ${flightDetails.time}`, 100, yPosition + 135)
.text(`Seat: ${flightDetails.seat}`, 100, yPosition + 160)
.text(`Thanks for booking with us :) !`, 100, yPosition + 200, { align: "center" });

doc.end();
  } catch (error) {
    console.error("Error in verifyPayment:", error);

    // Respond with error if the stream hasn't started
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
};