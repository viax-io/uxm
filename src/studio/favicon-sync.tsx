import { useEffect } from 'react';

import { useUxm } from './lib/context';

const LINK_ID = 'uxm-brand-favicon';

/**
 * Syncs the document favicon to the workbench brand. Host-opt-in via
 * `UxmApp`'s `syncFavicon` prop (off by default) so a host that manages its
 * own favicon (e.g. a Next app) isn't double-driven. Resolves the dark
 * favicon when the workbench theme is dark, falling back to the light one.
 */
export function FaviconSync() {
  const { brand, theme } = useUxm();
  const favicon =
    theme === 'dark' ? brand.faviconUrlDark || brand.faviconUrl : brand.faviconUrl;

  useEffect(() => {
    if (!favicon) return;

    document.querySelectorAll(`link#${LINK_ID}`).forEach((el) => el.remove());
    document
      .querySelectorAll("link[rel='icon'], link[rel='shortcut icon']")
      .forEach((el) => {
        if (el.id !== LINK_ID) el.setAttribute('disabled', 'true');
      });

    const link = document.createElement('link');
    link.id = LINK_ID;
    link.rel = 'icon';
    // Cache-bust so the browser swaps the tab icon immediately on change.
    link.href = favicon + (favicon.includes('?') ? '&' : '?') + 'v=' + Date.now();
    document.head.appendChild(link);
  }, [favicon]);

  return null;
}