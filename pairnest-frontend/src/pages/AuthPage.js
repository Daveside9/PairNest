import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AuthPage.css';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const url = isSignup
        ? `${process.env.REACT_APP_API_URL}/api/auth/signup`
        : `${process.env.REACT_APP_API_URL}/api/auth/login`;

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

  const handleGoogleSuccess = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    const googleEmail = decoded.email;

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/google-login`, {
        email: googleEmail,
      });

      setMessage(res.data.message);
      localStorage.setItem('loggedInUser', res.data.user.email);
      localStorage.setItem('isAdmin', res.data.user.isAdmin);
      navigate(res.data.user.isAdmin ? '/admin' : '/dashboard');
    } catch (error) {
      setMessage('Google login failed');
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
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
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="auth-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button type="submit" className="auth-btn">
              {isSignup ? 'Sign Up' : 'Sign In'}
            </button>
          </form>

          {!isSignup && (
            <div className="forgot-password">
              <a href="#" onClick={(e) => e.preventDefault()}>
                Forgot Password?
              </a>
            </div>
          )}

          <div className="divider">or</div>

          <div className="social-login">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setMessage('Google login failed')} />
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
    </GoogleOAuthProvider>
  );
}

export default AuthPage;
