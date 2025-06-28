import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/Authcontext';

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated || userRole !== role) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
