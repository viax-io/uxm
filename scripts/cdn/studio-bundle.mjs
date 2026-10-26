// Shared by tsup.cdn.config.ts (which builds `uxm-studio.esm.js`) and
// scripts/build-cdn.mjs (which proves the result holds no second copy of ui).
//
// The studio reaches `src/ui` by more than the barrel: its registry imports the
// per-atom previews (`dist/ui/*/*-preview.js`), and those import `../index.js`
// or a sibling (`./menu.js`, `../icon/index.js`). A specifier pattern cannot
// catch all of that, so the decision is made on the RESOLVED path: any module
// under dist/ui that is not a preview becomes the external `./uxm.esm.js`,
// which the page already loads. One copy of ui means one UxmLocaleProvider
// context and one toast store between the host and the studio.
import { resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
export const UI_DIR = resolve(ROOT, 'dist/ui') + sep;

/**
 * dist/ui modules the studio bundle may carry its own copy of: plain data, no
 * component, no context, no module state, and not on the public `/ui` surface
 * (so `./uxm.esm.js` cannot provide them). Keep this list to modules like that.
 */
export const UI_DUPLICATE_OK = ['list/list-item-styles.js'].map((rel) => resolve(UI_DIR, rel));

/** True when a dist/ui module must come from `./uxm.esm.js`, not the studio bundle. */
export const isSharedUiModule = (path) =>
  path.startsWith(UI_DIR) && !path.endsWith('-preview.js') && !UI_DUPLICATE_OK.includes(path);
