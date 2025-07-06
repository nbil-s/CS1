import React, { useEffect, useState } from 'react';
import './DoctorAppointments.css';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/doctor/appointments', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setAppointments(data.appointments);
        }
      } catch (err) {
        console.error('Failed to load appointments', err);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <div className="appointments-container">
      <h2>Today's Appointments</h2>
      <ul className="appointments-list">
        {appointments.map((appt, idx) => (
          <li key={idx} className="appointment-card">
            <strong>{appt.name}</strong> — {appt.time}<br />
            Reason: {appt.reason}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorAppointments;
