import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({
  size = 'medium',
  isLink = true,
  variant = 'horizontal',
  showSubtext = true
}) {
  const heightMap = {
    small: '38px',
    medium: '52px',
    large: '84px'
  };

  const currentHeight = heightMap[size] || heightMap.medium;

  const content = (
    <div
      className={`brand-logo-container ${variant === 'vertical' ? 'brand-logo-vertical' : 'brand-logo-horizontal'}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        textDecoration: 'none'
      }}
    >
      <img
        src="/images/logo.png"
        alt="QAMRAH Premium Nuts"
        style={{
          height: currentHeight,
          width: 'auto',
          maxWidth: '100%',
          objectFit: 'contain',
          filter: 'drop-shadow(0 2px 8px rgba(199, 154, 74, 0.35))',
          display: 'block'
        }}
      />
    </div>
  );

  if (!isLink) return content;

  return (
    <Link to="/" aria-label="QAMRAH Premium Nuts Home" style={{ display: 'inline-flex' }}>
      {content}
    </Link>
  );
}
