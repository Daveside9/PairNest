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

// Ban a user
router.put('/ban/:id', isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { banned: true }, { new: true });
    res.json({ message: 'User banned', user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to ban user', error: err.message });
  }
});

// Unban a user
router.put('/unban/:id', isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { banned: false }, { new: true });
    res.json({ message: 'User unbanned', user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to unban user', error: err.message });
  }
});

// ✅ Get all users (protected)
router.get('/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
});

module.exports = router;
