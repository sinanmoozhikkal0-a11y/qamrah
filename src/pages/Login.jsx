import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  LogOut,
  ShoppingBag,
  Package,
  Eye,
  X,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Ban
} from 'lucide-react';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function Login() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Customer Orders state
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [cancelFeedback, setCancelFeedback] = useState('');

  // Load customer orders when user is logged in
  useEffect(() => {
    if (user) {
      loadMyOrders();
    }
  }, [user]);

  const loadMyOrders = async () => {
    setLoadingOrders(true);
    setOrdersError('');
    try {
      const res = await api.orders.getMyOrders();
      if (res.success) {
        setOrders(res.data || []);
      } else {
        setOrdersError(res.message || 'Unable to load orders');
      }
    } catch (err) {
      setOrdersError(err.message || 'Failed to fetch order history.');
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you wish to cancel this order? Stock will be restored.')) {
      return;
    }
    setCancellingOrderId(orderId);
    setCancelFeedback('');
    try {
      const res = await api.orders.cancel(orderId, 'Cancelled by customer via member account.');
      if (res.success) {
        setCancelFeedback('Order cancelled successfully.');
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId || o.orderId === orderId
              ? { ...o, status: 'Cancelled', orderStatus: 'cancelled' }
              : o
          )
        );
        if (selectedOrder && (selectedOrder._id === orderId || selectedOrder.orderId === orderId)) {
          setSelectedOrder((prev) => ({
            ...prev,
            status: 'Cancelled',
            orderStatus: 'cancelled'
          }));
        }
      } else {
        alert(res.message || 'Failed to cancel order');
      }
    } catch (err) {
      alert(err.message || 'Failed to cancel order.');
    } finally {
      setCancellingOrderId(null);
    }
  };

  const handleViewOrder = async (order) => {
    setSelectedOrder(order);
    try {
      // Fetch fresh details from backend
      const res = await api.orders.getById(order._id || order.orderId);
      if (res.success && res.data) {
        setSelectedOrder(res.data);
      }
    } catch {
      // Fallback to existing order object
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both email and password');
      return;
    }

    setSubmitting(true);
    try {
      const res = await login(email, password, rememberMe);
      if (res && !res.success) {
        setError(res.error || 'Invalid email or password.');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemo = async (demoEmail) => {
    setError('');
    setSubmitting(true);
    try {
      const res = await login(demoEmail, 'demo123', true);
      if (res && !res.success) {
        setError(res.error || 'Demo login failed.');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    let bg = 'rgba(216, 182, 106, 0.15)';
    let color = '#F5DE98';
    let border = '#D8B66A';

    if (s === 'delivered') {
      bg = 'rgba(104, 211, 145, 0.15)';
      color = '#68D391';
      border = '#68D391';
    } else if (s === 'cancelled') {
      bg = 'rgba(245, 101, 101, 0.15)';
      color = '#FC8181';
      border = '#E53E3E';
    } else if (s === 'confirmed' || s === 'processing') {
      bg = 'rgba(99, 179, 237, 0.15)';
      color = '#90CDF4';
      border = '#63B3ED';
    } else if (s === 'shipped') {
      bg = 'rgba(79, 209, 197, 0.15)';
      color = '#81E6D9';
      border = '#4FD1C5';
    }

    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '3px 8px',
          borderRadius: '4px',
          fontSize: '0.72rem',
          fontWeight: '700',
          textTransform: 'uppercase',
          backgroundColor: bg,
          color,
          border: `1px solid ${border}`
        }}
      >
        {status}
      </span>
    );
  };

  const getPaymentBadge = (status) => {
    const s = (status || '').toLowerCase();
    let bg = 'rgba(216, 182, 106, 0.15)';
    let color = '#F5DE98';
    let border = 'rgba(216, 182, 106, 0.3)';

    if (s === 'paid') {
      bg = 'rgba(104, 211, 145, 0.15)';
      color = '#68D391';
      border = 'rgba(104, 211, 145, 0.3)';
    } else if (s === 'failed' || s === 'refunded') {
      bg = 'rgba(245, 101, 101, 0.15)';
      color = '#FC8181';
      border = 'rgba(229, 62, 62, 0.3)';
    }

    return (
      <span
        style={{
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '0.7rem',
          fontWeight: '600',
          backgroundColor: bg,
          color,
          border: `1px solid ${border}`,
          textTransform: 'uppercase'
        }}
      >
        Pay: {status || 'pending'}
      </span>
    );
  };

  // ==========================================
  // LOGGED-IN CUSTOMER MEMBER ACCOUNT VIEW
  // ==========================================
  if (user) {
    return (
      <div style={{ backgroundColor: '#07130D', minHeight: '85vh', padding: '60px 20px' }}>
        <SEO title="Member Account & Orders" noIndex={true} />
        <div style={{ maxWidth: '980px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>

          {/* Feedback message banner */}
          {cancelFeedback && (
            <div
              style={{
                padding: '12px 18px',
                backgroundColor: 'rgba(104, 211, 145, 0.15)',
                border: '1px solid #68D391',
                borderRadius: '8px',
                color: '#68D391',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.9rem'
              }}
            >
              <CheckCircle size={18} />
              <span>{cancelFeedback}</span>
            </div>
          )}

          {/* Member Profile Overview Card */}
          <div className="luxury-card" style={{ padding: '36px 32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #E2BF72, #C79A4A)',
                    color: '#07130D',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.6rem',
                    fontWeight: '700',
                    boxShadow: '0 8px 20px rgba(199, 154, 74, 0.35)',
                    flexShrink: 0
                  }}
                >
                  {user.avatarInitial || (user.name ? user.name.charAt(0).toUpperCase() : 'Q')}
                </div>
                <div>
                  <div className="eyebrow-label" style={{ marginBottom: '4px' }}>
                    <Sparkles size={13} color="#D8B66A" />
                    <span>{user.memberTier || 'Royal Connoisseur Patron'}</span>
                  </div>
                  <h1 style={{ fontSize: '1.8rem', color: '#FFFFFF', margin: 0, fontWeight: '700' }}>
                    Welcome, {user.name}
                  </h1>
                  <p style={{ color: 'var(--color-cream-muted)', fontSize: '0.85rem', marginTop: '4px', margin: 0 }}>
                    {user.email} • Member since {user.memberSince || '2026'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <Link to="/shop" className="btn btn-primary btn-sm">
                  <ShoppingBag size={15} />
                  <span>CONTINUE SHOPPING</span>
                </Link>
                <button onClick={logout} className="btn btn-outline btn-sm">
                  <LogOut size={15} />
                  <span>LOGOUT</span>
                </button>
              </div>
            </div>
          </div>

          {/* Order History Section */}
          <div className="luxury-card" style={{ padding: '36px 32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div className="eyebrow-label">
                  <Package size={14} color="#D8B66A" />
                  <span>PURCHASE ARCHIVE</span>
                </div>
                <h2 style={{ fontSize: '1.5rem', color: '#FFFFFF', margin: '4px 0 0' }}>
                  Your Orders &amp; Delivery Tracking
                </h2>
              </div>

              <button
                onClick={loadMyOrders}
                disabled={loadingOrders}
                className="btn btn-outline btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <RefreshCw size={14} className={loadingOrders ? 'animate-spin' : ''} />
                <span>{loadingOrders ? 'Refreshing...' : 'Refresh Orders'}</span>
              </button>
            </div>

            {/* Error State */}
            {ordersError && (
              <div
                style={{
                  padding: '16px',
                  backgroundColor: 'rgba(229, 62, 62, 0.15)',
                  border: '1px solid rgba(229, 62, 62, 0.3)',
                  borderRadius: '8px',
                  color: '#FC8181',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <AlertCircle size={18} />
                  <span>{ordersError}</span>
                </div>
                <button onClick={loadMyOrders} className="btn btn-outline btn-sm" style={{ borderColor: '#FC8181', color: '#FC8181' }}>
                  Retry
                </button>
              </div>
            )}

            {/* Loading State */}
            {loadingOrders && orders.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--color-cream-muted)' }}>
                <Clock size={32} color="#D8B66A" style={{ margin: '0 auto 12px', display: 'block' }} className="animate-spin" />
                <p>Loading your connoisseur order history from server...</p>
              </div>
            )}

            {/* Empty State */}
            {!loadingOrders && orders.length === 0 && !ordersError && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '48px 20px',
                  background: 'rgba(7, 19, 13, 0.5)',
                  border: '1px dashed rgba(199, 154, 74, 0.25)',
                  borderRadius: '8px'
                }}
              >
                <ShoppingBag size={40} color="#D8B66A" style={{ margin: '0 auto 16px', opacity: 0.8 }} />
                <h3 style={{ color: '#FFFFFF', fontSize: '1.2rem', marginBottom: '8px' }}>
                  No Orders Placed Yet
                </h3>
                <p style={{ color: 'var(--color-cream-muted)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 20px' }}>
                  You have not made any purchases yet. Explore our royal dates and slow-roasted dry fruits collection.
                </p>
                <Link to="/shop" className="btn btn-primary btn-sm">
                  EXPLORE THE COLLECTION
                </Link>
              </div>
            )}

            {/* Orders List */}
            {orders.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {orders.map((order) => {
                  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  });
                  const isEligibleForCancel = ['pending', 'confirmed'].includes(
                    (order.orderStatus || order.status || '').toLowerCase()
                  );

                  return (
                    <div
                      key={order._id || order.orderId}
                      style={{
                        backgroundColor: 'rgba(7, 19, 13, 0.75)',
                        border: '1px solid rgba(199, 154, 74, 0.2)',
                        borderRadius: '8px',
                        padding: '20px',
                        transition: 'border-color 0.2s',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--color-gold-light)', letterSpacing: '0.04em' }}>
                            {order.orderId}
                          </span>
                          <span style={{ color: 'var(--color-text-subtle)', fontSize: '0.8rem' }}>
                            {formattedDate}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {getStatusBadge(order.status || order.orderStatus)}
                          {getPaymentBadge(order.paymentStatus)}
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', borderTop: '1px solid rgba(199, 154, 74, 0.1)', paddingTop: '12px' }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-cream-base)' }}>
                          <strong>{order.items?.length || 0} item{(order.items?.length || 0) > 1 ? 's' : ''}:</strong>{' '}
                          <span style={{ color: 'var(--color-cream-muted)' }}>
                            {(order.items || []).map((it) => `${it.name} (${it.weight || '250g'}) x${it.quantity}`).join(', ')}
                          </span>
                        </div>

                        <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#FFFFFF' }}>
                          ₹{order.total}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '6px' }}>
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="btn btn-outline btn-sm"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', padding: '6px 14px' }}
                        >
                          <Eye size={13} />
                          <span>View Details</span>
                        </button>

                        {isEligibleForCancel && (
                          <button
                            onClick={() => handleCancelOrder(order._id || order.orderId)}
                            disabled={cancellingOrderId === (order._id || order.orderId)}
                            className="btn btn-outline btn-sm"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '0.78rem',
                              padding: '6px 14px',
                              borderColor: 'rgba(229, 62, 62, 0.4)',
                              color: '#FEB2B2'
                            }}
                          >
                            <Ban size={13} />
                            <span>
                              {cancellingOrderId === (order._id || order.orderId) ? 'Cancelling...' : 'Cancel Order'}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(4, 12, 8, 0.88)',
              backdropFilter: 'blur(10px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              overflowY: 'auto'
            }}
            onClick={() => setSelectedOrder(null)}
          >
            <div
              className="luxury-card"
              style={{
                width: '100%',
                maxWidth: '680px',
                backgroundColor: '#091A11',
                border: '1px solid var(--color-gold-border)',
                borderRadius: '8px',
                padding: '32px',
                position: 'relative',
                maxHeight: '90vh',
                overflowY: 'auto'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedOrder(null)}
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
                <X size={20} />
              </button>

              <div className="eyebrow-label" style={{ marginBottom: '4px' }}>
                <Sparkles size={13} color="#D8B66A" />
                <span>ORDER SPECIFICATIONS</span>
              </div>
              <h2 style={{ fontSize: '1.6rem', color: '#FFFFFF', marginBottom: '4px' }}>
                {selectedOrder.orderId}
              </h2>
              <div style={{ color: 'var(--color-cream-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
                Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
              </div>

              {/* Status and Payment summary */}
              <div
                style={{
                  backgroundColor: 'rgba(7, 19, 13, 0.8)',
                  border: '1px solid rgba(199, 154, 74, 0.2)',
                  borderRadius: '6px',
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-cream-muted)' }}>Status:</span>
                  {getStatusBadge(selectedOrder.status || selectedOrder.orderStatus)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-cream-muted)' }}>Payment:</span>
                  {getPaymentBadge(selectedOrder.paymentStatus)}
                </div>
              </div>

              {/* Delivery Address & Contact */}
              <div style={{ marginBottom: '20px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid rgba(199, 154, 74, 0.15)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-gold-base)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Shipping Destination
                </div>
                <div style={{ fontWeight: '600', color: '#FFFFFF', fontSize: '0.9rem' }}>
                  {selectedOrder.customer?.name}
                </div>
                <div style={{ color: 'var(--color-cream-muted)', fontSize: '0.85rem', lineHeight: '1.5', marginTop: '2px' }}>
                  {selectedOrder.customer?.address}<br />
                  {selectedOrder.customer?.city}, {selectedOrder.customer?.state || 'Maharashtra'} - {selectedOrder.customer?.pincode}
                </div>
                <div style={{ color: 'var(--color-gold-light)', fontSize: '0.8rem', marginTop: '6px' }}>
                  Phone: {selectedOrder.customer?.phone}
                </div>
              </div>

              {/* Items List */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-gold-base)', textTransform: 'uppercase', marginBottom: '10px' }}>
                  Ordered Items ({selectedOrder.items?.length || 0})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(selectedOrder.items || []).map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 14px',
                        background: 'rgba(7, 19, 13, 0.6)',
                        borderRadius: '6px',
                        border: '1px solid rgba(199, 154, 74, 0.15)'
                      }}
                    >
                      <div>
                        <div style={{ color: '#FFFFFF', fontWeight: '600', fontSize: '0.9rem' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-cream-muted)' }}>
                          Weight: {item.weight || '250g'} • {item.packDesign || 'Classic Pack'}
                          {item.packPriceAdjustment > 0 && ` (+₹${item.packPriceAdjustment})`}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: 'var(--color-gold-light)', fontWeight: '700', fontSize: '0.9rem' }}>
                          ₹{item.itemTotal || item.price * item.quantity}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>
                          Qty: {item.quantity} × ₹{item.price}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div
                style={{
                  padding: '16px',
                  background: 'rgba(7, 19, 13, 0.8)',
                  borderRadius: '6px',
                  border: '1px solid rgba(199, 154, 74, 0.2)',
                  marginBottom: '24px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--color-cream-muted)' }}>Items Subtotal:</span>
                  <span style={{ color: '#FFFFFF' }}>₹{selectedOrder.subtotal}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#68D391', marginBottom: '6px' }}>
                    <span>Privilege Discount:</span>
                    <span>-₹{selectedOrder.discount}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--color-cream-muted)' }}>Express Shipping:</span>
                  <span style={{ color: selectedOrder.shipping === 0 ? '#68D391' : '#FFFFFF' }}>
                    {selectedOrder.shipping === 0 ? 'FREE' : `₹${selectedOrder.shipping}`}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: '700', borderTop: '1px solid rgba(199, 154, 74, 0.2)', paddingTop: '10px' }}>
                  <span style={{ color: '#FFFFFF' }}>Total Paid/Payable:</span>
                  <span style={{ color: 'var(--color-gold-light)' }}>₹{selectedOrder.total}</span>
                </div>
              </div>

              {/* Modal Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                {['pending', 'confirmed'].includes((selectedOrder.orderStatus || selectedOrder.status || '').toLowerCase()) && (
                  <button
                    onClick={() => handleCancelOrder(selectedOrder._id || selectedOrder.orderId)}
                    disabled={cancellingOrderId === (selectedOrder._id || selectedOrder.orderId)}
                    className="btn btn-outline"
                    style={{ borderColor: '#E53E3E', color: '#FC8181' }}
                  >
                    <Ban size={15} />
                    <span>{cancellingOrderId === (selectedOrder._id || selectedOrder.orderId) ? 'Cancelling...' : 'Cancel Order'}</span>
                  </button>
                )}
                <button onClick={() => setSelectedOrder(null)} className="btn btn-primary">
                  Close Details
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // SIGN IN VIEW FOR GUESTS
  // ==========================================
  return (
    <div style={{ backgroundColor: '#07130D', minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
      <SEO title="Client Sign In" noIndex={true} />
      <div
        className="luxury-card"
        style={{
          maxWidth: '480px',
          width: '100%',
          padding: '48px 36px',
          backgroundColor: '#091A11',
          border: '1px solid var(--color-gold-border)'
        }}
      >
        <div className="eyebrow-label" style={{ justifyContent: 'center' }}>
          <Sparkles size={14} color="#D8B66A" />
          <span>EXCLUSIVE CLIENT PORTAL</span>
        </div>

        <h1 style={{ fontSize: '2rem', textAlign: 'center', color: '#FFFFFF', marginBottom: '8px' }}>
          Sign In to <span className="text-gold-gradient">QAMRAH</span>
        </h1>

        <p style={{ textAlign: 'center', color: 'var(--color-cream-muted)', fontSize: '0.9rem', marginBottom: '32px' }}>
          Access your member privileges, order status, and saved addresses.
        </p>

        {error && (
          <div
            style={{
              padding: '12px',
              backgroundColor: 'rgba(229, 62, 62, 0.15)',
              border: '1px solid rgba(229, 62, 62, 0.4)',
              borderRadius: '6px',
              color: '#FEB2B2',
              fontSize: '0.85rem',
              marginBottom: '20px'
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-gold-base)', marginBottom: '6px', textTransform: 'uppercase' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="#A3B5AA" style={{ position: 'absolute', left: '14px', top: '16px' }} />
              <input
                type="email"
                required
                placeholder="connoisseur@qamrah.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="luxury-input"
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-gold-base)', marginBottom: '6px', textTransform: 'uppercase' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#A3B5AA" style={{ position: 'absolute', left: '14px', top: '16px' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="luxury-input"
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--color-cream-muted)' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: 'var(--color-gold-base)' }}
              />
              <span>Remember me</span>
            </label>

            <span style={{ color: 'var(--color-gold-base)', cursor: 'pointer' }}>
              Forgot password?
            </span>
          </div>

          <button type="submit" disabled={submitting} className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '6px' }}>
            <span>{submitting ? 'SIGNING IN...' : 'SIGN IN'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Demo Quick Sign-in Button */}
        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(199, 154, 74, 0.15)', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', marginBottom: '10px' }}>
            Quick Demo Access:
          </div>
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleQuickDemo('shahid.kapoor@luxury.in')}
            className="btn btn-dark btn-sm"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <span>⚡ 1-Click Demo Login</span>
          </button>
        </div>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-cream-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--color-gold-light)', fontWeight: '600' }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
