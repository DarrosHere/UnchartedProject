import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/auth.css';

const Login = ({ setAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Response:', data);

        localStorage.setItem('token', data.token);

        if (setAuth && typeof setAuth === 'function') {
          setAuth(true);
          navigate('/dashboard');
        } else {
          console.error('setAuth is not a function or is undefined');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Invalid login credentials');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred while connecting to the server');
    }
  };

  return (
    <div className="auth-form-container">
      <h2 className="auth-form-title">Login</h2>
      <form className="auth-form" onSubmit={handleLogin}>
        <div className="auth-form-group">
          <input
            placeholder="Email"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="auth-form-group">
          <input
            placeholder="Password"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && (
          <div className="auth-error-message">
            {error} <br />
            Forgot your password? <a href="/reset-password">Reset Password</a>
          </div>
        )}
        <button className="auth-submit-button" type="submit">
          Login
        </button>
      </form>
      <div className="auth-footer">
        Don't have an account? <a href="/register">Register</a>
      </div>
    </div>
  );
};

export default Login;