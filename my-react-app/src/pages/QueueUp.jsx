import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  
      const response = await fetch('http://localhost:5000/api/queue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
  
      const data = await response.json();
      if (data.success) {
        alert('You have joined the queue successfully!');
      } else {
        alert(data.message || 'Failed to join queue.');
      }
    } catch (error) {
      console.error('Queueing error:', error);
      alert('Something went wrong while joining the queue.');
    }
  };

  return (
    <div className="container queueup-page py-5 mt-5">
      <h2 className="text-center mb-4">Join the Queue</h2>

      <div className="row">
        {/* Form Section */}
        <div className="col-md-7 mb-4">
          <div className="card shadow p-4">
            <h5 className="mb-3">Enter Your Details</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Full Name</label>
                <input type="text" className="form-control" id="name" name="name" required value={formData.name} onChange={handleChange} />
              </div>

              <div className="mb-3">
                <label htmlFor="phone" className="form-label">Phone Number</label>
                <input type="tel" className="form-control" id="phone" name="phone" required value={formData.phone} onChange={handleChange} />
              </div>

              <div className="mb-3">
                <label htmlFor="service" className="form-label">Select Service</label>
                <select className="form-select" name="service" value={formData.service} onChange={handleChange} required>
                  <option value="">-- Choose Service --</option>
                  <option value="consultation">Consultation</option>
                  <option value="checkup">General Check-Up</option>
                  <option value="vaccine">Vaccination</option>
                  <option value="dental">Dental</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="reason" className="form-label">Reason for Visit (Optional)</label>
                <textarea className="form-control" name="reason" rows="3" value={formData.reason} onChange={handleChange}></textarea>
              </div>

              <button type="submit" className="btn btn-success w-100">Join Queue</button>
            </form>
          </div>
        </div>

        {/* Future Features Section */}
        <div className="col-md-5">
          <div className="card mb-4 shadow p-3">
            <h6>Current Queue Status</h6>
            <p><strong>People ahead of you:</strong> <span className="text-muted">[to be calculated]</span></p>
          </div>

          <div className="card shadow p-3">
            <h6>Available Clinicians</h6>
            <p><strong>Currently Available:</strong> <span className="text-muted">[list to appear here]</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueueUp;
