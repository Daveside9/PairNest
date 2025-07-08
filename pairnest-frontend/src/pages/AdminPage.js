import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { io } from 'socket.io-client';
import './AdminPage.css';

const API = process.env.REACT_APP_API_URL; // ✅ Use env variable (e.g., https://pairnest.onrender.com)

const AdminPage = () => {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [notificationMsg, setNotificationMsg] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [bookings, setBookings] = useState([]);
  const loggedInAdminEmail = localStorage.getItem('loggedInUser');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes, bookingsRes] = await Promise.all([
          axios.get(`${API}/api/admin/stats`, { headers: { 'x-user-email': loggedInAdminEmail } }),
          axios.get(`${API}/api/admin/users`, { headers: { 'x-user-email': loggedInAdminEmail } }),
          axios.get(`${API}/api/admin/bookings`, { headers: { 'x-user-email': loggedInAdminEmail } }),
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data);
        setBookings(bookingsRes.data);
        setFiltered(usersRes.data);
      } catch (err) {
        console.error('Error fetching admin data', err);
      }
    };

    fetchData();
  }, [loggedInAdminEmail]);

  useEffect(() => {
    let result = users;
    if (search) result = result.filter(u => u.email.toLowerCase().includes(search.toLowerCase()));
    if (roleFilter) result = result.filter(u => (roleFilter === 'admin' ? u.isAdmin : !u.isAdmin));
    if (statusFilter) result = result.filter(u => (statusFilter === 'banned' ? u.banned : !u.banned));
    setFiltered(result);
  }, [search, roleFilter, statusFilter, users]);

  const handleBanToggle = async (user) => {
    const endpoint = user.banned ? 'unban' : 'ban';
    try {
      const res = await axios.put(`${API}/api/admin/${endpoint}/${user._id}`, {}, {
        headers: { 'x-user-email': loggedInAdminEmail }
      });
      setUsers(prev => prev.map(u => u._id === user._id ? { ...u, banned: !user.banned } : u));
    } catch (err) {
      console.error('Ban/unban error:', err);
    }
  };

  const handleEditSubmit = async () => {
    try {
      const res = await axios.put(`${API}/api/admin/edit/${editingUser._id}`, editingUser, {
        headers: { 'x-user-email': loggedInAdminEmail }
      });
      alert('User updated!');
      setEditingUser(null);
      setUsers(prev => prev.map(u => u._id === res.data._id ? res.data : u));
    } catch (err) {
      console.error('Edit error:', err);
    }
  };

  useEffect(() => {
    const socket = io(API); // ✅ Use backend URL for socket too

    socket.on('userUpdated', updatedUser => {
      setUsers(prev =>
        prev.map(u => (u._id === updatedUser._id ? updatedUser : u))
      );
    });

    socket.on('bookingCreated', newBooking => {
      setBookings(prev => [newBooking, ...prev]);
    });

    socket.on('notification', notif => {
      console.log('🔔 New notification:', notif);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const exportToCSV = () => {
    const csvRows = [
      ['Email', 'Role', 'Status', 'CreatedAt'],
      ...filtered.map(u => [u.email, u.isAdmin ? 'Admin' : 'User', u.banned ? 'Banned' : 'Active', new Date(u.createdAt).toLocaleDateString()])
    ];
    const blob = new Blob([csvRows.map(r => r.join(',')).join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pairnest_users.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSendNotification = async () => {
    if (!selectedUserId || !notificationMsg) return;
    try {
      await axios.post(`${API}/api/admin/notify/${selectedUserId}`, { message: notificationMsg }, {
        headers: { 'x-user-email': loggedInAdminEmail }
      });
      alert('Notification sent!');
      setNotificationMsg('');
      setSelectedUserId(null);
    } catch (err) {
      console.error('Notification error:', err);
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

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <h3 style={{ marginTop: '2rem' }}>👥 Users</h3>
      <div className="filters">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search email..." />
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">All Roles</option>
          <option value="admin">Admins</option>
          <option value="user">Users</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="banned">Banned</option>
          <option value="active">Active</option>
        </select>
        <button onClick={exportToCSV}>Export CSV</button>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>Email</th><th>Status</th><th>Role</th><th>Joined</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(user => (
            <tr key={user._id}>
              <td>{user.email}</td>
              <td>{user.banned ? '🔴 Banned' : '🟢 Active'}</td>
              <td>{user.isAdmin ? 'Admin' : 'User'}</td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td>
                <button onClick={() => setEditingUser({ ...user })}>Edit</button>
                <button onClick={() => handleBanToggle(user)}>{user.banned ? 'Unban' : 'Ban'}</button>
                <button onClick={() => setSelectedUserId(user._id)}>Notify</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingUser && (
        <div className="modal">
          <h3>Edit User</h3>
          <input value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} />
          <label>
            <input type="checkbox" checked={editingUser.isAdmin} onChange={(e) => setEditingUser({ ...editingUser, isAdmin: e.target.checked })} /> Admin
          </label>
          <button onClick={handleEditSubmit}>Save</button>
          <button onClick={() => setEditingUser(null)}>Cancel</button>
        </div>
      )}

      {selectedUserId && (
        <div className="modal">
          <h3>Send Notification</h3>
          <textarea value={notificationMsg} onChange={(e) => setNotificationMsg(e.target.value)} />
          <button onClick={handleSendNotification}>Send</button>
          <button onClick={() => setSelectedUserId(null)}>Cancel</button>
        </div>
      )}

      <div style={{ marginTop: '3rem' }}>
        <h3>📜 Booking Logs</h3>
        <table className="user-table">
          <thead>
            <tr><th>User 1</th><th>User 2</th><th>Status</th><th>Date</th></tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b._id}>
                <td>{b.user1?.email}</td>
                <td>{b.user2?.email}</td>
                <td>{b.status}</td>
                <td>{new Date(b.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;
