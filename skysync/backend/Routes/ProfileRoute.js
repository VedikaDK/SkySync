const express = require('express');
const router = express.Router();
const User = require('../model/User');

// API to fetch user details by email
router.get('/profile', async (req, res) => {
  const { email } = req.query; // Get email from query parameters

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email }); // Find user by email
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json(user); // Return user data
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
