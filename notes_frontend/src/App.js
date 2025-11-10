import React, { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import './styles/theme.css';
import './styles/globals.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import NoteEditor from './components/NoteEditor';
import EmptyState from './components/EmptyState';
import ModalConfirmDelete from './components/ModalConfirmDelete';
import Toast from './components/Toast';
import { useNotes } from './hooks/useNotes';
import { onGlobalShortcuts } from './utils/keyboard';
import { getHashRoute, navigateTo, ROUTES } from './utils/router';
import { now } from './utils/time';
import { restoreFocusOnHashChange } from './utils/router';

/**
 * Root App component orchestrating the two-pane layout and simple hash-based routes.
 * Routes:
 * - #: home, shows last opened or empty
 * - #/new: create new and open editor
 * - #/notes/:id: open existing note
 */
function App() {
  const {
    state,
    createNote,
    updateNote,
    deleteNote,
    pinNote,
    unpinNote,
    setLastOpenedId,
    forceSave,
    undoDeleteAvailable,
    undoLastDelete,
  } = useNotes();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [toast, setToast] = useState(null);
  const mainRef = useRef(null);

  // Simple router via hash
  const route = getHashRoute();

  // Ensure route defaults to last opened note if available
  useEffect(() => {
    if (!route.name || route.name === ROUTES.HOME) {
      if (state.lastOpenedId && state.notesById[state.lastOpenedId]) {
        navigateTo(`/notes/${state.lastOpenedId}`, false);
      }
    }
  }, [route.name, state.lastOpenedId, state.notesById]);

  // Focus management when route changes
  useEffect(() => restoreFocusOnHashChange(mainRef), []);

  // Keyboard shortcuts
  useEffect(() => {
    const unsubscribe = onGlobalShortcuts({
      onNew: () => {
        navigateTo('/new');
      },
      onSave: () => {
        forceSave();
        setToast({ type: 'info', message: 'Saved', id: 'save-' + now() });
      },
    });
    return () => unsubscribe();
  }, [forceSave]);

  // Handle /new: create and navigate to the new note
  useEffect(() => {
    if (route.name === ROUTES.NEW) {
      const n = createNote();
      navigateTo(`/notes/${n.id}`);
    }
  }, [route.name, createNote]);

  // Current note
  const currentNote = useMemo(() => {
    if (route.name === ROUTES.NOTE && route.params?.id) {
      return state.notesById[route.params.id] || null;
    }
    return null;
  }, [route.name, route.params, state.notesById]);

  // Update lastOpenedId when changing note
  useEffect(() => {
    if (currentNote?.id) {
      setLastOpenedId(currentNote.id);
    }
  }, [currentNote, setLastOpenedId]);

  const handleDelete = (id) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (pendingDeleteId) {
      deleteNote(pendingDeleteId);
      setConfirmOpen(false);
      setToast({
        type: 'warning',
        message: 'Note deleted. Undo?',
        id: 'del-' + now(),
        actionLabel: 'Undo',
        onAction: () => {
          undoLastDelete();
          setToast(null);
        },
        autoCloseMs: 10000,
      });
      // After deletion navigate to home to let router pick next note
      navigateTo('/');
    }
  };

  const cancelDelete = () => {
    setPendingDeleteId(null);
    setConfirmOpen(false);
  };

  const onPinToggle = (id, pinned) => {
    if (pinned) unpinNote(id);
    else pinNote(id);
  };

  const onTitleChange = (id, title) => updateNote(id, { title });
  const onContentChange = (id, content) => updateNote(id, { content });

  return (
    <div className="app-root" data-theme="ocean-pro">
      <Header
        onNew={() => navigateTo('/new')}
        title="Simple Notes"
        subtitle="Ocean Professional"
      />
      <div className="layout">
        <Sidebar
          notes={state.orderedNotes}
          activeId={currentNote?.id || null}
          onSelect={(id) => navigateTo(`/notes/${id}`)}
          onPinToggle={onPinToggle}
          onNew={() => navigateTo('/new')}
        />
        <main className="main" ref={mainRef} tabIndex={-1}>
          {!currentNote ? (
            <EmptyState onNew={() => navigateTo('/new')} />
          ) : (
            <NoteEditor
              key={currentNote.id}
              note={currentNote}
              onTitleChange={(t) => onTitleChange(currentNote.id, t)}
              onContentChange={(c) => onContentChange(currentNote.id, c)}
              onDelete={() => handleDelete(currentNote.id)}
              onForceSave={() => {
                forceSave();
                setToast({ type: 'info', message: 'Saved', id: 'save-' + now() });
              }}
            />
          )}
        </main>
      </div>

      <ModalConfirmDelete
        open={confirmOpen}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
      />

      {toast && (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          actionLabel={toast.actionLabel}
          onAction={toast.onAction}
          onClose={() => setToast(null)}
          autoCloseMs={toast.autoCloseMs}
        />
      )}
    </div>
  );
}

export default App;
