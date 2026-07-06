// Post-build fixup for the dual ESM/CJS output.
//
// The build emits both `.js` (ESM, because package.json is `"type": "module"`)
// and `.cjs` files, but `tsc-alias --resolve-full-paths` rewrites every
// internal specifier to a `.js` extension regardless of format. That leaves the
// CJS bundle doing `require("./foo/index.js")` — i.e. requiring an ESM file —
// which throws `ERR_REQUIRE_ESM` on Node < 22.12 and in CJS-only bundlers.
//
// This pass rewrites only *relative* `require("….js")` specifiers inside
// `.cjs` files to point at their `.cjs` siblings. Bare specifiers (e.g. "react")
// and the ESM `.js` files are left untouched.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = 'dist';

// require("./x.js") / require('../a/b.js') — relative specifiers only.
const RELATIVE_REQUIRE = /(\brequire\(\s*['"])(\.\.?\/[^'"]*?)\.js(['"]\s*\))/g;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else yield p;
  }
}

let patched = 0;
for await (const file of walk(DIST)) {
  if (!file.endsWith('.cjs')) continue;
  const src = await readFile(file, 'utf8');
  const out = src.replace(RELATIVE_REQUIRE, '$1$2.cjs$3');
  if (out !== src) {
    await writeFile(file, out);
    patched += 1;
  }
}
process.stdout.write(`  fixed CJS requires in ${patched} .cjs file(s)\n`);
