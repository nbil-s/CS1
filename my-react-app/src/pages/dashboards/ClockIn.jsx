import React, { useState } from 'react';
import './ClockIn.css';

const ClockIn_Out = () => {
  const [remarks, setRemarks] = useState('');
  const [password, setPassword] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  const [action, setAction] = useState(null); // 'clockin' or 'clockout'
  const [message, setMessage] = useState('');

  const handleAction = async () => {
    setMessage('');
    if (!password) {
      setMessage('Password is required to confirm.');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/${action === 'clockout' ? 'clock-out' : 'clock-in'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ remarks, password })
      });

      const data = await res.json();
      if (data.success) {
        setMessage(`✅ ${action === 'clockin' ? 'Clock-In' : 'Clock-Out'} successful`);
      } else {
        setMessage('❌ ' + data.message);
      }
    } catch (err) {
      setMessage('❌ Network error');
    }
  };

  return (
    <div className="clockin-wrapper">
      <h2>Admin Clock In/Out</h2>
      <textarea
        placeholder="Optional remarks..."
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
      />

      {showPrompt ? (
        <>
          <input
            type="password"
            placeholder="Confirm your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleAction}>
            Confirm {action === 'clockin' ? 'Clock-In' : 'Clock-Out'}
          </button>
        </>
      ) : (
        <div className="button-group">
          <button onClick={() => { setAction('clockin'); setShowPrompt(true); }}>
            Clock In
          </button>
          <button onClick={() => { setAction('clockout'); setShowPrompt(true); }}>
            Clock Out
          </button>
        </div>
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default ClockIn_Out;
