import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/auth.css';

const Register = ({ setAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
  e.preventDefault();
  setError(''); 

  try {
    const response = await fetch('http://localhost:5001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    console.log('Response:', data);

   
    if (response.status === 200 || response.status === 201) {
      
      localStorage.setItem('token', data.token); 

      if (setAuth && typeof setAuth === 'function') {
        setAuth(true);
        navigate('/set-name'); 
      } else {
        console.error('setAuth is not a function or is undefined');
      }
    } else {
      setError(data.message || 'Unexpected response from the server');
    }
  } catch (err) {
    console.error('Error:', err);
    setError('An error occurred while communicating with the server');
  }
};

  

  return (
    <div className="auth-form-container">
      <h2 className="auth-form-title">Register</h2>
      <form className="auth-form" onSubmit={handleRegister}>
        <div className="auth-form-group">
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="auth-form-group">
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="auth-error-message">{error}</div>}
        <button className="auth-submit-button" type="submit">
          Register
        </button>
      </form>
      <div className="auth-footer">
        Already have an account? <a href="/login">Login</a>
      </div>
    </div>
  );
};

export default Register;