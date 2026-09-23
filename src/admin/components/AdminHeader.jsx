import React from 'react';
import { ExternalLink, User, LogOut, Menu } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminHeader({ onToggleSidebar, title = 'Dashboard' }) {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <header className="admin-topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          className="mobile-sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle Navigation Sidebar"
        >
          <Menu size={24} color="#D8B66A" />
        </button>
        <h1 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#FFFFFF', letterSpacing: '0.02em' }}>
          {title}
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Visit Live Website Shortcut */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="admin-btn admin-btn-secondary admin-btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <span>View Live Store</span>
          <ExternalLink size={14} />
        </a>

        {/* Current Admin Tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--admin-gold-base)', fontSize: '0.85rem', fontWeight: 600 }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(216, 182, 106, 0.15)',
              border: '1px solid var(--admin-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--admin-gold-base)'
            }}
          >
            <User size={16} />
          </div>
          <span style={{ display: 'none', sm: 'inline' }}>{admin?.username || 'QAMRAH'}</span>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="admin-btn admin-btn-danger admin-btn-sm"
          title="Sign out of CMS"
        >
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
