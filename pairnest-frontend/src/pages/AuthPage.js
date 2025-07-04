import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AuthPage.css';

function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const url = isSignup
        ? 'http://localhost:5000/api/auth/signup'
        : 'http://localhost:5000/api/auth/login';

      const res = await axios.post(url, { email, password });
      setMessage(res.data.message);

      if (!isSignup) {
        localStorage.setItem('loggedInUser', res.data.user.email);
        localStorage.setItem('isAdmin', res.data.user.isAdmin);

        navigate(res.data.user.isAdmin ? '/admin' : '/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setMessage(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">{isSignup ? 'Sign Up' : 'Welcome Back'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="auth-btn">
            {isSignup ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="divider">or</div>

        <div className="social-login">
          <button className="social-btn google" disabled>
            Sign in with Google
          </button>
          <button className="social-btn github" disabled>
            Sign in with GitHub
          </button>
        </div>

        <p className="toggle-text">
          {isSignup ? 'Already have an account?' : 'Don’t have an account?'}{' '}
          <span onClick={() => setIsSignup(!isSignup)} className="toggle-link">
            {isSignup ? 'Sign In' : 'Sign Up'}
          </span>
        </p>

        {message && <p className="auth-message">{message}</p>}
      </div>
    </div>
  );
}

export default AuthPage;
