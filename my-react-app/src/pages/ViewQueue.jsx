import React, { useEffect, useState } from 'react';
import './ViewQueue.css';

function ViewQueue(){
  const [queueData, setQueueData] = useState([]);

  // Simulated fetch - replace with actual API call
  useEffect(() => {
    const mockData = [
      { name: 'Jane Doe', service: 'Consultation', joinedAt: '10:10 AM' },
      { name: 'John Smith', service: 'Check-Up', joinedAt: '10:20 AM' },
      { name: 'Alice N.', service: 'Dental', joinedAt: '10:25 AM' },
    ];

    setQueueData(mockData);
  }, []);

  return (
    <div className="container queue-status-page py-5 mt-5">
      <h2 className="text-center mb-4">Current Queue</h2>

      <div className="card shadow-sm p-4">
        <table className="table table-striped">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Patient Name</th>
              <th>Service</th>
              <th>Joined At</th>
            </tr>
          </thead>
          <tbody>
            {queueData.length > 0 ? (
              queueData.map((entry, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{entry.name}</td>
                  <td>{entry.service}</td>
                  <td>{entry.joinedAt}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted">No patients in the queue currently.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Future Features Placeholder */}
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h6>Estimated Wait Time</h6>
            <p className="text-muted">[To be calculated based on queue length and clinician availability]</p>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h6>Active Clinicians</h6>
            <p className="text-muted">[To be updated with real-time data]</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewQueue;
