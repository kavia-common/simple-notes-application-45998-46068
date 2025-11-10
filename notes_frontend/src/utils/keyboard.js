const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

/**
 * PUBLIC_INTERFACE
 * Register global keyboard shortcuts.
 */
export function onGlobalShortcuts({ onNew, onSave }) {
  function handler(e) {
    const meta = isMac ? e.metaKey : e.ctrlKey;
    if (meta && (e.key === 's' || e.key === 'S')) {
      e.preventDefault();
      onSave?.();
    } else if (meta && (e.key === 'n' || e.key === 'N')) {
      e.preventDefault();
      onNew?.();
    }
  }
  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}
