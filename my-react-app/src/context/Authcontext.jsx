import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!sessionStorage.getItem('token');
  });
  const [userRole, setUserRole] = useState(sessionStorage.getItem('role') || 'patient');
  const [hasAppointment, setHasAppointment] = useState(false);

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
  
      if (!res.ok) {
        console.error("❌ Server error response:", data);
        return setHasAppointment(false);
      }
  
      setHasAppointment(!!data.appointment);
    } catch (err) {
      console.error("Failed to check appointment:", err);
      setHasAppointment(false);
    }
  };
  
  

  const login = async (token, role, verified = true) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('role', role);
    sessionStorage.setItem('verified', verified ? 'true' : 'false');
  
    setIsAuthenticated(true);
    setUserRole(role);
  
    // Only check appointments after verified and for patients
    if (verified && role === 'patient') {
      await checkAppointment();
    }
  };
  
  

  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    setIsAuthenticated(false);
    setUserRole('patient');
    setHasAppointment(false);
  };

  useEffect(() => {
    let timer;
  
    const resetTimer = () => {
      clearTimeout(timer);
      if (isAuthenticated && userRole === 'admin') {
        timer = setTimeout(() => {
          alert("Logged out due to inactivity.");
          logout();
        }, 5 * 60 * 1000); // 5 minutes
      }
    };
  
    if (isAuthenticated && userRole === 'admin') {
      window.addEventListener('mousemove', resetTimer);
      window.addEventListener('keydown', resetTimer);
      window.addEventListener('click', resetTimer);
      resetTimer(); // Start timer
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
        setHasAppointment, // optional: to manually update after booking
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
