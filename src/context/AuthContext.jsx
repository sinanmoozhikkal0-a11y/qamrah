'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const AuthContext = createContext();

const AUTH_STORAGE_KEY = 'qamrah_auth_user_v1';
const rawApiUrl = import.meta.env.VITE_API_URL || 'https://qamrah-backend-livid.vercel.app/api';
const API_BASE_URL = rawApiUrl.replace(/\/+$/, '').endsWith('/api')
  ? rawApiUrl.replace(/\/+$/, '')
  : `${rawApiUrl.replace(/\/+$/, '')}/api`;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Error reading auth user from localStorage', e);
      return null;
    }
  });

  const { addToast } = useToast();

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Error updating auth in localStorage', e);
    }
  }, [user]);

  // Verify session on mount
  useEffect(() => {
    const verifyToken = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('qamrah_customer_token') : null;
      if (token) {
        try {
          const res = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const json = await res.json();
          if (json.success && json.data?.user) {
            setUser(json.data.user);
          } else {
            localStorage.removeItem('qamrah_customer_token');
            setUser(null);
          }
        } catch {
          // Keep current state on network failure
        }
      }
    };
    verifyToken();
  }, []);

  const login = async (email, password, _rememberMe = true) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Invalid email or password.');
      }
      const token = data.data.token;
      const loggedInUser = data.data.user;
      localStorage.setItem('qamrah_customer_token', token);
      setUser(loggedInUser);
      addToast(`Welcome back to QAMRAH, ${loggedInUser.name}!`);
      return { success: true, user: loggedInUser };
    } catch (err) {
      throw err;
    }
  };

  const register = async (name, email, password, phone = '') => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Registration failed.');
      }
      const token = data.data.token;
      const newUser = data.data.user;
      localStorage.setItem('qamrah_customer_token', token);
      setUser(newUser);
      addToast(`Account created! Welcome to QAMRAH, ${name}.`);
      return { success: true, user: newUser };
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('qamrah_customer_token');
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
    addToast('You have been signed out.');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
