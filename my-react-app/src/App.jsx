import React from 'react';
import { Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar.jsx';
import Homepage from './pages/HomePage.jsx';
import Login from './pages/Login.jsx';
import EmailVerification from './pages/EmailVerification.jsx';
import QueueUp from './pages/QueueUp.jsx';
import Signup from './pages/Signup.jsx';
import NumberAndDetails from './pages/NumberAndDetails.jsx';
import ViewQueue from './pages/ViewQueue.jsx';
import AppointmentPage from './pages/AppointmentPage.jsx';
import MyAppointment from './pages/MyAppointment.jsx';

function App() {
  return (
    <>
    <NavBar />
      <Routes>
      <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/appointment-page" element={<AppointmentPage />} />
        <Route path="/view-queue" element={<ViewQueue />} />
        <Route path="/queue-up" element={<QueueUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/my-appointment" element={<MyAppointment />} />
        <Route path="numberanddetails" element={<NumberAndDetails/>} />
      </Routes>
    </>
  );
};

export default App;
