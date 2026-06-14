import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { UxmApp, createReadOnlyPersistence } from '@viax/uxm/studio';

import '@viax/uxm/tokens.css';
import '@viax/uxm/ui.css';
import '@viax/uxm/studio.css';

const container = document.getElementById('root');
if (!container) throw new Error('Root element #root not found');

createRoot(container).render(
  <StrictMode>
    <UxmApp persistence={createReadOnlyPersistence()} />
  </StrictMode>,
);
