import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

function EmailVerification() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('');
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/verify-email?token=${token}`);
        setMessage(res.data.message);
      } catch (err) {
        const msg = err.response?.data?.message || 'Verification failed.';
        setMessage(msg);
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setMessage('Token missing.');
    }
  }, [token]);

  return <div><h3>{message}</h3></div>;
}

export default EmailVerification;
