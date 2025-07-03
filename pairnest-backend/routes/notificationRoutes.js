const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// Get notifications for user
router.get('/:userId', async (req, res) => {
  try {
    const notes = await Notification.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new notification
router.post('/', async (req, res) => {
  try {
    const { userId, message } = req.body;
    const note = await Notification.create({ userId, message });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark as read
router.patch('/:id/read', async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
