import React from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css';

const Homepage = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="display-4 fw-bold">Welcome to Our Hospital</h1>
              <p className="lead">Providing quality healthcare services with compassion and excellence.</p>
              <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                <Link to="/login" className="btn btn-light btn-lg px-4 me-md-2">Login</Link>
                <Link to="/signup" className="btn btn-outline-light btn-lg px-4">Sign Up</Link>
              </div>
            </div>
            <div className="col-md-6">
              <img src="https://img.freepik.com/free-vector/hospital-building_1308-26662.jpg" 
                   alt="Hospital" 
                   className="img-fluid rounded shadow-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="container">
          <h2 className="text-center mb-5" style={{ color: '#3E2723' }}>Our Services</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body text-center">
                  <i className="bx bx-calendar-check display-4 mb-3"></i>
                  <h3 className="card-title" style={{ color: '#3E2723' }}>Easy Appointments</h3>
                  <p className="card-text" style={{ color: '#666' }}>Book your appointments online with our user-friendly system.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body text-center">
                  <i className="bx bx-user-voice display-4 mb-3"></i>
                  <h3 className="card-title" style={{ color: '#3E2723' }}>Virtual Consultations</h3>
                  <p className="card-text" style={{ color: '#666' }}>Connect with our doctors remotely for medical advice.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body text-center">
                  <i className="bx bx-clipboard display-4 mb-3"></i>
                  <h3 className="card-title" style={{ color: '#3E2723' }}>Digital Records</h3>
                  <p className="card-text" style={{ color: '#666' }}>Access your medical history and test results online.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="why-us-section">
        <div className="container">
          <h2 className="text-center mb-5" style={{ color: '#3E2723' }}>Why Choose Us</h2>
          <div className="row g-4">
            <div className="col-md-3">
              <div className="text-center">
                <i className="bx bx-check-circle display-4 mb-3"></i>
                <h4>Quality Care</h4>
                <p>Experienced medical professionals</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="text-center">
                <i className="bx bx-time display-4 mb-3"></i>
                <h4>24/7 Service</h4>
                <p>Round-the-clock medical assistance</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="text-center">
                <i className="bx bx-heart display-4 mb-3"></i>
                <h4>Patient First</h4>
                <p>Personalized care approach</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="text-center">
                <i className="bx bx-shield display-4 mb-3"></i>
                <h4>Modern Facility</h4>
                <p>State-of-the-art equipment</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="cta-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
              <h2 className="mb-4">Ready to Get Started?</h2>
              <p className="lead mb-4">Join our healthcare community today and experience the best medical care.</p>
              <Link to="/signup" className="btn btn-primary btn-lg px-5">Get Started Now</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
