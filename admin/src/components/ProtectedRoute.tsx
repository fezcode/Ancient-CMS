import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center h-screen bg-ancient-950 text-gold-500">Loading...</div>;
  if (!token) return <Navigate to="/login" />;

  return <>{children}</>;
};

export default ProtectedRoute;
