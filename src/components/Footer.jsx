import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowUp } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        backgroundColor: '#040B07',
        borderTop: '1px solid rgba(199, 154, 74, 0.25)',
        color: 'var(--color-cream-muted)',
        position: 'relative',
        zIndex: 10,
        paddingTop: '64px',
        paddingBottom: '32px'
      }}
    >
      <div className="container">
        {/* Main 5-Column Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '40px',
            marginBottom: '48px'
          }}
        >
          {/* Column 1: Brand Info */}
          <div style={{ gridColumn: 'span 2', minWidth: '240px' }}>
            <Logo size="large" variant="vertical" showSubtext={true} />
            <p
              style={{
                marginTop: '18px',
                fontSize: '0.875rem',
                lineHeight: '1.7',
                color: 'var(--color-text-muted)',
                maxWidth: '320px'
              }}
            >
              Handpicked with meticulous care to bring you nature's finest nutrition, royal grades, and pure irresistible taste.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '20px' }}>
              <span className="badge-gold">
                <ShieldCheck size={12} />
                100% Authentic Quality
              </span>
            </div>
          </div>

          {/* Column 2: Shop by Category */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.825rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--color-gold-base)',
                marginBottom: '20px',
                fontWeight: '700'
              }}
            >
              SHOP
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li>
                <Link to="/shop/cashews" style={{ fontSize: '0.875rem', transition: 'color 0.2s' }}>
                  Cashews
                </Link>
              </li>
              <li>
                <Link to="/shop/almonds" style={{ fontSize: '0.875rem', transition: 'color 0.2s' }}>
                  Almonds
                </Link>
              </li>
              <li>
                <Link to="/shop/dates" style={{ fontSize: '0.875rem', transition: 'color 0.2s' }}>
                  Dates
                </Link>
              </li>
              <li>
                <Link to="/shop/pistachios" style={{ fontSize: '0.875rem', transition: 'color 0.2s' }}>
                  Pistachios
                </Link>
              </li>
              <li>
                <Link to="/shop/mix-nuts" style={{ fontSize: '0.875rem', transition: 'color 0.2s' }}>
                  Mix Nuts
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.825rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--color-gold-base)',
                marginBottom: '20px',
                fontWeight: '700'
              }}
            >
              QUICK LINKS
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li>
                <Link to="/" style={{ fontSize: '0.875rem' }}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" style={{ fontSize: '0.875rem' }}>
                  Shop All
                </Link>
              </li>
              <li>
                <Link to="/our-story" style={{ fontSize: '0.875rem' }}>
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/wholesale" style={{ fontSize: '0.875rem' }}>
                  Wholesale &amp; Gifting
                </Link>
              </li>
              <li>
                <Link to="/contact" style={{ fontSize: '0.875rem' }}>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Customer Care */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.825rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--color-gold-base)',
                marginBottom: '20px',
                fontWeight: '700'
              }}
            >
              CUSTOMER CARE
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li>
                <Link to="/contact" style={{ fontSize: '0.875rem' }}>
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/contact" style={{ fontSize: '0.875rem' }}>
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" style={{ fontSize: '0.875rem' }}>
                  Returns &amp; Refunds
                </Link>
              </li>
              <li>
                <Link to="/contact" style={{ fontSize: '0.875rem' }}>
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/contact" style={{ fontSize: '0.875rem' }}>
                  Privacy &amp; Terms
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Follow Us & Connect */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.825rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--color-gold-base)',
                marginBottom: '20px',
                fontWeight: '700'
              }}
            >
              FOLLOW US
            </h4>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              {/* Instagram SVG */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(199, 154, 74, 0.1)',
                  border: '1px solid rgba(199, 154, 74, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-gold-base)',
                  transition: 'all 0.2s'
                }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>

              {/* Facebook SVG */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(199, 154, 74, 0.1)',
                  border: '1px solid rgba(199, 154, 74, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-gold-base)',
                  transition: 'all 0.2s'
                }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>

              {/* YouTube SVG */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(199, 154, 74, 0.1)',
                  border: '1px solid rgba(199, 154, 74, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-gold-base)',
                  transition: 'all 0.2s'
                }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
                  <polygon points="10 15 15 12 10 9 10 15" fill="currentColor"/>
                </svg>
              </a>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>
              Complimentary luxury gift wrapping available on all hamper orders.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: '1px',
            backgroundColor: 'rgba(199, 154, 74, 0.2)',
            margin: '32px 0 24px'
          }}
        />

        {/* Bottom Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '0.8rem',
            color: 'var(--color-text-subtle)'
          }}
        >
          <div>
            &copy; 2026 <strong style={{ color: 'var(--color-cream-base)' }}>QAMRAH</strong>. All Rights Reserved. Crafted with pure devotion to quality.
          </div>

          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            style={{
              background: 'transparent',
              border: '1px solid rgba(199, 154, 74, 0.3)',
              color: 'var(--color-gold-base)',
              padding: '6px 14px',
              borderRadius: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.75rem',
              transition: 'all 0.2s'
            }}
          >
            <span>Back to top</span>
            <ArrowUp size={13} />
          </button>
        </div>
      </div>
    </footer>
  );
}
