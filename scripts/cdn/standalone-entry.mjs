// Entry for `uxm.standalone.js` (see tsup.cdn.config.ts). Re-exports the whole
// `/ui` surface plus the React instance bundled with it: a page without a
// bundler has no JSX and must call `UXM.React.createElement`, and it must use
// THIS React, not another copy, or hooks and context break.
//
// Lives inside the repo tree on purpose — Node resolves `react` from the
// importing file's location, so an entry in a scratch directory cannot see
// node_modules (esbuild's CLI has no --resolve-dir either).
//
// Reads from dist/, not src/: `npm run build` must have run first.
import * as React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';

export * from '../../dist/ui/index.js';
export { React, createRoot, hydrateRoot };
