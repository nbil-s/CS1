import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Prescriptions() {
  const navigate = useNavigate();
  const [prescriptions] = useState([
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

      <style jsx>{`
        .prescriptions-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .prescription-card {
          background: white;
          padding: 1.5rem;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .prescription-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e9ecef;
        }

        .prescription-header h3 {
          color: #2c3e50;
          margin: 0;
          font-size: 1.3rem;
        }

        .status {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: bold;
        }

        .status.active {
          background-color: #d4edda;
          color: #155724;
        }

        .status.completed {
          background-color: #e2e3e5;
          color: #6c757d;
        }

        .prescription-details {
          margin-bottom: 1rem;
        }

        .detail-row {
          display: flex;
          margin: 0.5rem 0;
          align-items: flex-start;
        }

        .label {
          font-weight: bold;
          color: #2c3e50;
          min-width: 150px;
          flex-shrink: 0;
        }

        .value {
          color: #666;
          flex-grow: 1;
        }

        .value.refills {
          color: #007bff;
          font-weight: bold;
        }

        .prescription-actions {
          padding-top: 1rem;
          border-top: 1px solid #e9ecef;
        }

        .refill-button {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background-color 0.2s;
        }

        .refill-button:hover {
          background-color: #0056b3;
        }

        @media (max-width: 768px) {
          .detail-row {
            flex-direction: column;
            gap: 0.25rem;
          }
          
          .label {
            min-width: auto;
          }
        }
      `}</style>
    </div>
  );
} 