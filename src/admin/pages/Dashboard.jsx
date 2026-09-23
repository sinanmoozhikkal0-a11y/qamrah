import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  Package,
  AlertTriangle,
  Building2,
  Mail,
  Eye,
  ArrowRight,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { api } from '../../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    deliveredOrders: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    wholesaleEnquiries: 0,
    contactMessages: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await api.orders.getStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const statCards = [
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: '#D8B66A', link: '/admin/orders' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: Clock, color: '#ECC94B', link: '/admin/orders?status=Pending' },
    { label: 'In-Transit Orders', value: stats.confirmedOrders, icon: Truck, color: '#63B3ED', link: '/admin/orders?status=Processing' },
    { label: 'Delivered Orders', value: stats.deliveredOrders, icon: CheckCircle, color: '#68D391', link: '/admin/orders?status=Delivered' },
    { label: 'Total Products', value: stats.totalProducts, icon: Package, color: '#D8B66A', link: '/admin/products' },
    { label: 'Low Stock Items', value: stats.lowStockProducts, icon: AlertTriangle, color: '#FC8181', link: '/admin/products' },
    { label: 'B2B Enquiries', value: stats.wholesaleEnquiries, icon: Building2, color: '#9F7AEA', link: '/admin/wholesale' },
    { label: 'Contact Messages', value: stats.contactMessages, icon: Mail, color: '#4FD1C5', link: '/admin/contact' }
  ];

  return (
    <div>
      {/* Welcome Banner */}
      <div
        className="admin-card"
        style={{
          marginBottom: '28px',
          background: 'linear-gradient(135deg, rgba(9, 26, 17, 0.95) 0%, rgba(15, 38, 27, 0.85) 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--admin-gold-base)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: '700' }}>
            CONCIERGE EXECUTIVE VIEW
          </div>
          <h2 style={{ fontSize: '1.6rem', color: '#FFFFFF', marginTop: '4px', fontWeight: '700' }}>
            Welcome to QAMRAH CMS
          </h2>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Manage catalog, monitor real-time orders, and oversee brand touchpoints.
          </p>
        </div>

        <button
          onClick={loadStats}
          disabled={loading}
          className="admin-btn admin-btn-secondary admin-btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* 8 Primary Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '18px',
          marginBottom: '32px'
        }}
      >
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Link
              key={i}
              to={card.link}
              className="stat-card"
              style={{ textDecoration: 'none' }}
            >
              <div className="stat-icon" style={{ borderColor: `${card.color}40`, color: card.color }}>
                <Icon size={24} />
              </div>
              <div>
                <div className="stat-value">{card.value}</div>
                <div className="stat-label">{card.label}</div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Orders Table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title">
            <ShoppingBag size={20} color="#D8B66A" />
            <span>Recent Orders</span>
          </div>
          <Link
            to="/admin/orders"
            className="admin-btn admin-btn-secondary admin-btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <span>View All Orders</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {stats.recentOrders && stats.recentOrders.length > 0 ? (
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
                {stats.recentOrders.map((order) => {
                  const statusClass = (order.status || 'pending').toLowerCase();
                  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  });

                  return (
                    <tr key={order._id}>
                      <td style={{ fontWeight: '700', color: 'var(--admin-gold-base)' }}>
                        {order.orderId}
                      </td>
                      <td>
                        <div style={{ fontWeight: '600', color: '#FFFFFF' }}>
                          {order.customer?.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                          {order.customer?.city}
                        </div>
                      </td>
                      <td style={{ color: 'var(--admin-text-muted)' }}>
                        {order.customer?.phone}
                      </td>
                      <td style={{ fontWeight: '700', color: '#FFFFFF' }}>
                        ₹{order.total}
                      </td>
                      <td style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem' }}>
                        {formattedDate}
                      </td>
                      <td>
                        <span className={`status-badge ${statusClass}`}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <Link
                          to={`/admin/orders?view=${order._id}`}
                          className="admin-btn admin-btn-secondary admin-btn-sm"
                        >
                          <Eye size={14} />
                          <span>View</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--admin-text-muted)' }}>
            <ShoppingBag size={40} color="#A3B8AC" style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <p>No orders placed yet. Orders placed by customers will appear here automatically.</p>
          </div>
        )}
      </div>
    </div>
  );
}
