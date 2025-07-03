import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';

const FacialVerification = ({ onVerified }) => {
  const videoRef = useRef();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models'),
    ]).then(startVideo);
  }, []);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error('Camera error:', err));
  };

  const handlePlay = () => {
    setInterval(async () => {
      const detections = await faceapi.detectAllFaces(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      );
      if (detections.length > 0) {
        setLoading(false);
        onVerified(true); // success callback
      }
    }, 2000);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h3>Facial Verification</h3>
      <video
        ref={videoRef}
        autoPlay
        muted
        width="320"
        height="240"
        onPlay={handlePlay}
        style={{ border: '2px solid #ccc', borderRadius: '8px' }}
      />
      {loading && <p>Scanning your face...</p>}
    </div>
  );
};

export default FacialVerification;
