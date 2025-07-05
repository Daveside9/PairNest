const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// GET notifications for a user
router.get('/:userId', async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notifications', error: err.message });
  }
});

// Mark as read
router.put('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Error updating notification', error: err.message });
  }
});

module.exports = router;
