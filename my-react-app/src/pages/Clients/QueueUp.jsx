import React, { useState } from 'react';
import './QueueUp.css';

function QueueUp() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    reason: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to join the queue.');
        return;
      }

      const response = await fetch("http://localhost:5000/api/queue", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        alert(`Successfully joined the queue. Your ticket number is: ${data.ticket}`);
        setFormData({ name: '', phone: '', service: '', reason: '' });
      } else {
        alert(data.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Queue error:', error);
      alert('Failed to join the queue. Please try again.');
    }
  };

  return (
    <div className="container queueup-page py-5 mt-5">
      <h2 className="text-center mb-4">Join the Queue</h2>
      <form onSubmit={handleSubmit} className="card p-4 shadow">
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input type="text" className="form-control" name="name" required value={formData.name} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input type="tel" className="form-control" name="phone" required value={formData.phone} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Service</label>
          <select className="form-select" name="service" required value={formData.service} onChange={handleChange}>
            <option value="">-- Select Service --</option>
            <option value="Consultation">Consultation</option>
            <option value="Checkup">Check-up</option>
            <option value="Dental">Dental</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Vaccination">Vaccination</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Reason (Optional)</label>
          <textarea className="form-control" name="reason" rows="3" value={formData.reason} onChange={handleChange}></textarea>
        </div>

        <button type="submit" className="btn btn-success w-100">Join Queue</button>
      </form>
    </div>
  );
}

export default QueueUp;
