const { createRazorpayInstance } = require("../Config/Razorpay_config");
require("dotenv").config();
const path = require("path");
const crypto = require("crypto");
const PDFDocument = require("pdfkit");
const Booking = require("../model/Booking");
const FlightSchedule = require("../model/FlightSchedule");
const razorpayInstance = createRazorpayInstance();

exports.bookTicket = async (req, res) => {
  const { Flight, price, deptCity, arrCity, date, time, seat, passengerNames, contact } = req.body;

  if (!Flight || !price || !deptCity || !arrCity || !date || !time || !seat || !passengerNames || !contact) {
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

    // Update seat availability
    const flightSchedule = await FlightSchedule.findOne({ FlightID: flightDetails.Flight, Date: flightDetails.date });
    if (flightSchedule) {
      seatArray.forEach(seat => {
        flightSchedule.SeatAvailability.push({ seatNumber: seat, status: "reserved" });
      });
      await flightSchedule.save();
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
    .text(`Passenger Name: ${flightDetails.passengerNames}`, 100, 330)
    .text(`Contact Number: ${flightDetails.contact}`, 100, 380)
    .text(`Flight: ${flightDetails.Flight}`, 100, 405)
    .text(`Departing City: ${flightDetails.deptCity}`, 100, 430)
    .text(`Arriving City: ${flightDetails.arrCity}`, 100, 455)
    .text(`Date: ${flightDetails.date}`, 100, 480)
    .text(`Time: ${flightDetails.time}`, 100, 505)
    .text(`Seat: ${flightDetails.seat}`, 100, 530)
    .text(`Thanks for booking with us :) !`, 100, 700, { align: "center" });

    doc.end();
  } catch (error) {
    console.error("Error in verifyPayment:", error);

    // Respond with error if the stream hasn't started
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
};