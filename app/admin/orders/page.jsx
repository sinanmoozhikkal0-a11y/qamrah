'use client';

import React, { Suspense } from 'react';
import OrdersCMS from '../../../src/admin/pages/OrdersCMS';

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={null}>
      <OrdersCMS />
    </Suspense>
  );
}
