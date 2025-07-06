import React from 'react';
import { Route, Routes } from 'react-router-dom';

import NavBar from './components/NavBar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
//patients
import Login from './pages/Login.jsx';
import Signup from './pages/Clients/Signup.jsx';
import VerifyCode from './pages/VerifyCode.jsx';
import QueueUp from './pages/Clients/QueueUp.jsx';
import Homepage from './pages/Clients/HomePage.jsx';
import MedicalRecords from './pages/Clients/MedicalRecords.jsx';
import ViewQueue from './pages/Clients/ViewQueue.jsx';
import MyAppointment from './pages/Clients/MyAppointment.jsx';
import AppointmentPage from './pages/Clients/AppointmentPage.jsx';
import PatientDashboard from './pages/admin/PatientDashboard.jsx';
//Doctors
import PrescribeMedication from './pages/doctors/PrescribeMedication.jsx';
import ManageSchedule from './pages/doctors/ManageSchedule.jsx';
import PatientRecords from './pages/doctors/PatientRecords.jsx';
import DoctorAppointments from './pages/doctors/DoctorAppointments.jsx';
import DoctorDashboard_1 from './pages/doctors/Doctordashboard.jsx';
import DoctorDashboard from './pages/admin/DoctorDashboard.jsx';

//Admins
import ClockIn from './pages/admin/ClockIn.jsx';
import AddUser from './pages/admin/AddUser.jsx';
import ClockOut from './pages/admin/ClockOut.jsx';
import ViewUsers from './pages/admin/ViewUsers.jsx';
import Prescriptions from './pages/Clients/Prescriptions.jsx';
import DeleteUser from './pages/admin/DeleteUser.jsx';
import ManageUsers from './pages/admin/ManageUsers.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';

//Receptionist
import ReceptionistDashboard from './pages/receptionist/ReceptionistDashboard.jsx';
import ManageAppointments from './pages/receptionist/ManageAppointments.jsx';
import RegisterPatient from './pages/receptionist/RegisterPatient.jsx';
import Billing from './pages/receptionist/Billing.jsx';
import PatientRecords_rec from './pages/receptionist/PatientRecords.jsx';
import HandleQueue from './pages/receptionist/HandleQueue.jsx';
import AddToQueue from './pages/receptionist/AddToQueue.jsx';
import RemoveFromQueue from './pages/receptionist/RemoveFromQueue.jsx';
import ConfirmNextPatient from './pages/receptionist/ConfirmNextPatient.jsx';
import IncreasePriority from './pages/receptionist/IncreasePriority.jsx';

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
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/patients" element={<PatientRecords />} />
        <Route path="/schedule" element={<ManageSchedule />} />
        <Route path="/handle-queue" element={<HandleQueue />} />
        <Route path="/manage-appointments" element={<ManageAppointments />} />
        <Route path="/register-patient" element={<RegisterPatient />} />
        <Route path="/patient-records" element={<PatientRecords_rec />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/prescriptions" element={<Prescriptions />} />
        <Route path="/my-appointment" element={<MyAppointment />} />
        <Route path="/admin-staff/clock-in" element={<ProtectedRoute role="admin"><ClockIn /> </ProtectedRoute>} />
        <Route path="/admin/manageusers/add" element={<ProtectedRoute role="admin"><AddUser /></ProtectedRoute>} />
        <Route path="/prescribe" element={<PrescribeMedication />} />
        <Route path="/admin-staff/clock-out" element={<ProtectedRoute role="admin"><ClockOut /></ProtectedRoute>} />
        <Route path="/medical-records" element={<MedicalRecords />} />
        <Route path="/admin/manageusers/view" element={<ProtectedRoute role="admin"><ViewUsers /></ProtectedRoute>}/>
        <Route path="/appointments" element={<DoctorAppointments />} />
        <Route path="/appointment-page" element={<AppointmentPage />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/admin/manageusers/delete" element={<ProtectedRoute role="admin"><DeleteUser /></ProtectedRoute>} />
        <Route path="/doctor/dashboard_1" element={<DoctorDashboard_1 />} />
        <Route path="/reception/queue/add" element={<AddToQueue />} />
        <Route path="/reception/queue/remove" element={<RemoveFromQueue />} />
        <Route path="/reception/queue/confirm" element={<ConfirmNextPatient />} />
        <Route path="/reception/queue/priority" element={<IncreasePriority />} />
        <Route path="/receptionist/dashboard" element={<ReceptionistDashboard />} />
        <Route path="/admin/manageusers"element={<ProtectedRoute role="admin"><ManageUsers /></ProtectedRoute>} />
        <Route path="/admin/dashboard"element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      </Routes>
    </>
  );
};

export default App;
