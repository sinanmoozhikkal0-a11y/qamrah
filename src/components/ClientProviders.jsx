'use client';

import React from 'react';
import { ToastProvider } from '../context/ToastContext';
import { AuthProvider } from '../context/AuthContext';
import { WishlistProvider } from '../context/WishlistContext';
import { CartProvider } from '../context/CartContext';
import { AdminAuthProvider } from '../context/AdminAuthContext';

export default function ClientProviders({ children }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <AdminAuthProvider>
              {children}
            </AdminAuthProvider>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
