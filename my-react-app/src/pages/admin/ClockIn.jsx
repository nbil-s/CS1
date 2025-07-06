import React, { useState } from 'react';
import './ClockIn_Out.css';

const ClockIn = () => {
  const [remarks, setRemarks] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleClockIn = async () => {
    setMessage('');
    if (!password) {
      setMessage('Password is required to confirm.');
      return;
    }

    const token = sessionStorage.getItem('token');

    try {
      const res = await fetch('http://localhost:5000/api/clock-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ remarks, password })
      });

      const data = await res.json();
      if (data.success) {
        setMessage('✅ Clock-In successful');
      } else {
        setMessage('❌ ' + data.message);
      }
    } catch (err) {
      setMessage('❌ Network error');
    }
  };

  return (
    <div className="clockin-wrapper">
      <h2>Clock In</h2>
      <textarea
        placeholder="Optional remarks..."
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleClockIn}>Confirm Clock-In</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ClockIn;
