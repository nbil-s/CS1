import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Login from './pages/Login.jsx';
import NavBar from './components/NavBar.jsx';
import Signup from './pages/Clients/Signup.jsx';
import QueueUp from './pages/Clients/QueueUp.jsx';
import Homepage from './pages/Clients/HomePage.jsx';
import ClockIn from './pages/dashboards/ClockIn.jsx';
import ViewQueue from './pages/Clients/ViewQueue.jsx';
import Prescriptions from './pages/patient/Prescriptions';
import MedicalRecords from './pages/patient/MedicalRecords';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ManageUsers from './pages/dashboards/ManageUsers.jsx';
import MyAppointment from './pages/Clients/MyAppointment.jsx';
import DoctorDashboard from './pages/dashboards/DoctorDashboard';
import AppointmentPage from './pages/Clients/AppointmentPage.jsx';
import AdminDashboard from './pages/dashboards/AdminDashboard.jsx';
import PatientDashboard from './pages/dashboards/PatientDashboard.jsx';
import ReceptionistDashboard from './pages/dashboards/ReceptionistDashboard';


function App() {
  return (
    <>
    <NavBar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/queue-up" element={<QueueUp />} />
        <Route path="/view-queue" element={<ViewQueue />} />
        <Route path="/prescriptions" element={<Prescriptions />} />
        <Route path="/my-appointment" element={<MyAppointment />} />
        <Route path="/medical-records" element={<MedicalRecords />} />
        <Route path="/appointment-page" element={<AppointmentPage />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/admin-staff/clock-in" element={<ClockIn />} />
        <Route path="/receptionist/dashboard" element={<ReceptionistDashboard />} />
        <Route path="/admin/manageusers"element={<ProtectedRoute role="admin"><ManageUsers /></ProtectedRoute>} />
        <Route path="/admin/dashboard"element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      </Routes>
    </>
  );
};

export default App;
