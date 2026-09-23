import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Home, ShoppingBag } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      style={{
        backgroundColor: '#07130D',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        textAlign: 'center'
      }}
    >
      <div className="luxury-card" style={{ maxWidth: '560px', width: '100%', padding: '56px 36px' }}>
        <div className="eyebrow-label" style={{ justifyContent: 'center' }}>
          <Sparkles size={14} color="#D8B66A" />
          <span>ERROR 404 • PAGE NOT FOUND</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(3.5rem, 8vw, 5.5rem)',
            color: 'var(--color-gold-light)',
            fontWeight: 800,
            lineHeight: 1,
            marginBottom: '16px',
            fontFamily: 'var(--font-heading)'
          }}
        >
          404
        </h1>

        <h2 style={{ fontSize: '1.75rem', color: '#FFFFFF', marginBottom: '14px' }}>
          The Harvest Path Ends Here
        </h2>

        <p style={{ color: 'var(--color-cream-muted)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '36px' }}>
          The page or product you are looking for has been moved, renamed, or is currently not in season.
        </p>

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary">
            <Home size={16} />
            <span>RETURN TO HOME</span>
          </Link>

          <Link to="/shop" className="btn btn-outline">
            <ShoppingBag size={16} />
            <span>EXPLORE ALL NUTS</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
