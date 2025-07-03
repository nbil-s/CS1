import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './ReceptionistDashboard.css';

export default function ReceptionistDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState('appointments'); // 'appointments' or 'queue'

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
    fetchQueue();
  }, [selectedDate]);

  const fetchAppointments = async () => {
    try {
      const response = await api.get(`/receptionist/appointments?date=${selectedDate}`);
      console.log('API Response:', response.data);
      console.log('Appointments data:', response.data.appointments);
      setAppointments(response.data.appointments || []);
      setLoading(false);
    } catch (err) {
      console.error('Fetch appointments error:', err);
      setError('Failed to fetch appointments');
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/receptionist/doctors');
      console.log('Doctors API Response:', response.data);
      console.log('Doctors data:', response.data.doctors);
      setDoctors(response.data.doctors || []);
    } catch (err) {
      console.error('Fetch doctors error:', err);
      setError('Failed to fetch doctors');
    }
  };

  const fetchQueue = async () => {
    try {
      const response = await api.get('/receptionist/queue');
      console.log('Queue API Response:', response.data);
      setQueue(response.data.queue || []);
    } catch (err) {
      console.error('Fetch queue error:', err);
      setError('Failed to fetch queue');
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

  const handleAddToQueue = async (patientId, doctorId, priority = 'normal') => {
    try {
      await api.post('/receptionist/queue/add', { patientId, doctorId, priority });
      fetchQueue();
    } catch (err) {
      setError('Failed to add patient to queue');
    }
  };

  const handleUpdateQueueStatus = async (queueId, status) => {
    try {
      await api.put(`/receptionist/queue/${queueId}/status`, { status });
      fetchQueue();
    } catch (err) {
      setError('Failed to update queue status');
    }
  };

  const handleRemoveFromQueue = async (queueId) => {
    try {
      await api.delete(`/receptionist/queue/${queueId}`);
      fetchQueue();
    } catch (err) {
      setError('Failed to remove from queue');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="receptionist-dashboard">
      <div className="dashboard-header">
        <h1>Receptionist Dashboard</h1>
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            Appointments
          </button>
          <button 
            className={`tab-button ${activeTab === 'queue' ? 'active' : ''}`}
            onClick={() => setActiveTab('queue')}
          >
            Queue Management
          </button>
        </div>
      </div>

      {activeTab === 'appointments' && (
        <>
          <div className="date-filter">
            <label htmlFor="date">Select Date:</label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div className="stats">
            <div className="stat-card">
              <h3>Total Appointments</h3>
              <p>{Array.isArray(appointments) ? appointments.length : 0}</p>
            </div>
            <div className="stat-card">
              <h3>Pending</h3>
              <p>{Array.isArray(appointments) ? appointments.filter(apt => apt.status === 'pending').length : 0}</p>
            </div>
            <div className="stat-card">
              <h3>Confirmed</h3>
              <p>{Array.isArray(appointments) ? appointments.filter(apt => apt.status === 'confirmed').length : 0}</p>
            </div>
            <div className="stat-card">
              <h3>Completed</h3>
              <p>{Array.isArray(appointments) ? appointments.filter(apt => apt.status === 'completed').length : 0}</p>
            </div>
          </div>

          <div className="appointments-section">
            <h2>Appointments for {new Date(selectedDate).toLocaleDateString()}</h2>
            <div className="appointments-list">
              {Array.isArray(appointments) && appointments.length > 0 ? (
                appointments.map(appointment => (
                  <div key={appointment.id} className="appointment-card">
                    <div className="appointment-info">
                      <h3>Patient: {appointment.patient?.name || 'Unknown'}</h3>
                      <p>Time: {appointment.appointmentTime}</p>
                      <p>Date: {new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                      <p>Status: <span className={`status ${appointment.status}`}>{appointment.status}</span></p>
                      {appointment.doctor && <p>Doctor: {appointment.doctor.name}</p>}
                      {appointment.reason && <p>Reason: {appointment.reason}</p>}
                    </div>
                    <div className="appointment-actions">
                      {appointment.status === 'pending' && (
                        <div className="assign-doctor">
                          <select
                            onChange={(e) => handleAssignDoctor(appointment.id, e.target.value)}
                            defaultValue=""
                          >
                            <option value="" disabled>Select Doctor</option>
                            {Array.isArray(doctors) && doctors.map(doctor => (
                              <option key={doctor.id} value={doctor.id}>
                                {doctor.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      {appointment.status === 'confirmed' && (
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
                ))
              ) : (
                <div className="no-appointments">
                  <p>No appointments found for this date.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === 'queue' && (
        <div className="queue-section">
          <h2>Queue Management</h2>
          
          {/* Add to Queue Form */}
          <div className="add-to-queue-form">
            <h3>Add Patient to Queue</h3>
            <div className="form-row">
              <select 
                id="patientSelect" 
                className="form-select"
                onChange={(e) => {
                  const patientId = e.target.value;
                  if (patientId) {
                    handleAddToQueue(parseInt(patientId), null, 'normal');
                    e.target.value = '';
                  }
                }}
              >
                <option value="">Select Patient to Add</option>
                <option value="1">Test Patient (patient1)</option>
              </select>
            </div>
          </div>

          <div className="queue-stats">
            <div className="stat-card">
              <h3>Total in Queue</h3>
              <p>{Array.isArray(queue) ? queue.length : 0}</p>
            </div>
            <div className="stat-card">
              <h3>Waiting</h3>
              <p>{Array.isArray(queue) ? queue.filter(q => q.status === 'waiting').length : 0}</p>
            </div>
            <div className="stat-card">
              <h3>Called</h3>
              <p>{Array.isArray(queue) ? queue.filter(q => q.status === 'called').length : 0}</p>
            </div>
          </div>

          <div className="queue-list">
            <h3>Current Queue</h3>
            {Array.isArray(queue) && queue.length > 0 ? (
              queue.map(queueItem => (
                <div key={queueItem.id} className="queue-item">
                  <div className="queue-info">
                    <h4>#{queueItem.queueNumber} - {queueItem.patient?.name}</h4>
                    <p>Status: <span className={`status ${queueItem.status}`}>{queueItem.status}</span></p>
                    {queueItem.doctor && <p>Doctor: {queueItem.doctor.name}</p>}
                    {queueItem.priority !== 'normal' && <p>Priority: {queueItem.priority}</p>}
                  </div>
                  <div className="queue-actions">
                    <select
                      value={queueItem.status}
                      onChange={(e) => handleUpdateQueueStatus(queueItem.id, e.target.value)}
                    >
                      <option value="waiting">Waiting</option>
                      <option value="called">Called</option>
                      <option value="in-consultation">In Consultation</option>
                      <option value="completed">Completed</option>
                    </select>
                    <button 
                      className="btn-remove"
                      onClick={() => handleRemoveFromQueue(queueItem.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No patients in queue</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 