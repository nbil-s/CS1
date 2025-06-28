import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token');
  });
  const [userRole, setUserRole] = useState(localStorage.getItem('role') || 'patient');
  const [hasAppointment, setHasAppointment] = useState(false);

  const checkAppointment = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setHasAppointment(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/my-appointment', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setHasAppointment(!!data.appointment);
    } catch (err) {
      console.error("Failed to check appointment:", err);
    }
  };

  

  const login = async (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    setIsAuthenticated(true);
    setUserRole(role);
    await checkAppointment(); // Check after login
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setUserRole('patient');
    setHasAppointment(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      checkAppointment();
    }
  }, [isAuthenticated]);

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
