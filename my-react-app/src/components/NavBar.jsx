import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './NavBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUser, faHome, faCalendarAlt, faListAlt, faFileMedical, faPills, faUserMd, faUserNurse, faUserShield, faClipboardList, faEye, faPlus, faInfoCircle, faCogs } from '@fortawesome/free-solid-svg-icons';

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Only show navbar for logged-in users
  if (!user) {
    return null;
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
