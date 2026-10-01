'use client';

import React from 'react';
import ProtectedRoute from '../../src/admin/components/ProtectedRoute';
import AdminLayout from '../../src/admin/components/AdminLayout';
import { usePathname } from 'next/navigation';

export default function AdminRootLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        {children}
      </AdminLayout>
    </ProtectedRoute>
  );
}
