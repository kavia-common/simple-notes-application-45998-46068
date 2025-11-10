import React, { useMemo, useState } from 'react';
import NoteListItem from './NoteListItem';

/**
 * PUBLIC_INTERFACE
 * Sidebar with search and a list of notes.
 */
function Sidebar({ notes, activeId, onSelect, onPinToggle, onNew }) {
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return notes;
    return notes.filter(n =>
      (n.title || '').toLowerCase().includes(query) ||
      (n.content || '').toLowerCase().includes(query)
    );
  }, [q, notes]);

  return (
    <aside className="sidebar" aria-label="Notes sidebar">
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <input
          className="input"
          placeholder="Search notes…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search notes"
        />
        <button className="btn" onClick={onNew} aria-label="Create new note">
          +
        </button>
      </div>
      <div role="list" aria-label="Notes list" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {filtered.length === 0 ? (
          <div className="card" style={{ padding: 12, textAlign: 'center' }}>
            No notes found
          </div>
        ) : filtered.map(note => (
          <NoteListItem
            key={note.id}
            note={note}
            active={note.id === activeId}
            onClick={() => onSelect(note.id)}
            onPinToggle={() => onPinToggle(note.id, note.pinned)}
          />
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;
