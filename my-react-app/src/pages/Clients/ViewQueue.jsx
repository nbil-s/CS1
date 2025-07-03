import React, { useEffect, useState } from 'react';
import './ViewQueue.css';

function ViewQueue() {
  const [queueData, setQueueData] = useState([]);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/view-queue");
        const data = await response.json();
        if (data.success) {
          setQueueData(data.queue);
          console.log(data.queue);

        }
      } catch (error) {
        console.error("Queue fetch error:", error);
      }
    };
  
    fetchQueue(); // Initial call
  
    const interval = setInterval(fetchQueue, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);
  

  return (
    <div className="container queue-status-page py-5 mt-5">
      <h2 className="text-center mb-4">Current Queue</h2>

      <div className="card shadow-sm p-4">
        <table className="table table-striped">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Ticket</th>
              <th>Service</th>
              <th>Joined At</th>
            </tr>
          </thead>
          <tbody>
            {queueData.length > 0 ? (
              queueData.map((entry, index) => (
                <tr key={entry.queue_id}>
                  <td>{index + 1}</td>
                  <td>{entry.Ticket_num}</td>
                  <td>{entry.service}</td>
                  <td>{new Date(entry.joined_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted">No patients in the queue currently.</td>
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
}

export default ViewQueue;
