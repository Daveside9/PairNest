const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// For Google Sign-In
const { OAuth2Client } = require('google-auth-library');
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

/** ---------- EXISTING ROUTES STAY UNCHANGED ---------- **/

// ... your /signup, /login, /upload-profile-pic/:id, /profile/:email routes ...

/**
 * @route   POST /api/auth/google
 * @desc    Login or register user using Google token
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
      user = await User.create({ email, password: Math.random().toString(36) }); // random password
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
 * @desc    Send reset email
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
 * @desc    Reset user password
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
