import React from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css';

const Homepage = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="container">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-6">
              <div className="hero-content">
                <h1 className="hero-title">
                  Advanced Healthcare
                  <span className="highlight">Management System</span>
                </h1>
                <p className="hero-subtitle">
                  Streamlined patient care, efficient appointment scheduling, and comprehensive medical records management. 
                  Experience healthcare reimagined for the digital age.
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
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-visual">
                <div className="medical-icons">
                  <div className="icon-card">
                    <i className="bx bx-heart-pulse"></i>
                  </div>
                  <div className="icon-card">
                    <i className="bx bx-calendar-check"></i>
                  </div>
                  <div className="icon-card">
                    <i className="bx bx-user-voice"></i>
                  </div>
                  <div className="icon-card">
                    <i className="bx bx-shield-check"></i>
                  </div>
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
            <h2 className="section-title">Comprehensive Healthcare Solutions</h2>
            <p className="section-subtitle">Everything you need for modern healthcare management</p>
          </div>
          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="bx bx-calendar-check"></i>
                </div>
                <h3>Smart Appointment Booking</h3>
                <p>Book appointments instantly with our intelligent scheduling system. Real-time availability and instant confirmations.</p>
                <div className="feature-stats">
                  <span>24/7 Booking</span>
                  <span>Instant Confirmation</span>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="bx bx-user-voice"></i>
                </div>
                <h3>Digital Patient Portal</h3>
                <p>Access your medical records, prescriptions, and test results anytime, anywhere with our secure patient portal.</p>
                <div className="feature-stats">
                  <span>Secure Access</span>
                  <span>Real-time Updates</span>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="bx bx-clipboard"></i>
                </div>
                <h3>Queue Management</h3>
                <p>Efficient queue system with real-time updates. Know your position and estimated wait times instantly.</p>
                <div className="feature-stats">
                  <span>Real-time Updates</span>
                  <span>Smart Notifications</span>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="bx bx-heart-pulse"></i>
                </div>
                <h3>Health Monitoring</h3>
                <p>Track your health metrics and receive personalized health insights from our advanced monitoring system.</p>
                <div className="feature-stats">
                  <span>24/7 Monitoring</span>
                  <span>AI Insights</span>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="bx bx-message-square-dots"></i>
                </div>
                <h3>Instant Notifications</h3>
                <p>Stay informed with real-time notifications about appointments, test results, and important health updates.</p>
                <div className="feature-stats">
                  <span>Real-time Alerts</span>
                  <span>Multi-channel</span>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="bx bx-shield-check"></i>
                </div>
                <h3>Secure & Compliant</h3>
                <p>Your health data is protected with enterprise-grade security and full HIPAA compliance standards.</p>
                <div className="feature-stats">
                  <span>HIPAA Compliant</span>
                  <span>End-to-end Encryption</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="container">
          <div className="row text-center">
            <div className="col-lg-3 col-md-6">
              <div className="stat-item">
                <div className="stat-number">10,000+</div>
                <div className="stat-label">Patients Served</div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="stat-item">
                <div className="stat-number">50+</div>
                <div className="stat-label">Expert Doctors</div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="stat-item">
                <div className="stat-number">99.9%</div>
                <div className="stat-label">Uptime</div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Support</div>
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
              <h2 className="cta-title">Ready to Transform Your Healthcare Experience?</h2>
              <p className="cta-subtitle">
                Join thousands of patients who have already experienced the future of healthcare management.
              </p>
              <div className="cta-buttons">
                <Link to="/signup" className="btn btn-primary btn-lg">
                  <i className="bx bx-rocket me-2"></i>
                  Start Your Journey
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

