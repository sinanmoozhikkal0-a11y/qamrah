import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAdminAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#07130D',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--admin-gold-base)'
        }}
      >
        Authenticating QAMRAH CMS...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
