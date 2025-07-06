import React, { useState } from 'react';
import './PrescribeMedication.css';

const PrescribeMedication = () => {
  const [form, setForm] = useState({
    patientName: '',
    medication: '',
    dosage: '',
    instructions: ''
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/prescriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) alert('Prescription saved');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="prescription-form">
      <h2>Prescribe Medication</h2>
      <form onSubmit={handleSubmit}>
        <input name="patientName" placeholder="Patient Name" onChange={handleChange} required />
        <input name="medication" placeholder="Medication" onChange={handleChange} required />
        <input name="dosage" placeholder="Dosage" onChange={handleChange} required />
        <textarea name="instructions" placeholder="Instructions" onChange={handleChange} required />
        <button type="submit">Prescribe</button>
      </form>
    </div>
  );
};

export default PrescribeMedication;
