import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './AdminPage.css'; // ✅ Import the CSS

const AdminPage = () => {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);
  const loggedInAdminEmail = localStorage.getItem('loggedInUser');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/stats', {
            headers: { 'x-user-email': loggedInAdminEmail }
          }),
          axios.get('http://localhost:5000/api/admin/users', {
            headers: { 'x-user-email': loggedInAdminEmail }
          })
        ]);

        setStats(statsRes.data);
        setUsers(usersRes.data);
        setFiltered(usersRes.data);
      } catch (err) {
        console.error('Error fetching admin data', err);
      }
    };

    fetchData();
  }, [loggedInAdminEmail]);

  useEffect(() => {
    setFiltered(
      users.filter(user =>
        user.email.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, users]);

  const handleBanToggle = async (user) => {
    const endpoint = user.banned ? 'unban' : 'ban';
    try {
      const res = await axios.put(`http://localhost:5000/api/admin/${endpoint}/${user._id}`, {}, {
        headers: { 'x-user-email': loggedInAdminEmail }
      });

      setUsers(prev =>
        prev.map(u =>
          u._id === user._id ? { ...u, banned: !user.banned } : u
        )
      );
    } catch (err) {
      console.error('Error banning/unbanning user:', err);
    }
  };

  const chartData = [
    { label: 'Users', value: stats.totalUsers || 0 },
    { label: 'Matches', value: stats.matches || 0 },
    { label: 'Feedbacks', value: stats.feedbacks || 0 }
  ];

  return (
    <div className="admin-container">
      <h1 className="admin-title">👨‍💼 Admin Dashboard</h1>

      <div className="stat-grid">
        {chartData.map(stat => (
          <div key={stat.label} className="stat-card">
            <h4>{stat.label}</h4>
            <p>{stat.value}</p>
          </div>
        ))}
      </div>

      <div>
        <h3 style={{ marginBottom: "1rem" }}>📊 Overview</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3>👥 User List</h3>
        <input
          type="text"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <table className="user-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Joined</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map(user => (
                <tr key={user._id}>
                  <td>{user.email}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>{user.banned ? '🔴 Banned' : '🟢 Active'}</td>
                  <td>
                    <button className="btn-edit">Edit</button>
                    <button
                      className={user.banned ? 'btn-unban' : 'btn-ban'}
                      onClick={() => handleBanToggle(user)}
                    >
                      {user.banned ? 'Unban' : 'Ban'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;
