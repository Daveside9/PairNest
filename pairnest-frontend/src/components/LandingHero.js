import React from 'react';
import loveGif from '../assets/love-animation.gif'; 
import './LandingHero.css';

const LandingHero = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="text-left space-y-6">
          <h1 className="hero-title">Think Less. Love More.</h1>
          <p className="hero-subtext">Find meaningful connections with AI-guided matchmaking on PairNest.</p>
          <div className="flex gap-4">
            <button className="btn-primary">Get Started for Free</button>
            <button className="btn-secondary">Watch Demo</button>
          </div>
        </div>
        <div className="hero-image-container">
          <img src={loveGif} alt="AI Love Assistant" className="..." /> 
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
