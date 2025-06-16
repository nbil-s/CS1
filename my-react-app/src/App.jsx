import React from 'react';
import { Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar.jsx';
import HomePage from './pages/Homepage.jsx';
import Login from './pages/Login.jsx';
import OtpVerify from './pages/OtpVerify.jsx';
import QueueUp from './pages/QueueUp.jsx';
import Signup from './pages/Signup.jsx';
import NumberAndDetails from './pages/NumberAndDetails.jsx';
import ViewQueue from './pages/ViewQueue.jsx';
import AppointmentPage from './pages/AppointmentPage.jsx';

function App() {
  return (
    <>
    <NavBar />
      <Routes>
      <Route path="/verify-otp" element={<OtpVerify />} />
        <Route path="/appointment-page" element={<AppointmentPage />} />
        <Route path="/view-queue" element={<ViewQueue />} />
        <Route path="/queue-up" element={<QueueUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="numberanddetails" element={<NumberAndDetails/>} />
      </Routes>
    </>
  );
};

export default App;
