import React, { useState } from 'react';
import { Mail, CheckCircle, ArrowRight } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');
  const { addToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubscribed(true);
    addToast('Thank you for subscribing to QAMRAH privilege updates!');
  };

  return (
    <section
      style={{
        position: 'relative',
        padding: '72px 0',
        background: 'linear-gradient(180deg, #091A11 0%, #06110B 100%)',
        borderTop: '1px solid rgba(199, 154, 74, 0.25)',
        overflow: 'hidden'
      }}
    >
      <div className="container">
        <div
          className="luxury-card"
          style={{
            maxWidth: '860px',
            margin: '0 auto',
            padding: '52px 36px',
            textAlign: 'center',
            background: 'radial-gradient(ellipse at 50% 0%, #152E20 0%, #0A1911 100%)',
            border: '1px solid rgba(199, 154, 74, 0.35)',
            boxShadow: '0 16px 40px rgba(0,0,0,0.6)'
          }}
        >
          {/* Eyebrow */}
          <div className="eyebrow-label" style={{ justifyContent: 'center' }}>
            <Mail size={14} color="#D8B66A" />
            <span>JOIN OUR CONNOISSEUR CLUB</span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
              marginBottom: '14px',
              color: '#FFFFFF'
            }}
          >
            STAY CONNECTED WITH <span className="text-gold-gradient">QAMRAH</span>
          </h2>

          <p
            style={{
              fontSize: '1rem',
              color: 'var(--color-cream-muted)',
              maxWidth: '520px',
              margin: '0 auto 32px'
            }}
          >
            Receive private allocations, festive gifting catalogs, and curated nutritional insights directly in your inbox.
          </p>

          {isSubscribed ? (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(56, 161, 105, 0.15)',
                border: '1px solid rgba(56, 161, 105, 0.4)',
                padding: '16px 28px',
                borderRadius: 'var(--radius-sm)',
                color: '#68D391',
                fontWeight: '600'
              }}
            >
              <CheckCircle size={20} />
              <span>You're subscribed! Check your inbox for a 10% welcome privilege code.</span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                maxWidth: '480px',
                margin: '0 auto',
                gap: '10px',
                flexWrap: 'wrap'
              }}
            >
              <input
                type="email"
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className="luxury-input"
                style={{
                  flex: '1 1 240px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(4, 12, 8, 0.9)'
                }}
              />
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  flex: '0 0 auto',
                  padding: '13px 24px'
                }}
              >
                <span>SUBSCRIBE</span>
                <ArrowRight size={16} />
              </button>

              {error && (
                <div
                  style={{
                    width: '100%',
                    color: 'var(--color-danger)',
                    fontSize: '0.8rem',
                    textAlign: 'left',
                    marginTop: '4px'
                  }}
                >
                  {error}
                </div>
              )}
            </form>
          )}

          <div
            style={{
              marginTop: '20px',
              fontSize: '0.75rem',
              color: 'var(--color-text-subtle)'
            }}
          >
            We respect your privacy. No spam, ever. Unsubscribe at any time.
          </div>
        </div>
      </div>
    </section>
  );
}
