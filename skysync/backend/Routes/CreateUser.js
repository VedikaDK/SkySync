const express =require('express');
const router = express.Router();
const User = require('../model/User') ;
const bcrypt = require('bcrypt');



router.post('/signup',async(req,res)=>{
    console.log("Received data:", req.body);
    try{
        const { firebaseUid,firstname, lastname, email, password, contact,gender } = req.body;
        // Validate the incoming data (optional but recommended)
        if (!firstname || !lastname || !email || !password || !contact || !gender) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if the email or contact number already exists
        const existingUserByEmail = await User.findOne({ email });
        if (existingUserByEmail){
             return res.status(400).json({ message: 'Email already exists' });
        }

        const existingUserByContact = await User.findOne({ contact });
        if (existingUserByContact) {
            return res.status(400).json({ message: 'Contact number already exists' });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user
        const newUser = new User({
          firebaseUid,
            firstname,
            lastname,
            email,
            password : hashedPassword,
            contact,
            gender
        });

        console.log("Saving new user:", newUser);
        const savedUser = await newUser.save();
        console.log("User saved successfully:", savedUser);
        res.status(201).json({ message: 'User created successfully' });
    }
    catch (error){
        console.error('Error creating user:', error);
        res.status(500).json({message: 'Internal server error' });

    }
});

// Login route for Firebase email/password or Google sign-in
router.post('/login', async (req, res) => {
  console.log("Login request received:", req.body);
  try {
    const { email, password } = req.body;
    
    // Validate the incoming data
    if (!email || !password) {
      console.log("Email and password not provided");
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Log: Searching for user in database
    console.log(`Checking database for user with email: ${email}`);

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found in the database");
      return res.status(404).json({ message: 'User not found' });
    }

    console.log("User found in the database:", user);

    // Check if the password is correct
    console.log("Checking if the password is valid");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`Invalid password for user ${email}. Entered password: ${password}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log("Password is valid. Login successful");

    // Successful login
    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
module.exports = router;