import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <span className="footer-brand">PairNest © 2025</span>
        <div className="footer-links">
          <a href="#">Product</a>
          <a href="#">Pricing</a>
          <a href="#">Terms</a>
          <a href="#">Blog</a>
        </div>
        <div className="footer-newsletter">
          <input type="email" placeholder="Subscribe" className="newsletter-input" />
          <button className="btn-primary text-sm">Go</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
