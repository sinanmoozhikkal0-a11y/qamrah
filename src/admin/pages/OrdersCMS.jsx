import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  Eye,
  Printer,
  Phone,
  MessageCircle,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Calendar,
  User,
  MapPin,
  Sparkles
} from 'lucide-react';
import { api } from '../../services/api';
import SaveToast from '../components/SaveToast';

export default function OrdersCMS() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const [searchParams] = useSearchParams();

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await api.orders.getAll({ status: statusFilter === 'all' ? '' : statusFilter });
      if (res.success) {
        setOrders(res.data || []);

        // If view param exists, open that order
        const viewId = searchParams.get('view');
        if (viewId && res.data) {
          const matched = res.data.find((o) => o._id === viewId || o.orderId === viewId);
          if (matched) setSelectedOrder(matched);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setStatusUpdating(true);
    try {
      const res = await api.orders.updateStatus(orderId, newStatus, `Status updated to ${newStatus} by admin.`);
      if (res.success) {
        setToastMessage(`Order status updated to ${newStatus}`);
        setToastType('success');
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(res.data);
        }
        loadOrders();
      }
    } catch (err) {
      setToastMessage(err.message || 'Failed to update status');
      setToastType('error');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredOrders = orders.filter((o) => {
    return (
      o.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer?.phone?.includes(searchTerm) ||
      o.customer?.city?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const statuses = ['Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];

  return (
    <div>
      <SaveToast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />

      {/* Filter Bar */}
      <div
        className="admin-card"
        style={{
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', gap: '12px', flex: 1, maxWidth: '600px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Order ID, customer, phone, or city..."
              className="admin-input"
              style={{ paddingLeft: '38px' }}
            />
            <Search
              size={18}
              color="#A3B8AC"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-select"
            style={{ width: '180px' }}
          >
            <option value="all">All Statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title">
            <ShoppingBag size={20} color="#D8B66A" />
            <span>Orders Management ({filteredOrders.length})</span>
          </div>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const statusClass = (order.status || 'pending').toLowerCase();
                const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                });

                return (
                  <tr key={order._id}>
                    <td style={{ fontWeight: '700', color: 'var(--admin-gold-base)' }}>{order.orderId}</td>
                    <td>
                      <div style={{ fontWeight: '600', color: '#FFFFFF' }}>{order.customer?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                        {order.customer?.city}, {order.customer?.pincode}
                      </div>
                    </td>
                    <td style={{ color: 'var(--admin-text-muted)' }}>{order.customer?.phone}</td>
                    <td style={{ fontWeight: '700', color: '#FFFFFF' }}>₹{order.total}</td>
                    <td style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem' }}>{formattedDate}</td>
                    <td>
                      <span className={`status-badge ${statusClass}`}>{order.status}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="admin-btn admin-btn-secondary admin-btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Eye size={13} />
                        <span>View Order</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Order Modal */}
      {selectedOrder && (
        <div className="admin-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="admin-modal admin-modal-lg print-container" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--admin-gold-base)', letterSpacing: '0.1em', fontWeight: '700' }}>
                  CONNOISSEUR INVOICE
                </div>
                <h2 style={{ fontSize: '1.6rem', color: '#FFFFFF', fontWeight: '800', marginTop: '4px' }}>
                  {selectedOrder.orderId}
                </h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', marginTop: '4px' }}>
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handlePrint} className="admin-btn admin-btn-secondary admin-btn-sm">
                  <Printer size={14} />
                  <span>Print Order</span>
                </button>
                <button onClick={() => setSelectedOrder(null)} className="admin-btn admin-btn-secondary admin-btn-sm">
                  Close
                </button>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div
              style={{
                backgroundColor: 'rgba(7, 19, 13, 0.9)',
                border: '1px solid var(--admin-border)',
                borderRadius: '8px',
                padding: '14px 18px',
                marginBottom: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--admin-gold-base)', fontWeight: '700', textTransform: 'uppercase' }}>
                  Update Order Status:
                </span>
                <select
                  value={selectedOrder.status}
                  disabled={statusUpdating}
                  onChange={(e) => handleUpdateStatus(selectedOrder._id, e.target.value)}
                  className="admin-select"
                  style={{ width: '150px', padding: '6px 10px', fontSize: '0.8rem' }}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <a
                  href={`https://wa.me/${selectedOrder.customer?.phone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hello ${selectedOrder.customer?.name}, regarding your QAMRAH order ${selectedOrder.orderId}: `
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  style={{ color: '#68D391', borderColor: 'rgba(104, 211, 145, 0.4)' }}
                >
                  <MessageCircle size={14} />
                  <span>WhatsApp Customer</span>
                </a>

                <a
                  href={`tel:${selectedOrder.customer?.phone}`}
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                >
                  <Phone size={14} />
                  <span>Call</span>
                </a>
              </div>
            </div>

            {/* Customer Information & Shipping Destination */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--admin-gold-base)', fontWeight: '700', marginBottom: '10px', textTransform: 'uppercase' }}>
                  Customer Details
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '4px' }}>
                  {selectedOrder.customer?.name}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', marginBottom: '4px' }}>
                  Phone: {selectedOrder.customer?.phone}
                </div>
                {selectedOrder.customer?.email && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
                    Email: {selectedOrder.customer?.email}
                  </div>
                )}
                {selectedOrder.customer?.notes && (
                  <div style={{ marginTop: '10px', fontSize: '0.8rem', color: 'var(--admin-gold-base)', fontStyle: 'italic' }}>
                    Note: "{selectedOrder.customer?.notes}"
                  </div>
                )}
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--admin-gold-base)', fontWeight: '700', marginBottom: '10px', textTransform: 'uppercase' }}>
                  Delivery Address &amp; Payment
                </div>
                <div style={{ fontSize: '0.85rem', color: '#FFFFFF', lineHeight: 1.6, marginBottom: '6px' }}>
                  {selectedOrder.customer?.address}<br />
                  {selectedOrder.customer?.city}, {selectedOrder.customer?.state || 'Maharashtra'} - {selectedOrder.customer?.pincode}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--admin-gold-base)', fontWeight: '600' }}>
                  Payment Method: {selectedOrder.paymentMethod || 'Cash on Delivery'}
                </div>
              </div>
            </div>

            {/* Order Items Table */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--admin-gold-base)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '10px' }}>
                Ordered Products ({selectedOrder.items?.length || 0})
              </div>

              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Weight</th>
                      <th>Pack Design</th>
                      <th>Unit Price</th>
                      <th>Qty</th>
                      <th style={{ textAlign: 'right' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedOrder.items || []).map((item, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: '600', color: '#FFFFFF' }}>{item.name}</td>
                        <td style={{ color: 'var(--admin-text-muted)' }}>{item.weight || '250g'}</td>
                        <td>
                          <span style={{ color: 'var(--admin-gold-base)', fontWeight: '600' }}>
                            {item.packDesign || 'Classic Pack'}
                          </span>
                          {item.packPriceAdjustment > 0 && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-dim)', marginLeft: '4px' }}>
                              (+₹{item.packPriceAdjustment})
                            </span>
                          )}
                        </td>
                        <td>₹{item.price}</td>
                        <td>{item.quantity}</td>
                        <td style={{ textAlign: 'right', fontWeight: '700', color: '#FFFFFF' }}>
                          ₹{item.itemTotal || (item.price + (item.packPriceAdjustment || 0)) * item.quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Totals Summary */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
              <div style={{ width: '280px', background: 'rgba(7, 19, 13, 0.8)', padding: '16px', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--admin-text-muted)' }}>Subtotal:</span>
                  <span style={{ color: '#FFFFFF' }}>₹{selectedOrder.subtotal}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#68D391', marginBottom: '6px' }}>
                    <span>Discount:</span>
                    <span>-₹{selectedOrder.discount}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--admin-text-muted)' }}>Shipping:</span>
                  <span style={{ color: selectedOrder.shipping === 0 ? 'var(--admin-gold-base)' : '#FFFFFF' }}>
                    {selectedOrder.shipping === 0 ? 'FREE' : `₹${selectedOrder.shipping}`}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: '800', borderTop: '1px solid var(--admin-border)', paddingTop: '8px' }}>
                  <span style={{ color: '#FFFFFF' }}>Total Amount:</span>
                  <span style={{ color: 'var(--admin-gold-base)' }}>₹{selectedOrder.total}</span>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            {selectedOrder.timeline && selectedOrder.timeline.length > 0 && (
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--admin-gold-base)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '10px' }}>
                  Order History &amp; Status Logs
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedOrder.timeline.map((entry, i) => (
                    <div
                      key={i}
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--admin-text-muted)',
                        padding: '6px 12px',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '4px',
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <strong style={{ color: '#FFFFFF' }}>{entry.status}</strong> - {entry.note}
                      </div>
                      <span style={{ color: 'var(--admin-text-dim)' }}>
                        {new Date(entry.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-container, .print-container * {
            visibility: visible;
          }
          .print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
          }
          .admin-btn, .admin-select {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
