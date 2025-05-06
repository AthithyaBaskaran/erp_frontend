import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const RootRedirect: React.FC = () => {
  // Check if user is logged in
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('roles');
  
  // If not logged in, redirect to login page
  if (!token) {
    return <Navigate to="/" replace />;
  }
  
  // If logged in, redirect based on role
  if (role && typeof role === 'string') {
    const userRole = role.toLowerCase();
    if (userRole === 'supplier') {
      return <Navigate to="/supplier-dashboard" replace />;
    } else if (userRole === 'salesman') {
      return <Navigate to="/salesman-dashboard" replace />;
    } else if (userRole === 'inventory') {
      return <Navigate to="/inventory-dashboard" replace />;
    }
  }
  
  // Default redirect to main dashboard
  return <Navigate to="/dashboard" replace />;
};

export default RootRedirect;