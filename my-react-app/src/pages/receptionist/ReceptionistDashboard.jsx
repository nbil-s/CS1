import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './ReceptionistDashboard.css';

export default function ReceptionistDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, [selectedDate]);

  const fetchAppointments = async () => {
    try {
      const response = await api.get(`/receptionist/appointments?date=${selectedDate}`);
      setAppointments(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch appointments');
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/receptionist/doctors');
      setDoctors(response.data);
    } catch (err) {
      setError('Failed to fetch doctors');
    }
  };

  const handleAssignDoctor = async (appointmentId, doctorId) => {
    try {
      await api.put(`/receptionist/appointments/${appointmentId}/assign`, { doctorId });
      fetchAppointments();
    } catch (err) {
      setError('Failed to assign doctor');
    }
  };

  const handleStatusUpdate = async (appointmentId, status) => {
    try {
      await api.put(`/receptionist/appointments/${appointmentId}`, { status });
      fetchAppointments();
    } catch (err) {
      setError('Failed to update appointment status');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="receptionist-dashboard">
      <div className="dashboard-header">
        <h1>Receptionist Dashboard</h1>
        <div className="date-filter">
          <label htmlFor="date">Select Date:</label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      <div className="stats">
        <div className="stat-card">
          <h3>Total Appointments</h3>
          <p>{appointments.length}</p>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <p>{appointments.filter(apt => apt.status === 'pending').length}</p>
        </div>
        <div className="stat-card">
          <h3>Assigned</h3>
          <p>{appointments.filter(apt => apt.status === 'assigned').length}</p>
        </div>
      </div>

      <div className="appointments-section">
        <h2>Appointments for {new Date(selectedDate).toLocaleDateString()}</h2>
        <div className="appointments-list">
          {appointments.map(appointment => (
            <div key={appointment.id} className="appointment-card">
              <div className="appointment-info">
                <h3>Patient: {appointment.patientName}</h3>
                <p>Time: {new Date(appointment.datetime).toLocaleTimeString()}</p>
                <p>Status: <span className={`status ${appointment.status}`}>{appointment.status}</span></p>
                {appointment.doctorName && <p>Doctor: {appointment.doctorName}</p>}
              </div>
              <div className="appointment-actions">
                {appointment.status === 'pending' && (
                  <div className="assign-doctor">
                    <select
                      onChange={(e) => handleAssignDoctor(appointment.id, e.target.value)}
                      defaultValue=""
                    >
                      <option value="" disabled>Select Doctor</option>
                      {doctors.map(doctor => (
                        <option key={doctor.id} value={doctor.id}>
                          Dr. {doctor.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {appointment.status === 'assigned' && (
                  <button 
                    className="btn-complete"
                    onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                  >
                    Mark Complete
                  </button>
                )}
                {appointment.status === 'pending' && (
                  <button 
                    className="btn-cancel"
                    onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                  >
                    Cancel
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