import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Authcontext';
import './VerifyCode.css';


function VerifyCode() {
  const [code, setCode] = useState('');
  const [email, setEmail] = useState(''); // Needed for resend
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setEmail(sessionStorage.getItem('pendingEmail') || '');
    setName(sessionStorage.getItem('pendingName') || '');
  }, []);

  const handleVerify = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      if (data.success) {
        console.log("✅ JWT:", data.token); // check what token looks like
        await login(data.token, data.user.role);
        navigate('/');
      } else {
        setError(data.message || 'Verification failed.');
        alert("Invalid or expired code.");
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendCooldown(true);
    setTimeout(() => setResendCooldown(false), 30000); // 30s
    try {
      const res = await fetch('http://localhost:5000/api/resend-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      alert(data.message || 'Verification code resent');
    } catch (err) {
      console.error('❌ Resend error:', err);
      alert('Failed to resend code');
    }
  };

  
  

  return (
    <div className="verify-code">
      <h2>Email Verification</h2>
      <input
        type="text"
        placeholder="Enter 6-digit code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        maxLength={6}
      />
      <button onClick={handleVerify} disabled={loading}>
        {loading ? 'Verifying...' : 'Verify'}
      </button>
      {error && <p className="error">{error}</p>}

      <button onClick={handleResend} disabled={resendCooldown}>
        {resendCooldown ? 'Please wait...' : 'Resend Code'}
      </button>
    </div>
  );
}

export default VerifyCode;
