const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../models/User');

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

/**
 * @route   POST /api/auth/signup
 * @desc    Register new user
 */
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = await User.create({ email, password });
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login existing user
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // ✅ Send only relevant user info
    res.status(200).json({
      message: 'Login successful',
      user: {
        email: user.email,
        isAdmin: user.isAdmin,
      }
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @route   POST /api/auth/upload-profile-pic/:id
 * @desc    Upload or update profile picture
 */
router.post('/upload-profile-pic/:id', upload.single('profilePic'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, {
      profilePic: `http://localhost:5000/uploads/${req.file.filename}`
    }, { new: true });

    res.json({ message: 'Profile picture updated', profilePic: user.profilePic });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});

/**
 * @route   GET /api/auth/profile/:email
 * @desc    Get user profile by email
 */
router.get('/profile/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Profile fetch failed' });
  }
});

module.exports = router;
