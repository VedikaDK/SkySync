const { createRazorpayInstance } = require("../Config/Razorpay_config");
require("dotenv").config();
const path = require('path');
const crypto = require("crypto");
const PDFDocument = require("pdfkit");

const razorpayInstance = createRazorpayInstance();

exports.bookTicket = async (req, res) => {
    const { Flight, price } = req.body;

    if (!Flight || !price) {
        return res.status(400).json({
            success: false,
            message: "Flight and price are required",
        });
    }

    // Create Razorpay order
    const options = {
        amount: price * 100, // Convert to smallest currency unit
        currency: "INR",
        receipt: `receipt_order_1`,
    };

    razorpayInstance.orders.create(options, (err, order) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Something went wrong",
            });
        }
        return res.status(200).json(order);
    });
};

exports.verifyPayment = async (req, res) => {
    const { razorpay_order_id, payment_id, signature } = req.body;
    const secret = process.env.RAZORPAY_KEY_SECRET;
    console.log("In verification Route");
    console.log(req);

    // Create HMAC object
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(razorpay_order_id + "|" + payment_id);
    const gensignature = hmac.digest("hex");

    if (gensignature === signature) {
        // Payment verified; generate the PDF with hardcoded details
        const doc = new PDFDocument();

        // Set headers for PDF download
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="ticket_${razorpay_order_id}.pdf"`
        );

        // Stream the PDF to the response
        doc.pipe(res);
        const backgroundPath = path.join(__dirname, 'ticket.png'); // Replace with your image path
        doc.image(backgroundPath, 0, 0, { width: 600, height: 240 }); // A4 dimensions in points
        // Add hardcoded ticket details to the PDF
        doc
            .fontSize(14)
            .text(`SG720`,75,92)
            .text(`New Delhi`,120,121)
            .text(`Mumbai`,110,165)
            .text(`23 November 2024`,120,209)
            .text(`16:00`,195,92)
            .fontSize(16)
            .text(`10A`,344,92)
            .text(`10A`,430,92)
            .fontSize(18)
            .text("Flight Details", 100, 280, { align: "center" })
            .fontSize(16)
            .text(`Passenger Name: Mrunmai Mahendra Kandharkar`,100,330)
            .text(`Contact Number: 7276851715`,100,380)
            .text(`Flight: SG720`,100,405)
            .text(`Departing City: New Delhi`,100,430)
            .text(`Arriving City: Mumbai`,100,455)
            .text(`Date: 23 November 2024`,100,480)
            .text(`Time: 16:00`,100,505)
            .text(`Seat: 10A`,100,530)
            .text(`Thanks for booking with us :) !`,100,700,{ align: "center" })

            
            

        // Finalize the PDF
        doc.end();
    } else {
        return res.status(400).json({
            success: false,
            message: "Payment not verified",
        });
    }
};
