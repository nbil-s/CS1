import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './NavBar.css';

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user && user.role === 'patient') {
      fetchUnreadCount();
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/notifications/patient/unread-count');
      setUnreadCount(response.data.unreadCount || 0);
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return null;
    
    switch (user.role) {
      case 'patient':
        return '/patient/dashboard';
      case 'doctor':
        return '/doctor/dashboard';
      case 'receptionist':
        return '/receptionist/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return null;
    }
  };

  return (
    <div className="navbar bg-dark border-bottom border-body" data-bs-theme="dark">
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand">Hospital Management System</Link>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup"
            aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav me-auto">
              <Link to="/" className="nav-link">Home</Link>
              {!user && (
                <>
                  <Link to="/login" className="nav-link">Login</Link>
                  <Link to="/signup" className="nav-link">Sign Up</Link>
                </>
              )}
              {user && (
                <>
                  <Link to={getDashboardLink()} className="nav-link">Dashboard</Link>
                  {user.role === 'patient' && (
                    <>
                      <Link to="/book" className="nav-link">Book Appointment</Link>
                      <Link to="/queue" className="nav-link">Queue</Link>
                      <Link to="/view-queue" className="nav-link">View Queue</Link>
                      <Link to="/queue-up" className="nav-link">Queue Up</Link>
                      <Link to="/appointment-page" className="nav-link">Appointment</Link>
                    </>
                  )}
                </>
              )}
            </div>
            
            {user && (
              <div className="navbar-nav">
                {user.role === 'patient' && unreadCount > 0 && (
                  <div className="nav-item">
                    <Link to={getDashboardLink()} className="nav-link position-relative">
                      Notifications
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {unreadCount}
                      </span>
                    </Link>
                  </div>
                )}
                <div className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    {user.name}
                  </a>
                  <ul className="dropdown-menu">
                    <li><span className="dropdown-item-text">Role: {user.role}</span></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
