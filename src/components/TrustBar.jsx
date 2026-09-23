import React from 'react';
import { Truck, Lock, RotateCcw, Headphones } from 'lucide-react';

export default function TrustBar() {
  const trustItems = [
    {
      icon: Truck,
      title: 'FREE SHIPPING',
      subtitle: 'On orders above ₹999 across India'
    },
    {
      icon: Lock,
      title: 'SECURE PAYMENT',
      subtitle: '100% secure & verified checkout'
    },
    {
      icon: RotateCcw,
      title: 'EASY RETURNS',
      subtitle: 'Hassle-free freshness guarantee'
    },
    {
      icon: Headphones,
      title: 'CUSTOMER SUPPORT',
      subtitle: "We're here to help Mon–Sat"
    }
  ];

  return (
    <div
      style={{
        backgroundColor: '#040C08',
        borderTop: '1px solid rgba(199, 154, 74, 0.2)',
        borderBottom: '1px solid rgba(199, 154, 74, 0.2)',
        padding: '28px 0'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px'
          }}
          className="trust-bar-grid"
        >
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  justifyContent: 'center'
                }}
              >
                <div
                  style={{
                    color: 'var(--color-gold-base)',
                    flexShrink: 0
                  }}
                >
                  <Icon size={26} strokeWidth={1.75} />
                </div>
                <div>
                  <h4
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      letterSpacing: '0.08em',
                      color: 'var(--color-cream-base)',
                      marginBottom: '2px',
                      textTransform: 'uppercase'
                    }}
                  >
                    {item.title}
                  </h4>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--color-text-subtle)',
                      margin: 0
                    }}
                  >
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .trust-bar-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            row-gap: 20px !important;
          }
          .trust-bar-grid > div {
            justify-content: flex-start !important;
          }
        }
        @media (max-width: 480px) {
          .trust-bar-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
