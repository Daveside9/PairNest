const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Multer config
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
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

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
 */
router.get('/profile/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Profile fetch failed' });
  }
});

/**
 * @route   POST /api/auth/google
 */
router.post('/google', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        password: Math.random().toString(36).slice(-8) // triggers hashing
      });
    }

    res.status(200).json({
      message: 'Google login successful',
      user: {
        email: user.email,
        isAdmin: user.isAdmin,
      }
    });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(500).json({ message: 'Google authentication failed' });
  }
});

/**
 * @route   POST /api/auth/forgot-password
 */
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'No user found' });

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '10m' });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      }
    });

    const mailOptions = {
      from: 'PairNest <no-reply@pairnest.com>',
      to: email,
      subject: 'Reset your PairNest password',
      html: `<p>Click <a href="${process.env.CLIENT_URL}/reset-password/${token}">here</a> to reset your password. This link expires in 10 minutes.</p>`
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Password reset email sent' });

  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Error sending email' });
  }
});

/**
 * @route   POST /api/auth/reset-password/:token
 */
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = password;
    await user.save();

    res.json({ message: 'Password reset successful' });

  } catch (err) {
    console.error('Reset password error:', err);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});

module.exports = router;
