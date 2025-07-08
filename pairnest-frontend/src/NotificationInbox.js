import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import './NotificationInbox.css';

const socket = io(process.env.REACT_APP_API_URL); // ✅ use .env-based backend URL

function NotificationInbox({ userId }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch existing notifications
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/notifications/${userId}`);
        setNotifications(res.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
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
    try {
      await axios.patch(`${process.env.REACT_APP_API_URL}/api/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
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
              {n.message}{' '}
              <span>{new Date(n.createdAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NotificationInbox;
