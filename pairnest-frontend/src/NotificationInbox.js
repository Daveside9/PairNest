import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import './NotificationInbox.css';

const socket = io('http://localhost:5000');

function NotificationInbox({ userId }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch existing notifications
    const fetchNotifications = async () => {
      const res = await axios.get(`http://localhost:5000/api/notifications/${userId}`);
      setNotifications(res.data);
    };
    fetchNotifications();

    // Listen for real-time notifications
    socket.on('notification', (notif) => {
      if (notif.user === userId) {
        setNotifications(prev => [notif, ...prev]);
      }
    });

    return () => socket.off('notification');
  }, [userId]);

  const markAsRead = async (id) => {
    await axios.put(`http://localhost:5000/api/notifications/${id}/read`);
    setNotifications(prev =>
      prev.map(n => (n._id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="notif-inbox">
      <h3>🔔 Notifications</h3>
      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <ul>
          {notifications.map(n => (
            <li
              key={n._id}
              className={n.read ? 'read' : 'unread'}
              onClick={() => markAsRead(n._id)}
            >
              {n.message} <span>{new Date(n.createdAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NotificationInbox;
