import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faEnvelope, faLock, faSignInAlt } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', formData);
      
      if (response.data.requiresOtp) {
        setShowOtpForm(true);
        setEmail(formData.email);
        setPassword(formData.password);
        setOtpLoading(false);
      } else {
        login(response.data.token, response.data.user);
        navigateToDashboard(response.data.user.role);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setOtpError('');
    setOtpLoading(true);

    try {
      const response = await api.post('/auth/verify-otp', {
        email,
        password,
        otp
      });

      login(response.data.token, response.data.user);
      navigateToDashboard(response.data.user.role);
    } catch (err) {
      setOtpError(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setOtpLoading(false);
    }
  };

  const navigateToDashboard = (role) => {
    switch (role) {
      case 'patient':
        navigate('/patient/dashboard');
        break;
      case 'doctor':
        navigate('/doctor/dashboard');
        break;
      case 'receptionist':
        navigate('/receptionist/dashboard');
        break;
      case 'admin':
        navigate('/admin/dashboard');
        break;
      default:
        navigate('/');
    }
  };

  if (showOtpForm) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h2>Verify OTP</h2>
          <p>Please enter the OTP sent to your email</p>
          
          {otpError && <div className="error-message">{otpError}</div>}
          
          <form onSubmit={handleOtpSubmit}>
            <div className="form-group">
              <div className="input-group">
                <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
            </div>
            
            <button type="submit" className="login-btn" disabled={otpLoading}>
              {otpLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
          
          <div className="login-footer">
            <Link to="/login" className="back-link">Back to Login</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        <p>Welcome back! Please login to your account.</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-group">
              <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
              <input
                type="text"
                name="email"
                placeholder="Email or Username"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>
          </div>
          
          <div className="form-group">
            <div className="input-group">
              <FontAwesomeIcon icon={faLock} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="form-input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>
          
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : (
              <>
                <FontAwesomeIcon icon={faSignInAlt} /> Login
              </>
            )}
          </button>
        </form>
        
        <div className="login-footer">
          <p>Don't have an account? <Link to="/signup" className="signup-link">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
