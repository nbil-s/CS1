import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  // Optional: Redirect if role is missing
  useEffect(() => {
    if (!role) {
      navigate('/login'); // force redirect to login
    }
  }, [role, navigate]);

  return (
    <div>
      <h1>{role ? `${role.toUpperCase()} Dashboard` : 'Dashboard'}</h1>

      {role === 'patient' && (
        <div>
          <button onClick={() => navigate('/book')}>Book Appointment</button>
          <button onClick={() => navigate('/queue')}>Check Queue</button>
        </div>
      )}

      {role === 'doctor' && (
        <div>
          <button onClick={() => navigate('/patients')}>View Patients</button>
        </div>
      )}

      {role === 'admin' && (
        <div>
          <button onClick={() => navigate('/manage-users')}>Manage Users</button>
        </div>
      )}
    </div>
  );
}
