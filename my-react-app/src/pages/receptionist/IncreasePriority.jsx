import React, { useEffect, useState } from 'react';
import './HandleQueue.css';

export default function IncreasePriority() {
  const [queue, setQueue] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState('');
  const [message, setMessage] = useState('');

  const fetchQueue = async () => {
    const token = sessionStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/view-queue', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setQueue(data.queue);
    } catch (err) {
      console.error('❌ Failed to load queue:', err);
    }
  };

  const handlePriorityIncrease = async (e) => {
    e.preventDefault();
    setMessage('');
    const token = sessionStorage.getItem('token');

    if (!selectedTicket) {
      setMessage('⚠️ Please select a patient.');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/increase-priority/${selectedTicket}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      if (data.success) {
        setMessage(`✅ Priority increased for ${selectedTicket}`);
        setSelectedTicket('');
        fetchQueue(); // Refresh queue
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error("❌ Error increasing priority:", err);
      setMessage("❌ Server error. Try again.");
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  return (
    <div className="queue-page">
      <h2>Increase Patient Priority</h2>
      <p>Select a patient below to prioritize them in the queue.</p>
      <form onSubmit={handlePriorityIncrease} className="priority-form">
        <select
          className="form-select mb-3"
          value={selectedTicket}
          onChange={(e) => setSelectedTicket(e.target.value)}
        >
          <option value="">-- Select Patient --</option>
          {queue.map((patient) => (
            <option key={patient.queue_id} value={patient.Ticket_num}>
              {patient.name} ({patient.Ticket_num}) - {patient.service}
            </option>
          ))}
        </select>
        <button className="btn btn-warning w-100">⚡ Increase Priority</button>
      </form>
      {message && <p className="mt-3">{message}</p>}
    </div>
  );
}
