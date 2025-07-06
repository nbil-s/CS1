import React, { useEffect, useState } from 'react';
import './HandleQueue.css';

export default function HandleQueue() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/view-queue', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setQueue(data.queue);
      }
    } catch (err) {
      console.error("❌ Fetch queue error:", err);
    } finally {
      setLoading(false);
    }
  };

  const confirmPatient = async (queueId) => {
    if (!queueId) {
      alert("⚠️ No patient to confirm.");
      return;
    }
  
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/confirm-patient/${queueId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      const data = await response.json();
      if (data.success) {
        alert("✅ Patient has been called and removed from the queue.");
        setQueue(prev => prev.filter(p => p.queue_id !== queueId));
      } else {
        alert("⚠️ " + data.message);
      }
    } catch (err) {
      console.error("❌ Confirm error:", err);
      alert("Failed to confirm patient.");
    }
  };
  


  useEffect(() => {
    fetchQueue();
    // Optional: set interval to auto-refresh queue every 30 seconds
    const interval = setInterval(fetchQueue, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="queue-page">
      <h2>Manage Patient Queue</h2>
      {loading ? (
        <p>Loading queue...</p>
      ) : queue.length === 0 ? (
        <p>✅ No patients currently in queue.</p>
      ) : (
        queue.map(patient => (
          <div key={patient.queue_id || `${patient.name}-${patient.Ticket_num}`} className="next-patient-card">
            <h4>Patient</h4>
            <p><strong>Name:</strong> {patient.name}</p>
            <p><strong>Phone:</strong> {patient.phone}</p>
            <p><strong>Service:</strong> {patient.service}</p>
            <p><strong>Ticket #:</strong> {patient.Ticket_num}</p>
            <p><strong>Joined At:</strong> {new Date(patient.joined_at).toLocaleString()}</p>
            <button
              className="btn btn-danger mt-2"
              onClick={() => confirmPatient(patient.queue_id)}
            >
              ✅ Confirm & Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
}
