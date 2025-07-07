import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

export default function MedicalRecords() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      setError(null);
      try {
        // Replace with your actual backend endpoint
        const response = await api.get('/patient/medical-records');
        setMedicalRecords(response.data.records || []);
      } catch (err) {
        setError('Failed to fetch medical records');
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Medical Records</h1>
        <button 
          className="logout-button" 
          onClick={() => navigate('/patient/dashboard')}
        >
          0 Back to Dashboard
        </button>
      </div>

      {loading && <div>Loading medical records...</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="medical-records-list">
        {medicalRecords.map(record => (
          <div key={record.id} className="medical-record-card">
            <div className="record-header">
              <h3>{record.type}</h3>
              <span className={`status ${record.status?.toLowerCase()}`}>{record.status}</span>
            </div>
            <div className="record-details">
              <p><strong>Date:</strong> {record.date}</p>
              <p><strong>Doctor:</strong> {record.doctorName || record.doctor}</p>
              <p><strong>Description:</strong> {record.description}</p>
              <p><strong>Results:</strong> {record.results}</p>
            </div>
          </div>
        ))}
        {!loading && !error && medicalRecords.length === 0 && (
          <div>No medical records found.</div>
        )}
      </div>
    </div>
  );
} 