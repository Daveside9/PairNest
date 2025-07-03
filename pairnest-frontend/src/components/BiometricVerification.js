// components/BiometricVerification.js
import React, { useEffect } from 'react';
import { startAuthentication } from '@simplewebauthn/browser';

function BiometricVerification({ onVerified }) {
  const handleBiometric = async () => {
    try {
      const resp = await fetch('http://localhost:5000/generate-authentication-options');
      const options = await resp.json();

      const authResponse = await startAuthentication(options);

      const verificationResp = await fetch('http://localhost:5000/verify-authentication', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authResponse),
      });

      const { verified } = await verificationResp.json();
      if (verified) {
        onVerified(); // Call parent handler
      } else {
        alert('Biometric verification failed.');
      }
    } catch (err) {
      console.error('Biometric auth error:', err);
      alert('Biometric not supported or failed.');
    }
  };

  useEffect(() => {
    handleBiometric();
  }, []);

  return <p>Checking biometric authentication...</p>;
}

export default BiometricVerification;
