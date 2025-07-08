import React from 'react';
import './TestimonialsCarousel.css';

const testimonials = [
  { text: "I found my soulmate on PairNest in just 2 weeks!", user: "— Ada, kaduna" },
  { text: "The temperament matching is scarily accurate.", user: "— Chinedu, kaduna" },
  { text: "We got married last year, all thanks to PairNest!", user: "— Tola & Grace" },
];

const TestimonialsCarousel = () => {
  return (
    <section className="testimonials-section">
      <h2 className="section-title">Happy Stories</h2>
      <div className="testimonial-grid">
        {testimonials.map((t, i) => (
          <div className="testimonial-card" key={i}>
            <p className="testimonial-text">"{t.text}"</p>
            <p className="testimonial-user">{t.user}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
