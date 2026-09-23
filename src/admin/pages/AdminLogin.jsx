import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import SEO from '../../components/SEO';
import '../admin.css';

export default function AdminLogin() {
  const [username, setUsername] = useState('QAMRAH');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(username, password);
      if (result.success) {
        navigate('/admin/dashboard');
      } else {
        setError(result.message || 'Invalid username or password.');
      }
    } catch (err) {
      setError(err.message || 'Failed to connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#050E09',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative'
      }}
    >
      <SEO title="Admin Sign In | QAMRAH" noIndex={true} />
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(216, 182, 106, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#091A11',
          border: '1px solid var(--admin-border)',
          borderRadius: '16px',
          padding: '40px 36px',
          boxShadow: '0 24px 70px rgba(0,0,0,0.8), 0 0 35px rgba(216,182,106,0.15)',
          position: 'relative',
          zIndex: 2
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '12px',
              background: 'rgba(216, 182, 106, 0.15)',
              border: '1.5px solid var(--admin-gold-base)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--admin-gold-base)',
              margin: '0 auto 16px',
              boxShadow: '0 0 20px rgba(216, 182, 106, 0.2)'
            }}
          >
            <Sparkles size={28} />
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#FFFFFF', letterSpacing: '0.06em', marginBottom: '6px' }}>
            QAMRAH
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--admin-gold-base)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: '600' }}>
            SUPER CMS DASHBOARD
          </p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: 'rgba(229, 62, 62, 0.15)',
              border: '1px solid rgba(229, 62, 62, 0.4)',
              borderRadius: '8px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#FC8181',
              fontSize: '0.85rem',
              marginBottom: '20px'
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label className="admin-label">Username</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="admin-input"
                style={{ paddingLeft: '38px' }}
              />
              <User
                size={18}
                color="#A3B8AC"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          <div className="admin-form-group" style={{ marginBottom: '28px' }}>
            <label className="admin-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="admin-input"
                style={{ paddingLeft: '38px' }}
              />
              <Lock
                size={18}
                color="#A3B8AC"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="admin-btn admin-btn-primary admin-btn-lg"
            style={{ width: '100%', letterSpacing: '0.04em' }}
          >
            {loading ? 'AUTHENTICATING...' : 'LOGIN TO DASHBOARD'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.75rem', color: 'var(--admin-text-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <ShieldCheck size={14} color="#D8B66A" />
          <span>Protected by JWT &amp; Rate-Limited Encryption</span>
        </div>
      </div>
    </div>
  );
}
