import React, { useEffect } from 'react';

/**
 * PUBLIC_INTERFACE
 * Toast component for notifications with optional action and autoclose.
 */
function Toast({ type = 'info', message, actionLabel, onAction, onClose, autoCloseMs = 3000 }) {
  useEffect(() => {
    if (!autoCloseMs) return;
    const t = setTimeout(() => onClose?.(), autoCloseMs);
    return () => clearTimeout(t);
  }, [autoCloseMs, onClose]);

  const bg = type === 'warning' ? 'var(--color-secondary)' :
             type === 'error' ? 'var(--color-error)' :
             'var(--color-primary)';
  const color = type === 'warning' ? '#111827' : '#fff';

  return (
    <div
      role="status"
      aria-live="polite"
      className="card"
      style={{
        position: 'fixed',
        left: 16,
        bottom: 16,
        background: bg,
        color,
        border: 'none',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 12px',
        zIndex: 60,
      }}
    >
      <span>{message}</span>
      {actionLabel && (
        <button
          className="icon-btn"
          style={{ color }}
          onClick={onAction}
          aria-label={actionLabel}
        >
          {actionLabel}
        </button>
      )}
      <button className="icon-btn" style={{ color }} aria-label="Close" onClick={onClose}>×</button>
    </div>
  );
}

export default Toast;
