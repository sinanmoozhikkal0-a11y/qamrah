import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ShieldCheck, Trash2, Sparkles, Truck } from 'lucide-react';
import CartItem from '../components/CartItem';
import CheckoutModal from '../components/CheckoutModal';
import SEO from '../components/SEO';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const {
    cartItems,
    subtotal,
    discountAmount,
    shipping,
    total,
    clearCart,
    coupon,
    applyCoupon,
    removeCoupon,
    amountToFreeShipping,
    freeShippingThreshold
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    const result = applyCoupon(couponInput);
    if (!result.success) {
      setCouponError(result.message);
    } else {
      setCouponInput('');
    }
  };

  const freeShippingProgress = Math.min(100, Math.round(((freeShippingThreshold - amountToFreeShipping) / freeShippingThreshold) * 100));

  if (!cartItems || cartItems.length === 0) {
    return (
      <div style={{ backgroundColor: '#07130D', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
        <SEO title="Your Cart" noIndex={true} />
        <div className="luxury-card" style={{ maxWidth: '520px', width: '100%', padding: '54px 32px', textAlign: 'center' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(199, 154, 74, 0.1)',
              border: '1px solid var(--color-gold-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-gold-base)',
              margin: '0 auto 24px'
            }}
          >
            <ShoppingBag size={32} />
          </div>

          <div className="eyebrow-label" style={{ justifyContent: 'center' }}>YOUR SHOPPING BAG</div>
          <h2 style={{ fontSize: '1.85rem', color: '#FFFFFF', marginBottom: '12px' }}>
            Your Cart is Empty
          </h2>
          <p style={{ color: 'var(--color-cream-muted)', fontSize: '0.95rem', marginBottom: '32px', lineHeight: '1.6' }}>
            You haven't added any luxury nuts or dates to your bag yet. Explore our royal collection and elevate your daily nutrition.
          </p>

          <Link to="/shop" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
            <span>START SHOPPING</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#07130D', minHeight: '100vh', padding: '48px 0 90px' }}>
      <SEO title="Your Cart" noIndex={true} />
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div className="eyebrow-label">
              <Sparkles size={14} color="#D8B66A" />
              <span>SHOPPING BAG</span>
            </div>
            <h1 style={{ fontSize: '2.4rem', color: '#FFFFFF' }}>
              Your <span className="text-gold-gradient">Selected Items</span>
            </h1>
          </div>

          <button
            onClick={clearCart}
            style={{
              background: 'transparent',
              border: '1px solid rgba(199, 154, 74, 0.25)',
              color: 'var(--color-text-subtle)',
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-danger)';
              e.currentTarget.style.borderColor = 'var(--color-danger)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-text-subtle)';
              e.currentTarget.style.borderColor = 'rgba(199, 154, 74, 0.25)';
            }}
          >
            <Trash2 size={14} />
            <span>Clear Cart</span>
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div
          className="luxury-card"
          style={{
            padding: '18px 24px',
            marginBottom: '32px',
            backgroundColor: '#0A1B12',
            border: '1px solid var(--color-gold-border)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-cream-base)' }}>
              <Truck size={16} color="#D8B66A" />
              {amountToFreeShipping > 0 ? (
                <span>
                  Add <strong style={{ color: 'var(--color-gold-light)' }}>₹{amountToFreeShipping}</strong> more to qualify for <strong>FREE Express Shipping</strong>
                </span>
              ) : (
                <span style={{ color: '#68D391', fontWeight: '700' }}>
                  ✓ Congratulations! You have unlocked FREE Express Air Shipping!
                </span>
              )}
            </div>
            <span style={{ color: 'var(--color-gold-base)', fontWeight: '700' }}>{freeShippingProgress}%</span>
          </div>

          <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(7, 19, 13, 0.8)', borderRadius: '3px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${freeShippingProgress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #D8B66A, #C79A4A)',
                borderRadius: '3px',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div>

        {/* 2-Column Grid: Cart Item List & Summary */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 380px',
            gap: '36px',
            alignItems: 'flex-start'
          }}
          className="cart-layout-grid"
        >
          {/* Item List */}
          <div>
            {cartItems.map((item) => (
              <CartItem key={`${item.id}-${item.weight}`} item={item} />
            ))}

            <div style={{ marginTop: '24px' }}>
              <Link
                to="/shop"
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--color-gold-base)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: '600'
                }}
              >
                <span>← Continue Shopping for More Premium Nuts</span>
              </Link>
            </div>
          </div>

          {/* Order Summary Card */}
          <div
            className="luxury-card"
            style={{
              padding: '30px',
              backgroundColor: '#091A11',
              border: '1px solid var(--color-gold-border)',
              position: 'sticky',
              top: '100px'
            }}
          >
            <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '20px', borderBottom: '1px solid rgba(199, 154, 74, 0.2)', paddingBottom: '12px' }}>
              Order Summary
            </h3>

            {/* Price Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-cream-muted)' }}>Bag Subtotal:</span>
                <span style={{ color: '#FFFFFF', fontWeight: '600' }}>₹{subtotal}</span>
              </div>

              {coupon && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#68D391' }}>
                  <span>{coupon.label}:</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-cream-muted)' }}>Express Air Shipping:</span>
                <span style={{ color: shipping === 0 ? 'var(--color-gold-base)' : '#FFFFFF', fontWeight: '600' }}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: '1px solid rgba(199, 154, 74, 0.2)',
                  paddingTop: '14px',
                  marginTop: '4px',
                  fontSize: '1.2rem',
                  fontWeight: '700'
                }}
              >
                <span style={{ color: '#FFFFFF' }}>Total:</span>
                <span style={{ color: 'var(--color-gold-light)' }}>₹{total}</span>
              </div>
            </div>

            {/* Promo Code Input */}
            <div style={{ marginBottom: '24px', paddingTop: '16px', borderTop: '1px solid rgba(199, 154, 74, 0.15)' }}>
              {coupon ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(199, 154, 74, 0.15)',
                    padding: '10px 14px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-gold-border)'
                  }}
                >
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-gold-light)' }}>
                    Code <strong>{coupon.code}</strong> active (-{coupon.discountPercent}%)
                  </div>
                  <button
                    onClick={removeCoupon}
                    style={{ background: 'none', border: 'none', color: 'var(--color-text-subtle)', cursor: 'pointer', fontSize: '0.75rem', textDecoration: 'underline' }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Coupon code (e.g. QAMRAH10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="luxury-input"
                    style={{ height: '40px', fontSize: '0.8rem' }}
                  />
                  <button type="submit" className="btn btn-outline" style={{ padding: '8px 14px', fontSize: '0.75rem' }}>
                    APPLY
                  </button>
                </form>
              )}
              {couponError && (
                <div style={{ fontSize: '0.75rem', color: 'var(--color-danger)', marginTop: '4px' }}>
                  {couponError}
                </div>
              )}
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginBottom: '16px' }}
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>
              <ShieldCheck size={14} color="#D8B66A" />
              <span>100% Encrypted &amp; Secure Payment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />

      <style>{`
        @media (max-width: 900px) {
          .cart-layout-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
