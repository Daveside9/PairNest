const express = require('express');
const {
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} = require('@simplewebauthn/server');

const router = express.Router();

let mockDatabase = {}; // Replace with real DB in production

router.get('/generate-authentication-options', (req, res) => {
  const options = generateAuthenticationOptions({
    allowCredentials: mockDatabase.allowCredentials || [],
    userVerification: 'preferred',
  });

  req.session.authOptions = options;
  res.json(options);
});

router.post('/verify-authentication', async (req, res) => {
  try {
    const verification = await verifyAuthenticationResponse({
      response: req.body,
      expectedChallenge: req.session.authOptions.challenge,
      expectedOrigin: 'http://localhost:3000',
      expectedRPID: 'localhost',
      authenticator: mockDatabase.authenticator,
    });

    res.json({ verified: verification.verified });
  } catch (err) {
    res.status(500).json({ verified: false, error: err.message });
  }
});

module.exports = router;
