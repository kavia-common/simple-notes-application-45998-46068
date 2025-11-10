import React from 'react';
import { relativeTime } from '../utils/time';

/**
 * PUBLIC_INTERFACE
 * Displays a single note preview in the list.
 */
function NoteListItem({ note, active, onClick, onPinToggle }) {
  const title = note.title?.trim() || 'Untitled';
  const preview = (note.content || '').replace(/\n+/g, ' ').slice(0, 80);

  return (
    <button
      role="listitem"
      className="card"
      onClick={onClick}
      aria-current={active ? 'true' : 'false'}
      style={{
        textAlign: 'left',
        padding: 12,
        background: active ? 'rgba(37,99,235,0.08)' : 'var(--color-surface)',
        border: active ? '1px solid rgba(37,99,235,0.4)' : '1px solid rgba(17,24,39,0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        gap: 8,
      }}
    >
      <div>
        <div style={{ fontWeight: 600, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
          {note.pinned && <span title="Pinned" aria-hidden="true">📌</span>}
          <span>{title}</span>
        </div>
        <div style={{ fontSize: 12, opacity: 0.7 }}>{preview}</div>
        <div style={{ fontSize: 11, opacity: 0.6, marginTop: 6 }}>
          Updated {relativeTime(note.updatedAt)}
        </div>
      </div>
      <div>
        <button
          className="icon-btn"
          title={note.pinned ? 'Unpin' : 'Pin'}
          aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
          onClick={(e) => { e.stopPropagation(); onPinToggle(); }}
        >
          {note.pinned ? 'Unpin' : 'Pin'}
        </button>
      </div>
    </button>
  );
}

export default NoteListItem;
