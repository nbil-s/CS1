import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './Queue.css';

export default function Queue() {
  const [queueData, setQueueData] = useState({
    queue: [],
    currentPatient: null,
    position: null,
    totalWaiting: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQueueData = async () => {
      try {
        const response = await api.get('/patient/queue');
        console.log('Queue response:', response.data);
        setQueueData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Queue error:', err);
        setError('Failed to fetch queue data. Please try again later.');
        setLoading(false);
      }
    };

    fetchQueueData();
    // Refresh queue data every 30 seconds
    const interval = setInterval(fetchQueueData, 30000);

    return () => clearInterval(interval);
  }, []);

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
      </div>
    );
  }

  return (
    <div className="queue-container">
      <div className="queue-header">
        <h1>Queue Status</h1>
        <p className="last-updated">Last updated: {new Date().toLocaleTimeString()}</p>
      </div>

      {/* Prominent Queue Number Display */}
      {queueData.currentPatient && (
        <div className="queue-number-display">
          <div className="queue-number-card">
            <div className="queue-number-icon">🎫</div>
            <div className="queue-number-content">
              <h2>Your Queue Number</h2>
              <div className="queue-number-value">#{queueData.currentPatient.queueNumber}</div>
              <p className="queue-number-status">Status: {queueData.currentPatient.status}</p>
            </div>
          </div>
        </div>
      )}

      <div className="queue-status">
        <div className="status-card">
          <div className="status-icon">🎯</div>
          <h2>Your Position</h2>
          <p className="status-value">{queueData.position || 'Not in queue'}</p>
          <p className="status-label">in queue</p>
        </div>

        <div className="status-card">
          <div className="status-icon">⏱️</div>
          <h2>Estimated Wait</h2>
          <p className="status-value">
            {queueData.currentPatient?.estimatedWaitTime || 0}
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

      {queueData.currentPatient && (
        <div className="current-patient">
          <h2>Your Queue Information</h2>
          <div className="patient-info">
            <p><strong>Queue Number:</strong> {queueData.currentPatient.queueNumber}</p>
            <p><strong>Status:</strong> {queueData.currentPatient.status}</p>
            {queueData.currentPatient.doctor && (
              <p><strong>Assigned Doctor:</strong> {queueData.currentPatient.doctor.name}</p>
            )}
            {queueData.currentPatient.priority !== 'normal' && (
              <p><strong>Priority:</strong> {queueData.currentPatient.priority}</p>
            )}
          </div>
        </div>
      )}

      {queueData.queue.length > 0 && (
        <div className="queue-list">
          <h2>Current Queue</h2>
          <div className="queue-items">
            {queueData.queue.slice(0, 5).map((item, index) => (
              <div key={item.id} className={`queue-item ${item.patientId === queueData.currentPatient?.patientId ? 'current' : ''}`}>
                <span className="queue-number">#{item.queueNumber}</span>
                <span className="patient-name">{item.patient.name}</span>
                <span className="status">{item.status}</span>
                {item.priority !== 'normal' && (
                  <span className="priority">{item.priority}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="queue-tips">
        <h3>Tips</h3>
        <ul>
          <li>Please arrive 10 minutes before your estimated time</li>
          <li>Bring your medical records and ID</li>
          <li>Keep your phone number updated for notifications</li>
          <li>Queue position may change based on priority cases</li>
        </ul>
      </div>

      <div className="queue-actions">
        <button className="refresh-button" onClick={() => window.location.reload()}>
          Refresh Queue Status
        </button>
        {!queueData.currentPatient && (
          <button className="join-queue-button">
            Join Queue
          </button>
        )}
      </div>
    </div>
  );
} 