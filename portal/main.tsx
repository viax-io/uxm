import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { UxmApp, createClientPersistence } from '@/studio';

import './studio.css';

// UI atom styles live as self-contained .scss next to each component. Pull the
// whole tree as side-effect imports so atoms render with their real CSS in
// dev (HMR) and build alike — no prior library build, no .scss aggregator.
import.meta.glob('../src/ui/**/*.scss', { eager: true });

// Default VIAX brand shown in the portal (mirrors modo's components.json).
// The assets are served from portal/public/uxm-assets at `/uxm-assets/*`.
const VIAX_BRAND_DEFAULTS = {
  logoUrl: '/uxm-assets/logo-1777586563215.svg',
  iconUrl: '/uxm-assets/icon-1777563094833.svg',
  faviconUrl: '/uxm-assets/favicon-1777563100218.svg',
  logoUrlDark: '/uxm-assets/logoDark-1777586583135.svg',
};

const container = document.getElementById('root');
if (!container) throw new Error('Root element #root not found');

// createClientPersistence: live-preview only (nothing saved), but brand-asset
// upload works client-side via data: URLs — so the BrandSettings controls are
// fully functional in the static portal. syncFavicon keeps the browser tab
// icon in step with the brand favicon.
createRoot(container).render(
  <StrictMode>
    <UxmApp
      persistence={createClientPersistence({ brand: VIAX_BRAND_DEFAULTS })}
      syncFavicon
    />
  </StrictMode>,
);
