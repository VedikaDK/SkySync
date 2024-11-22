const express = require('express');
const { bookTicket, verifyPayment } = require('../Controller/payment.controller');
const router = express.Router();

router.post('/createTicket', bookTicket);  // Corrected function name
router.post('/verifyPayment', verifyPayment);

module.exports = router;
