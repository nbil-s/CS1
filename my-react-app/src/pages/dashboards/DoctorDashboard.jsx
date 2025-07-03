import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import '../Dashboard.css';

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const fetchDoctorData = async () => {
    try {
      const [appointmentsRes, patientsRes, notificationsRes] = await Promise.all([
        api.get('/doctor/appointments'),
        api.get('/doctor/patients'),
        api.get('/notifications/doctor')
      ]);

      setAppointments(appointmentsRes.data.appointments || []);
      setPatients(patientsRes.data.patients || []);
      setNotifications(notificationsRes.data.notifications || []);
    } catch (err) {
      console.error('Error fetching doctor data:', err);
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      await api.put(`/doctor/appointments/${appointmentId}`, { status });
      fetchDoctorData(); // Refresh data
    } catch (err) {
      console.error('Error updating appointment:', err);
    }
  };

  const markNotificationAsRead = async (id) => {
    try {
      await api.put(`/notifications/doctor/${id}/read`);
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
      case 'patient': return '👤';
      case 'prescription': return '💊';
      case 'reminder': return '🔔';
      case 'system': return 'ℹ️';
      default: return '📢';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return <div className="loading">Loading doctor dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  const todayAppointments = appointments.filter(apt => 
    new Date(apt.appointmentDate).toDateString() === new Date().toDateString()
  );
  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Doctor Dashboard</h1>
        {user && (
          <div className="user-info">
            <p>Welcome, Dr. {user.name}!</p>
          </div>
        )}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-icon">📅</div>
          <h3>Today's Appointments</h3>
          <p>{todayAppointments.length} appointments scheduled</p>
          <div className="card-actions">
            <button onClick={() => navigate('/doctor/appointments')}>View All</button>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">👥</div>
          <h3>My Patients</h3>
          <p>{patients.length} patients under care</p>
          <div className="card-actions">
            <button onClick={() => navigate('/doctor/patients')}>View Patients</button>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">💊</div>
          <h3>Prescriptions</h3>
          <p>Manage patient prescriptions</p>
          <div className="card-actions">
            <button onClick={() => navigate('/doctor/prescriptions')}>Write Prescription</button>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">⏰</div>
          <h3>Schedule</h3>
          <p>Manage your availability</p>
          <div className="card-actions">
            <button onClick={() => navigate('/doctor/schedule')}>Update Schedule</button>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section">
          <h2>Today's Appointments</h2>
          {todayAppointments.length === 0 ? (
            <p className="no-data">No appointments scheduled for today.</p>
          ) : (
            <div className="appointments-list">
              {todayAppointments.map(appointment => (
                <div key={appointment.id} className="appointment-item">
                  <div className="appointment-info">
                    <h4>{appointment.patient?.name || 'Unknown Patient'}</h4>
                    <p>Time: {formatDate(appointment.appointmentDate)}</p>
                    <p>Status: <span className={`status-${appointment.status}`}>{appointment.status}</span></p>
                  </div>
                  <div className="appointment-actions">
                    {appointment.status === 'pending' && (
                      <>
                        <button 
                          className="btn-accept"
                          onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                        >
                          Accept
                        </button>
                        <button 
                          className="btn-decline"
                          onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                        >
                          Decline
                        </button>
                      </>
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