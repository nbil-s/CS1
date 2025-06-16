import React from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMd, faUserNurse, faUser, faCalendarAlt, faClipboardList, faFileMedical, faPills, faEye, faPlus } from '@fortawesome/free-solid-svg-icons';

const Homepage = () => {
  return (
    <div className="homepage">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Clinic Queue Management System</h1>
          <p>Streamline your healthcare experience with our modern queue management solution</p>
          <div className="hero-buttons">
            <Link to="/login" className="btn btn-primary">Get Started</Link>
            <Link to="/signup" className="btn btn-secondary">Sign Up</Link>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2>Our Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <FontAwesomeIcon icon={faCalendarAlt} className="feature-icon" />
            <h3>Appointment Booking</h3>
            <p>Schedule appointments with ease and receive timely reminders</p>
          </div>
          
          <div className="feature-card">
            <FontAwesomeIcon icon={faClipboardList} className="feature-icon" />
            <h3>Queue Management</h3>
            <p>Join virtual queues and track your position in real-time</p>
          </div>
          
          <div className="feature-card">
            <FontAwesomeIcon icon={faFileMedical} className="feature-icon" />
            <h3>Medical Records</h3>
            <p>Access your medical history and records securely</p>
          </div>
          
          <div className="feature-card">
            <FontAwesomeIcon icon={faPills} className="feature-icon" />
            <h3>Prescriptions</h3>
            <p>View and manage your prescriptions digitally</p>
          </div>
        </div>
      </div>

      <div className="roles-section">
        <h2>For Different Users</h2>
        <div className="roles-grid">
          <div className="role-card">
            <FontAwesomeIcon icon={faUser} className="role-icon" />
            <h3>Patients</h3>
            <ul>
              <li>Book appointments online</li>
              <li>Join virtual queues</li>
              <li>View medical records</li>
              <li>Access prescriptions</li>
            </ul>
            <Link to="/signup" className="role-btn">Join as Patient</Link>
          </div>
          
          <div className="role-card">
            <FontAwesomeIcon icon={faUserMd} className="role-icon" />
            <h3>Doctors</h3>
            <ul>
              <li>View patient queue</li>
              <li>Manage appointments</li>
              <li>Update medical records</li>
              <li>Issue prescriptions</li>
            </ul>
            <Link to="/signup" className="role-btn">Join as Doctor</Link>
          </div>
          
          <div className="role-card">
            <FontAwesomeIcon icon={faUserNurse} className="role-icon" />
            <h3>Receptionists</h3>
            <ul>
              <li>Manage queue flow</li>
              <li>Handle patient registration</li>
              <li>Coordinate appointments</li>
              <li>Provide support</li>
            </ul>
            <Link to="/signup" className="role-btn">Join as Receptionist</Link>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <h2>Ready to Get Started?</h2>
        <p>Join thousands of users who trust our platform for their healthcare needs</p>
        <Link to="/signup" className="btn btn-primary">Create Account</Link>
      </div>
    </div>
  );
};

export default Homepage;

