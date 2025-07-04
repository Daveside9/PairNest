import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import InterestPage from './pages/InterestPage';
import ConcellorPage from './pages/ConcellorPage';
import AdminPage from './pages/AdminPage';
import './App.css';

function App() {
  const user = localStorage.getItem('loggedInUser');
  const isAdmin = localStorage.getItem('isAdmin') === 'true'; // ✅ ensures boolean check

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/auth" />} />
      <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/auth" />} />
      <Route path="/interest" element={user ? <InterestPage /> : <Navigate to="/auth" />} />
      <Route path="/concellor" element={user ? <ConcellorPage /> : <Navigate to="/auth" />} />
      <Route path="/settings" element={user ? <SettingsPage /> : <Navigate to="/auth" />} />

      {/* ✅ Admin route protected */}
      <Route path="/admin" element={user && isAdmin ? <AdminPage /> : <Navigate to="/" />} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
