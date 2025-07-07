const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const User = require('../models/User');

// GET /api/notifications/:email → fetch notifications for a user
router.get('/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const notifications = await Notification.find({ user: user._id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
