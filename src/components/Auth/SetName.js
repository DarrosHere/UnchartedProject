import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/auth.css';

const SetName = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSetName = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5001/api/user/set-name', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, 
        },
        credentials: 'include', 
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to set name');
      }

      const data = await response.json();
      setSuccess(data.message || 'Name updated successfully');
      setTimeout(() => navigate('/dashboard'), 2000); 
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'An error occurred while setting your name');
    }
  };

  return (
    <div className="auth-form-container">
      <h2 className="auth-form-title">Set Your Name</h2>
      <form className="auth-form" onSubmit={handleSetName}>
        <div className="auth-form-group">
          <input
            className="auth-form-input"
            placeholder="Enter your name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        {error && <div className="auth-error-message">{error}</div>}
        {success && <div className="auth-success-message">{success}</div>}
        <button className="auth-submit-button" type="submit">
          Save Name
        </button>
      </form>
    </div>
  );
};

export default SetName;