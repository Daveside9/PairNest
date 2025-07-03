import React, { useEffect, useState } from 'react';
import axios from 'axios';

function NotificationBell({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [showList, setShowList] = useState(false);

  const fetchNotifications = async () => {
    const res = await axios.get(`http://localhost:5000/api/notifications/${userId}`);
    setNotifications(res.data);
  };

  const markAsRead = async (id) => {
    await axios.patch(`http://localhost:5000/api/notifications/${id}/read`);
    fetchNotifications();
  };

  const deleteNotification = async (id) => {
    await axios.delete(`http://localhost:5000/api/notifications/${id}`);
    fetchNotifications();
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

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
            notifications.map(note => (
              <div key={note._id} className={`p-2 mb-1 border rounded ${note.read ? 'bg-gray-100' : 'bg-yellow-100'}`}>
                <p className="text-sm">{note.message}</p>
                <div className="flex gap-2 text-xs mt-1">
                  {!note.read && (
                    <button onClick={() => markAsRead(note._id)} className="text-blue-500">Mark as read</button>
                  )}
                  <button onClick={() => deleteNotification(note._id)} className="text-red-500">Delete</button>
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
