import { useMemo } from 'react';

import type { PreviewShellContext } from '@/previews';

import { useStudioT } from '../i18n';

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
 *
 * `t` travels the same way, and for the same reason the boundary exists:
 * `src/previews` may not import `src/studio`, so the studio hands the
 * translator DOWN rather than letting previews reach UP for it. Only the
 * editor-style previews use it — demo copy stays English deliberately.
 */
export function usePreviewShell(): PreviewShellContext {
  const { brand, setBrand, theme, setTheme, persistence, capabilities } = useUxm();
  const studioT = useStudioT();
  return useMemo(
    () => ({
      brand,
      setBrand,
      theme,
      setTheme,
      uploadAsset: capabilities.upload ? persistence.uploadAsset : undefined,
      t: (source: string, vars?: Record<string, string | number>) => studioT('chrome', source, vars),
    }),
    [brand, setBrand, theme, setTheme, persistence, capabilities.upload, studioT],
  );
}
