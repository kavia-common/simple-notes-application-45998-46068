import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Header component displaying app title and quick actions.
 */
function Header({ title, subtitle, onNew }) {
  return (
    <header
      className="card"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        margin: '12px',
        gap: 12,
      }}
      aria-label="Application header"
    >
      <div>
        <h1 style={{ margin: 0, fontSize: 18 }}>{title}</h1>
        <p style={{ margin: 0, opacity: 0.7, fontSize: 12 }}>{subtitle}</p>
      </div>
      <div className="toolbar">
        <button className="btn btn-secondary" onClick={onNew} aria-label="Create new note (Ctrl/Cmd+N)">
          + New
        </button>
      </div>
    </header>
  );
}

export default Header;
