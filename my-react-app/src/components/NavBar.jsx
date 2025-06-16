import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './NavBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUser, faHome, faCalendarAlt, faListAlt, faFileMedical, faPills, faUserMd, faUserNurse, faUserShield, faClipboardList, faEye, faPlus } from '@fortawesome/free-solid-svg-icons';

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <FontAwesomeIcon icon={faHome} /> Clinic Queue
          </Link>
          <div className="nav-menu">
            <Link to="/login" className="nav-link">
              <FontAwesomeIcon icon={faUser} /> Login
            </Link>
            <Link to="/signup" className="nav-link">
              <FontAwesomeIcon icon={faUser} /> Sign Up
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  const renderPatientLinks = () => (
    <>
      <Link to="/patient/dashboard" className="nav-link">
        <FontAwesomeIcon icon={faHome} /> Dashboard
      </Link>
      <Link to="/book" className="nav-link">
        <FontAwesomeIcon icon={faCalendarAlt} /> Book Appointment
      </Link>
      <Link to="/queue" className="nav-link">
        <FontAwesomeIcon icon={faListAlt} /> Join Queue
      </Link>
      <Link to="/queue-status" className="nav-link">
        <FontAwesomeIcon icon={faEye} /> Queue Status
      </Link>
      <Link to="/medical-records" className="nav-link">
        <FontAwesomeIcon icon={faFileMedical} /> Medical Records
      </Link>
      <Link to="/prescriptions" className="nav-link">
        <FontAwesomeIcon icon={faPills} /> Prescriptions
      </Link>
    </>
  );

  const renderDoctorLinks = () => (
    <>
      <Link to="/doctor/dashboard" className="nav-link">
        <FontAwesomeIcon icon={faUserMd} /> Dashboard
      </Link>
      <Link to="/view-queue" className="nav-link">
        <FontAwesomeIcon icon={faClipboardList} /> View Queue
      </Link>
      <Link to="/appointment-page" className="nav-link">
        <FontAwesomeIcon icon={faCalendarAlt} /> Appointments
      </Link>
    </>
  );

  const renderReceptionistLinks = () => (
    <>
      <Link to="/receptionist/dashboard" className="nav-link">
        <FontAwesomeIcon icon={faUserNurse} /> Dashboard
      </Link>
      <Link to="/queue-up" className="nav-link">
        <FontAwesomeIcon icon={faPlus} /> Queue Management
      </Link>
      <Link to="/numberanddetails" className="nav-link">
        <FontAwesomeIcon icon={faClipboardList} /> Number & Details
      </Link>
    </>
  );

  const renderAdminLinks = () => (
    <>
      <Link to="/admin/dashboard" className="nav-link">
        <FontAwesomeIcon icon={faUserShield} /> Admin Dashboard
      </Link>
    </>
  );

  const renderUserLinks = () => {
    switch (user.role) {
      case 'patient':
        return renderPatientLinks();
      case 'doctor':
        return renderDoctorLinks();
      case 'receptionist':
        return renderReceptionistLinks();
      case 'admin':
        return renderAdminLinks();
      default:
        return null;
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <FontAwesomeIcon icon={faHome} /> Clinic Queue
        </Link>
        <div className="nav-menu">
          {renderUserLinks()}
          <button onClick={handleLogout} className="nav-link logout-btn">
            <FontAwesomeIcon icon={faSignOutAlt} /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
