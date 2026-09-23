import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    register(formData.name, formData.email, formData.password);
    navigate('/');
  };

  return (
    <div style={{ backgroundColor: '#07130D', minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
      <SEO title="Create Client Account" noIndex={true} />
      <div
        className="luxury-card"
        style={{
          maxWidth: '500px',
          width: '100%',
          padding: '48px 36px',
          backgroundColor: '#091A11',
          border: '1px solid var(--color-gold-border)'
        }}
      >
        <div className="eyebrow-label" style={{ justifyContent: 'center' }}>
          <Sparkles size={14} color="#D8B66A" />
          <span>JOIN THE PRIVILEGE CLUB</span>
        </div>

        <h1 style={{ fontSize: '2rem', textAlign: 'center', color: '#FFFFFF', marginBottom: '8px' }}>
          Create an <span className="text-gold-gradient">Account</span>
        </h1>

        <p style={{ textAlign: 'center', color: 'var(--color-cream-muted)', fontSize: '0.9rem', marginBottom: '32px' }}>
          Enjoy private access to limited harvest dates, custom hampers, and VIP shipping privileges.
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
              Full Name *
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="#A3B5AA" style={{ position: 'absolute', left: '14px', top: '16px' }} />
              <input
                type="text"
                required
                placeholder="Rohan Varma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="luxury-input"
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-gold-base)', marginBottom: '6px', textTransform: 'uppercase' }}>
              Email Address *
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="#A3B5AA" style={{ position: 'absolute', left: '14px', top: '16px' }} />
              <input
                type="email"
                required
                placeholder="rohan@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="luxury-input"
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-gold-base)', marginBottom: '6px', textTransform: 'uppercase' }}>
              Create Password *
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#A3B5AA" style={{ position: 'absolute', left: '14px', top: '16px' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="luxury-input"
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-gold-base)', marginBottom: '6px', textTransform: 'uppercase' }}>
              Confirm Password *
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#A3B5AA" style={{ position: 'absolute', left: '14px', top: '16px' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="luxury-input"
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '6px' }}>
            <span>CREATE MY ACCOUNT</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-cream-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--color-gold-light)', fontWeight: '600' }}>
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
