import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import '../Dashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [systemStats, setSystemStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });
  const [deleteError, setDeleteError] = useState(null);

  // Security check - redirect non-admin users
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'admin') {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  // Don't render anything if user is not admin
  if (!user || user.role !== 'admin') {
    return null;
  }

  useEffect(() => {
    fetchSystemStats();
    fetchUsers();
    fetchAuditLogs();
  }, []);

  const fetchSystemStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setSystemStats(response.data);
    } catch (err) {
      console.error('Error fetching system stats:', err);
      setError('Failed to fetch system statistics');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data.users || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const response = await api.get('/admin/audit-logs');
      setAuditLogs(response.data.auditLogs || []);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
    }
  };

  const handleUpdateUser = async (userId, updates) => {
    try {
      await api.put(`/admin/users/${userId}`, updates);
      fetchUsers(); // Refresh the list
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Failed to update user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await api.delete(`/admin/users/${userId}`);
      fetchUsers(); // Refresh the list
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user');
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#dc3545';
      case 'doctor': return '#007bff';
      case 'receptionist': return '#28a745';
      case 'patient': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const openEditModal = (user) => {
    setUserToEdit(user);
    setEditForm({ name: user.name, email: user.email, role: user.role });
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setUserToEdit(null);
    setEditForm({ name: '', email: '', role: '' });
  };

  if (loading) return <div className="loading">Loading admin dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        {user && (
          <div className="user-info">
            <p>Logged in as: {user.name} (Admin)</p>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          User Management
        </button>
        <button 
          className={`tab-button ${activeTab === 'audit' ? 'active' : ''}`}
          onClick={() => setActiveTab('audit')}
        >
          Audit Logs
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && systemStats && (
        <div className="overview-section">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Users</h3>
              <p>{systemStats.stats.totalUsers}</p>
            </div>
            <div className="stat-card">
              <h3>Patients</h3>
              <p>{systemStats.stats.totalPatients}</p>
            </div>
            <div className="stat-card">
              <h3>Doctors</h3>
              <p>{systemStats.stats.totalDoctors}</p>
            </div>
            <div className="stat-card">
              <h3>Receptionists</h3>
              <p>{systemStats.stats.totalReceptionists}</p>
            </div>
            <div className="stat-card">
              <h3>Total Appointments</h3>
              <p>{systemStats.stats.totalAppointments}</p>
            </div>
            <div className="stat-card">
              <h3>Pending Appointments</h3>
              <p>{systemStats.stats.pendingAppointments}</p>
            </div>
            <div className="stat-card">
              <h3>Queue Entries</h3>
              <p>{systemStats.stats.totalQueueEntries}</p>
            </div>
            <div className="stat-card">
              <h3>Active Queue</h3>
              <p>{systemStats.stats.activeQueueEntries}</p>
            </div>
          </div>

          <div className="recent-activity">
            <h2>Recent Activity</h2>
            <div className="activity-grid">
              <div className="activity-section">
                <h3>Recent Appointments</h3>
                <div className="activity-list">
                  {systemStats.recentActivity.appointments.map(appointment => (
                    <div key={appointment.id} className="activity-item">
                      <span className="activity-icon">📅</span>
                      <div className="activity-content">
                        <p><strong>{appointment.patient?.name || 'Unknown'}</strong> - {appointment.status}</p>
                        <small>{new Date(appointment.createdAt).toLocaleDateString()}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="activity-section">
                <h3>Recent Users</h3>
                <div className="activity-list">
                  {systemStats.recentActivity.users.map(user => (
                    <div key={user.id} className="activity-item">
                      <span className="activity-icon">👤</span>
                      <div className="activity-content">
                        <p><strong>{user.name}</strong> - {user.role}</p>
                        <small>{new Date(user.createdAt).toLocaleDateString()}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Management Tab */}
      {activeTab === 'users' && (
        <div className="users-section">
          <h2>User Management</h2>
          {deleteError && <div className="error">{deleteError}</div>}
          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span 
                        className="role-badge"
                        style={{ backgroundColor: getRoleColor(user.role) }}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button 
                        className="btn-edit"
                        onClick={() => openEditModal(user)}
                        disabled={user && user.id === userToEdit?.id}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={async () => {
                          setDeleteError(null);
                          console.log('Attempting to delete user:', user.id);
                          try {
                            await handleDeleteUser(user.id);
                            console.log('User deleted:', user.id);
                          } catch (err) {
                            console.error('Delete error:', err);
                            setDeleteError(err.message || 'Failed to delete user');
                          }
                        }}
                        disabled={user && user.id === userToEdit?.id}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Edit Modal */}
          {editModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Edit User</h3>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    console.log('Submitting edit for user:', userToEdit?.id, editForm);
                    try {
                      await handleUpdateUser(userToEdit.id, editForm);
                      console.log('User updated:', userToEdit.id);
                      closeEditModal();
                    } catch (err) {
                      console.error('Edit error:', err);
                      setError('Failed to update user');
                    }
                  }}
                >
                  <label>Name:</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                    required
                  />
                  <label>Email:</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                    required
                  />
                  <label>Role:</label>
                  <select
                    value={editForm.role}
                    onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                    required
                  >
                    <option value="admin">Admin</option>
                    <option value="doctor">Doctor</option>
                    <option value="receptionist">Receptionist</option>
                    <option value="patient">Patient</option>
                  </select>
                  <div className="modal-actions">
                    <button type="submit" className="btn-edit">Save</button>
                    <button type="button" className="btn-cancel" onClick={closeEditModal}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Audit Logs Tab */}
      {activeTab === 'audit' && (
        <div className="audit-section">
          <h2>Audit Logs</h2>
          <div className="audit-list">
            {auditLogs.map(log => (
              <div key={log.id} className="audit-item">
                <div className="audit-header">
                  <span className="audit-action">{log.action}</span>
                  <span className="audit-timestamp">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="audit-details">{log.details}</p>
                <small className="audit-user">User: {log.user}</small>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 