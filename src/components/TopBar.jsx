import React from 'react';
import { Link } from 'react-router-dom';
import { Award, ShieldCheck, PackageCheck, HeartPulse, Truck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TopBar() {
  const { user } = useAuth();

  return (
    <div
      style={{
        backgroundColor: '#040C08',
        borderBottom: '1px solid rgba(199, 154, 74, 0.2)',
        fontSize: '0.75rem',
        letterSpacing: '0.08em',
        color: 'var(--color-cream-muted)',
        height: 'var(--topbar-height)',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        zIndex: 40
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          overflowX: 'auto',
          scrollbarWidth: 'none'
        }}
      >
        {/* Left / Center Badges */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            whiteSpace: 'nowrap',
            textTransform: 'uppercase',
            fontWeight: 600
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Award size={13} color="#D8B66A" />
            <span>PREMIUM QUALITY</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={13} color="#D8B66A" />
            <span>NO PRESERVATIVES</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <PackageCheck size={13} color="#D8B66A" />
            <span>FRESHLY PACKED</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <HeartPulse size={13} color="#D8B66A" />
            <span>NATURALLY HEALTHY</span>
          </div>
        </div>

        {/* Right Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            marginLeft: '20px'
          }}
        >
          <Link
            to="/contact"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'color 0.2s',
              color: 'var(--color-cream-muted)'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#D8B66A')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-cream-muted)')}
          >
            <Truck size={13} color="#D8B66A" />
            <span>Track Order</span>
          </Link>

          <span style={{ opacity: 0.3 }}>|</span>

          {user ? (
            <Link
              to="/login"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--color-gold-base)',
                fontWeight: 600
              }}
            >
              <User size={13} />
              <span>Hi, {user.name}</span>
            </Link>
          ) : (
            <Link
              to="/login"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'color 0.2s',
                color: 'var(--color-cream-muted)'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#D8B66A')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-cream-muted)')}
            >
              <User size={13} color="#D8B66A" />
              <span>Sign In / Register</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
