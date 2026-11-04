import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingScreen } from './LoadingScreen';

export const AdminRoute: React.FC = () => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  if (!user) return <Navigate to="/admin/login" replace />;

  if (!isAdmin) return <Navigate to="/admin/login" replace />;

  return <Outlet />;
};
