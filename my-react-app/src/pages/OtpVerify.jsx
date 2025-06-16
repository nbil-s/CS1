import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './OtpVerify.css';

function OtpVerify() {
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
    if (!value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      alert('Please enter the 6-digit OTP.');
      return;
    }
    if (!email) {
      alert('Please enter your email.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: enteredOtp }),
      });
      const data = await response.json();
      if (data.success) {
        alert('Email verified! You can now log in.');
        navigate('/login');
      } else {
        alert(data.message || 'OTP verification failed.');
      }
    } catch (err) {
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-wrapper">
      <h2>Enter OTP</h2>
      <form onSubmit={handleSubmit}>
        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength="1"
              className="otp-box"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputRefs.current[index] = el)}
              required
            />
          ))}
        </div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="email-input"
          required
          style={{ margin: '1rem 0', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc', width: '100%' }}
        />
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </form>
    </div>
  );
}

export default OtpVerify;
