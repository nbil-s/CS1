import React from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMd, faUserNurse, faUser, faCalendarAlt, faClipboardList, faFileMedical, faPills, faEye, faPlus, faHome, faInfoCircle, faCogs, faSignOutAlt, faHeartbeat, faHospital, faStethoscope, faClock, faCheckCircle, faShieldAlt, faMobileAlt, faChartLine, faUsers, faTooth, faSyringe } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';

const Homepage = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
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
    <div className="homepage">
      {/* Homepage Navigation Bar */}
      <nav className="homepage-navbar">
        <div className="homepage-nav-container">
          <div className="homepage-nav-logo">
            <FontAwesomeIcon icon={faHome} className="logo-icon" />
            <span>Clinic Queue</span>
          </div>
          <div className="homepage-nav-links">
            <Link to="/about" className="nav-link">
              <FontAwesomeIcon icon={faInfoCircle} />
              About Us
            </Link>
            <Link to="/services" className="nav-link">
              <FontAwesomeIcon icon={faCogs} />
              Services
            </Link>
            {user ? null : null}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to Clinic Queue Management System
          </h1>
          <p className="hero-subtitle">
            Streamline your healthcare experience with our modern queue management solution
          </p>
          {!user && (
            <div className="hero-actions">
              <Link to="/login" className="cta-button primary">
                Get Started
              </Link>
              <Link to="/signup" className="cta-button secondary">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="services-preview">
        <h2>Our Features</h2>
        <div className="services-grid">
          <div className="service-card">
            <FontAwesomeIcon icon={faCalendarAlt} className="service-icon" />
            <h3>Appointment Booking</h3>
            <p>Schedule appointments with ease and receive timely reminders</p>
          </div>
          <div className="service-card">
            <FontAwesomeIcon icon={faClipboardList} className="service-icon" />
            <h3>Queue Management</h3>
            <p>Join virtual queues and track your position in real-time</p>
          </div>
          <div className="service-card">
            <FontAwesomeIcon icon={faFileMedical} className="service-icon" />
            <h3>Medical Records</h3>
            <p>Access your medical history and records securely</p>
          </div>
          <div className="service-card">
            <FontAwesomeIcon icon={faPills} className="service-icon" />
            <h3>Prescriptions</h3>
            <p>View and manage your prescriptions digitally</p>
          </div>
        </div>
      </section>

      {/* Specialized Clinics Section */}
      <section className="specialized-clinics-section">
        <h2>Specialized Clinics</h2>
        <div className="specialized-clinics-grid">
          <div className="clinic-card">
            <FontAwesomeIcon icon={faStethoscope} className="clinic-icon" />
            <h3>General Medicine</h3>
          </div>
          <div className="clinic-card">
            <FontAwesomeIcon icon={faHeartbeat} className="clinic-icon" />
            <h3>Cardiology</h3>
          </div>
          <div className="clinic-card">
            <FontAwesomeIcon icon={faUserMd} className="clinic-icon" />
            <h3>Pediatrics</h3>
          </div>
          <div className="clinic-card">
            <FontAwesomeIcon icon={faHospital} className="clinic-icon" />
            <h3>Dermatology</h3>
          </div>
          <div className="clinic-card">
            <FontAwesomeIcon icon={faTooth} className="clinic-icon" />
            <h3>Dental</h3>
          </div>
          <div className="clinic-card">
            <FontAwesomeIcon icon={faSyringe} className="clinic-icon" />
            <h3>Vaccination</h3>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="homepage-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Clinic Queue</h3>
            <p>Transforming healthcare management with technology</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <Link to="/about">About Us</Link>
            <Link to="/services">Services</Link>
            <Link to="/login">Login</Link>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>Email: info@clinicqueue.com</p>
            <p>Phone: +254 713 456 7890</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Clinic Queue. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;

