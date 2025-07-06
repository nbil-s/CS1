import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './DoctorDashboard.css';

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      console.log('Current user:', user);
      console.log('Fetching doctor appointments for user ID:', user?.id);
      console.log('Authorization header:', api.defaults.headers.common['Authorization']);
      
      const response = await api.get('/doctor/appointments');
      console.log('Doctor appointments response:', response.data);
      setAppointments(response.data.appointments || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      console.error('Error response:', err.response?.data);
      setError('Failed to fetch appointments: ' + (err.message || 'Unknown error'));
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

  if (loading) return <div className="loading">Loading appointments...</div>;
  if (error) return <div className="error">{error}</div>;

  // Helper function to format date and time
  const formatDateTime = (date, time) => {
    if (!date) return 'N/A';
    const dateObj = new Date(date);
    const timeStr = time || '';
    return {
      date: dateObj.toLocaleDateString(),
      time: timeStr,
      fullDateTime: `${dateObj.toLocaleDateString()} ${timeStr}`
    };
  };

  // Filter appointments for today
  const today = new Date().toDateString();
  const todayAppointments = appointments.filter(apt => 
    new Date(apt.appointmentDate).toDateString() === today
  );

  return (
    <div className="doctor-dashboard">
      <div className="dashboard-header">
        <h1>Doctor Dashboard</h1>
        {user && (
          <div className="user-info">
            <p>Logged in as: {user.name} (ID: {user.id}, Role: {user.role})</p>
          </div>
        )}
        <div className="stats">
          <div className="stat-card">
            <h3>Today's Appointments</h3>
            <p>{todayAppointments.length}</p>
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
        {/* Add navigation buttons below stats */}
        <div className="dashboard-actions" style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
          <button onClick={() => navigate('/doctor/consultation')}>In Consultation</button>
          <button onClick={() => navigate('/doctor/records')}>View Records</button>
        </div>
      </div>

      <div className="appointments-section">
        <h2>Upcoming Appointments ({appointments.length} total)</h2>
        {appointments.length === 0 ? (
          <div className="no-appointments">
            <p>No appointments found. You may not have any appointments assigned to you yet.</p>
            <p>Appointments need to be assigned by a receptionist before they appear here.</p>
            <p>Current user ID: {user?.id}</p>
            <p>Make sure you're logged in as a doctor and appointments have been assigned to you.</p>
          </div>
        ) : (
          <div className="appointments-list">
            {appointments.map(appointment => {
              const dateTime = formatDateTime(appointment.appointmentDate, appointment.appointmentTime);
              return (
                <div key={appointment.id} className="appointment-card">
                  <div className="appointment-info">
                    <h3>Patient: {appointment.patient?.name || 'Unknown Patient'}</h3>
                    <p>Date: {dateTime.date}</p>
                    <p>Time: {dateTime.time}</p>
                    <p>Status: <span className={`status ${appointment.status}`}>{appointment.status}</span></p>
                    {appointment.reason && <p>Reason: {appointment.reason}</p>}
                  </div>
                  <div className="appointment-actions">
                    {appointment.status === 'pending' && (
                      <>
                        <button 
                          className="btn-accept"
                          onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
                        >
                          Accept
                        </button>
                        <button 
                          className="btn-reject"
                          onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {appointment.status === 'confirmed' && (
                      <button 
                        className="btn-complete"
                        onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 