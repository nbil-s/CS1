import React, { useState } from 'react';
import './ManageSchedule.css';

const ManageSchedule = () => {
  const [days, setDays] = useState(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
  const [schedule, setSchedule] = useState({});

  const updateTime = (day, value) => {
    setSchedule({ ...schedule, [day]: value });
  };

  const handleSave = () => {
    const token = sessionStorage.getItem('token');
    fetch('http://localhost:5000/api/doctor/schedule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(schedule)
    }).then(res => res.json()).then(data => {
      if (data.success) alert('Schedule saved!');
    });
  };

  return (
    <div className="schedule-container">
      <h2>Manage Your Schedule</h2>
      {days.map(day => (
        <div key={day} className="schedule-row">
          <label>{day}</label>
          <input
            type="text"
            placeholder="e.g. 09:00 - 16:00"
            onChange={e => updateTime(day, e.target.value)}
          />
        </div>
      ))}
      <button onClick={handleSave}>Save Schedule</button>
    </div>
  );
};

export default ManageSchedule;
