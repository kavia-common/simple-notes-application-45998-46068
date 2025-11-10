export const STORAGE_KEY = 'notes_v1';

export function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveNotes(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function migrateIfNeeded(data, targetVersion) {
  if (!data) return { version: targetVersion, notesById: {}, order: [], lastOpenedId: null };
  // In future, transform versions here
  return data;
}
