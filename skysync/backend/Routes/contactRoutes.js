const express = require('express');
const router = express.Router();
const Contact = require('../model/Contact');

// Route to handle POST requests for saving contact data
router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    res.status(201).json({ message: 'Contact information saved successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save contact information.' });
  }
});

module.exports = router;