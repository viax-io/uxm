import { copyFile, mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';

import * as sass from 'sass';
import { defineConfig } from 'tsup';

async function copyAsset(from: string, to: string) {
  const dest = resolve(to);
  await mkdir(dirname(dest), { recursive: true });
  await copyFile(resolve(from), dest);
}

/**
 * Recursively copy every `.css` file under `srcDir` into `destDir`,
 * preserving relative paths. Mirrors the aggregator `src/ui/styles.css`
 * (the only hand-written .css under src/ui/) so its `@import` chain
 * resolves at the consumer side. Per-component .css files are produced
 * by `compileScssTree` from .scss sources, not copied.
 */
async function copyCssTree(srcDir: string, destDir: string) {
  const absSrc = resolve(srcDir);
  const absDest = resolve(destDir);
  async function walk(dir: string) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const p = join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(p);
      } else if (entry.isFile() && entry.name.endsWith('.css')) {
        const rel = relative(absSrc, p);
        const dest = join(absDest, rel);
        await mkdir(dirname(dest), { recursive: true });
        await copyFile(p, dest);
      }
    }
  }
  try {
    const s = await stat(absSrc);
    if (s.isDirectory()) await walk(absSrc);
  } catch {
    // src dir absent — nothing to copy
  }
}

/**
 * Compile every `.scss` file under `srcDir` to a sibling `.css` file under
 * `destDir`, preserving folder structure. Sources live as nested-BEM SCSS
 * while consumers receive plain CSS at `dist/ui/<name>/<name>.css`.
 */
async function compileScssTree(srcDir: string, destDir: string) {
  const absSrc = resolve(srcDir);
  const absDest = resolve(destDir);
  let count = 0;
  async function walk(dir: string) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const p = join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(p);
      } else if (entry.isFile() && entry.name.endsWith('.scss')) {
        const rel = relative(absSrc, p).replace(/\.scss$/, '.css');
        const dest = join(absDest, rel);
        // `charset: false`: these outputs are fragments — `styles.css`
        // concatenates every one with `@import` — and `@charset` is legal only
        // as a stylesheet's first byte, so Sass emitting one per file holding a
        // non-ASCII character (ours hold them only in comments) is invalid past
        // the first fragment. A consumer that imports the aggregator into a
        // cascade layer, as it must with rules that ship unlayered, then gets
        // one "unknown at-rule" warning per fragment. The bundle stays UTF-8.
        const { css } = sass.compile(p, { style: 'expanded', sourceMap: false, charset: false });
        await mkdir(dirname(dest), { recursive: true });
        await writeFile(dest, css);
        count += 1;
      }
    }
  }
  try {
    const s = await stat(absSrc);
    if (s.isDirectory()) await walk(absSrc);
  } catch {
    // src dir absent — nothing to compile
  }
  if (count > 0) process.stdout.write(`  compiled ${count} .scss → .css\n`);
}

// DTS generation is intentionally OFF here. tsup runs its DTS pass in a
// single worker that loads typings for every entry at once, and with
// `bundle: false` + 100+ entries (every .ts/.tsx in src/) the worker
// exceeds Node's default heap and exits with ERR_WORKER_OUT_OF_MEMORY.
// Instead, `npm run build` chains a standalone `tsc -p tsconfig.build.json`
// pass after tsup, then `tsc-alias` rewrites `@/*` aliases across the
// whole dist tree (JS + CJS + .d.ts in one shot).
export default defineConfig({
  entry: ['src/**/*.ts', 'src/**/*.tsx', '!src/**/*.css'],
  format: ['esm', 'cjs'],
  dts: false,
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: false,
  target: 'es2020',
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  bundle: false,
  outExtension({ format }) {
    return { js: format === 'cjs' ? '.cjs' : '.js' };
  },
  async onSuccess() {
    await copyCssTree('src/ui', 'dist/ui');
    await compileScssTree('src/ui', 'dist/ui');
    await copyAsset('src/tokens/index.css', 'dist/tokens/index.css');
  },
});
