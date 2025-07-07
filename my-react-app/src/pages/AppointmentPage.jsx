import React from 'react';
import './AppointmentPage.css';

function AppointmentPage (){
  return (
    <div className="container appointment-page py-5 mt-5">
      <h2 className="text-center mb-4">Book an Appointment</h2>

      <div className="card p-4 shadow-sm">
        <form>
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input type="text" className="form-control" id="name" placeholder="Jane Doe" />
            </div>
            <div className="col-md-6">
              <label htmlFor="phone" className="form-label">Phone Number</label>
              <input type="tel" className="form-control" id="phone" placeholder="+254..." />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input type="email" className="form-control" id="email" placeholder="you@example.com" />
            </div>
            <div className="col-md-6">
              <label htmlFor="department" className="form-label">Department</label>
              <select className="form-select" id="department" defaultValue="">
                <option value="" disabled>Choose...</option>
                <option>General Consultation</option>
                <option>Dental</option>
                <option>Pediatrics</option>
                <option>Dermatology</option>
              </select>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="clinician" className="form-label">Clinician</label>
              <select className="form-select" id="clinician" defaultValue="">
                <option value="" disabled>Select Clinician</option>
                <option>Dr. Mwangi</option>
                <option>Dr. Wanjiku</option>
                <option>Dr. Otieno</option>
              </select>
            </div>
            <div className="col-md-3">
              <label htmlFor="date" className="form-label">Date</label>
              <input type="date" className="form-control" id="date" />
            </div>
            <div className="col-md-3">
              <label htmlFor="time" className="form-label">Time</label>
              <input type="time" className="form-control" id="time" />
            </div>
          </div>

          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <button type="button" className="btn btn-primary">Book Appointment</button>
          </div>
        </form>
      </div>

      {/* Future Features */}
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h6>Clinician Availability</h6>
            <p className="text-muted">[This section will show available times dynamically]</p>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h6>Conflict Warnings</h6>
            <p className="text-muted">[Future feature: Warn if patient or clinician is double-booked]</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;
