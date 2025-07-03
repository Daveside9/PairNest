import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NotificationBell from '../components/NotificationBell';
import './DashboardPage.css';

function DashboardPage() {
  const navigate = useNavigate();
  const email = localStorage.getItem('loggedInUser');
  const [profilePic, setProfilePic] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      if (!email) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/auth/profile/${email}`);
        if (res.data) {
          setUserId(res.data._id || '');
          setProfilePic(res.data.profilePic || '');
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err.message);
      }
    }
    fetchProfile();
  }, [email]);

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    navigate('/');
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !userId) return;

    const formData = new FormData();
    formData.append('profilePic', file);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/upload-profile-pic/${userId}`,
        formData
      );
      setProfilePic(res.data.profilePic);
    } catch (err) {
      console.error('Profile picture upload failed:', err.message);
    }
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2>🧠 NeuroPulse</h2>

        <div className="profile-section">
          {profilePic && (
  <img src={profilePic} alt="Profile" className="profile-avatar" />
)}

<input
  type="file"
  onChange={handleFileChange}
  className="upload-input"
/>

<p className="profile-email">{email}</p>

        </div>

        <nav>
          <ul>
            <li><Link to="/dashboard">Overview</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/interest">Interest</Link></li>
            <li><Link to="/concellor">Concellor</Link></li>
            <li><Link to="/settings">Settings</Link></li>
          </ul>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </aside>

      <main className="main-content">
        <NotificationBell />
        <h1>Welcome to your Dashboard</h1>
        <p>Select a section on the left to begin.</p>
      </main>
    </div>
  );
}

export default DashboardPage;
