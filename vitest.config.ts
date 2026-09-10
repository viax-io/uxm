import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vitest/config';

/**
 * Smoke suite for the contracts nothing else can see: keyboard/focus
 * behaviour of the floating layers, ARIA wiring, the CSS sanitizers and the
 * overrides generator, plus the public surface (export names per subpath,
 * the `--uxm-*` theming variables, and that `dist/` loads as ESM and CJS —
 * snapshots under `tests/__snapshots__`, refreshed with `vitest run -u`).
 * Runs in jsdom — no browser, no styles. Tests live in `tests/` (outside
 * `src/`, so tsup and the DTS pass never see them).
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
    // One jsdom per worker instead of one per file — jsdom set-up was ~40 %
    // of the run. Files stay isolated in their own VM context.
    pool: 'vmThreads',
    // Orientation only — there are deliberately NO thresholds and no CI gate
    // (`npm run test:coverage`). Previews, barrels and the studio's shell /
    // editors are portal-verified and excluded so the numbers describe the
    // logic that can actually be unit-tested.
    coverage: {
      provider: 'v8',
      reporter: ['text-summary', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*-preview.tsx',
        'src/**/index.ts',
        'src/previews/**',
        'src/studio/shell/**',
        'src/studio/editors/**',
      ],
    },
  },
});
