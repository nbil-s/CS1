import React, { useEffect, useState } from 'react';
import api from '../../services/api';

export default function QueueStatus() {
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const res = await api.get('/patient/queue');
        setQueue(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        alert('Could not fetch queue.');
      }
    };

    fetchQueue();
  }, []);

  return (
    <div>
      <h2>Your Queue Status</h2>
      <ul>
        {queue.map((item, index) => (
          <li key={item.id}>
            #{index + 1} — Status: {item.status} — Time: {new Date(item.datetime).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
