import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './NavBar.css';

const NavBar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">ClinicQueue</Link>
        <nav className="navbar-links">
          <Link to="/">Home</Link>
          {isAuthenticated && (
            <>
              <Link to="/view-queue">View Queue</Link>
              <Link to="/appointment-page">Appointment</Link>
              <Link to="/queue-up">Queue Up</Link>
              <Link to="/my-details">My Details</Link>
            </>
          )}
        </nav>
        <div className="navbar-auth">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="btn-outline">Login</Link>
              <Link to="/signup" className="btn-primary">Sign Up</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="btn-danger">Logout</button>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
