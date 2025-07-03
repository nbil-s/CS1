import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'patient'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
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
      // Send the correct field names that the backend expects
      const loginData = {
        email: formData.username, // Map username field to email
        password: formData.password,
        role: formData.role
      };
      
      console.log('Sending login data:', { ...loginData, password: '***' });
      
      const response = await api.post('/auth/login', loginData);
      if (response.data.token) {
        // Use the login function from AuthContext
        login(response.data.token, response.data.user);
        
        // Navigate to role-specific dashboard
        switch (formData.role) {
          case 'doctor':
            navigate('/doctor/dashboard');
            break;
          case 'receptionist':
            navigate('/receptionist/dashboard');
            break;
          case 'patient':
            navigate('/patient/dashboard');
            break;
          case 'admin':
            navigate('/admin/dashboard');
            break;
          default:
            navigate('/');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response) {
        setError(err.response.data.message || 'Invalid credentials');
      } else if (err.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome Back</h2>
        <p className="text-center text-muted mb-4">Please sign in to continue</p>
        
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              <i className="bx bx-user me-2"></i>Email or Username
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter your email or username"
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              <i className="bx bx-lock-alt me-2"></i>Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="role" className="form-label">
              <i className="bx bx-user-circle me-2"></i>Role
            </label>
            <select
              className="form-select"
              id="role"
              name="role"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              required
            >
              <option value="">Select Role</option>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="receptionist">Receptionist</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Signing in...
              </>
            ) : (
              <>
                <i className="bx bx-log-in me-2"></i>Sign In
              </>
            )}
          </button>
        </form>
        
        <div className="text-center mt-4">
          <p className="mb-0">
            Don't have an account?{' '}
            <Link to="/signup" className="text-decoration-none" style={{ color: '#8B4513' }}>
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
