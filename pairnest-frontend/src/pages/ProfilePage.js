import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import './ProfilePage.css';

function ProfilePage() {
  const email = localStorage.getItem('loggedInUser');
  const [profile, setProfile] = useState({
    fullName: '',
    gender: '',
    age: '',
    profession: '',
    location: '',
    temperament: '',
    loveLanguage: '',
    tribe: '',
    hobbies: '',
  });

  useEffect(() => {
    async function fetchProfile() {
      if (!email) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/profile/${email}`);
        if (res.data) {
          setProfile((prev) => ({
            ...prev,
            ...res.data
          }));
        }
      } catch (err) {
        console.error('Error fetching profile:', err.message);
      }
    }

    fetchProfile();
  }, [email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      alert('No user email found. Please login again.');
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/profile/${email}`, profile);
      alert('Profile saved successfully!');
    } catch (err) {
      console.error('Error saving profile:', err.message);
      alert('Failed to save profile.');
    }
  };

  return (
    <motion.div
      className="profile-page"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2>Your Profile</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        {Object.entries(profile).map(([field, value]) => (
          <div key={field} className="form-group">
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              type={field === 'age' ? 'number' : 'text'}
              name={field}
              value={value}
              onChange={handleChange}
              required={field !== 'hobbies'} // hobbies is optional
            />
          </div>
        ))}
        <button type="submit" className="save-btn">Save Profile</button>
      </form>
    </motion.div>
  );
}

export default ProfilePage;
