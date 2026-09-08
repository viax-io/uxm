import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vitest/config';

/**
 * Smoke suite for the contracts nothing else can see: keyboard/focus
 * behaviour of the floating layers, ARIA wiring, the CSS sanitizers and the
 * overrides generator. Runs in jsdom — no browser, no styles. Tests live in
 * `tests/` (outside `src/`, so tsup and the DTS pass never see them).
 */
export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.{ts,tsx}'],
    setupFiles: ['./tests/setup.ts'],
    css: false,
    restoreMocks: true,
  },
});
