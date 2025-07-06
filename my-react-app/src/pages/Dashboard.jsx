import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PatientDashboard from './dashboards/PatientDashboard';
import DoctorDashboard from './dashboards/DoctorDashboard';
import ReceptionistDashboard from './dashboards/ReceptionistDashboard';
import AdminDashboard from './dashboards/AdminDashboard';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  // const navigate = useNavigate();

  if (!user) {
    return (
      <div className="dashboard-container" style={{ textAlign: 'center', paddingTop: '6rem' }}>
        <div className="dashboard-header">
          <h1>Welcome to Clinic Queue Dashboard</h1>
          <p>Please log in or get started to access your dashboard features.</p>
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
            <Link to="/login" className="cta-button primary">Login</Link>
            <Link to="/signup" className="cta-button secondary">Get Started</Link>
          </div>
        </div>
      </div>
    );
  }

  switch (user.role) {
    case 'patient':
      return <PatientDashboard />;
    case 'doctor':
      return <DoctorDashboard />;
    case 'receptionist':
      return <ReceptionistDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return (
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h1>Error</h1>
            <p>Unknown user role. Please contact support.</p>
          </div>
        </div>
      );
  }
}
