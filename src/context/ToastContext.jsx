import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'gold', duration = 3200) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast Notification Container */}
      <div 
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxWidth: '380px',
          width: 'calc(100% - 48px)',
          pointerEvents: 'none'
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            style={{
              pointerEvents: 'auto',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #102619 0%, #07150E 100%)',
              border: '1px solid var(--color-gold-border)',
              borderRadius: '8px',
              padding: '14px 18px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.6), 0 0 15px rgba(199,154,74,0.2)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '0.875rem',
              fontWeight: '500',
              animation: 'fadeInUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              lineHeight: 1.4
            }}
          >
            <span style={{ color: 'var(--color-gold-base)', fontSize: '1.1rem', flexShrink: 0 }}>
              ✦
            </span>
            <div style={{ flex: 1 }}>{toast.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
