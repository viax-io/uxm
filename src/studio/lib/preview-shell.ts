import { useMemo } from 'react';

import type { PreviewShellContext } from '@/previews';

import { useUxm } from './context';

/**
 * Reshape the Studio UxmContext into the slim `PreviewShellContext` that
 * shell-coupled previews (brand-settings, app-sidebar, login-page) expect.
 * The previews that ignore `shell` receive a stable reference and incur no
 * extra re-renders.
 *
 * `uploadAsset` is routed through the injected persistence backend (no direct
 * `fetch` here). When the backend can't upload (read-only static portal) it is
 * omitted entirely — previews then keep their upload UI inert (R2/R7).
 */
export function usePreviewShell(): PreviewShellContext {
  const { brand, setBrand, theme, setTheme, persistence, capabilities } = useUxm();
  return useMemo(
    () => ({
      brand,
      setBrand,
      theme,
      setTheme,
      uploadAsset: capabilities.upload ? persistence.uploadAsset : undefined,
    }),
    [brand, setBrand, theme, setTheme, persistence, capabilities.upload],
  );
}
