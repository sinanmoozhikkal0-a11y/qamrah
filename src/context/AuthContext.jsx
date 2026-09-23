import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const AuthContext = createContext();

const AUTH_STORAGE_KEY = 'qamrah_auth_user_v1';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
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

  const login = (email, password, rememberMe = true) => {
    // Generate clean user profile from email if not preset
    const extractedName = email.split('@')[0];
    const formattedName = extractedName.charAt(0).toUpperCase() + extractedName.slice(1);

    const loggedInUser = {
      name: formattedName,
      email: email,
      memberTier: 'Gold Connoisseur',
      memberSince: '2026',
      avatarInitial: formattedName.charAt(0)
    };

    setUser(loggedInUser);
    addToast(`Welcome back to QAMRAH, ${formattedName}!`);
    return { success: true, user: loggedInUser };
  };

  const register = (name, email, password) => {
    const newUser = {
      name: name,
      email: email,
      memberTier: 'Royal Privilege Member',
      memberSince: '2026',
      avatarInitial: name.charAt(0).toUpperCase()
    };

    setUser(newUser);
    addToast(`Account created! Welcome to QAMRAH, ${name}.`);
    return { success: true, user: newUser };
  };

  const logout = () => {
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
