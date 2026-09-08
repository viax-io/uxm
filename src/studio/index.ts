/**
 * @viax.io/uxm/studio — the UXM design workbench (sidebar + canvas + properties
 * panel + previews + editors), the same portal shipped at modo's `/uxm` route.
 *
 * Decoupled from any specific backend via `StudioPersistence`: inject
 * `createHttpPersistence()` to read/write against a Hono API, or
 * `createReadOnlyPersistence()` for a static portal (live-preview only).
 *
 * Styles ship separately as `@viax.io/uxm/studio.css` — import it once in the
 * host; it bundles tokens + UI atom CSS + the Tailwind utilities the shell
 * uses, so no host Tailwind config is required.
 */
export { UxmApp } from './uxm-app';
export type { UxmAppProps } from './uxm-app';
export { UxmProvider, useUxm } from './lib/context';
export { registry, getComponentDef, categoryColors } from './lib/registry';
export type {
  BrandConfig,
  BrandTokens,
  Category,
  ComponentDef,
  EditorControlType,
  LayoutVariant,
  PreviewProps,
  StyleOverrides,
  StyleProperty,
} from './lib/types';

// Persistence contract + adapters + the single CSS generator (R5/R7).
export {
  createReadOnlyPersistence,
  createClientPersistence,
  createHttpPersistence,
  generateOverridesCss,
} from './persistence';
export type {
  StudioPersistence,
  StudioState,
  AllOverrides,
} from './persistence';
