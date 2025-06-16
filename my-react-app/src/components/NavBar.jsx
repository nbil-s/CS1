import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
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
            <Link to="/homepage" className="nav-link">Home</Link>
            <Link to="/view-queue" className="nav-link">View Queue</Link>
            <Link to="/appointment-page" className="nav-link">Appointment</Link>
            <Link to="/queue-up" className="nav-link">Queue Up</Link>
            <Link to="/my-appointments" className="nav-link">My Appointments</Link>
          </div>

          <div className="d-flex gap-2">
            <Link to="/login" className="btn btn-outline-light btn-sm">Login</Link>
            <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
