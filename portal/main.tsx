import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { UxmApp, createReadOnlyPersistence } from '@/studio';

import './studio.css';

// UI atom styles live as self-contained .scss next to each component. Pull the
// whole tree as side-effect imports so atoms render with their real CSS in
// dev (HMR) and build alike — no prior library build, no .scss aggregator.
import.meta.glob('../src/ui/**/*.scss', { eager: true });

const container = document.getElementById('root');
if (!container) throw new Error('Root element #root not found');

createRoot(container).render(
  <StrictMode>
    <UxmApp persistence={createReadOnlyPersistence()} />
  </StrictMode>,
);
