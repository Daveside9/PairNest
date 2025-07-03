import React from 'react';
import './FeaturesSection.css';
import { FaHeart, FaMagic, FaRocket, FaUsers } from 'react-icons/fa';

const features = [
  { icon: <FaHeart />, title: "Smart Matchmaking" },
  { icon: <FaMagic />, title: "Love Language Decoder" },
  { icon: <FaRocket />, title: "Growth Tracker" },
  { icon: <FaUsers />, title: "Tribe Connect" },
];

const FeaturesSection = () => {
  return (
    <section className="features-section">
      <h2 className="section-title">Why PairNest?</h2>
      <div className="features-grid">
        {features.map((item, idx) => (
          <div className="feature-card" key={idx}>
            <div className="feature-icon">{item.icon}</div>
            <h3 className="feature-title">{item.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
