import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './MyAppointment.css';

function MyAppointment() {
  const [appointment, setAppointment] = useState(null);


  const token = sessionStorage.getItem('token');
  console.log('🔑 Token:', token);


  useEffect(() => {
    const fetchAppointment = async () => {
      const token = sessionStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/my-appointment', {
        headers: { 'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAppointment(data.appointment);
      }
    };
    fetchAppointment();
  }, []);

  const handleCancel = async () => {
    const token = sessionStorage.getItem('token');
    await fetch('http://localhost:5000/api/my-appointment', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}` }
    });
    setAppointment(null);
    alert("Appointment cancelled.");
  };

  if (!appointment) {
    return <p className="text-center mt-5">No active appointments found.</p>;
  }

  return (
    <div className="container mt-5">
      <h2>Your Appointment</h2>
      <div className="card p-4">
        <p><strong>Name:</strong> {appointment.name}</p>
        <p><strong>Phone:</strong> {appointment.phone}</p>
        <p><strong>Department:</strong> {appointment.department}</p>
        <p><strong>Clinician:</strong> {appointment.clinician}</p>
        <p><strong>Date:</strong> {appointment.date}</p>
        <p><strong>Time:</strong> {appointment.time}</p>
        <p><strong>Reason:</strong> {appointment.reason}</p>
        <button className="btn btn-danger mt-3" onClick={handleCancel}>Cancel Appointment</button>
      </div>
    </div>
  );
}

export default MyAppointment;
