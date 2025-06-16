import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function OtpVerify() {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState(''); // Optionally get from signup state
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:5000/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });

    const data = await response.json();

    if (data.success) {
      alert('Email verified! You can now log in.');
      navigate('/login'); // Or any page you want after verification
    } else {
      alert(data.message || 'OTP verification failed.');
    }
  };

  return (
    <div className="otp-container">
      <form onSubmit={handleVerify}>
        <h2>Enter OTP</h2>
        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter 6-digit OTP"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email again"
          required
        />
        <button type="submit">Verify OTP</button>
      </form>
    </div>
  );
}

export default OtpVerify;
