import React, { useState } from 'react';
import api from '../../services/api';

export default function BookAppointment() {
  const [dateTime, setDateTime] = useState('');

  const handleBook = async () => {
    try {
      await api.post('/patient/appointments', { datetime: dateTime });
      alert('Appointment booked successfully!');
    } catch (err) {
      alert('Failed to book appointment.');
    }
  };

  return (
    <div>
      <h2>Book Appointment</h2>
      <input
        type="datetime-local"
        value={dateTime}
        onChange={(e) => setDateTime(e.target.value)}
      />
      <button onClick={handleBook}>Book</button>
    </div>
  );
}
