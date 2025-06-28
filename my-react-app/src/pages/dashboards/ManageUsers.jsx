import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ManageUsers.css'; // CSS shown below

const ManageUsers = () => {
  const navigate = useNavigate();

  return (
    <div className="manage-menu-container">
      <h2>Manage Users</h2>
      <p>Select the action you want to perform:</p>

      <div className="manage-actions">
        <button onClick={() => navigate('/admin/manageusers/add')}>
          ➕ Add Staff/Admin
        </button>
        <button onClick={() => navigate('/admin/manageusers/view')}>
          👀 View Staff/Admin
        </button>
        <button onClick={() => navigate('/admin/manageusers/delete')}>
          🗑️ Delete Staff/Admin
        </button>
      </div>
    </div>
  );
};

export default ManageUsers;
