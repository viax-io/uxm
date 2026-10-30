import { readFileSync } from 'node:fs';

import { compileString } from 'sass';

/**
 * The compiled CSS for a `src/ui` stylesheet.
 *
 * Some contracts in this suite are about cascade order and specificity —
 * things jsdom applies none of, so they are asserted against the stylesheet
 * directly. Those assertions must read the COMPILED output, not the `.scss`
 * source, and the distinction earned itself rather than being a precaution:
 * `data-table.scss`'s three card-mode blocks were factored into mixins so
 * `stackAt` could reuse them, which moved their bodies out of the `@container`
 * blocks in source while leaving the compiled output byte-identical. Every
 * source-shaped assertion failed on a change that could not alter one pixel.
 *
 * The compiled output is the artifact the browser resolves, and the only thing
 * these contracts are really about.
 */
export function compiledCss(scssPath: string): string {
  return compileString(readFileSync(scssPath, 'utf8'), {
    loadPaths: [scssPath.replace(/\/[^/]+$/, '')],
  }).css;
}
