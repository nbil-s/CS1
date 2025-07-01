import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Authcontext';
import './NavBar.css';

const NavBar = () => {
  const { isAuthenticated, hasAppointment, logout, userRole } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const fetchAppointmentStatus = async () => {
      const token = sessionStorage.getItem('token');
      const verified = sessionStorage.getItem('verified') === 'true';
      const role = sessionStorage.getItem('role');
  
      if (!token || !verified || role !== 'patient') return;
  
      try {
        const response = await fetch('http://localhost:5000/api/my-appointment', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
  
        const data = await response.json();
        if (response.ok && data.appointment) {
          setHasAppointment(true);
        } else {
          setHasAppointment(false);
        }
      } catch (error) {
        console.error("Error checking appointment status", error);
        setHasAppointment(false);
      }
    };
  
    if (isAuthenticated) {
      fetchAppointmentStatus();
    }
  }, [isAuthenticated]);
  
  

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">ClinicQueue</Link>
        <nav className="navbar-links">
        {isAuthenticated && userRole === "patient" && (
            <>
              <Link to="/">Home</Link>
              <Link to="/view-queue">View Queue</Link>
              <Link to={hasAppointment ? "/my-appointment" : "/appointment-page"}>
                  {hasAppointment ? "My Appointment" : "Appointment"}
              </Link>
              <Link to="/queue-up">Queue Up</Link>
              <Link to="/my-details">My Details</Link>
            </>
          )}
          {isAuthenticated && userRole === "admin" && (
  <>
    <Link to="/admin/dashboard">Home</Link>
    <Link to="/admin/manageusers">Manage Users</Link>
    <Link to="/admin-staff/clock-in">Clock In</Link>
    <Link to="/admin-staff/clock-out">Clock Out</Link>
    <Link to="/admin/reports">Reports</Link>
    <Link to="/admin/audit-logs">Audit Logs</Link>
  </>
)}

{isAuthenticated && userRole === "staff" && (
  <>
    <Link to="/staff/dashboard">Home</Link>
    <Link to="/admin-staff/clock-in">Clock In</Link>
    <Link to="/admin-staff/clock-out">Clock Out</Link>
    <Link to="/staff/manage-appointments">Appointments</Link>
    <Link to="/staff/queue-management">Queue Management</Link>
    <Link to="/staff/patient-records">Patient Records</Link>
    <Link to="/staff/consultations">Consultations</Link>
  </>
)}

        </nav>
        <div className="navbar-auth">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="btn-outline">Login</Link>
              <Link to="/signup" className="btn-primary">Sign Up</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="btn-danger">Logout</button>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;