export const ROUTES = {
  HOME: 'home',
  NEW: 'new',
  NOTE: 'note',
};

export function parseHash(hash) {
  const h = (hash || '').replace(/^#/, '');
  const path = h || '/';
  const segments = path.split('/').filter(Boolean);
  if (segments.length === 0) return { name: ROUTES.HOME, params: {} };
  if (segments[0] === 'new') return { name: ROUTES.NEW, params: {} };
  if (segments[0] === 'notes' && segments[1]) return { name: ROUTES.NOTE, params: { id: segments[1] } };
  return { name: ROUTES.HOME, params: {} };
}

export function getHashRoute() {
  return parseHash(window.location.hash);
}

export function navigateTo(path, push = true) {
  const target = '#' + (path.startsWith('/') ? path.slice(1) : path);
  if (push) window.location.hash = target;
  else {
    const { pathname, search } = window.location;
    window.history.replaceState(null, '', `${pathname}${search}${target}`);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  }
}

export function restoreFocusOnHashChange(nodeRef) {
  function onHash() {
    // Try to focus main content for screen readers
    if (nodeRef?.current) {
      setTimeout(() => nodeRef.current.focus(), 0);
    }
  }
  window.addEventListener('hashchange', onHash);
  return () => window.removeEventListener('hashchange', onHash);
}
