import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    try {
      const saved = localStorage.getItem('qamrah_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('qamrah_admin_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const res = await api.auth.getMe();
          if (res.success && res.data?.admin) {
            setAdmin(res.data.admin);
            localStorage.setItem('qamrah_admin_user', JSON.stringify(res.data.admin));
          } else {
            handleLogout();
          }
        } catch {
          handleLogout();
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, [token]);

  const handleLogin = async (username, password) => {
    const res = await api.auth.login(username, password);
    if (res.success && res.data?.token) {
      setToken(res.data.token);
      setAdmin(res.data.admin);
      localStorage.setItem('qamrah_admin_token', res.data.token);
      localStorage.setItem('qamrah_admin_user', JSON.stringify(res.data.admin));
      return { success: true };
    }
    return { success: false, message: res.message || 'Login failed' };
  };

  const handleLogout = () => {
    api.auth.logout();
    setToken(null);
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: !!token,
        loading,
        login: handleLogin,
        logout: handleLogout
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
}
