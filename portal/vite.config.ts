import { fileURLToPath, URL } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

/**
 * Standalone host that bundles the UXM Studio workbench into a static portal
 * (the `build:modo` target, Storybook-style). It consumes the *built* library
 * via self-reference (`@viax/uxm/studio` → ./dist), so the portal validates the
 * published artifact exactly as a real consumer would. Run `npm run build`
 * first (or `npm run dev` for tsup watch) so ./dist exists.
 *
 * Output → ../dist-portal (zero-backend static site for S3 + CloudFront).
 */
export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  plugins: [react()],
  build: {
    outDir: fileURLToPath(new URL('../dist-portal', import.meta.url)),
    emptyOutDir: true,
  },
});
