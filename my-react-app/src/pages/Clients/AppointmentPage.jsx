import React, { useState } from 'react';
import './AppointmentPage.css';

function AppointmentPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    department: '',
    clinician: '',
    date: '',
    time: '',
    reason: ''
  });
  const { setHasAppointment } = useAuth();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('token');
    if (!token) return alert("You must be logged in.");

    const response = await fetch('http://localhost:5000/api/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    if (data.success) {
      setHasAppointment(true);
      alert("Appointment booked!");
      navigate("/my-appointment");
    } else {
      alert(data.message || "Error booking appointment.");
    }
  };

  return (
    <div className="container appointment-page py-5 mt-5">
      <h2 className="text-center mb-4">Book an Appointment</h2>
      <div className="card p-4 shadow-sm">
        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Full Name</label>
              <input type="text" name="name" className="form-control" required onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Phone Number</label>
              <input type="tel" name="phone" className="form-control" required onChange={handleChange} />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Department</label>
              <select name="department" className="form-select" required onChange={handleChange}>
                <option value="">Choose...</option>
                <option>General Consultation</option>
                <option>Dental</option>
                <option>Pediatrics</option>
                <option>Dermatology</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Clinician</label>
              <select name="clinician" className="form-select" required onChange={handleChange}>
                <option value="">Select Clinician</option>
                <option>Dr. Mwangi</option>
                <option>Dr. Wanjiku</option>
                <option>Dr. Otieno</option>
              </select>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Date</label>
              <input type="date" name="date" className="form-control" required onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Time</label>
              <input type="time" name="time" className="form-control" required onChange={handleChange} />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Reason for Appointment</label>
            <textarea name="reason" className="form-control" rows="3" onChange={handleChange}></textarea>
          </div>

          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <button type="submit" className="btn btn-primary">Book Appointment</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AppointmentPage;
