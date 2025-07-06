// ViewUsers.jsx
import React, { useEffect, useState } from 'react';
import './ViewUsers.css';

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [modalUser, setModalUser] = useState(null);
  const [editData, setEditData] = useState({});
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUsers(data.users || []));
  }, []);

  const maskPhone = (phone) => {
    return phone && phone.length >= 10
      ? phone.substring(0, 2) + '******' + phone.slice(-2)
      : '**********';
  };

  const validateInputs = (user) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!user.name.trim()) return 'Name is required';
    if (!emailRegex.test(user.email)) return 'Invalid email format';
    if (!user.phone.match(/^07\d{8}$/)) return 'Phone must start with 07 and be 10 digits';
    if (!['staff', 'admin'].includes(user.role)) return 'Invalid role';
    return null;
  };

  const openModal = (user) => {
    const pw = prompt('Enter your password to edit:');
    if (!pw) return;
    setPassword(pw);
    setModalUser(user);
    setEditData({ ...user });
    setStatus('');
  };

  const handleSave = async () => {
    const validationError = validateInputs(editData);
    if (validationError) return setStatus(`❌ ${validationError}`);
    const confirm = window.confirm('Are you sure you want to save these changes?');
    if (!confirm) return;

    const res = await fetch(`http://localhost:5000/api/admin/update-user/${editData.user_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ ...editData, password })
    });

    const data = await res.json();
    if (data.success) {
      setUsers(users.map(u => u.user_id === editData.user_id ? editData : u));
      closeModal();
      setStatus('✅ Updated successfully');
    } else {
      setStatus('❌ ' + (data.message || 'Update failed'));
    }
  };

  const closeModal = () => {
    setModalUser(null);
    setEditData({});
    setPassword('');
  };

  return (
    <div className="view-users-container">
      <h2>Manage Staff/Admin Users</h2>
      {status && <div className="status">{status}</div>}
      <table className="user-table">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.user_id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{maskPhone(user.phone)}</td>
              <td>{user.role}</td>
              <td><button className="edit-btn" onClick={() => openModal(user)}>Edit</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalUser && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit User</h3>
            <label>Name: <input value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} /></label>
            <label>Email: <input value={editData.email} onChange={e => setEditData({ ...editData, email: e.target.value })} /></label>
            <label>Phone: <input value={editData.phone} onChange={e => setEditData({ ...editData, phone: e.target.value })} /></label>
            <label>Role:
              <select value={editData.role} onChange={e => setEditData({ ...editData, role: e.target.value })}>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <div className="modal-buttons">
              <button onClick={handleSave} className="save-btn">Save</button>
              <button onClick={closeModal} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewUsers;
