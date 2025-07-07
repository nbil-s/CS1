import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import './Prescriptions.css';

export default function Prescriptions() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      setLoading(true);
      setError(null);
      try {
        // Replace with your actual backend endpoint
        const response = await api.get('/patient/prescriptions');
        setPrescriptions(response.data.prescriptions || []);
      } catch (err) {
        setError('Failed to fetch prescriptions');
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Prescriptions</h1>
        <button 
          className="logout-button" 
          onClick={() => navigate('/patient/dashboard')}
        >
          0 Back to Dashboard
        </button>
      </div>

      {loading && <div>Loading prescriptions...</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="prescriptions-list">
        {prescriptions.map(prescription => (
          <div key={prescription.id} className="prescription-card">
            <div className="prescription-header">
              <h3>{prescription.medication}</h3>
              <span className={`status ${prescription.status?.toLowerCase()}`}>{prescription.status}</span>
            </div>
            <div className="prescription-details">
              <div className="detail-row">
                <span className="label">Prescribed by:</span>
                <span className="value">{prescription.doctorName || prescription.doctor}</span>
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
        {!loading && !error && prescriptions.length === 0 && (
          <div>No prescriptions found.</div>
        )}
      </div>
    </div>
  );
} 