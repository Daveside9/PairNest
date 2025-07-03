import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleMeetPairClick = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard'); // Already logged in
    } else {
      navigate('/auth'); // Redirect to signup/login
    }
  };

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-left">
          <h1>This is where hearts meet through harmony.</h1>
          <p>PairNest: Your heart's new favorite algorithm.</p>
          <div className="cta-buttons">
            <button className="primary-btn" onClick={handleMeetPairClick}>
              Meet a Pair
            </button>
          </div>
        </div>
        <div className="hero-right">
          <img
            src="/images/love-assistant.png"
            alt="Love awaits"
            className="hero-img"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why PairNest?</h2>
        <div className="feature-cards">
          <div className="card">
            <span role="img" aria-label="heart">💜</span>
            <h3>Smart Matchmaking</h3>
          </div>
          <div className="card">
            <span role="img" aria-label="language">🎯</span>
            <h3>Love Language Decoder</h3>
          </div>
          <div className="card">
            <span role="img" aria-label="protection">🛡️</span>
            <h3>Love Protection</h3>
          </div>
          <div className="card">
            <span role="img" aria-label="community">🌍</span>
            <h3>Tribe Connect</h3>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2>Happy Stories</h2>
        <blockquote>
          "I found my soulmate on PairNest in just 2 weeks!"
          <footer>— Jane, Kaduna</footer>
        </blockquote>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 PairNest. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
