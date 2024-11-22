const express =require('express');
const router = express.Router();
const User = require('../model/User') ;
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
require('dotenv').config();
// Global variable to track logged-in user
let loggedInUser = null;


//Route to Signup
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
    // Check if there's already a user logged in
    if (loggedInUser) {
      return res.status(403).json({ message: 'Another user is already logged in. Please wait until they log out.' });
  }

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

      // Generate JWT token
      const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
    // Mark the user as logged in
    loggedInUser = user.email;

   
    console.log("Password is valid. Login successful");

    // Successful login
    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});








// Logout route
router.post('/logout', (req, res) => {
  if (!loggedInUser) {
      return res.status(400).json({ message: 'No user is currently logged in.' });
  }

  // Clear the current logged-in user
  loggedInUser = null;
  res.status(200).json({ message: 'Logout successful' });
});




// Protected route example (require JWT)
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
      return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
          return res.status(500).json({ message: 'Failed to authenticate token' });
      }

      req.userId = decoded.id;
      next();
  });
};


//This is the route to get details of loggedInUSer
// router.get('/api/user/:firebaseUid', async (req, res) => {
//   console.log("Received firebaseUid:", req.params.firebaseUid);
//   try {
//        //const user = await User.findOne({ firebaseUid: req.params.firebaseUid }).select('-password');
       
//       const user = await User.findOne({ firebaseUid: "1aHdHfd6dOhUx0bImdrwFe4mgeO2" }).select('-password');
//       console.log("Static query result:", user); // Log the result

//       if (user) {
//           res.json(user);
//       } else {
//           res.status(404).json({ message: 'User not found' });
//       }
//   } catch (error) {
//     console.error('Error fetching user data:', error);
//       res.status(500).json({ message: 'Error fetching user data' });
//   }
// });

// Route to fetch user details
router.get('/userdetails', async (req, res) => {
  try {
    // Assuming a logged-in user's email or ID is available (e.g., through JWT)
    const email = req.query.email; // Use a query parameter to fetch specific user details
    if (!email) {
      return res.status(400).json({ error: 'Email query parameter is required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.contact,
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});





module.exports = router;