const express = require('express');
const router = express.Router();
const Interest = require('../models/Interest');

// Get preferences by email
router.get('/:email', async (req, res) => {
  try {
    const interest = await Interest.findOne({ email: req.params.email });
    res.json(interest || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch interest preferences.' });
  }
});

// Create or update preferences
router.post('/', async (req, res) => {
  const { email, ...data } = req.body;
  try {
    const interest = await Interest.findOneAndUpdate(
      { email },
      { email, ...data },
      { upsert: true, new: true }
    );
    res.json({ message: 'Preferences saved successfully.', interest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to save preferences.', error: err.message });
  }
});

module.exports = router;
