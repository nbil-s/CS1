import React, { useEffect, useState } from 'react';
import './DeleteUser.css';

const DeleteUser = () => {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState('');

  const fetchUsers = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const res = await fetch('http://localhost:5000/api/admin/users', {
        headers: {"Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      } else {
        setStatus('⚠️ Failed to fetch users');
      }
    } catch (err) {
      setStatus('❌ Network error while fetching users');
    }
  };

  const handleDelete = async (userId) => {
    const confirm = window.confirm("Are you sure you want to delete this user?");
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/delete-user/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await res.json();
      if (data.success) {
        setUsers(users.filter(user => user.user_id !== userId));
        setStatus('✅ User deleted successfully');
      } else {
        setStatus('❌ ' + (data.message || 'Delete failed'));
      }
    } catch (err) {
      setStatus('❌ Network error while deleting user');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="delete-user-wrapper">
      <h2>Delete Staff/Admin</h2>
      {status && <p className="status-msg">{status}</p>}

      {users.length === 0 ? (
        <p>No users available to delete.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.user_id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => handleDelete(user.user_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DeleteUser;
