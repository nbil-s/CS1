import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import '../Dashboard.css';

export default function PatientDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications/patient');
      setNotifications(response.data.notifications || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to fetch notifications');
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/patient/${id}/read`);
      setNotifications(notifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      ));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/patient/mark-all-read');
      setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'appointment':
        return '📅';
      case 'queue':
        return '⏳';
      case 'prescription':
        return '💊';
      case 'reminder':
        return '🔔';
      case 'system':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Patient Dashboard</h1>
        {user && (
          <div className="user-info">
            <p>Welcome, {user.name}!</p>
          </div>
        )}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card" onClick={() => navigate('/book')}>
          <div className="card-icon">📅</div>
          <h3>Book Appointment</h3>
          <p>Schedule a new appointment with a doctor</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate('/queue')}>
          <div className="card-icon">⏳</div>
          <h3>Check Queue</h3>
          <p>View your current position in the queue</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate('/medical-records')}>
          <div className="card-icon">📋</div>
          <h3>Medical Records</h3>
          <p>Access your medical history and test results</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate('/prescriptions')}>
          <div className="card-icon">💊</div>
          <h3>Prescriptions</h3>
          <p>View your current and past prescriptions</p>
        </div>
      </div>

      <div className="notifications-section">
        <div className="notifications-header">
          <h2>Notifications {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}</h2>
          {unreadCount > 0 && (
            <button className="mark-all-read-btn" onClick={markAllAsRead}>
              Mark All as Read
            </button>
          )}
        </div>
        
        {loading ? (
          <div className="loading">Loading notifications...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : notifications.length === 0 ? (
          <div className="no-notifications">
            <p>No notifications yet.</p>
            <p>You'll see notifications here when appointments are updated, doctors are assigned, or other important events occur.</p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <h4 className="notification-title">{notification.title}</h4>
                  <p className="notification-message">{notification.message}</p>
                  <span className="notification-date">{formatDate(notification.createdAt)}</span>
                </div>
                {!notification.read && <div className="notification-badge" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 