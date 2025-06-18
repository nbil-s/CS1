import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './DoctorDashboard.css';

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/doctor/appointments');
      setAppointments(response.data.appointments || response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch appointments');
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, status) => {
    try {
      await api.put(`/doctor/appointments/${appointmentId}`, { status });
      fetchAppointments();
    } catch (err) {
      setError('Failed to update appointment status');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="doctor-dashboard">
      <div className="dashboard-header">
        <h1>Doctor Dashboard</h1>
        <div className="stats">
          <div className="stat-card">
            <h3>Today's Appointments</h3>
            <p>{appointments.filter(apt => new Date(apt.datetime).toDateString() === new Date().toDateString()).length}</p>
          </div>
          <div className="stat-card">
            <h3>Pending</h3>
            <p>{appointments.filter(apt => apt.status === 'pending').length}</p>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <p>{appointments.filter(apt => apt.status === 'completed').length}</p>
          </div>
        </div>
      </div>

      <div className="appointments-section">
        <h2>Upcoming Appointments</h2>
        <div className="appointments-list">
          {appointments.map(appointment => (
            <div key={appointment.id} className="appointment-card">
              <div className="appointment-info">
                <h3>Patient: {appointment.patientName}</h3>
                <p>Date: {new Date(appointment.datetime).toLocaleDateString()}</p>
                <p>Time: {new Date(appointment.datetime).toLocaleTimeString()}</p>
                <p>Status: <span className={`status ${appointment.status}`}>{appointment.status}</span></p>
              </div>
              <div className="appointment-actions">
                {appointment.status === 'pending' && (
                  <>
                    <button 
                      className="btn-accept"
                      onClick={() => handleStatusUpdate(appointment.id, 'accepted')}
                    >
                      Accept
                    </button>
                    <button 
                      className="btn-reject"
                      onClick={() => handleStatusUpdate(appointment.id, 'rejected')}
                    >
                      Reject
                    </button>
                  </>
                )}
                {appointment.status === 'accepted' && (
                  <button 
                    className="btn-complete"
                    onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                  >
                    Mark Complete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 