const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');
const isAdmin = require('../middleware/isAdmin');

// Admin stats
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

    // Save notification
    const notif = await Notification.create({
      user: user._id,
      message: 'You have been banned by the admin.'
    });

    // Emit event to frontend via WebSocket
    const io = req.app.get('io');
    io.emit('notification', notif);
    io.emit('userUpdated', user); // update admin dashboard live

    res.json({ message: 'User banned', user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to ban user', error: err.message });
  }
});

// Unban user
router.put('/unban/:id', isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { banned: false }, { new: true });

    const notif = await Notification.create({
      user: user._id,
      message: 'You have been unbanned. You can now access your account.'
    });

    const io = req.app.get('io');
    io.emit('notification', notif);
    io.emit('userUpdated', user);

    res.json({ message: 'User unbanned', user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to unban user', error: err.message });
  }
});

// Get all users
router.get('/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
});

// Edit user
router.put('/edit/:id', isAdmin, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

    const io = req.app.get('io');
    io.emit('userUpdated', updatedUser);

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user', error: err.message });
  }
});

// Admin manually sends notification
router.post('/notify/:id', isAdmin, async (req, res) => {
  try {
    const { message } = req.body;

    const notif = await Notification.create({
      user: req.params.id,
      message
    });

    const io = req.app.get('io');
    io.emit('notification', notif);

    res.json({ message: 'Notification sent and saved.', notif });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send notification', error: err.message });
  }
});

// Admin views booking logs
router.get('/bookings', isAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user1', 'email')
      .populate('user2', 'email')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bookings', error: err.message });
  }
});

module.exports = router;
