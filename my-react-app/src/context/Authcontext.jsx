import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!sessionStorage.getItem('token'));
  const [userRole, setUserRole] = useState(sessionStorage.getItem('role') || 'patient');
  const [staffType, setStaffType] = useState(sessionStorage.getItem('staffType') || '');
  const [hasAppointment, setHasAppointment] = useState(false);
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);

  const checkAppointment = async () => {
    const token = sessionStorage.getItem('token');
    const role = sessionStorage.getItem('role');
    const verified = sessionStorage.getItem('verified') === 'true';

    if (!token || !verified || role !== 'patient') {
      setHasAppointment(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/my-appointment', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setHasAppointment(!!data.appointment);
    } catch (err) {
      console.error("Failed to check appointment:", err);
      setHasAppointment(false);
    }
  };

  const login = async (token, role, verified = true, incomingStaffType = '') => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('role', role);
    sessionStorage.setItem('verified', verified ? 'true' : 'false');

    setIsAuthenticated(true);
    setUserRole(role);

    if (role === 'staff' && incomingStaffType) {
      sessionStorage.setItem('staffType', incomingStaffType);
      setStaffType(incomingStaffType);
    }

    if (verified && role === 'patient') {
      await checkAppointment();
    }
  };

  const logout = () => {
    sessionStorage.clear();
    setIsAuthenticated(false);
    setUserRole('patient');
    setStaffType('');
    setHasAppointment(false);

    navigateRef.current('/');

  };

    useEffect(() => {
    let timer;
    const resetTimer = () => {
      clearTimeout(timer);
      if (isAuthenticated && userRole === 'admin') {
        timer = setTimeout(() => {
          alert("Logged out due to inactivity.");
          logout();
        }, 5 * 60 * 1000);
      }
    };

    if (isAuthenticated && userRole === 'admin') {
      window.addEventListener('mousemove', resetTimer);
      window.addEventListener('keydown', resetTimer);
      window.addEventListener('click', resetTimer);
      resetTimer();
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
    };
  }, [isAuthenticated, userRole]);


  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        hasAppointment,
        login,
        logout,
        userRole,
        checkAppointment,
        setHasAppointment,
        staffType,
        setStaffType,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
