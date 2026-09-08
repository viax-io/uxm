/**
 * @viax.io/uxm — public entry.
 *
 * Re-exports the UI primitive barrel and the design-token API so consumers
 * can do `import { Button } from "@viax.io/uxm"` for convenience, while the
 * subpath entries (`@viax.io/uxm/ui`, `@viax.io/uxm/tokens`) remain available for
 * tree-shaking-friendly, granular consumption.
 */
export * from './ui';
export * from './tokens';
// WCAG/contrast helpers — useful for tooling that needs to audit token pairs.
export * from './lib/contrast';
