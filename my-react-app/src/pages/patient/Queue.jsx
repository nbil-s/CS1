import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './Queue.css';

export default function Queue() {
  const [queueData, setQueueData] = useState({
    position: 0,
    estimatedWaitTime: 0,
    currentPatient: null,
    queueLength: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQueueData = async () => {
      try {
        const response = await api.get('/patient/queue');
        setQueueData(response.data);
        setLoading(false);
      } catch (err) {
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
          <p className="status-value">{queueData.estimatedWaitTime}</p>
          <p className="status-label">minutes</p>
        </div>

        <div className="status-card">
          <div className="status-icon">👥</div>
          <h2>Queue Length</h2>
          <p className="status-value">{queueData.queueLength}</p>
          <p className="status-label">patients waiting</p>
        </div>
      </div>

      {queueData.currentPatient && (
        <div className="current-patient">
          <h2>Currently Being Served</h2>
          <div className="patient-info">
            <p>Patient: {queueData.currentPatient.name}</p>
            <p>Doctor: {queueData.currentPatient.doctor}</p>
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
        <button className="notify-button">
          Notify When It's My Turn
        </button>
      </div>
    </div>
  );
} 