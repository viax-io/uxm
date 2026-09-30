import { useLayoutEffect } from 'react';

import { useUxm } from './lib/context';

/**
 * Applies the workbench theme to the document so `[data-theme="dark"]` token
 * overrides and `useGlobalTheme` consumers react to the in-app theme toggle.
 * Rendered by `UxmApp` only when the studio owns the theme (standalone portal,
 * i.e. not `embed`) — an embedded host (e.g. modo) drives `data-theme` itself.
 */
export function ThemeSync() {
  const { theme } = useUxm();

  // useLayoutEffect, NOT useEffect. WcagPanel resolves every colour pair with
  // `getComputedStyle` inside its own useLayoutEffect. Layout effects run
  // before passive ones, so with a passive effect here the panel sampled the
  // OUTGOING theme's tokens and was left exactly one toggle behind — in dark
  // it reported the light ratios, and back in light it reported the dark ones.
  // Nothing about a stale number looks stale, so it could show AA for a
  // pairing that fails in the theme actually on screen. This is the
  // accessibility tool; it has to be right.
  //
  // This closes the window in which <html> and the panel disagree. It is NOT a
  // no-flash guarantee: the first paint still comes from UxmProvider restoring
  // the stored theme in a passive effect (lib/context.tsx), which this does not
  // touch.
  //
  // This USED to make sibling order load-bearing — ThemeSync is rendered
  // before the shell in UxmApp, and a reorder would have silently restored the
  // bug. It no longer is: WcagPanel now reads the attribute through
  // `useGlobalTheme` (a MutationObserver), so it sees the write whenever and
  // by whomever it happens. Keeping the layout effect anyway, because a DOM
  // sync belongs before paint on its own merits and the panel should not be
  // the only reason it is correct.
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return null;
}
