import React, { useEffect, useState } from 'react';
import axios from 'axios';

function NotificationBell({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [showList, setShowList] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/notifications/${userId}`);
      setNotifications(res.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(`${API_URL}/api/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/notifications/${id}`);
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button onClick={() => setShowList(!showList)}>
        🔔 {unreadCount > 0 && <span className="text-red-500">({unreadCount})</span>}
      </button>

      {showList && (
        <div className="absolute right-0 mt-2 w-72 bg-white text-black shadow rounded z-10 p-2 max-h-96 overflow-auto">
          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500">No notifications</p>
          ) : (
            notifications.map((note) => (
              <div
                key={note._id}
                className={`p-2 mb-1 border rounded ${
                  note.read ? 'bg-gray-100' : 'bg-yellow-100'
                }`}
              >
                <p className="text-sm">{note.message}</p>
                <div className="flex gap-2 text-xs mt-1">
                  {!note.read && (
                    <button
                      onClick={() => markAsRead(note._id)}
                      className="text-blue-500"
                    >
                      Mark as read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(note._id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
