import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './BookAppointment.css';

export default function BookAppointment() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentType, setAppointmentType] = useState('general');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Mock doctors data for small general hospital
  const doctors = [
    { id: 'dr-smith', name: 'Dr. Sarah Smith', specialty: 'General Medicine' },
    { id: 'dr-johnson', name: 'Dr. Michael Johnson', specialty: 'Cardiology' },
    { id: 'dr-williams', name: 'Dr. Emily Williams', specialty: 'Pediatrics' },
    { id: 'dr-brown', name: 'Dr. David Brown', specialty: 'Dermatology' }
  ];

  // Mock available time slots
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.toDateString() === today.toDateString();
      const isPast = date < today;
      
      // Fix date comparison for selection
      const dateYear = date.getFullYear();
      const dateMonth = String(date.getMonth() + 1).padStart(2, '0');
      const dateDay = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${dateYear}-${dateMonth}-${dateDay}`;
      const isSelected = selectedDate === formattedDate;
      
      days.push({
        date,
        isCurrentMonth,
        isToday,
        isPast,
        isSelected
      });
    }
    
    return days;
  };

  const handleDateSelect = (date) => {
    if (date < new Date()) return; // Can't select past dates
    
    // Fix timezone issue by creating date in local timezone
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    
    setSelectedDate(formattedDate);
    setSelectedTime(''); // Reset time when date changes
  };

  const handleBook = async () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select a date and time');
      return;
    }

    setLoading(true);
    try {
      // Format the data to match our backend API
      const appointmentData = {
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        reason: `${appointmentType} - ${notes || 'No additional notes'}`
      };

      const response = await api.post('/patient/appointments', appointmentData);
      
      if (response.data.message) {
        alert('Appointment booked successfully!');
        navigate('/patient/dashboard');
      }
    } catch (err) {
      console.error('Booking error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to book appointment. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="booking-container">
      <div className="booking-header">
        <h1>Book Your Appointment</h1>
        <p>Select your preferred date, time, and doctor to schedule your appointment</p>
        <button 
          className="back-button" 
          onClick={() => navigate('/patient/dashboard')}
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="booking-content">
        {/* Calendar Section */}
        <div className="calendar-section">
          <div className="calendar-header">
            <button className="calendar-nav" onClick={prevMonth}>‹</button>
            <h2>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h2>
            <button className="calendar-nav" onClick={nextMonth}>›</button>
          </div>
          
          <div className="calendar-grid">
            <div className="calendar-weekdays">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="weekday">{day}</div>
              ))}
            </div>
            
            <div className="calendar-days">
              {generateCalendarDays().map((day, index) => (
                <div
                  key={index}
                  className={`calendar-day ${day.isCurrentMonth ? 'current-month' : 'other-month'} 
                    ${day.isToday ? 'today' : ''} 
                    ${day.isPast ? 'past' : ''} 
                    ${day.isSelected ? 'selected' : ''}`}
                  onClick={() => handleDateSelect(day.date)}
                >
                  {day.date.getDate()}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Form Section */}
        <div className="booking-form">
          <div className="form-section">
            <h3>Appointment Details</h3>
            
            <div className="form-group">
              <label>Selected Date:</label>
              <div className="selected-date">
                {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'No date selected'}
              </div>
            </div>

            <div className="form-group">
              <label>Select Doctor:</label>
              <select 
                value={selectedDoctor} 
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="form-select"
              >
                <option value="">Choose a doctor...</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialty}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Appointment Type:</label>
              <select 
                value={appointmentType} 
                onChange={(e) => setAppointmentType(e.target.value)}
                className="form-select"
              >
                <option value="general">General Checkup</option>
                <option value="consultation">Consultation</option>
                <option value="follow-up">Follow-up</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>

            <div className="form-group">
              <label>Select Time:</label>
              <div className="time-slots">
                {timeSlots.map(time => (
                  <button
                    key={time}
                    className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                    onClick={() => setSelectedTime(time)}
                    disabled={!selectedDate}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Additional Notes:</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any specific concerns or information you'd like to share..."
                className="form-textarea"
                rows="4"
              />
            </div>

            <button 
              className="book-button"
              onClick={handleBook}
              disabled={loading || !selectedDate || !selectedTime}
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
