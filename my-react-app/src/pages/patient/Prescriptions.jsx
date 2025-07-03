import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Prescriptions.css';

export default function Prescriptions() {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 1,
      date: '2024-01-15',
      doctor: 'Dr. Smith',
      medication: 'Amoxicillin 500mg',
      dosage: '1 capsule, 3 times daily',
      duration: '7 days',
      instructions: 'Take with food. Complete the full course.',
      status: 'Active',
      refills: 0
    },
    {
      id: 2,
      date: '2024-01-10',
      doctor: 'Dr. Johnson',
      medication: 'Ibuprofen 400mg',
      dosage: '1 tablet, as needed for pain',
      duration: '10 days',
      instructions: 'Take with food. Do not exceed 4 tablets per day.',
      status: 'Active',
      refills: 2
    },
    {
      id: 3,
      date: '2024-01-05',
      doctor: 'Dr. Williams',
      medication: 'Omeprazole 20mg',
      dosage: '1 capsule, once daily',
      duration: '30 days',
      instructions: 'Take on an empty stomach, 30 minutes before breakfast.',
      status: 'Completed',
      refills: 0
    }
  ]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Prescriptions</h1>
        <button 
          className="logout-button" 
          onClick={() => navigate('/patient/dashboard')}
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="prescriptions-list">
        {prescriptions.map(prescription => (
          <div key={prescription.id} className="prescription-card">
            <div className="prescription-header">
              <h3>{prescription.medication}</h3>
              <span className={`status ${prescription.status.toLowerCase()}`}>
                {prescription.status}
              </span>
            </div>
            <div className="prescription-details">
              <div className="detail-row">
                <span className="label">Prescribed by:</span>
                <span className="value">{prescription.doctor}</span>
              </div>
              <div className="detail-row">
                <span className="label">Date:</span>
                <span className="value">{prescription.date}</span>
              </div>
              <div className="detail-row">
                <span className="label">Dosage:</span>
                <span className="value">{prescription.dosage}</span>
              </div>
              <div className="detail-row">
                <span className="label">Duration:</span>
                <span className="value">{prescription.duration}</span>
              </div>
              <div className="detail-row">
                <span className="label">Instructions:</span>
                <span className="value">{prescription.instructions}</span>
              </div>
              {prescription.refills > 0 && (
                <div className="detail-row">
                  <span className="label">Refills remaining:</span>
                  <span className="value refills">{prescription.refills}</span>
                </div>
              )}
            </div>
            {prescription.status === 'Active' && prescription.refills > 0 && (
              <div className="prescription-actions">
                <button className="refill-button">Request Refill</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 