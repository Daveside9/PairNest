const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Booking = require('../models/Booking'); // Assuming you track bookings
const isAdmin = require('../middleware/isAdmin');

router.get('/stats', isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const matches = await Booking.countDocuments({ status: 'matched' });
    const feedbacks = await Booking.countDocuments({ feedback: { $exists: true } });
    res.json({ totalUsers, matches, feedbacks });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

module.exports = router;
