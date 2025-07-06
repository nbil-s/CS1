import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';

export default function AuthWrapper({ children }) {
  const navigate = useNavigate();

  return (
    <AuthProvider navigate={navigate}>
      {children}
    </AuthProvider>
  );
}
