import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Dashboard.css';

export default function ReceptionistDashboard() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'appointment',
      message: 'New appointment request from Sarah Johnson',
      date: '2024-03-20',
      read: false
    },
    {
      id: 2,
      type: 'reminder',
      message: '5 patients waiting in the queue',
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
        <h1>Receptionist Dashboard</h1>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card" onClick={() => navigate('/manage-appointments')}>
          <div className="card-icon">📅</div>
          <h3>Manage Appointments</h3>
          <p>Schedule and manage patient appointments</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate('/register-patient')}>
          <div className="card-icon">👤</div>
          <h3>Register Patient</h3>
          <p>Add new patients to the system</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate('/patient-records')}>
          <div className="card-icon">📋</div>
          <h3>Patient Records</h3>
          <p>View and update patient information</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate('/billing')}>
          <div className="card-icon">💰</div>
          <h3>Billing</h3>
          <p>Manage patient payments and invoices</p>
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