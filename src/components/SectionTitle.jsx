import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  actionText,
  actionLink,
  isGold = false
}) {
  const isCentered = align === 'center';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isCentered ? 'column' : 'row',
        alignItems: isCentered ? 'center' : 'flex-end',
        justifyContent: isCentered ? 'center' : 'space-between',
        textAlign: isCentered ? 'center' : 'left',
        marginBottom: '44px',
        gap: '20px',
        flexWrap: 'wrap'
      }}
    >
      <div style={{ maxWidth: isCentered ? '680px' : '620px' }}>
        {eyebrow && (
          <div className="eyebrow-label">
            <span style={{ color: 'var(--color-gold-base)' }}>✦</span>
            <span>{eyebrow}</span>
            <span style={{ color: 'var(--color-gold-base)' }}>✦</span>
          </div>
        )}

        <h2
          style={{
            fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
            marginBottom: subtitle ? '12px' : '0',
            fontWeight: 600,
            lineHeight: 1.15
          }}
          className={isGold ? 'text-gold-gradient' : ''}
        >
          {title}
        </h2>

        {subtitle && (
          <p
            style={{
              fontSize: '1rem',
              color: 'var(--color-text-muted)',
              lineHeight: 1.6
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {actionText && actionLink && (
        <Link
          to={actionLink}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.85rem',
            fontWeight: '700',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--color-gold-base)',
            borderBottom: '1px solid var(--color-gold-base)',
            paddingBottom: '4px',
            transition: 'all 0.2s',
            flexShrink: 0
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#FFFFFF';
            e.currentTarget.style.borderColor = '#FFFFFF';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--color-gold-base)';
            e.currentTarget.style.borderColor = 'var(--color-gold-base)';
          }}
        >
          <span>{actionText}</span>
          <ArrowRight size={15} />
        </Link>
      )}
    </div>
  );
}
