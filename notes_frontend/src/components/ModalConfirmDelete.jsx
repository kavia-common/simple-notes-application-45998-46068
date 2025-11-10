import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Modal dialog asking for delete confirmation.
 */
function ModalConfirmDelete({ open, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Confirm delete"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(17,24,39,0.35)',
        display: 'grid',
        placeItems: 'center',
        padding: 16,
        zIndex: 50,
      }}
      onClick={onCancel}
    >
      <div
        className="card"
        style={{ width: 'min(420px, 96vw)', padding: 16 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ marginTop: 0, marginBottom: 8 }}>Delete note?</h3>
        <p style={{ marginTop: 0, opacity: 0.8 }}>
          This action can be undone for 10 seconds via the snackbar.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
          <button className="btn" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm} autoFocus>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default ModalConfirmDelete;
