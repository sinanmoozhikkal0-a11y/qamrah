'use client';

import React, { Suspense } from 'react';
import Cart from '../../src/pages/Cart';

export default function CartPage() {
  return (
    <Suspense fallback={null}>
      <Cart />
    </Suspense>
  );
}
