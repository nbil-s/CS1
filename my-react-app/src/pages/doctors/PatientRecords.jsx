import React, { useState, useEffect } from 'react';
import './PatientRecords.css';

const PatientRecords = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    // Replace with your API route
    const token = sessionStorage.getItem('token');
    fetch('http://localhost:5000/api/patient-records', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) setPatients(data.records);
    })
    .catch(err => console.error(err));
  }, []);

  return (
    <div className="records-container">
      <h2>Patient Records</h2>
      <table className="records-table">
        <thead>
          <tr>
            <th>Name</th><th>Phone</th><th>Last Visit</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p, i) => (
            <tr key={i}>
              <td>{p.name}</td>
              <td>{p.phone}</td>
              <td>{p.last_visit || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientRecords;
