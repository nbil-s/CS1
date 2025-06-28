import React from 'react';
import { Link } from 'react-router-dom';
import clinicBg from '../../assets/clinic-bg.jpg';
import './Homepage.css';

function Homepage() {
  const FeatureCard = ({ icon, title, text }) => (
    <div className="feature-card">
      <i className={`bi ${icon}`}></i>
      <h5>{title}</h5>
      <p>{text}</p>
    </div>
  );

  return (
    <>
      <div className="landing">
        {/* Hero */}
        <header className="hero" style={{ backgroundImage: `url(${clinicBg})` }}>
          <div className="overlay">
            <h1>Welcome to ClinicQueue</h1>
            <p>Effortless check-ins and shorter wait times.</p>
            <Link to="/signup" className="cta-btn">Get Started</Link>
          </div>
        </header>

        {/* Features */}
        <section className="features">
          <FeatureCard
            icon="bi-phone"
            title="Online Booking"
            text="Join the queue remotely using your phone."
          />
          <FeatureCard
            icon="bi-clock"
            title="Real-Time Updates"
            text="Track your queue position live."
          />
          <FeatureCard
            icon="bi-envelope"
            title="Notifications"
            text="Get SMS or email when it's your turn."
          />
        </section>

        {/* Footer */}
        <footer className="footer">
          <p>&copy; 2025 ClinicQueue. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}

export default Homepage;
