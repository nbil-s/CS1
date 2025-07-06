import React from 'react';
import { Link } from 'react-router-dom';
import './HandleQueue.css';

export default function HandleQueue() {
  return (
    <div className="queue-page">
      <h2>Queue Management</h2>
      <ul className="queue-actions">
        <li><Link to="/reception/queue/add">➕ Add Patient to Queue</Link></li>
        <li><Link to="/reception/queue/remove">❌ Remove Patient from Queue</Link></li>
        <li><Link to="/reception/queue/confirm">📢 Confirm Next Patient</Link></li>
        <li><Link to="/reception/queue/priority">⬆️ Increase Patient Priority</Link></li>
      </ul>
    </div>
  );
}
