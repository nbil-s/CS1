import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AboutUs from './pages/AboutUs';
import Services from './pages/Services';
import BookAppointment from './pages/patient/BookAppointment';
import Queue from './pages/patient/Queue';
import QueueStatus from './pages/patient/QueueStatus';
import MedicalRecords from './pages/patient/MedicalRecords';
import Prescriptions from './pages/patient/Prescriptions';
import PatientDashboard from './pages/dashboards/PatientDashboard';
import DoctorDashboard from './pages/dashboards/DoctorDashboard';
import DoctorQueue from './pages/doctor/DoctorQueue';
import ReceptionistDashboard from './pages/dashboards/ReceptionistDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';
// New imports from cherry-picked commit
import EmailVerification from './pages/EmailVerification.jsx';
import QueueUp from './pages/QueueUp.jsx';
import OtpVerify from './pages/OtpVerify.jsx';
import NumberAndDetails from './pages/NumberAndDetails.jsx';
import ViewQueue from './pages/ViewQueue.jsx';
import AppointmentPage from './pages/AppointmentPage.jsx';

function App() {
  const location = useLocation();
  const isHomepage = location.pathname === '/';

  return (
    <div className="app">
      {!isHomepage && <NavBar />}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/book" element={<BookAppointment />} />
        <Route path="/queue" element={<Queue />} />
        <Route path="/queue-status" element={<QueueStatus />} />
        <Route path="/medical-records" element={<MedicalRecords />} />
        <Route path="/prescriptions" element={<Prescriptions />} />
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/queue" element={<DoctorQueue />} />
        <Route path="/receptionist/dashboard" element={<ReceptionistDashboard />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        {/* New routes from cherry-picked commit */}
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/verify-otp" element={<OtpVerify />} />
        <Route path="/appointment-page" element={<AppointmentPage />} />
        <Route path="/view-queue" element={<ViewQueue />} />
        <Route path="/queue-up" element={<QueueUp />} />
        <Route path="/numberanddetails" element={<NumberAndDetails/>} />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
