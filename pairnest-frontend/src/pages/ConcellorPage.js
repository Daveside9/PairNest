import React, { useState } from 'react';
import axios from 'axios';
import './ConcellorPage.css';

const ConcellorPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: localStorage.getItem('loggedInUser') || '',
    message: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.message.trim()) {
      alert("Please enter a message.");
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/concellor', form);
      alert("Your message was sent to our counselor. Thank you!");
      setForm({ ...form, message: '' });
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="concellor-page">
      <h2>Talk to a Love Counselor 💬</h2>
      <p>Your thoughts and concerns matter. Reach out for private guidance.</p>

      <form onSubmit={handleSubmit} className="concellor-form">
        <input
          type="text"
          name="name"
          placeholder="Your Name (optional)"
          value={form.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
        />
        <textarea
          name="message"
          placeholder="What's on your heart?"
          rows="6"
          value={form.message}
          onChange={handleChange}
          required
        />
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
};

export default ConcellorPage;
