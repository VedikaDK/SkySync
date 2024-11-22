// routes/feedbackRoutes.js
const express = require('express');
const Feedback = require('../model/Feedback'); // Import the Feedback model

const router = express.Router();

// Route to handle feedback submission
router.post('/', async (req, res) => {
    try {
        const feedbackData = req.body;
        const feedback = new Feedback(feedbackData);
        await feedback.save();
        res.status(201).json({ message: 'Feedback saved successfully' });
    } catch (err) {
        console.error('Error saving feedback:', err);
        res.status(500).json({ error: 'An error occurred while saving feedback' });
    }
});

// Route to get all feedbacks
router.get('/', async (req, res) => {
    try {
        const feedbacks = await Feedback.find(); // Retrieve all feedbacks
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching feedbacks' });
    }
});

// Route to delete feedback by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters
    try {
        const deletedFeedback = await Feedback.findByIdAndDelete(id);
        if (!deletedFeedback) {
            return res.status(404).json({ error: 'Feedback not found' });
        }
        res.status(200).json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting feedback' });
    }
});

module.exports = router; // Export the router
