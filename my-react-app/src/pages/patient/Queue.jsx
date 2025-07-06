import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './Queue.css';

export default function Queue() {
  const [queueData, setQueueData] = useState({
    inQueue: false,
    queueEntry: null,
    position: null,
    totalWaiting: 0,
    estimatedWaitTime: 0
  });
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [joinFormData, setJoinFormData] = useState({
    doctorId: '',
    priority: 'normal',
    notes: ''
  });

  useEffect(() => {
    fetchQueueStatus();
    fetchDoctors();
  }, []);

  const fetchQueueStatus = async () => {
      try {
      const response = await api.get('/queue/status');
      console.log('Queue status response:', response.data);
        setQueueData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Queue error:', err);
      setError('Failed to fetch queue status. Please try again later.');
        setLoading(false);
      }
    };

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/doctor/all');
      setDoctors(response.data.doctors || []);
    } catch (err) {
      console.error('Error fetching doctors:', err);
    }
  };

  const handleJoinQueue = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/queue', joinFormData);
      console.log('Join queue response:', response.data);
      setShowJoinForm(false);
      fetchQueueStatus(); // Refresh queue status
    } catch (err) {
      console.error('Join queue error:', err);
      setError('Failed to join queue. Please try again.');
    }
  };

  const handleLeaveQueue = async () => {
    if (!queueData.queueEntry) return;
    
    try {
      await api.put(`/queue/${queueData.queueEntry.id}/status`, { status: 'cancelled' });
      fetchQueueStatus(); // Refresh queue status
    } catch (err) {
      console.error('Leave queue error:', err);
      setError('Failed to leave queue. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="queue-container">
        <div className="loading-spinner">Loading queue information...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="queue-container">
        <div className="error-message">{error}</div>
        <button onClick={fetchQueueStatus} className="retry-button">Retry</button>
      </div>
    );
  }

  return (
    <div className="queue-container">
      <div className="queue-header">
        <h1>Queue Status</h1>
        <p className="last-updated">Last updated: {new Date().toLocaleTimeString()}</p>
      </div>

      {!queueData.inQueue ? (
        <div className="not-in-queue">
          <div className="queue-number-card">
            <div className="queue-number-icon">🚫</div>
            <div className="queue-number-content">
              <h2>Not in Queue</h2>
              <p>You are not currently in the queue</p>
              <button 
                className="join-queue-button"
                onClick={() => setShowJoinForm(true)}
              >
                Join Queue
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Prominent Queue Number Display */}
          <div className="queue-number-display">
            <div className="queue-number-card">
              <div className="queue-number-icon">🎫</div>
              <div className="queue-number-content">
                <h2>Your Queue Number</h2>
                <div className="queue-number-value">#{queueData.queueEntry.queueNumber}</div>
                <p className="queue-number-status">Status: {queueData.queueEntry.status}</p>
              </div>
            </div>
          </div>

      <div className="queue-status">
        <div className="status-card">
          <div className="status-icon">🎯</div>
          <h2>Your Position</h2>
              <p className="status-value">{queueData.position}</p>
          <p className="status-label">in queue</p>
        </div>

        <div className="status-card">
          <div className="status-icon">⏱️</div>
          <h2>Estimated Wait</h2>
          <p className="status-value">
                {queueData.estimatedWaitTime || 0}
          </p>
          <p className="status-label">minutes</p>
        </div>

        <div className="status-card">
          <div className="status-icon">👥</div>
          <h2>Queue Length</h2>
          <p className="status-value">{queueData.totalWaiting}</p>
          <p className="status-label">patients waiting</p>
        </div>
      </div>

        <div className="current-patient">
          <h2>Your Queue Information</h2>
          <div className="patient-info">
              <p><strong>Queue Number:</strong> {queueData.queueEntry.queueNumber}</p>
              <p><strong>Status:</strong> {queueData.queueEntry.status}</p>
              {queueData.queueEntry.doctor ? (
                <div className="assigned-doctor">
                  <p><strong>Assigned Doctor:</strong></p>
                  <div className="doctor-info">
                    <span className="doctor-name">{queueData.queueEntry.doctor.name}</span>
                    {queueData.queueEntry.doctor.specialization && (
                      <span className="doctor-specialization">({queueData.queueEntry.doctor.specialization})</span>
            )}
          </div>
        </div>
              ) : (
                <p><strong>Assigned Doctor:</strong> Will be assigned by receptionist</p>
              )}
              {queueData.queueEntry.priority !== 'normal' && (
                <p><strong>Priority:</strong> <span className={`priority-${queueData.queueEntry.priority}`}>{queueData.queueEntry.priority}</span></p>
              )}
              {queueData.queueEntry.notes && (
                <p><strong>Notes:</strong> {queueData.queueEntry.notes}</p>
                )}
              </div>
            <button 
              className="leave-queue-button"
              onClick={handleLeaveQueue}
            >
              Leave Queue
            </button>
          </div>
        </>
      )}

      {showJoinForm && (
        <div className="join-queue-form">
          <h2>Join Queue</h2>
          <form onSubmit={handleJoinQueue}>
            <div className="form-group">
              <label>Select Doctor (Optional):</label>
              <select 
                value={joinFormData.doctorId}
                onChange={(e) => setJoinFormData({...joinFormData, doctorId: e.target.value})}
              >
                <option value="">Any available doctor</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialization || 'General Medicine'}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Priority:</label>
              <select 
                value={joinFormData.priority}
                onChange={(e) => setJoinFormData({...joinFormData, priority: e.target.value})}
              >
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
            <div className="form-group">
              <label>Notes (optional):</label>
              <textarea 
                value={joinFormData.notes}
                onChange={(e) => setJoinFormData({...joinFormData, notes: e.target.value})}
                placeholder="Any special requirements or symptoms..."
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-button">Join Queue</button>
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => setShowJoinForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="queue-tips">
        <h3>Tips</h3>
        <ul>
          <li>Please arrive 10 minutes before your estimated time</li>
          <li>Bring your medical records and ID</li>
          <li>Keep your phone number updated for notifications</li>
          <li>Queue position may change based on priority cases</li>
          <li>You will be notified when it's your turn</li>
          <li>You can select a specific doctor or let the system assign one</li>
        </ul>
      </div>

      <div className="queue-actions">
        <button className="refresh-button" onClick={fetchQueueStatus}>
          Refresh Queue Status
        </button>
      </div>
    </div>
  );
} 