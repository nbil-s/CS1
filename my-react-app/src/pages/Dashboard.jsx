import React from 'react';
import { useNavigate } from 'react-router-dom';
import PatientDashboard from './dashboards/PatientDashboard';
import DoctorDashboard from './dashboards/DoctorDashboard';
import ReceptionistDashboard from './dashboards/ReceptionistDashboard';
import AdminDashboard from './dashboards/AdminDashboard';
import './Dashboard.css';

export default function Dashboard() {
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  if (!role) {
    navigate('/login');
    return null;
  }

  switch (role) {
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
