import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './ViewQueue.css';

function ViewQueue(){
  const [queueData, setQueueData] = useState({
    queue: [],
    stats: {
      total: 0,
      waiting: 0,
      called: 0,
      inConsultation: 0,
      completed: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQueueData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchQueueData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchQueueData = async () => {
    try {
      const response = await api.get('/queue/detailed');
      setQueueData(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching queue data:', err);
      setError('Failed to fetch queue data');
      setLoading(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="container queue-status-page py-5 mt-5">
        <div className="text-center">Loading queue data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container queue-status-page py-5 mt-5">
        <div className="text-center text-danger">{error}</div>
        <button onClick={fetchQueueData} className="btn btn-primary mt-3">Retry</button>
      </div>
    );
  }

  return (
    <div className="container queue-status-page py-5 mt-5">
      <h2 className="text-center mb-4">Current Queue</h2>

      {/* Queue Statistics */}
      <div className="row mb-4">
        <div className="col-md-2">
          <div className="card text-center p-3 shadow-sm">
            <h6>Total</h6>
            <h4 className="text-primary">{queueData.stats.total}</h4>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card text-center p-3 shadow-sm">
            <h6>Waiting</h6>
            <h4 className="text-warning">{queueData.stats.waiting}</h4>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card text-center p-3 shadow-sm">
            <h6>Called</h6>
            <h4 className="text-info">{queueData.stats.called}</h4>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card text-center p-3 shadow-sm">
            <h6>In Consultation</h6>
            <h4 className="text-success">{queueData.stats.inConsultation}</h4>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card text-center p-3 shadow-sm">
            <h6>Completed</h6>
            <h4 className="text-secondary">{queueData.stats.completed}</h4>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card text-center p-3 shadow-sm">
            <h6>Avg Wait</h6>
            <h4 className="text-dark">{queueData.stats.waiting * 15} min</h4>
          </div>
        </div>
      </div>

      <div className="card shadow-sm p-4">
        <table className="table table-striped">
          <thead className="table-dark">
            <tr>
              <th>Position</th>
              <th>Queue #</th>
              <th>Patient Name</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Doctor</th>
              <th>Est. Wait</th>
              <th>Joined At</th>
            </tr>
          </thead>
          <tbody>
            {queueData.queue.length > 0 ? (
              queueData.queue.map((entry) => (
                <tr key={entry.id} className={entry.status === 'waiting' ? 'table-warning' : 
                                             entry.status === 'called' ? 'table-info' : 
                                             entry.status === 'in-consultation' ? 'table-success' : ''}>
                  <td><strong>{entry.position}</strong></td>
                  <td><span className="badge bg-primary">#{entry.queueNumber}</span></td>
                  <td>{entry.patient?.name || 'Unknown'}</td>
                  <td>
                    <span className={`badge ${
                      entry.status === 'waiting' ? 'bg-warning' :
                      entry.status === 'called' ? 'bg-info' :
                      entry.status === 'in-consultation' ? 'bg-success' :
                      entry.status === 'completed' ? 'bg-secondary' : 'bg-dark'
                    }`}>
                      {entry.status}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${
                      entry.priority === 'urgent' ? 'bg-danger' :
                      entry.priority === 'emergency' ? 'bg-danger' : 'bg-secondary'
                    }`}>
                      {entry.priority}
                    </span>
                  </td>
                  <td>{entry.doctor?.name || 'Unassigned'}</td>
                  <td>{entry.estimatedWaitTime} min</td>
                  <td>{formatTime(entry.createdAt)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center text-muted">No patients in the queue currently.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Queue Information */}
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h6>Estimated Wait Time</h6>
            <p className="text-muted">
              Average wait time is calculated as 15 minutes per person ahead in the queue.
              Priority cases may be seen earlier.
            </p>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h6>Queue Status Legend</h6>
            <div className="d-flex flex-wrap gap-2">
              <span className="badge bg-warning">Waiting</span>
              <span className="badge bg-info">Called</span>
              <span className="badge bg-success">In Consultation</span>
              <span className="badge bg-secondary">Completed</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        <button onClick={fetchQueueData} className="btn btn-primary">
          Refresh Queue
        </button>
        <small className="d-block text-muted mt-2">
          Last updated: {new Date().toLocaleTimeString()}
        </small>
      </div>
    </div>
  );
}

export default ViewQueue;
