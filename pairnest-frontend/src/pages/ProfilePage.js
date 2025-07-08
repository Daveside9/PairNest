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
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/profile/${email}`)
        if (res.data) {
          setProfile((prev) => ({
            ...prev,
            ...res.data
          }));
        }
      } catch (err) {
        console.error('Error fetching profile:', err.response?.data || err.message);
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

  const validateProfile = () => {
    const requiredFields = ['fullName', 'gender', 'age', 'profession', 'location', 'temperament', 'loveLanguage', 'tribe'];
    for (const field of requiredFields) {
      if (!profile[field]) {
        return `Please fill in the "${field}" field.`;
      }
    }
    if (isNaN(profile.age) || profile.age < 18 || profile.age > 100) {
      return 'Age must be between 18 and 100.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      alert('No user email found. Please login again.');
      return;
    }

    const validationError = validateProfile();
    if (validationError) {
      alert(validationError);
      return;
    }
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/profile/${email}`, profile);
      alert('Profile saved successfully!');
   } catch (err) {
  if (err.response?.status === 404) {
    console.log('No profile yet — user needs to fill it.');
  } else {
    console.error('Error fetching profile:', err.response?.data || err.message);
  }
}
  }
  return (
    <motion.div
      className="profile-page"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2>Your Profile</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" name="fullName" value={profile.fullName} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Gender</label>
          <select name="gender" value={profile.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Age</label>
          <input type="number" name="age" value={profile.age} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Profession</label>
          <input type="text" name="profession" value={profile.profession} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input type="text" name="location" value={profile.location} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Temperament</label>
          <select name="temperament" value={profile.temperament} onChange={handleChange} required>
            <option value="">Select Temperament</option>
            <option value="Choleric">Choleric</option>
            <option value="Sanguine">Sanguine</option>
            <option value="Melancholic">Melancholic</option>
            <option value="Phlegmatic">Phlegmatic</option>
          </select>
        </div>

        <div className="form-group">
          <label>Love Language</label>
          <select name="loveLanguage" value={profile.loveLanguage} onChange={handleChange} required>
            <option value="">Select Love Language</option>
            <option value="Words of Affirmation">Words of Affirmation</option>
            <option value="Acts of Service">Acts of Service</option>
            <option value="Receiving Gifts">Receiving Gifts</option>
            <option value="Quality Time">Quality Time</option>
            <option value="Physical Touch">Physical Touch</option>
          </select>
        </div>

        <div className="form-group">
          <label>Tribe</label>
          <select name="tribe" value={profile.tribe} onChange={handleChange} required>
            <option value="">Select Tribe</option>
            <option value="Yoruba">Yoruba</option>
            <option value="Igbo">Igbo</option>
            <option value="Hausa">Hausa</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Hobbies</label>
          <input type="text" name="hobbies" value={profile.hobbies} onChange={handleChange} />
        </div>

        <button type="submit" className="save-btn">Save Profile</button>
      </form>
    </motion.div>
  );
}

export default ProfilePage;
