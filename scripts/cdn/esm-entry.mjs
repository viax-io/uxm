// Entry for `uxm.esm.js` (see tsup.cdn.config.ts): the whole `/ui` surface
// plus `VERSION`, the package version this file was built from.
//
// A host that loads uxm from the CDN has no node_modules/@viax.io/uxm/package.json
// to read its version from, so the bundle carries it. CDN-only on purpose: the
// npm `/ui` entry stays exactly src/ui/index.ts. The named JSON import is
// tree-shaken to that one string — the rest of package.json never ships.
//
// Reads from dist/, not src/: `npm run build` must have run first.
export * from '../../dist/ui/index.js';
export { version as VERSION } from '../../package.json';
