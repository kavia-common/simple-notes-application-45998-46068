import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { loadNotes, saveNotes, STORAGE_KEY, migrateIfNeeded } from '../utils/storage';
import { uuid } from '../utils/id';
import { now } from '../utils/time';

const VERSION = 1;

/**
 * PUBLIC_INTERFACE
 * Hook managing notes collection with persistence and utilities.
 */
export function useNotes() {
  const [notesById, setNotesById] = useState({});
  const [order, setOrder] = useState([]); // ids
  const [lastOpenedId, setLastOpenedId] = useState(null);
  const [deletedStack, setDeletedStack] = useState([]); // for undo

  // Load on mount
  useEffect(() => {
    const raw = loadNotes();
    const data = migrateIfNeeded(raw, VERSION);
    setNotesById(data.notesById || {});
    setOrder(data.order || []);
    setLastOpenedId(data.lastOpenedId || null);
  }, []);

  // Persist on change (debounced minimal)
  const saveRef = useRef(null);
  useEffect(() => {
    if (saveRef.current) clearTimeout(saveRef.current);
    saveRef.current = setTimeout(() => {
      saveNotes({ version: VERSION, notesById, order, lastOpenedId });
    }, 120);
    return () => clearTimeout(saveRef.current);
  }, [notesById, order, lastOpenedId]);

  const orderedNotes = useMemo(() => {
    const arr = order.map(id => notesById[id]).filter(Boolean);
    // pinned first by updatedAt desc within each section
    const pinned = arr.filter(n => n.pinned).sort((a,b)=>b.updatedAt - a.updatedAt);
    const rest = arr.filter(n => !n.pinned).sort((a,b)=>b.updatedAt - a.updatedAt);
    return [...pinned, ...rest];
  }, [order, notesById]);

  const createNote = useCallback(() => {
    const id = uuid();
    const ts = now();
    const note = { id, title: '', content: '', createdAt: ts, updatedAt: ts, pinned: false };
    setNotesById(prev => ({ ...prev, [id]: note }));
    setOrder(prev => [id, ...prev]);
    setLastOpenedId(id);
    return note;
  }, []);

  const updateNote = useCallback((id, patch) => {
    setNotesById(prev => {
      const current = prev[id];
      if (!current) return prev;
      const next = { ...current, ...patch, updatedAt: now() };
      return { ...prev, [id]: next };
    });
  }, []);

  const deleteNote = useCallback((id) => {
    setNotesById(prev => {
      const note = prev[id];
      const { [id]: _, ...rest } = prev;
      if (note) {
        setDeletedStack(stack => [{ note, when: now() }, ...stack].slice(0, 5));
      }
      return rest;
    });
    setOrder(prev => prev.filter(nid => nid !== id));
    setLastOpenedId(prev => (prev === id ? null : prev));
  }, []);

  const undoLastDelete = useCallback(() => {
    setDeletedStack(stack => {
      const item = stack[0];
      if (!item) return stack;
      const remaining = stack.slice(1);
      const { note, when } = item;
      // only allow within 10s
      if (now() - when <= 10000) {
        setNotesById(prev => ({ ...prev, [note.id]: note }));
        setOrder(prev => [note.id, ...prev]);
        setLastOpenedId(note.id);
      }
      return remaining;
    });
  }, []);

  const pinNote = useCallback((id) => updateNote(id, { pinned: true }), [updateNote]);
  const unpinNote = useCallback((id) => updateNote(id, { pinned: false }), [updateNote]);

  const forceSave = useCallback(() => {
    // Immediate save (no-op since we always persist debounced), but ensure flush by writing now.
    saveNotes({ version: VERSION, notesById, order, lastOpenedId });
  }, [notesById, order, lastOpenedId]);

  return {
    state: { notesById, order, orderedNotes, lastOpenedId },
    createNote,
    updateNote,
    deleteNote,
    pinNote,
    unpinNote,
    setLastOpenedId,
    forceSave,
    undoDeleteAvailable: deletedStack.length > 0,
    undoLastDelete,
  };
}
