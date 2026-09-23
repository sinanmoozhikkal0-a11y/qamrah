import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export default function SaveToast({ message, type = 'success', onClose, duration = 3500 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '28px',
        right: '28px',
        backgroundColor: '#091A11',
        border: `1.5px solid ${isSuccess ? 'var(--admin-gold-base)' : '#E53E3E'}`,
        borderRadius: '8px',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 12px 40px rgba(0,0,0,0.8), 0 0 20px rgba(216,182,106,0.2)',
        zIndex: 9999,
        animation: 'fadeInUp 0.3s ease forwards'
      }}
    >
      {isSuccess ? (
        <CheckCircle size={20} color="#D8B66A" />
      ) : (
        <AlertCircle size={20} color="#FC8181" />
      )}
      <span style={{ color: '#FFFFFF', fontSize: '0.875rem', fontWeight: 600 }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#A3B8AC',
          cursor: 'pointer',
          padding: '2px',
          marginLeft: '8px'
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
