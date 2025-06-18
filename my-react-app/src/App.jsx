import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BookAppointment from './pages/patient/BookAppointment';
import Queue from './pages/patient/Queue';
import QueueStatus from './pages/patient/QueueStatus';
import MedicalRecords from './pages/patient/MedicalRecords';
import Prescriptions from './pages/patient/Prescriptions';
import PatientDashboard from './pages/dashboards/PatientDashboard';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import ReceptionistDashboard from './pages/receptionist/ReceptionistDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';

function App() {
  return (
    <div className="app">
      <NavBar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/book" element={<BookAppointment />} />
        <Route path="/queue" element={<Queue />} />
        <Route path="/queue-status" element={<QueueStatus />} />
        <Route path="/medical-records" element={<MedicalRecords />} />
        <Route path="/prescriptions" element={<Prescriptions />} />
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/receptionist/dashboard" element={<ReceptionistDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
