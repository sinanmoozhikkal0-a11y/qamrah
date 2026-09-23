import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ isOpen, title = 'Confirm Deletion', message = 'Are you sure you want to delete this?', onConfirm, onCancel, confirmText = 'Delete', isDanger = true }) {
  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay" onClick={onCancel}>
      <div className="admin-modal" style={{ maxWidth: '420px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onCancel}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#A3B8AC', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: isDanger ? 'rgba(229, 62, 62, 0.15)' : 'rgba(216, 182, 106, 0.15)',
            border: `1px solid ${isDanger ? 'rgba(229, 62, 62, 0.4)' : 'rgba(216, 182, 106, 0.4)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isDanger ? '#FC8181' : '#D8B66A',
            margin: '0 auto 16px'
          }}
        >
          <AlertTriangle size={28} />
        </div>

        <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: '#FFFFFF' }}>{title}</h3>
        <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.875rem', marginBottom: '24px', lineHeight: 1.5 }}>
          {message}
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button type="button" className="admin-btn admin-btn-secondary" onClick={onCancel} style={{ flex: 1 }}>
            Cancel
          </button>
          <button
            type="button"
            className={`admin-btn ${isDanger ? 'admin-btn-danger' : 'admin-btn-primary'}`}
            onClick={onConfirm}
            style={{ flex: 1 }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
