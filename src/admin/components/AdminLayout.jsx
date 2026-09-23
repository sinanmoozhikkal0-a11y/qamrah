import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Sparkles,
  Home,
  BookOpen,
  Building2,
  PhoneCall,
  HelpCircle,
  Image as ImageIcon,
  Settings as SettingsIcon,
  LogOut,
  X
} from 'lucide-react';
import AdminHeader from './AdminHeader';
import { useAdminAuth } from '../../context/AdminAuthContext';
import SEO from '../../components/SEO';
import '../admin.css';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/products', icon: Package, label: 'Products' },
    { to: '/admin/categories', icon: Layers, label: 'Categories' },
    { to: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
    { to: '/admin/pack-designs', icon: Sparkles, label: 'Pack Design' },
    { to: '/admin/home', icon: Home, label: 'Home Page' },
    { to: '/admin/story', icon: BookOpen, label: 'Our Story' },
    { to: '/admin/wholesale', icon: Building2, label: 'Wholesale & B2B' },
    { to: '/admin/contact', icon: PhoneCall, label: 'Contact & Inbox' },
    { to: '/admin/faqs', icon: HelpCircle, label: 'FAQs' },
    { to: '/admin/media', icon: ImageIcon, label: 'Media Library' },
    { to: '/admin/settings', icon: SettingsIcon, label: 'Settings' }
  ];

  // Determine current page title
  const currentNav = navLinks.find((item) => location.pathname.startsWith(item.to));
  const pageTitle = currentNav ? currentNav.label : 'CMS Management';

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-wrapper">
      <SEO title={`Admin ${pageTitle} | QAMRAH`} noIndex={true} />
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <NavLink to="/admin/dashboard" className="admin-sidebar-brand">
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                backgroundColor: 'rgba(216, 182, 106, 0.15)',
                border: '1.5px solid var(--admin-gold-base)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--admin-gold-base)',
                fontWeight: '800',
                fontSize: '1.1rem'
              }}
            >
              Q
            </div>
            <div>
              <div style={{ fontWeight: '800', fontSize: '1.05rem', color: '#FFFFFF', letterSpacing: '0.08em' }}>
                QAMRAH
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--admin-gold-base)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                SUPER CMS
              </div>
            </div>
          </NavLink>
          <button
            onClick={() => setSidebarOpen(false)}
            className="mobile-sidebar-toggle"
            aria-label="Close sidebar"
          >
            <X size={20} color="#D8B66A" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="admin-nav">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Bottom Logout */}
        <div className="admin-sidebar-footer">
          <button
            onClick={handleLogout}
            className="admin-nav-item"
            style={{ width: '100%', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}
          >
            <LogOut size={18} color="#FC8181" />
            <span style={{ color: '#FC8181' }}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main">
        <AdminHeader
          title={pageTitle}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
