import React, { useState } from 'react';
import './HandleQueue.css';

export default function RemoveFromQueue() {
  const [ticket, setTicket] = useState('');
  const [name, setName] = useState('');

  const handleRemove = async (e) => {
    e.preventDefault();

    if (!ticket && !name) {
      alert('Please provide a ticket number or name.');
      return;
    }

    try {
      const token = sessionStorage.getItem('token');

      const response = await fetch('http://localhost:5000/api/remove-from-queue', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ticket, name })
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ ' + data.message);
        setTicket('');
        setName('');
      } else {
        alert('⚠️ ' + data.message);
      }
    } catch (err) {
      console.error('❌ Error removing from queue:', err);
      alert('Something went wrong.');
    }
  };

  return (
    <div className="container queue-page py-5 mt-4">
      <h2 className="text-center mb-4">Remove Patient from Queue</h2>
      <form onSubmit={handleRemove} className="card p-4 shadow-sm">
        <div className="mb-3">
          <label className="form-label">Ticket Number</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g., CON-12345"
            value={ticket}
            onChange={(e) => setTicket(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">OR Patient Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g., John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-danger w-100">Remove Patient</button>
      </form>
    </div>
  );
}
