import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Sparkles, LogOut } from 'lucide-react';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both email and password');
      return;
    }

    login(email, password, rememberMe);
    navigate('/');
  };

  const handleQuickDemo = (demoEmail) => {
    login(demoEmail, 'demo123', true);
    navigate('/');
  };

  if (user) {
    return (
      <div style={{ backgroundColor: '#07130D', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
        <SEO title="Member Account" noIndex={true} />
        <div className="luxury-card" style={{ maxWidth: '520px', width: '100%', padding: '48px 32px', textAlign: 'center' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #E2BF72, #C79A4A)',
              color: '#07130D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              fontWeight: '700',
              margin: '0 auto 20px',
              boxShadow: '0 8px 24px rgba(199, 154, 74, 0.4)'
            }}
          >
            {user.avatarInitial || 'Q'}
          </div>

          <div className="eyebrow-label" style={{ justifyContent: 'center' }}>
            <Sparkles size={14} color="#D8B66A" />
            <span>{user.memberTier || 'Gold Connoisseur Member'}</span>
          </div>

          <h2 style={{ fontSize: '2rem', color: '#FFFFFF', marginBottom: '8px' }}>
            Welcome, {user.name}
          </h2>

          <p style={{ color: 'var(--color-cream-muted)', fontSize: '0.9rem', marginBottom: '28px' }}>
            {user.email} • Member since {user.memberSince || '2026'}
          </p>

          <div
            style={{
              backgroundColor: 'rgba(7, 19, 13, 0.7)',
              border: '1px solid rgba(199, 154, 74, 0.2)',
              borderRadius: '8px',
              padding: '20px',
              textAlign: 'left',
              marginBottom: '28px',
              fontSize: '0.85rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--color-text-subtle)' }}>Privilege Tier:</span>
              <span style={{ color: 'var(--color-gold-light)', fontWeight: '600' }}>Royal Connoisseur (10% Off)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--color-text-subtle)' }}>Complimentary Shipping:</span>
              <span style={{ color: '#68D391', fontWeight: '600' }}>Active for All Orders</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-subtle)' }}>Account Status:</span>
              <span style={{ color: '#68D391', fontWeight: '600' }}>Verified</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/shop" className="btn btn-primary" style={{ flex: 1 }}>
              CONTINUE SHOPPING
            </Link>
            <button onClick={logout} className="btn btn-outline" style={{ flex: 1 }}>
              <LogOut size={16} />
              <span>LOGOUT</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

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

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '6px' }}>
            <span>SIGN IN</span>
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
