import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const role = localStorage.getItem('role'); // set after login response
  const navigate = useNavigate();

  return (
    <div>
      <h1>{role.toUpperCase()} Dashboard</h1>
      {role === 'patient' && (
        <div>
          <button onClick={() => navigate('/book')}>Book Appointment</button>
          <button onClick={() => navigate('/queue')}>Check Queue</button>
        </div>
      )}
      {/* Buttons for other roles can be added here */}
    </div>
  );
}
