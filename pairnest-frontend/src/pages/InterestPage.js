import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './InterestPage.css';

const InterestPage = () => {
  const email = localStorage.getItem('loggedInUser');
  const [preferences, setPreferences] = useState({
    minAge: '',
    maxAge: '',
    location: '',
    profession: '',
    temperament: '',
    religion: '',
    tribe: '',
    loveLanguage: ''
  });

  useEffect(() => {
    // Load saved preferences
    axios.get(`http://localhost:5000/api/interest/${email}`)
      .then(res => {
        if (res.data) setPreferences(res.data);
      })
      .catch(err => console.error(err));
  }, [email]);

  const handleChange = (e) => {
    setPreferences({ ...preferences, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/interest', { email, ...preferences });
      alert("Preferences saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to save preferences.");
    }
  };

  return (
    <div className="interest-page">
      <h2>Your Ideal Match Preferences</h2>
      <form onSubmit={handleSubmit} className="interest-form">
        <div className="input-group">
          <input type="number" name="minAge" placeholder="Min Age" value={preferences.minAge} onChange={handleChange} />
          <input type="number" name="maxAge" placeholder="Max Age" value={preferences.maxAge} onChange={handleChange} />
        </div>

        <input type="text" name="location" placeholder="Preferred Location" value={preferences.location} onChange={handleChange} />
        <input type="text" name="profession" placeholder="Preferred Profession" value={preferences.profession} onChange={handleChange} />

        <select name="temperament" value={preferences.temperament} onChange={handleChange}>
          <option value="">Temperament</option>
          <option value="choleric">Choleric</option>
          <option value="melancholic">Melancholic</option>
          <option value="phlegmatic">Phlegmatic</option>
          <option value="sanguine">Sanguine</option>
        </select>

        <input type="text" name="religion" placeholder="Preferred Religion" value={preferences.religion} onChange={handleChange} />
        <input type="text" name="tribe" placeholder="Preferred Tribe" value={preferences.tribe} onChange={handleChange} />
        <input type="text" name="loveLanguage" placeholder="Love Language" value={preferences.loveLanguage} onChange={handleChange} />

        <button type="submit">Save Preferences</button>
      </form>
    </div>
  );
};

export default InterestPage;
