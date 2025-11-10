import { useEffect, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * Small helper hook for reading/writing localStorage values.
 */
export function useLocalStorage(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const v = window.localStorage.getItem(key);
      return v !== null ? JSON.parse(v) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      /* ignore write errors */
    }
  }, [key, state]);

  return [state, setState];
}
