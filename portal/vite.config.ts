import { fileURLToPath, URL } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

/**
 * Standalone host that runs / bundles the UXM Studio workbench as a static
 * portal (Storybook-style). It compiles everything straight from `src` — TSX
 * via the `@` alias, Tailwind utilities + tokens via the Tailwind plugin, and
 * the UI atom CSS via a `.scss` glob in main.tsx — so both `dev:modo` (full
 * HMR) and `build:modo` need NO prior library build.
 *
 * Output → ../dist-portal (zero-backend static site for S3 + CloudFront).
 */
export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('../src', import.meta.url)),
    },
  },
  build: {
    outDir: fileURLToPath(new URL('../dist-portal', import.meta.url)),
    emptyOutDir: true,
  },
});
