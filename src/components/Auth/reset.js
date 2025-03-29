import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../../styles/reset.css';

const ResetPasswordForm = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [message, setMessage] = useState(""); 
  const [error, setError] = useState(""); 

 
  const handleRequestReset = async () => {
    setError("");
    setMessage("");
    try {
      const response = await fetch("http://localhost:5001/api/auth/request-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setMessage("If the email exists, a reset link will be sent. Check the console for the link.");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResetPassword = async () => {
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setMessage("Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-form">
        <h2>{token ? "Reset Your Password" : "Request Password Reset"}</h2>

  
        {!token ? (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleRequestReset}>Send Reset Link</button>
          </>
        ) : (
          <>
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button onClick={handleResetPassword}>Reset Password</button>
          </>
        )}

       
        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
};

export default ResetPasswordForm;