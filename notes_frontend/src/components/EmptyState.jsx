import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Empty state prompting to create a note.
 */
function EmptyState({ onNew }) {
  return (
    <div className="card" style={{ padding: 24, display: 'grid', placeItems: 'center', minHeight: 280 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 42, marginBottom: 8 }}>🗒️</div>
        <h2 style={{ margin: '8px 0' }}>No note selected</h2>
        <p style={{ margin: '0 0 16px', opacity: 0.7 }}>Create a new note to get started.</p>
        <button className="btn btn-secondary" onClick={onNew} aria-label="Create new note">
          + New note
        </button>
      </div>
    </div>
  );
}

export default EmptyState;
