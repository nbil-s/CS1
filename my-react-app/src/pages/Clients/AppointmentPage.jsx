import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "./AppointmentPage.css";

export default function AppointmentPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [clinician, setClinician] = useState('');
  const [reason, setReason] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [message, setMessage] = useState('');

  const departments = ['General', 'Pediatrics', 'Dermatology', 'Dental'];

  useEffect(() => {
    if (selectedDate) {
      const day = selectedDate.getDay();
      let slots;

      if (day === 0) {
        // Sunday: 9:00 AM – 1:00 PM
        slots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30'];
      } else {
        // Other days: normal slots
        slots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
      }

      setAvailableTimeSlots(slots);
      setSelectedTime('');
    }
  }, [selectedDate]);

  const handleDateChange = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date <= today) {
      alert('You can only book appointments from tomorrow onwards.');
      return;
    }
    setSelectedDate(date);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !phone || !department || !clinician || !selectedDate || !selectedTime) {
      setMessage('Please fill in all required fields.');
      return;
    }

    const formattedDate = selectedDate.toISOString().split('T')[0]; // 'YYYY-MM-DD'

    try {
      const response = await api.post('/api/appointments', {
        name,
        phone,
        department,
        clinician,
        date: formattedDate,
        time: selectedTime,
        reason
      });

      if (response.data.success) {
        setMessage('Appointment booked successfully!');
        // Optionally clear form
        setName('');
        setPhone('');
        setDepartment('');
        setClinician('');
        setReason('');
        setSelectedDate(null);
        setSelectedTime('');
      } else {
        setMessage('Failed to book appointment.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Server error. Please try again.');
    }
  };

  return (
    <div className="appointment-page">
      <h2>Book Appointment</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
        <input type="tel" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} required />

        <select value={department} onChange={e => setDepartment(e.target.value)} required>
          <option value="">Select Department</option>
          {departments.map((dept, index) => (
            <option key={index} value={dept}>{dept}</option>
          ))}
        </select>

        <input type="text" placeholder="Preferred Clinician" value={clinician} onChange={e => setClinician(e.target.value)} required />
        
        <textarea placeholder="Reason (optional)" value={reason} onChange={e => setReason(e.target.value)} />

        <div className="calendar-container">
          <label>Select Date:</label>
          <Calendar onChange={handleDateChange} value={selectedDate} minDate={new Date(new Date().setDate(new Date().getDate() + 1))} />
        </div>

        {selectedDate && (
          <div className="time-slot-container">
            <label>Select Time:</label>
            <select value={selectedTime} onChange={e => setSelectedTime(e.target.value)} required>
              <option value="">Select Time Slot</option>
              {availableTimeSlots.map((slot, index) => (
                <option key={index} value={slot}>{slot}</option>
              ))}
            </select>
          </div>
        )}

        <button type="submit">Book Appointment</button>
      </form>
    </div>
  );
}
