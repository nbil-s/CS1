import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUsers, faHeart, faShieldAlt, faClock, faMapMarkerAlt, faPhone } from '@fortawesome/free-solid-svg-icons';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <Link to="/" className="back-button">
          <FontAwesomeIcon icon={faArrowLeft} /> Back to Home
        </Link>
        <h1>About Us</h1>
        <p>Providing quality healthcare with modern technology</p>
      </div>

      <div className="about-content">
        <div className="about-section">
          <div className="about-card">
            <div className="card-icon">
              <FontAwesomeIcon icon={faUsers} />
            </div>
            <h2>Our Mission</h2>
            <p>
              To provide accessible, efficient, and patient-centered healthcare services 
              through innovative queue management technology, ensuring every patient 
              receives timely and quality care.
            </p>
          </div>

          <div className="about-card">
            <div className="card-icon">
              <FontAwesomeIcon icon={faHeart} />
            </div>
            <h2>Our Vision</h2>
            <p>
              To be the leading healthcare facility that revolutionizes patient care 
              through digital innovation, creating a seamless and stress-free experience 
              for both patients and healthcare providers.
            </p>
          </div>

          <div className="about-card">
            <div className="card-icon">
              <FontAwesomeIcon icon={faShieldAlt} />
            </div>
            <h2>Our Values</h2>
            <ul>
              <li>Patient-Centered Care</li>
              <li>Innovation & Technology</li>
              <li>Professional Excellence</li>
              <li>Compassion & Empathy</li>
              <li>Safety & Quality</li>
            </ul>
          </div>
        </div>

        <div className="team-section">
          <h2>Our Healthcare Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-avatar">👨‍⚕️</div>
              <h3>Dr. John Smith</h3>
              <p>General Medicine</p>
            </div>
            <div className="team-member">
              <div className="member-avatar">👩‍⚕️</div>
              <h3>Dr. Sarah Johnson</h3>
              <p>Cardiology</p>
            </div>
            <div className="team-member">
              <div className="member-avatar">👨‍⚕️</div>
              <h3>Dr. Michael Chen</h3>
              <p>Pediatrics</p>
            </div>
            <div className="team-member">
              <div className="member-avatar">👩‍⚕️</div>
              <h3>Dr. Emily Rodriguez</h3>
              <p>Dermatology</p>
            </div>
          </div>
        </div>

        <div className="contact-section">
          <h2>Contact Information</h2>
          <div className="contact-grid">
            <div className="contact-item">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              <div>
                <h4>Address</h4>
                <p>123 Healthcare Avenue<br />Medical District, City 12345</p>
              </div>
            </div>
            <div className="contact-item">
              <FontAwesomeIcon icon={faPhone} />
              <div>
                <h4>Phone</h4>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="contact-item">
              <FontAwesomeIcon icon={faClock} />
              <div>
                <h4>Hours</h4>
                <p>Monday - Friday: 8:00 AM - 6:00 PM<br />Saturday: 9:00 AM - 2:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs; 