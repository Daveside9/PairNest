import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminPage.css';

const AdminPage = () => {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('/api/admin/stats').then(res => setStats(res.data));
    axios.get('/api/admin/users').then(res => setUsers(res.data)); // If route added
  }, []);

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card">Total Users: {stats.totalUsers}</div>
        <div className="stat-card">Matches Made: {stats.matches}</div>
        <div className="stat-card">Feedbacks: {stats.feedbacks}</div>
      </div>

      <h3>Recent Users</h3>
      <table>
        <thead><tr><th>Email</th><th>Joined</th></tr></thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.email}</td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
