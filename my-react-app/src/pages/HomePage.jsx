import React from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css';

const Homepage = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section hero-bg-image">
        <div className="container">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-12">
              <div className="hero-content text-center">
                <h1 className="hero-title">
                  Welcome to <span className="highlight">SmartCare</span>
                </h1>
                <p className="hero-subtitle">
                  Modern, digital-first hospital management for patients, doctors, and staff. Book appointments, manage queues, and access your health records—all in one place.
                </p>
                <div className="hero-buttons">
                  <Link to="/login" className="btn btn-primary btn-lg">
                    <i className="bx bx-log-in me-2"></i>
                    Login
                  </Link>
                  <Link to="/signup" className="btn btn-outline-light btn-lg">
                    <i className="bx bx-user-plus me-2"></i>
                    Get Started
                  </Link>
                </div>
                {/* Colorful Medical Icons Row */}
                <div className="hero-icons-row mt-5">
                  <span className="icon medical-icon medical-blue"><i className="bx bx-heart"></i></span>
                  <span className="icon medical-icon medical-green"><i className="bx bx-calendar"></i></span>
                  <span className="icon medical-icon medical-purple"><i className="bx bx-user"></i></span>
                  <span className="icon medical-icon medical-orange"><i className="bx bx-shield"></i></span>
                  <span className="icon medical-icon medical-pink"><i className="bx bx-clipboard"></i></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">All-in-One Healthcare Platform</h2>
            <p className="section-subtitle">Everything you need for modern hospital management</p>
          </div>
          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="feature-card">
                <div className="feature-icon medical-blue">
                  <i className="bx bx-calendar"></i>
                </div>
                <h3>Book Appointments</h3>
                <p>Schedule visits with your doctor in seconds. Real-time availability and instant confirmation.</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="feature-card">
                <div className="feature-icon medical-green">
                  <i className="bx bx-user"></i>
                </div>
                <h3>Virtual Consultations</h3>
                <p>Connect with healthcare professionals from the comfort of your home.</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="feature-card">
                <div className="feature-icon medical-purple">
                  <i className="bx bx-clipboard"></i>
                </div>
                <h3>Digital Records</h3>
                <p>Access your medical history, prescriptions, and test results securely online.</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="feature-card">
                <div className="feature-icon medical-orange">
                  <i className="bx bx-shield"></i>
                </div>
                <h3>Queue Management</h3>
                <p>Know your position and estimated wait time. Get notified when it's your turn.</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="feature-card">
                <div className="feature-icon medical-pink">
                  <i className="bx bx-heart"></i>
                </div>
                <h3>Health Monitoring</h3>
                <p>Track your health metrics and receive personalized insights.</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="feature-card">
                <div className="feature-icon medical-yellow">
                  <i className="bx bx-message"></i>
                </div>
                <h3>Instant Notifications</h3>
                <p>Stay updated with real-time alerts about appointments and results.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="cta-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h2 className="cta-title">Ready to Experience Modern Healthcare?</h2>
              <p className="cta-subtitle">
                Join SmartCare today and take control of your health journey.
              </p>
              <div className="cta-buttons">
                <Link to="/signup" className="btn btn-primary btn-lg">
                  <i className="bx bx-rocket me-2"></i>
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-outline-primary btn-lg">
                  <i className="bx bx-log-in me-2"></i>
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;

