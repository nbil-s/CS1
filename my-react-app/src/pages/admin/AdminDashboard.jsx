import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/Authcontext';
import '../../Dashboard.css';


export default function AdminDashboard() {
  const navigate = useNavigate();

  const { logout } = useAuth();

  const { isAuthenticated, userRole } = useAuth();

  
useEffect(() => {
  if (!isAuthenticated || userRole !== 'admin') {
    navigate('/'); // Redirect unauthorized users
  }
}, [isAuthenticated, userRole, navigate]);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'system',
      message: 'System maintenance scheduled for tonight at 2 AM',
      date: '2024-03-20',
      read: false
    },
    {
      id: 2,
      type: 'user',
      message: 'New doctor registration request from Dr. James Wilson',
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
        <h1>Admin Dashboard</h1>
      </div>

      <div className="admin-meta">
          Logged in as: <strong>{userRole}</strong>
        </div>


      <div className="dashboard-grid">
        <div className="dashboard-card" onClick={() => navigate('/admin/manageusers')}>
          <div className="card-icon">👥</div>
          <h3>Manage Users</h3>
          <p>Add, edit, or remove system users</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate('/admin-staff/clock-in')}>
          <div className="card-icon">⚙️</div>
          <h3>Clock In/Out</h3>
          <p>Clocking In To For The Day</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate('/reports')}>
          <div className="card-icon">📊</div>
          <h3>Reports</h3>
          <p>Generate and view system reports</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate('/audit-logs')}>
          <div className="card-icon">📝</div>
          <h3>Audit Logs</h3>
          <p>View system activity and changes</p>
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
                {notification.type === 'system' ? '⚙️' : '👤'}
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