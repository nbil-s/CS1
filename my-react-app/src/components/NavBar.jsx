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
    <nav className="navbar navbar-expand-lg navbar-dark bg-transparent fixed-top shadow-sm">
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold">ClinicQueue</Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
          data-bs-target="#navbarNav" aria-controls="navbarNav"
          aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
          <div className="navbar-nav">
            <Link to="/" className="nav-link">Home</Link>
            {isAuthenticated && (
              <>
                <Link to="/view-queue" className="nav-link">View Queue</Link>
                <Link to="/appointment-page" className="nav-link">Appointment</Link>
                <Link to="/queue-up" className="nav-link">Queue Up</Link>
                <Link to="/my-details" className="nav-link">My Details</Link>
              </>
            )}
          </div>

          <div className="d-flex gap-2">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="btn btn-outline-light btn-sm">Login</Link>
                <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
              </>
            ) : (
              <button onClick={handleLogout} className="btn btn-danger btn-sm">Logout</button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
