const Profile = require('./models/Profile');

// Create or update profile
exports.saveProfile = async (req, res) => {
  const { userId } = req.params;
  try {
    const existing = await Profile.findOne({ userId });
    if (existing) {
      const updated = await Profile.findOneAndUpdate({ userId }, req.body, { new: true });
      return res.json(updated);
    } else {
      const profile = await Profile.create({ userId, ...req.body });
      return res.status(201).json(profile);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  const { userId } = req.params;
  try {
    const profile = await Profile.findOne({ userId });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
