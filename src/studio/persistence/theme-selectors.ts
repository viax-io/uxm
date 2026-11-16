/**
 * Where a brand's per-theme colour tokens are written, shared by the published
 * stylesheet (`generate-css.ts`) and the workbench's live `<style>`
 * (`brand-token-styles.tsx`) so the two never drift.
 *
 * Light is scoped to "not dark" on the root rather than written on a bare
 * `:root`: `:root` and `[data-theme="dark"]` have equal specificity, so a bare
 * `:root` block would pin a token customised only for light into dark mode
 * too. `[data-theme="light"]` carries the same tokens to a light panel inside
 * a dark page, over tokens.css's `:where([data-theme="light"])` defaults.
 * Both stay in ONE selector list: hosts that re-scope the sheet (modo's
 * `scopeUxmCss`) split lists on commas.
 */
export const LIGHT_TOKENS_SELECTOR = ':root:not([data-theme="dark"]), [data-theme="light"]';
export const DARK_TOKENS_SELECTOR = '[data-theme="dark"]';
