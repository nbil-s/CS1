import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import '../Dashboard.css';

export default function ReceptionistDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [queue, setQueue] = useState([]);
  const [patients, setPatients] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReceptionistData();
  }, []);

  const fetchReceptionistData = async () => {
    try {
      const [appointmentsRes, queueRes, patientsRes, notificationsRes] = await Promise.all([
        api.get('/receptionist/appointments'),
        api.get('/queue'),
        api.get('/receptionist/patients'),
        api.get('/notifications/receptionist')
      ]);

      setAppointments(appointmentsRes.data.appointments || []);
      setQueue(queueRes.data.queue || []);
      setPatients(patientsRes.data.patients || []);
      setNotifications(notificationsRes.data.notifications || []);
    } catch (err) {
      console.error('Error fetching receptionist data:', err);
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const assignDoctor = async (appointmentId, doctorId) => {
    try {
      await api.put(`/receptionist/appointments/${appointmentId}/assign-doctor`, { doctorId });
      fetchReceptionistData(); // Refresh data
    } catch (err) {
      console.error('Error assigning doctor:', err);
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
      case 'appointment': return '📅';
      case 'queue': return '⏳';
      case 'patient': return '👤';
      case 'reminder': return '🔔';
      case 'system': return 'ℹ️';
      default: return '📢';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return <div className="loading">Loading receptionist dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  const pendingAppointments = appointments.filter(apt => apt.status === 'pending');
  const activeQueue = queue.filter(q => q.status === 'waiting' || q.status === 'called');
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
          <div className="card-icon">📅</div>
          <h3>Appointments</h3>
          <p>{pendingAppointments.length} pending appointments</p>
          <div className="card-actions">
            <button onClick={() => navigate('/receptionist/appointments')}>Manage Appointments</button>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">⏳</div>
          <h3>Queue</h3>
          <p>{activeQueue.length} patients in queue</p>
          <div className="card-actions">
            <button onClick={() => navigate('/receptionist/queue')}>Manage Queue</button>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">👤</div>
          <h3>Patients</h3>
          <p>{patients.length} registered patients</p>
          <div className="card-actions">
            <button onClick={() => navigate('/receptionist/patients')}>View Patients</button>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">💰</div>
          <h3>Billing</h3>
          <p>Manage payments and invoices</p>
          <div className="card-actions">
            <button onClick={() => navigate('/receptionist/billing')}>View Billing</button>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section">
          <h2>Pending Appointments</h2>
          {pendingAppointments.length === 0 ? (
            <p className="no-data">No pending appointments.</p>
          ) : (
            <div className="appointments-list">
              {pendingAppointments.map(appointment => (
                <div key={appointment.id} className="appointment-item">
                  <div className="appointment-info">
                    <h4>{appointment.patient?.name || 'Unknown Patient'}</h4>
                    <p>Date: {formatDate(appointment.appointmentDate)}</p>
                    <p>Reason: {appointment.reason || 'Not specified'}</p>
                    <p>Doctor: {appointment.doctor?.name || 'Unassigned'}</p>
                  </div>
                  <div className="appointment-actions">
                    {!appointment.doctor && (
                      <button 
                        className="btn-assign"
                        onClick={() => navigate(`/receptionist/appointments/${appointment.id}/assign`)}
                      >
                        Assign Doctor
                      </button>
                    )}
                    <button 
                      className="btn-view"
                      onClick={() => navigate(`/receptionist/appointments/${appointment.id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="section">
          <h2>Active Queue</h2>
          {activeQueue.length === 0 ? (
            <p className="no-data">No patients in queue.</p>
          ) : (
            <div className="queue-list">
              {activeQueue.map(queueItem => (
                <div key={queueItem.id} className="queue-item">
                  <div className="queue-info">
                    <h4>#{queueItem.queueNumber} - {queueItem.patient?.name || 'Unknown Patient'}</h4>
                    <p>Status: <span className={`status-${queueItem.status}`}>{queueItem.status}</span></p>
                    <p>Doctor: {queueItem.doctor?.name || 'Unassigned'}</p>
                    <p>Joined: {formatDate(queueItem.createdAt)}</p>
                  </div>
                  <div className="queue-actions">
                    {queueItem.status === 'waiting' && (
                      <button 
                        className="btn-call"
                        onClick={() => updateQueueStatus(queueItem.id, 'called')}
                      >
                        Call Patient
                      </button>
                    )}
                    {queueItem.status === 'called' && (
                      <button 
                        className="btn-complete"
                        onClick={() => updateQueueStatus(queueItem.id, 'completed')}
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
                    <span className="notification-date">{formatDate(notification.createdAt)}</span>
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