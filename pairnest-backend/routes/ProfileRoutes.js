const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');

// Get user profile by email
router.get('/:email', async (req, res) => {
  try {
    const profile = await Profile.findOne({ email: req.params.email });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Save or update user profile
router.post('/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const data = req.body;

    let profile = await Profile.findOne({ email });

    if (profile) {
      // update
      profile = await Profile.findOneAndUpdate({ email }, data, { new: true });
    } else {
      // create
      profile = await Profile.create({ ...data, email });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Failed to save profile', error: err.message });
  }
});

module.exports = router;
