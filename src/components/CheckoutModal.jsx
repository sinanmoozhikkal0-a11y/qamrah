import React, { useState } from 'react';
import { X, ShieldCheck, Banknote, Sparkles, MessageCircle, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function CheckoutModal({ isOpen, onClose }) {
  const { cartItems, total, discountedSubtotal, shipping, discountAmount, clearCart } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    notes: '',
    paymentMethod: 'Cash on Delivery'
  });

  const [isOrdered, setIsOrdered] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const orderPayload = {
        customer: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          notes: formData.notes
        },
        items: cartItems.map((item) => ({
          productId: item.productId || item.id,
          name: item.name,
          slug: item.slug,
          image: item.image,
          weight: item.weight,
          price: item.price,
          quantity: item.quantity,
          packDesign: item.packDesign || 'Classic QAMRAH Pack',
          packPriceAdjustment: item.packPriceAdjustment || 0
        })),
        subtotal: discountedSubtotal + discountAmount,
        shipping,
        discount: discountAmount,
        total,
        paymentMethod: formData.paymentMethod
      };

      const res = await api.orders.create(orderPayload);

      if (res.success && res.data) {
        const generatedId = res.data.orderId || res.data.order?.orderId;
        setOrderId(generatedId);
        setWhatsappUrl(res.data.whatsappFallbackUrl || '');
        setIsOrdered(true);

        // Trigger Luxury Confetti
        try {
          confetti({
            particleCount: 90,
            spread: 75,
            origin: { y: 0.6 },
            colors: ['#D8B66A', '#C79A4A', '#F5DE98', '#102217', '#FFFFFF']
          });
        } catch {
          // ignore if canvas confetti unavailable
        }

        clearCart();
      } else {
        setError(res.message || 'Failed to place order. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOrdered(false);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(4, 12, 8, 0.88)',
        backdropFilter: 'blur(12px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflowY: 'auto'
      }}
      onClick={handleClose}
    >
      <div
        className="luxury-card"
        style={{
          width: '100%',
          maxWidth: '680px',
          backgroundColor: '#091A11',
          border: '1px solid var(--color-gold-border)',
          borderRadius: 'var(--radius-md)',
          padding: '32px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.8), 0 0 35px rgba(199,154,74,0.2)',
          position: 'relative',
          animation: 'fadeInUp 0.3s ease forwards',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            color: 'var(--color-cream-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={22} />
        </button>

        {isOrdered ? (
          /* Order Placed Success View */
          <div style={{ textAlign: 'center', padding: '24px 12px' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'rgba(199, 154, 74, 0.15)',
                border: '2px solid var(--color-gold-base)',
                color: 'var(--color-gold-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 0 25px rgba(216, 182, 106, 0.3)'
              }}
            >
              <Sparkles size={36} />
            </div>

            <div className="eyebrow-label" style={{ justifyContent: 'center' }}>
              <span>CONNOISSEUR ORDER CONFIRMED</span>
            </div>

            <h2 style={{ fontSize: '1.85rem', marginBottom: '12px', color: '#FFFFFF' }}>
              Thank You For Your Order!
            </h2>

            <p style={{ color: 'var(--color-cream-muted)', fontSize: '0.95rem', marginBottom: '24px' }}>
              Your order <strong style={{ color: 'var(--color-gold-light)' }}>#{orderId}</strong> has been saved and an instant notification has been dispatched to our concierge team at <strong style={{ color: '#FFFFFF' }}>+91 62358 20223</strong>.
            </p>

            <div
              style={{
                backgroundColor: 'rgba(7, 19, 13, 0.8)',
                border: '1px solid rgba(199, 154, 74, 0.25)',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '24px',
                textAlign: 'left',
                fontSize: '0.875rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--color-text-subtle)' }}>Recipient:</span>
                <span style={{ fontWeight: '600', color: 'var(--color-cream-base)' }}>{formData.name || 'Valued Customer'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--color-text-subtle)' }}>Destination:</span>
                <span style={{ fontWeight: '600', color: 'var(--color-cream-base)' }}>{formData.city}, {formData.pincode}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--color-text-subtle)' }}>Estimated Dispatch:</span>
                <span style={{ fontWeight: '600', color: 'var(--color-gold-base)' }}>Within 24 Hours (Express Courier)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(199, 154, 74, 0.2)', paddingTop: '10px', marginTop: '10px' }}>
                <span style={{ color: 'var(--color-cream-base)', fontWeight: '700' }}>Amount to Pay (COD):</span>
                <span style={{ color: 'var(--color-gold-light)', fontWeight: '700', fontSize: '1.05rem' }}>₹{total}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#68D391', borderColor: 'rgba(104,211,145,0.4)' }}
                >
                  <MessageCircle size={18} />
                  <span>Open WhatsApp Order Confirmation</span>
                </a>
              )}

              <button
                onClick={handleClose}
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
              >
                CONTINUE SHOPPING
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form View */
          <div>
            <div className="eyebrow-label" style={{ marginBottom: '6px' }}>
              <ShieldCheck size={14} color="#D8B66A" />
              <span>100% SECURE &amp; ENCRYPTED CHECKOUT</span>
            </div>

            <h2 style={{ fontSize: '1.6rem', marginBottom: '20px', color: '#FFFFFF' }}>
              Complete Your Order
            </h2>

            {error && (
              <div
                style={{
                  backgroundColor: 'rgba(229, 62, 62, 0.15)',
                  border: '1px solid rgba(229, 62, 62, 0.4)',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#FC8181',
                  fontSize: '0.85rem',
                  marginBottom: '16px'
                }}
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Order Items Snapshot */}
            <div
              style={{
                background: 'rgba(7, 19, 13, 0.7)',
                border: '1px solid rgba(199, 154, 74, 0.2)',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '20px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Items Subtotal:</span>
                <span style={{ color: 'var(--color-cream-base)', fontWeight: '600' }}>₹{discountedSubtotal + discountAmount}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#68D391', marginBottom: '6px' }}>
                  <span>Privilege Discount:</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Express Shipping:</span>
                <span style={{ color: shipping === 0 ? 'var(--color-gold-base)' : 'var(--color-cream-base)' }}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: '700', borderTop: '1px solid rgba(199, 154, 74, 0.2)', paddingTop: '10px', marginTop: '8px' }}>
                <span style={{ color: '#FFFFFF' }}>Total to Pay:</span>
                <span style={{ color: 'var(--color-gold-light)' }}>₹{total}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-gold-base)', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="luxury-input"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-gold-base)', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="luxury-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-gold-base)', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="rahul@example.com"
                    className="luxury-input"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-gold-base)', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Order Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g. Please call before delivery"
                    className="luxury-input"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-gold-base)', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Delivery Address *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Flat / Building, Street, Landmark"
                  className="luxury-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-gold-base)', marginBottom: '6px', textTransform: 'uppercase' }}>
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="luxury-input"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-gold-base)', marginBottom: '6px', textTransform: 'uppercase' }}>
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="luxury-input"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-gold-base)', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Pincode *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="luxury-input"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-gold-base)', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Payment Method:
                </label>
                <div
                  style={{
                    border: '1.5px solid var(--color-gold-base)',
                    backgroundColor: 'rgba(199, 154, 74, 0.15)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <Banknote size={22} color="#D8B66A" />
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#FFFFFF' }}>
                      Cash on Delivery (COD)
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-cream-muted)' }}>
                      Pay in cash or UPI directly upon doorstep delivery.
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: '12px' }}
              >
                {isSubmitting ? 'CONFIRMING ORDER...' : `PLACE ORDER (₹${total})`}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
