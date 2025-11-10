import React, { useEffect, useRef } from 'react';

/**
 * PUBLIC_INTERFACE
 * Note editor with title and content fields, delete and save actions.
 */
function NoteEditor({ note, onTitleChange, onContentChange, onDelete, onForceSave }) {
  const titleRef = useRef(null);

  useEffect(() => {
    // Focus title for new notes
    if (!note.title && titleRef.current) {
      titleRef.current.focus();
    }
  }, [note.id]); // when a new note mounts

  return (
    <section className="card" style={{ height: '100%', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div className="toolbar" style={{ justifyContent: 'space-between' }}>
        <div className="toolbar" role="group" aria-label="Editor actions left">
          <button className="btn" onClick={onForceSave} aria-label="Save (Ctrl/Cmd+S)">Save</button>
        </div>
        <div className="toolbar" role="group" aria-label="Editor actions right">
          <button className="btn btn-danger" onClick={onDelete} aria-label="Delete note">Delete</button>
        </div>
      </div>
      <label style={{ fontSize: 12, opacity: 0.7 }} htmlFor="note-title">Title</label>
      <input
        id="note-title"
        ref={titleRef}
        className="input"
        placeholder="Title"
        value={note.title || ''}
        onChange={(e) => onTitleChange(e.target.value)}
      />
      <label style={{ fontSize: 12, opacity: 0.7 }} htmlFor="note-content">Content</label>
      <textarea
        id="note-content"
        className="input"
        placeholder="Start typing…"
        value={note.content || ''}
        onChange={(e) => onContentChange(e.target.value)}
        style={{ minHeight: 280, resize: 'vertical', lineHeight: 1.5 }}
      />
      <div style={{ display: 'flex', gap: 12, fontSize: 12, opacity: 0.6 }}>
        <span>Created: {new Date(note.createdAt).toLocaleString()}</span>
        <span>Updated: {new Date(note.updatedAt).toLocaleString()}</span>
      </div>
    </section>
  );
}

export default NoteEditor;
