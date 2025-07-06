import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import './DoctorQueue.css';

export default function DoctorQueue() {
  const { user } = useAuth();
  const [queueData, setQueueData] = useState({
    queue: [],
    totalWaiting: 0,
    totalCalled: 0,
    totalInConsultation: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDoctorQueue();
    // Refresh every 30 seconds
    const interval = setInterval(fetchDoctorQueue, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDoctorQueue = async () => {
    try {
      const response = await api.get('/queue/doctor');
      setQueueData(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching doctor queue:', err);
      setError('Failed to fetch queue data');
      setLoading(false);
    }
  };

  const updateQueueStatus = async (queueId, status) => {
    try {
      await api.put(`/queue/${queueId}/status`, { status });
      fetchDoctorQueue(); // Refresh data
    } catch (err) {
      console.error('Error updating queue status:', err);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="doctor-queue-container">
        <div className="loading-spinner">Loading your patient queue...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="doctor-queue-container">
        <div className="error-message">{error}</div>
        <button onClick={fetchDoctorQueue} className="retry-button">Retry</button>
      </div>
    );
  }

  return (
    <div className="doctor-queue-container">
      <div className="doctor-header">
        <h1>Dr. {user?.name}</h1>
        <p className="specialization">{user?.specialization || 'General Medicine'}</p>
        <p className="last-updated">Last updated: {new Date().toLocaleTimeString()}</p>
      </div>

      <div className="queue-stats">
        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <h3>Waiting</h3>
          <p className="stat-number">{queueData.totalWaiting}</p>
          <p className="stat-label">patients</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📞</div>
          <h3>Called</h3>
          <p className="stat-number">{queueData.totalCalled}</p>
          <p className="stat-label">patients</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👨‍⚕️</div>
          <h3>In Consultation</h3>
          <p className="stat-number">{queueData.totalInConsultation}</p>
          <p className="stat-label">patients</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <h3>Total</h3>
          <p className="stat-number">{queueData.queue.length}</p>
          <p className="stat-label">in queue</p>
        </div>
      </div>

      <div className="queue-section">
        <h2>Your Patient Queue</h2>
        {queueData.queue.length === 0 ? (
          <div className="no-patients">
            <div className="no-patients-icon">👥</div>
            <h3>No patients in your queue</h3>
            <p>Patients will appear here when they join your queue</p>
          </div>
        ) : (
          <div className="queue-list">
            {queueData.queue.map((queueEntry) => (
              <div key={queueEntry.id} className={`queue-item ${queueEntry.status}`}>
                <div className="queue-info">
                  <div className="queue-number">#{queueEntry.queueNumber}</div>
                  <div className="patient-details">
                    <h4>{queueEntry.patient?.name || 'Unknown Patient'}</h4>
                    <p>Position: {queueEntry.position}</p>
                    <p>Priority: <span className={`priority-${queueEntry.priority}`}>{queueEntry.priority}</span></p>
                    {queueEntry.notes && <p>Notes: {queueEntry.notes}</p>}
                    <p>Joined: {formatTime(queueEntry.createdAt)}</p>
                  </div>
                  <div className="queue-status">
                    <span className={`status-${queueEntry.status}`}>{queueEntry.status}</span>
                  </div>
                </div>
                <div className="queue-actions">
                  {queueEntry.status === 'waiting' && (
                    <button 
                      className="btn-call"
                      onClick={() => updateQueueStatus(queueEntry.id, 'called')}
                    >
                      Call Patient
                    </button>
                  )}
                  {queueEntry.status === 'called' && (
                    <button 
                      className="btn-start"
                      onClick={() => updateQueueStatus(queueEntry.id, 'in-consultation')}
                    >
                      Start Consultation
                    </button>
                  )}
                  {queueEntry.status === 'in-consultation' && (
                    <button 
                      className="btn-complete"
                      onClick={() => updateQueueStatus(queueEntry.id, 'completed')}
                    >
                      Complete Consultation
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="queue-tips">
        <h3>Queue Management Tips</h3>
        <ul>
          <li>Call patients when you're ready to see them</li>
          <li>Start consultation when the patient arrives</li>
          <li>Complete consultation when finished</li>
          <li>Priority patients may need immediate attention</li>
          <li>Check patient notes for special requirements</li>
        </ul>
      </div>

      <div className="queue-actions">
        <button className="refresh-button" onClick={fetchDoctorQueue}>
          Refresh Queue
        </button>
      </div>
    </div>
  );
} 