import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Dashboard.css';

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'appointment',
      message: 'You have 3 appointments scheduled for today',
      date: '2024-03-20',
      read: false
    },
    {
      id: 2,
      type: 'reminder',
      message: 'Patient John Doe\'s test results are ready for review',
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
        <h1>Doctor Dashboard</h1>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card" onClick={() => navigate('/appointments')}>
          <div className="card-icon">📅</div>
          <h3>Today's Appointments</h3>
          <p>View and manage your daily appointments</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate('/patients')}>
          <div className="card-icon">👥</div>
          <h3>Patient Records</h3>
          <p>Access and manage patient information</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate('/prescribe')}>
          <div className="card-icon">💊</div>
          <h3>Prescribe Medication</h3>
          <p>Create new prescriptions for patients</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate('/schedule')}>
          <div className="card-icon">⏰</div>
          <h3>Manage Schedule</h3>
          <p>Set your availability and working hours</p>
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