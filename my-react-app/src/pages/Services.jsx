import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUserMd, faHeartbeat, faBaby, faAllergies, faXRay, faPills, faSyringe, faStethoscope, faClock, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import './Services.css';

const Services = () => {
  const services = [
    {
      icon: faUserMd,
      title: 'General Medicine',
      description: 'Comprehensive primary care services for adults including health check-ups, diagnosis, and treatment of common illnesses.',
      doctor: 'Dr. John Smith',
      duration: '30-45 minutes'
    },
    {
      icon: faHeartbeat,
      title: 'Cardiology',
      description: 'Specialized heart care including cardiovascular assessments, heart disease prevention, and cardiac monitoring.',
      doctor: 'Dr. Sarah Johnson',
      duration: '45-60 minutes'
    },
    {
      icon: faBaby,
      title: 'Pediatrics',
      description: 'Comprehensive healthcare for children from birth to adolescence, including vaccinations and developmental monitoring.',
      doctor: 'Dr. Michael Chen',
      duration: '30-45 minutes'
    },
    {
      icon: faAllergies,
      title: 'Dermatology',
      description: 'Skin care services including treatment for skin conditions, allergies, and cosmetic dermatology procedures.',
      doctor: 'Dr. Emily Rodriguez',
      duration: '20-30 minutes'
    }
  ];

  const features = [
    {
      icon: faClock,
      title: 'Digital Queue System',
      description: 'Skip the waiting room with our innovative digital queue management system.'
    },
    {
      icon: faCheckCircle,
      title: 'Online Appointments',
      description: 'Book appointments online at your convenience, 24/7.'
    },
    {
      icon: faStethoscope,
      title: 'Expert Care',
      description: 'Experienced healthcare professionals dedicated to your well-being.'
    },
    {
      icon: faPills,
      title: 'Prescription Services',
      description: 'Convenient prescription management and refill services.'
    }
  ];

  return (
    <div className="services-container">
      <div className="services-header">
        <Link to="/" className="back-button">
          <FontAwesomeIcon icon={faArrowLeft} /> Back to Home
        </Link>
        <h1>Our Services</h1>
        <p>Comprehensive healthcare services with modern technology</p>
      </div>

      <div className="services-content">
        <div className="services-section">
          <h2>Medical Specialties</h2>
          <div className="services-grid">
            {services.map((service, index) => (
              <div key={index} className="service-card">
                <div className="service-icon">
                  <FontAwesomeIcon icon={service.icon} />
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <div className="service-details">
                  <div className="detail-item">
                    <strong>Doctor:</strong> {service.doctor}
                  </div>
                  <div className="detail-item">
                    <strong>Duration:</strong> {service.duration}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="features-section">
          <h2>Why Choose Us</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  <FontAwesomeIcon icon={feature.icon} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="appointment-section">
          <div className="appointment-card">
            <h2>Ready to Get Started?</h2>
            <p>Book your appointment today and experience our modern healthcare services.</p>
            <div className="appointment-buttons">
              <Link to="/login" className="btn-primary">
                Login to Book
              </Link>
              <Link to="/signup" className="btn-secondary">
                Create Account
              </Link>
            </div>
          </div>
        </div>

        <div className="info-section">
          <div className="info-card">
            <h3>Operating Hours</h3>
            <div className="hours-list">
              <div className="hour-item">
                <span>Monday - Friday:</span>
                <span>8:00 AM - 6:00 PM</span>
              </div>
              <div className="hour-item">
                <span>Saturday:</span>
                <span>9:00 AM - 2:00 PM</span>
              </div>
              <div className="hour-item">
                <span>Sunday:</span>
                <span>Closed</span>
              </div>
            </div>
          </div>

          <div className="info-card">
            <h3>Emergency Contact</h3>
            <p>For medical emergencies, please call:</p>
            <div className="emergency-contact">
              <strong>911</strong>
            </div>
            <p>For non-emergency inquiries:</p>
            <div className="contact-info">
              <strong>+1 (555) 123-4567</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services; 