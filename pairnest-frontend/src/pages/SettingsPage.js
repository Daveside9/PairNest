import React, { useState } from 'react';
import './SettingsPage.css';

function SettingsPage() {
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('');
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    alert('Settings saved!');
  };

  return (
    <div className="settings-page">
      <h2>⚙️ Settings</h2>

      <form onSubmit={handleSave} className="settings-form">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>New Password</label>
        <input
          type="password"
          placeholder="•••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>Theme</label>
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>

        <label>
          <input
            type="checkbox"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
          />
          Enable Notifications
        </label>

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default SettingsPage;
