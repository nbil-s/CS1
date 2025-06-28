import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MedicalRecords() {
  const navigate = useNavigate();
  const [medicalRecords] = useState([
    {
      id: 1,
      date: '2024-01-15',
      type: 'Blood Test',
      doctor: 'Dr. Smith',
      description: 'Complete blood count and cholesterol screening',
      results: 'Normal ranges - all values within expected limits',
      status: 'Completed'
    },
    {
      id: 2,
      date: '2024-01-10',
      type: 'Physical Examination',
      doctor: 'Dr. Johnson',
      description: 'Annual physical examination',
      results: 'Good overall health, blood pressure: 120/80',
      status: 'Completed'
    },
    {
      id: 3,
      date: '2024-01-05',
      type: 'X-Ray',
      doctor: 'Dr. Williams',
      description: 'Chest X-ray for respiratory symptoms',
      results: 'Clear lungs, no abnormalities detected',
      status: 'Completed'
    }
  ]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Medical Records</h1>
        <button
          className="logout-button"
          onClick={() => navigate('/patient/dashboard')}
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="medical-records-list">
        {medicalRecords.map(record => (
          <div key={record.id} className="medical-record-card">
            <div className="record-header">
              <h3>{record.type}</h3>
              <span className={`status ${record.status.toLowerCase()}`}>
                {record.status}
              </span>
            </div>
            <div className="record-details">
              <p><strong>Date:</strong> {record.date}</p>
              <p><strong>Doctor:</strong> {record.doctor}</p>
              <p><strong>Description:</strong> {record.description}</p>
              <p><strong>Results:</strong> {record.results}</p>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .medical-records-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .medical-record-card {
          background: white;
          padding: 1.5rem;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .record-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .record-header h3 {
          color: #2c3e50;
          margin: 0;
        }

        .status {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: bold;
        }

        .status.completed {
          background-color: #d4edda;
          color: #155724;
        }

        .record-details p {
          margin: 0.5rem 0;
          color: #666;
        }

        .record-details strong {
          color: #2c3e50;
        }
      `}</style>
    </div>
  );
} 