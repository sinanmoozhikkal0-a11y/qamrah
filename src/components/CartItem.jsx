import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import QuantitySelector from './QuantitySelector';
import { useCart } from '../context/CartContext';

export default function CartItem({ item }) {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

  const unitTotal = item.price + (item.packPriceAdjustment || 0);
  const lineTotal = unitTotal * item.quantity;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '80px 1fr auto auto',
        gap: '20px',
        alignItems: 'center',
        padding: '20px',
        borderBottom: '1px solid rgba(199, 154, 74, 0.15)',
        backgroundColor: 'rgba(15, 35, 23, 0.4)',
        borderRadius: '8px',
        marginBottom: '12px'
      }}
      className="cart-item-row"
    >
      {/* Thumbnail */}
      <Link to={`/product/${item.slug || item.id}`} style={{ display: 'block', width: '80px', height: '80px', flexShrink: 0 }}>
        <img
          src={item.image}
          alt={item.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '6px',
            border: '1px solid rgba(199, 154, 74, 0.25)'
          }}
        />
      </Link>

      {/* Info */}
      <div>
        <div style={{ fontSize: '0.725rem', color: 'var(--color-gold-base)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2px' }}>
          {item.categoryName}
        </div>
        <h4 style={{ fontSize: '1.05rem', marginBottom: '4px', fontFamily: 'var(--font-heading)' }}>
          <Link to={`/product/${item.slug || item.id}`} style={{ color: '#FFFFFF' }}>
            {item.name}
          </Link>
        </h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--color-cream-muted)' }}>
          <span className="badge-gold" style={{ padding: '2px 8px', fontSize: '0.65rem' }}>
            {item.weight}
          </span>
          {item.packDesign && (
            <span style={{ color: 'var(--color-gold-light)', fontSize: '0.75rem', fontWeight: '600' }}>
              • Pack: {item.packDesign} {item.packPriceAdjustment > 0 ? `(+₹${item.packPriceAdjustment})` : ''}
            </span>
          )}
          <span>•</span>
          <span>₹{unitTotal} each</span>
        </div>
      </div>

      {/* Quantity Stepper */}
      <div>
        <QuantitySelector
          quantity={item.quantity}
          onIncrease={() => increaseQuantity(item.id, item.weight, item.packDesign)}
          onDecrease={() => decreaseQuantity(item.id, item.weight, item.packDesign)}
          size="small"
        />
      </div>

      {/* Total & Delete Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', textAlign: 'right' }}>
        <span style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--color-gold-light)', minWidth: '70px' }}>
          ₹{lineTotal}
        </span>

        <button
          onClick={() => removeFromCart(item.id, item.weight, item.packDesign)}
          aria-label={`Remove ${item.name} from cart`}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--color-text-subtle)',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '50%',
            transition: 'color 0.2s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-danger)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-subtle)')}
        >
          <Trash2 size={17} />
        </button>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .cart-item-row {
            grid-template-columns: 70px 1fr !important;
            grid-template-rows: auto auto;
            gap: 14px !important;
          }
          .cart-item-row > div:nth-child(3) {
            grid-column: 2;
          }
          .cart-item-row > div:nth-child(4) {
            grid-column: 2;
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
}
