import { useSyncExternalStore } from 'react';

/**
 * Reads the current global theme from `document.documentElement.dataset.theme`
 * and re-renders when it changes. Lets UXM previews react to the host app's
 * light/dark toggle without owning theme state themselves.
 */
export function useGlobalTheme(): 'light' | 'dark' {
  return useSyncExternalStore(
    (cb) => {
      if (typeof document === 'undefined') return () => {};
      const obs = new MutationObserver(cb);
      obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
      return () => obs.disconnect();
    },
    () => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'),
    () => 'light',
  );
}
