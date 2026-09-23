import React from 'react';
import { Award, FlaskConical, PackageCheck, Heart } from 'lucide-react';

export default function FeatureBar() {
  const features = [
    {
      icon: Award,
      title: 'PREMIUM QUALITY',
      description: 'Handpicked & carefully selected for the best quality'
    },
    {
      icon: FlaskConical,
      title: 'NO PRESERVATIVES',
      description: '100% natural, no added chemicals or preservatives'
    },
    {
      icon: PackageCheck,
      title: 'FRESHLY PACKED',
      description: 'Packed fresh in airtight pouches to retain taste & nutrition'
    },
    {
      icon: Heart,
      title: 'NATURALLY HEALTHY',
      description: 'Rich in essential nutrients for a vibrant lifestyle'
    }
  ];

  return (
    <section
      style={{
        padding: '36px 0',
        backgroundColor: '#091A11',
        borderBottom: '1px solid rgba(199, 154, 74, 0.2)'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px'
          }}
          className="feature-bar-grid"
        >
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="luxury-card"
                style={{
                  padding: '24px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  backgroundColor: 'rgba(15, 35, 23, 0.7)'
                }}
              >
                {/* Circular Golden Ring Icon */}
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    border: '1.5px solid var(--color-gold-base)',
                    backgroundColor: 'rgba(7, 19, 13, 0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(199, 154, 74, 0.2)'
                  }}
                >
                  <Icon size={24} color="#D8B66A" strokeWidth={1.75} />
                </div>

                <div>
                  <h3
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      letterSpacing: '0.1em',
                      color: 'var(--color-gold-base)',
                      marginBottom: '4px',
                      textTransform: 'uppercase',
                      fontFamily: 'var(--font-body)'
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.8rem',
                      lineHeight: '1.45',
                      color: 'var(--color-cream-muted)',
                      margin: 0
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .feature-bar-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 580px) {
          .feature-bar-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
