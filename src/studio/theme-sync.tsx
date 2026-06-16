import { useEffect } from 'react';

import { useUxm } from './lib/context';

/**
 * Applies the workbench theme to the document so `[data-theme="dark"]` token
 * overrides and `useGlobalTheme` consumers react to the in-app theme toggle.
 * Rendered by `UxmApp` only when the studio owns the theme (standalone portal,
 * i.e. not `embed`) — an embedded host (e.g. modo) drives `data-theme` itself.
 */
export function ThemeSync() {
  const { theme } = useUxm();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return null;
}
