import React from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({
  products = [],
  onQuickView,
  emptyMessage = 'No products found matching your selection.'
}) {
  if (!products || products.length === 0) {
    return (
      <div
        className="luxury-card"
        style={{
          padding: '48px 24px',
          textAlign: 'center',
          color: 'var(--color-text-muted)'
        }}
      >
        <p style={{ fontSize: '1.1rem', marginBottom: '16px' }}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fill, minmax(240px, 1fr))`,
        gap: '24px'
      }}
      className="product-grid"
    >
      {products.map((product) => (
        <ProductCard key={product.slug || product._id || product.id} product={product} onQuickView={onQuickView} />
      ))}
    </div>
  );
}
