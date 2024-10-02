const express =require('express');
const router = express.Router();
const User = require('../model/User') ;
const bcrypt = require('bcrypt');



router.post('/signup',async(req,res)=>{
    console.log("Received data:", req.body);
    try{
        const { firstname, lastname, email, password, contact } = req.body;
        // Validate the incoming data (optional but recommended)
        if (!firstname || !lastname || !email || !password || !contact) {
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
            firstname,
            lastname,
            email,
            password : hashedPassword,
            contact
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

router.get('/signup', (req, res) => {
    res.send('Signup page'); // Or serve an HTML file
})
module.exports = router;