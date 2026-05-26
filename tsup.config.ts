import { execFile } from 'node:child_process';
import { copyFile, mkdir, readdir, stat } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { promisify } from 'node:util';

import { defineConfig } from 'tsup';

const execFileAsync = promisify(execFile);

async function copyAsset(from: string, to: string) {
  const dest = resolve(to);
  await mkdir(dirname(dest), { recursive: true });
  await copyFile(resolve(from), dest);
}

/**
 * Recursively copy every `.css` file under `srcDir` into `destDir`,
 * preserving relative paths. Used to mirror `src/ui/<name>/<name>.css`
 * into `dist/ui/<name>/<name>.css` so the aggregator `dist/ui/styles.css`
 * (raw `@import` passthrough) can resolve them at consumer build/load time.
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
 * Rewrite `@/*` aliases to relative paths in the emitted `dist/` tree.
 * Required because tsup runs esbuild in `bundle: false` mode (transform-only),
 * which preserves import specifiers verbatim and does NOT resolve tsconfig
 * paths. Without this step published `.js`/`.cjs`/`.d.ts` files would ship
 * unresolvable `from "@/helpers"` imports.
 */
async function rewriteAliases() {
  const { stdout, stderr } = await execFileAsync('npx', [
    'tsc-alias',
    '-p', 'tsconfig.json',
    '--outDir', 'dist',
    '--resolve-full-paths',
  ]);
  if (stdout.trim()) process.stdout.write(stdout);
  if (stderr.trim()) process.stderr.write(stderr);
}

export default defineConfig({
  entry: ['src/**/*.ts', 'src/**/*.tsx', '!src/**/*.css'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: false,
  target: 'es2020',
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  // 1:1 file output so Next.js App Router consumers preserve the
  // `"use client"` / `"use server"` directives declared in individual
  // component source files.
  bundle: false,
  outExtension({ format }) {
    return { js: format === 'cjs' ? '.cjs' : '.js' };
  },
  async onSuccess() {
    // Copy raw CSS assets into the dist tree alongside the JS bundles so that
    // `@viax/uxm/ui.css` and `@viax/uxm/tokens.css` exports resolve correctly.
    // Mirrors EVERY .css file under src/ui/ (aggregator + per-component) so the
    // `@import` chain in dist/ui/styles.css resolves at the consumer side.
    await copyCssTree('src/ui', 'dist/ui');
    await copyAsset('src/tokens/index.css', 'dist/tokens/index.css');
    // Rewrite `@/*` aliases in dist/ to relative paths — see rewriteAliases doc.
    await rewriteAliases();
  },
});
