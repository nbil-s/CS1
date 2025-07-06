import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import '../Dashboard.css';

export default function ReceptionistDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [queueData, setQueueData] = useState({
    queue: [],
    stats: {
      total: 0,
      waiting: 0,
      called: 0,
      inConsultation: 0,
      completed: 0
    }
  });
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReceptionistData();
    // Refresh queue data every 30 seconds
    const interval = setInterval(fetchReceptionistData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchReceptionistData = async () => {
    try {
      const [queueRes, notificationsRes] = await Promise.all([
        api.get('/queue/detailed'),
        api.get('/notifications/receptionist')
      ]);

      setQueueData(queueRes.data);
      setNotifications(notificationsRes.data.notifications || []);
    } catch (err) {
      console.error('Error fetching receptionist data:', err);
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const updateQueueStatus = async (queueId, status) => {
    try {
      await api.put(`/queue/${queueId}/status`, { status });
      fetchReceptionistData(); // Refresh data
    } catch (err) {
      console.error('Error updating queue status:', err);
    }
  };

  const removeFromQueue = async (queueId) => {
    try {
      await api.delete(`/queue/${queueId}`);
      fetchReceptionistData(); // Refresh data
    } catch (err) {
      console.error('Error removing from queue:', err);
    }
  };

  const markNotificationAsRead = async (id) => {
    try {
      await api.put(`/notifications/receptionist/${id}/read`);
      setNotifications(notifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      ));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'queue': return '🎫';
      case 'patient': return '👤';
      case 'reminder': return '🔔';
      case 'system': return 'ℹ️';
      default: return '📢';
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return <div className="loading">Loading receptionist dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  const activeQueue = queueData.queue.filter(q => q.status === 'waiting' || q.status === 'called');
  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Receptionist Dashboard</h1>
        {user && (
          <div className="user-info">
            <p>Welcome, {user.name}!</p>
          </div>
        )}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-icon">🎫</div>
          <h3>Queue Management</h3>
          <p>{queueData.stats.total} total patients</p>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">⏰</div>
          <h3>Waiting Patients</h3>
          <p>{queueData.stats.waiting} patients waiting</p>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">📞</div>
          <h3>Called Patients</h3>
          <p>{queueData.stats.called} patients called</p>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">👨‍⚕️</div>
          <h3>In Consultation</h3>
          <p>{queueData.stats.inConsultation} patients</p>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section">
          <h2>Current Queue</h2>
          {queueData.queue.length === 0 ? (
            <p className="no-data">No patients in queue currently.</p>
          ) : (
            <div className="queue-list">
              {queueData.queue.map(queueEntry => (
                <div key={queueEntry.id} className={`queue-item ${queueEntry.status}`}>
                  <div className="queue-info">
                    <div className="queue-number">#{queueEntry.queueNumber}</div>
                    <div className="patient-details">
                      <h4>{queueEntry.patient?.name || 'Unknown Patient'}</h4>
                      <p>Position: {queueEntry.position}</p>
                      <p>Priority: <span className={`priority-${queueEntry.priority}`}>{queueEntry.priority}</span></p>
                      <p>Estimated Wait: {queueEntry.estimatedWaitTime} minutes</p>
                      {queueEntry.notes && <p>Notes: {queueEntry.notes}</p>}
                      <p>Joined: {formatTime(queueEntry.createdAt)}</p>
                    </div>
                    <div className="queue-status">
                      <span className={`status-${queueEntry.status}`}>{queueEntry.status}</span>
                    </div>
                  </div>
                  <div className="queue-actions">
                    {queueEntry.status === 'waiting' && (
                      <>
                        <button 
                          className="btn-call"
                          onClick={() => updateQueueStatus(queueEntry.id, 'called')}
                        >
                          Call Patient
                        </button>
                        <button 
                          className="btn-remove"
                          onClick={() => removeFromQueue(queueEntry.id)}
                        >
                          Remove
                        </button>
                      </>
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
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="section">
          <h2>Notifications {unreadNotifications > 0 && <span className="unread-badge">{unreadNotifications}</span>}</h2>
          {notifications.length === 0 ? (
            <p className="no-data">No notifications yet.</p>
          ) : (
            <div className="notifications-list">
              {notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                  onClick={() => !notification.read && markNotificationAsRead(notification.id)}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <h4>{notification.title}</h4>
                    <p>{notification.message}</p>
                    <span className="notification-date">{formatTime(notification.createdAt)}</span>
                  </div>
                  {!notification.read && <div className="notification-badge" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 