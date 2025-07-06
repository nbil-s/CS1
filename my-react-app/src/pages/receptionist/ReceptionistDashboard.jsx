import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import './ReceptionistDashboard.css';

export default function ReceptionistDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [queue, setQueue] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('appointments');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [testResult, setTestResult] = useState('');

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
    fetchQueue();
    setLoading(false);
  }, [selectedDate]);

  const testApiConnection = async () => {
    try {
      console.log('Testing API connection...');
      const response = await api.get('/test');
      console.log('Test response:', response.data);
      setTestResult('API connection successful: ' + JSON.stringify(response.data));
      setError(null);
    } catch (err) {
      console.error('API test failed:', err);
      setTestResult('API test failed: ' + (err.response?.data?.message || err.message));
      setError('API connection test failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await api.get(`/receptionist/appointments?date=${selectedDate}`);
      console.log('Appointments response:', response.data);
      setAppointments(response.data.appointments || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to fetch appointments: ' + (err.response?.data?.message || err.message));
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/receptionist/doctors');
      console.log('Doctors response:', response.data);
      setDoctors(response.data.doctors || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Failed to fetch doctors: ' + (err.response?.data?.message || err.message));
    }
  };

  const fetchQueue = async () => {
    try {
      const response = await api.get('/receptionist/queue');
      console.log('Queue response:', response.data);
      setQueue(response.data.queue || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching queue:', err);
      setError('Failed to fetch queue: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleStatusUpdate = async (appointmentId, status) => {
    try {
      console.log('Updating appointment status:', appointmentId, status);
      await api.put(`/receptionist/appointments/${appointmentId}`, { status });
      await fetchAppointments();
      setError(null);
    } catch (err) {
      console.error('Error updating appointment status:', err);
      setError('Failed to update appointment status: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleAddToQueue = async (e) => {
    e.preventDefault();
    if (!selectedPatient) {
      setError('Please select a patient');
      return;
    }

    try {
      console.log('Adding patient to queue:', selectedPatient);
      await api.post('/receptionist/queue/add', { patientId: selectedPatient });
      setSelectedPatient('');
      await fetchQueue();
      setError(null);
    } catch (err) {
      console.error('Error adding to queue:', err);
      setError('Failed to add patient to queue: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleUpdateQueueStatus = async (queueId, status) => {
    try {
      console.log('Updating queue status:', queueId, status);
      await api.put(`/receptionist/queue/${queueId}/status`, { status });
      await fetchQueue();
      setError(null);
    } catch (err) {
      console.error('Error updating queue status:', err);
      setError('Failed to update queue status: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="receptionist-dashboard">
      <h1>Receptionist Dashboard</h1>
      <p>Welcome, {user?.name || user?.email}</p>

      {error && <div className="error-message">{error}</div>}
      {testResult && <div className="test-result">{testResult}</div>}

      <div className="debug-section">
        <button onClick={testApiConnection} className="test-button">
          Test API Connection
        </button>
        <p>User Role: {user?.role || 'Unknown'}</p>
        <p>Token: {localStorage.getItem('token') ? 'Present' : 'Missing'}</p>
      </div>

      <div className="tab-navigation">
        <button 
          className={activeTab === 'appointments' ? 'active' : ''} 
          onClick={() => setActiveTab('appointments')}
        >
          Appointments
        </button>
        <button 
          className={activeTab === 'queue' ? 'active' : ''} 
          onClick={() => setActiveTab('queue')}
        >
          Queue Management
        </button>
        <button 
          className={activeTab === 'doctors' ? 'active' : ''} 
          onClick={() => setActiveTab('doctors')}
        >
          Doctors
        </button>
      </div>

      {activeTab === 'appointments' && (
        <div className="appointments-section">
          <h2>Appointments</h2>
          
          <div className="date-filter">
            <label>Select Date:</label>
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div className="appointments-list">
            {appointments.length === 0 ? (
              <p>No appointments for this date</p>
            ) : (
              appointments.map(appointment => (
                <div key={appointment.id} className="appointment-card">
                  <div className="appointment-info">
                    <h3>{appointment.patient?.name || 'Unknown Patient'}</h3>
                    <p><strong>Doctor:</strong> {appointment.doctor?.name || 'Not assigned'}</p>
                    <p><strong>Date:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {appointment.appointmentTime}</p>
                    <p><strong>Status:</strong> {appointment.status}</p>
                    <p><strong>Reason:</strong> {appointment.reason}</p>
                  </div>
                  <div className="appointment-actions">
                    <button 
                      onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
                      className={appointment.status === 'confirmed' ? 'active' : ''}
                      disabled={appointment.status === 'confirmed'}
                    >
                      Confirm
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                      className={appointment.status === 'cancelled' ? 'active' : ''}
                      disabled={appointment.status === 'cancelled'}
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                      className={appointment.status === 'completed' ? 'active' : ''}
                      disabled={appointment.status === 'completed'}
                    >
                      Complete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'queue' && (
        <div className="queue-section">
          <h2>Queue Management</h2>

          {/* Current Queue Status */}
          <div className="queue-status-info">
            <h3>Current Queue Status</h3>
            <p>People waiting: {Array.isArray(queue) ? queue.filter(q => q.status === 'waiting').length : 0}</p>
          </div>

          {/* Available Clinicians */}
          <div className="available-clinicians-info">
            <h3>Available Clinicians</h3>
            <ul>
              {doctors && doctors.length > 0 ? (
                doctors
                  .filter(doc => !queue.some(q => q.doctorId === doc.id && (q.status === 'in-consultation' || q.status === 'called')))
                  .map(doc => (
                    <li key={doc.id}>{doc.name}</li>
                  ))
              ) : (
                <li>No clinicians available</li>
              )}
            </ul>
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
            <div className="stat-card">
              <h3>In Consultation</h3>
              <p>{Array.isArray(queue) ? queue.filter(q => q.status === 'in-consultation').length : 0}</p>
            </div>
          </div>

          <div className="add-to-queue-form">
            <h3>Add Patient to Queue</h3>
            <form onSubmit={handleAddToQueue}>
              <div className="form-row">
                <select 
                  value={selectedPatient} 
                  onChange={(e) => setSelectedPatient(e.target.value)}
                  className="form-select"
                  required
                >
                  <option value="">Select a patient</option>
                  {appointments
                    .filter(apt => apt.status === 'confirmed' && apt.patient)
                    .map(appointment => (
                      <option key={appointment.id} value={appointment.patient.id}>
                        {appointment.patient.name} - {appointment.doctor?.name || 'No doctor assigned'}
                      </option>
                    ))
                  }
                </select>
                <button type="submit" className="btn-primary">Add to Queue</button>
              </div>
            </form>
          </div>

          <div className="queue-list">
            <h3>Current Queue</h3>
            {Array.isArray(queue) && queue.length > 0 ? (
              <div className="queue-items">
                {queue.map((item, index) => (
                  <div key={item.id} className="queue-item">
                    <div className="queue-number">{item.queueNumber || index + 1}</div>
                    <div className="queue-info">
                      <h4>{item.patient?.name || 'Unknown Patient'}</h4>
                      <p>Doctor: {item.doctor?.name || 'Not assigned'}</p>
                      <p>Status: {item.status}</p>
                      <p>Added by: {item.receptionist?.name || 'N/A'}</p>
                      {item.estimatedWaitTime && (
                        <p>Estimated wait: {item.estimatedWaitTime} minutes</p>
                      )}
                    </div>
                    <div className="queue-actions">
                      <button 
                        onClick={() => handleUpdateQueueStatus(item.id, 'called')}
                        className={item.status === 'called' ? 'active' : ''}
                        disabled={item.status === 'called' || item.status === 'in-consultation' || item.status === 'completed'}
                      >
                        Call Patient
                      </button>
                      <button 
                        onClick={() => handleUpdateQueueStatus(item.id, 'in-consultation')}
                        className={item.status === 'in-consultation' ? 'active' : ''}
                        disabled={item.status === 'in-consultation' || item.status === 'completed'}
                      >
                        Start Consultation
                      </button>
                      <button 
                        onClick={() => handleUpdateQueueStatus(item.id, 'completed')}
                        className={item.status === 'completed' ? 'active' : ''}
                        disabled={item.status === 'completed'}
                      >
                        Complete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No patients in queue</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'doctors' && (
        <div className="doctors-section">
          <h2>Available Doctors</h2>
          <div className="doctors-list">
            {doctors.length > 0 ? (
              doctors.map(doctor => (
                <div key={doctor.id} className="doctor-card">
                  <h3>{doctor.name}</h3>
                  <p><strong>Email:</strong> {doctor.email}</p>
                  <p><strong>Status:</strong> Available</p>
                </div>
              ))
            ) : (
              <p>No doctors available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 