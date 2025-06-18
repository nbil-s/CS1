import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Dashboard.css';

export default function PatientDashboard() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'appointment',
      message: 'Your appointment with Dr. Smith is scheduled for tomorrow at 10:00 AM',
      date: '2024-03-20',
      read: false
    },
    {
      id: 2,
      type: 'reminder',
      message: 'Don\'t forget to bring your medical records for your next visit',
      date: '2024-03-19',
      read: true
    }
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Patient Dashboard</h1>
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
        <h2>Notifications</h2>
        <div className="notifications-list">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item ${notification.read ? 'read' : 'unread'}`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="notification-icon">
                {notification.type === 'appointment' ? '📅' : '🔔'}
              </div>
              <div className="notification-content">
                <p className="notification-message">{notification.message}</p>
                <span className="notification-date">{notification.date}</span>
              </div>
              {!notification.read && <div className="notification-badge" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 