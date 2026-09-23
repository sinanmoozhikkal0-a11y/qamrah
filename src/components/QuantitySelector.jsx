import React from 'react';
import { Minus, Plus } from 'lucide-react';

export default function QuantitySelector({
  quantity = 1,
  onIncrease,
  onDecrease,
  min = 1,
  max = 99,
  size = 'medium'
}) {
  const isSmall = size === 'small';

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: 'rgba(7, 19, 13, 0.9)',
        border: '1px solid rgba(199, 154, 74, 0.35)',
        borderRadius: 'var(--radius-sm)',
        padding: isSmall ? '2px' : '4px',
        userSelect: 'none'
      }}
    >
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= min}
        aria-label="Decrease quantity"
        style={{
          width: isSmall ? '26px' : '34px',
          height: isSmall ? '26px' : '34px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          border: 'none',
          color: quantity <= min ? 'var(--color-text-subtle)' : 'var(--color-gold-base)',
          cursor: quantity <= min ? 'not-allowed' : 'pointer',
          borderRadius: '4px',
          transition: 'all 0.15s'
        }}
      >
        <Minus size={isSmall ? 12 : 14} />
      </button>

      <span
        style={{
          width: isSmall ? '30px' : '44px',
          textAlign: 'center',
          fontSize: isSmall ? '0.85rem' : '0.95rem',
          fontWeight: '700',
          color: 'var(--color-cream-base)'
        }}
      >
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        disabled={quantity >= max}
        aria-label="Increase quantity"
        style={{
          width: isSmall ? '26px' : '34px',
          height: isSmall ? '26px' : '34px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          border: 'none',
          color: quantity >= max ? 'var(--color-text-subtle)' : 'var(--color-gold-base)',
          cursor: quantity >= max ? 'not-allowed' : 'pointer',
          borderRadius: '4px',
          transition: 'all 0.15s'
        }}
      >
        <Plus size={isSmall ? 12 : 14} />
      </button>
    </div>
  );
}
