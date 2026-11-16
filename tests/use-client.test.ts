import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

/**
 * `'use client'` marks the modules a React Server Component cannot render: the
 * ones that call hooks or `createContext`, and the ones that build their own
 * event handlers (a server component can't hand a function to the browser).
 * Next.js App Router reads the directive per module, so a server page can
 * render the atoms without a client wrapper of its own.
 *
 * The set is derived from the source rather than listed, so a new atom that
 * gains a hook without the directive (or a pure atom that gains one it doesn't
 * need) fails here instead of 500-ing a consumer's server page.
 */
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const UI = join(ROOT, 'src/ui');

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const modules = walk(UI)
  .filter((p) => /\.tsx?$/.test(p))
  .filter((p) => !p.endsWith('-preview.tsx') && !p.endsWith('/index.ts'))
  .map((p) => relative(ROOT, p));

// A generic call (`useRef<HTMLDivElement>(null)`) counts too.
const HOOK = /\buse[A-Z]\w*\s*(?:<[^>()]*>)?\(|createContext\s*(?:<[^>()]*>)?\(|\buse\(/;
// An inline ref callback is a function built here too. (Object-style handlers,
// `{ onClick: () => … }`, aren't matched: the pattern can't be told apart from a
// props interface's `onClick: () => void`.)
const OWN_FN = /\bref=\{\s*\(/;
const HANDLER = /\b(on[A-Z]\w*)=\{([^}]*)/g;

/** True when the module builds a handler itself, not just forwards a prop of the same name.
 *  Errs towards "client" on purpose (a value with nested braces is cut short):
 *  an unneeded directive costs a client boundary, a missing one a 500. */
function ownsHandler(src: string): boolean {
  for (const [, name, raw] of src.matchAll(HANDLER)) {
    const value = raw.trim();
    if (value === name || value.startsWith('rest.') || value.startsWith('props.')) continue;
    // A prop forwarded under another name (`onClick={onDismiss}`) is still a
    // pass-through: the function comes from the caller, not from this module.
    if (/^on[A-Z]\w*$/.test(value)) continue;
    // An action object's own handler (`onClick={action.onClick}`) is the caller's too.
    if (/^\w+\.on[A-Z]\w*$/.test(value)) continue;
    return true;
  }
  return false;
}

const source = (rel: string) => readFileSync(join(ROOT, rel), 'utf8');
const startsWithDirective = (src: string) => /^\s*(?:\/\*[\s\S]*?\*\/\s*|\/\/[^\n]*\n\s*)*['"]use client['"];/.test(src);
/** Comments stripped, so an example in a JSDoc block isn't read as code. */
const code = (src: string) => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/[^\n]*/g, '$1');
const needsClient = (src: string) => HOOK.test(code(src)) || OWN_FN.test(code(src)) || ownsHandler(code(src));

describe("'use client' in src/ui", () => {
  it('finds the modules (a silent empty scan would pass everything below)', () => {
    expect(modules.length).toBeGreaterThan(80);
    expect(modules.filter((m) => needsClient(source(m))).length).toBeGreaterThan(40);
  });

  it('every module with hooks, context or its own handlers starts with the directive', () => {
    const missing = modules.filter((m) => needsClient(source(m)) && !startsWithDirective(source(m)));
    expect(missing).toEqual([]);
  });

  it('no other module carries it, so pure atoms stay server components', () => {
    const extra = modules.filter((m) => !needsClient(source(m)) && startsWithDirective(source(m)));
    expect(extra).toEqual([]);
  });

  it('keeps the layout atoms server-safe', () => {
    for (const atom of ['stack/stack.tsx', 'cluster/cluster.tsx', 'card/card.tsx', 'responsive-grid/responsive-grid.tsx', 'icon/icon.tsx', 'page-shell/page-shell.tsx']) {
      expect(startsWithDirective(source(`src/ui/${atom}`)), atom).toBe(false);
    }
  });

  it('exports the public constants from server-safe modules', () => {
    // A server component importing a value from a 'use client' module gets a
    // client reference, not the value. These three live in their own files and
    // the barrels export them from there.
    for (const [file, name] of [
      ['src/ui/listbox/listbox-constants.ts', 'SEARCHABLE_AUTO_THRESHOLD'],
      ['src/ui/locale/locale-constants.ts', 'DEFAULT_UXM_LOCALE'],
      ['src/ui/app-sidebar/app-sidebar-icon-colors.ts', 'DEFAULT_SIDEBAR_ICON_COLORS'],
    ] as const) {
      const src = source(file);
      expect(startsWithDirective(src), file).toBe(false);
      expect(src, file).toMatch(new RegExp(`export const ${name}\\b`));
    }
  });
});

describe("'use client' and the public constants", () => {
  it('no UPPER_CASE value exported from src/ui/index.ts is defined in a client module', () => {
    // src/ui/index.ts is the public surface; a constant a server component can
    // import from it has to come out as the value, not a client reference.
    const barrel = source('src/ui/index.ts');
    const names = [...barrel.matchAll(/export\s*\{([^}]*)\}/g)]
      .flatMap(([, list]) => list.split(','))
      .map((n) => n.trim().replace(/^type\s+/, ''))
      .filter((n) => /^[A-Z][A-Z0-9_]+$/.test(n));
    expect(names.length).toBeGreaterThan(2);
    const inClient = names.filter((name) =>
      modules.some((m) => new RegExp(`export const ${name}\\b`).test(source(m)) && startsWithDirective(source(m))),
    );
    expect(inClient).toEqual([]);
  });
});

describe("'use client' survives the build", () => {
  const dist = join(ROOT, 'dist/ui');
  const built = existsSync(dist);

  it.skipIf(!built)('ESM and CJS output keep it as the first directive', () => {
    const lost = modules
      .filter((m) => needsClient(source(m)))
      .flatMap((m) => {
        const base = join(ROOT, 'dist', m.replace(/^src\//, '').replace(/\.tsx?$/, ''));
        const esm = readFileSync(`${base}.js`, 'utf8');
        const cjs = readFileSync(`${base}.cjs`, 'utf8');
        return [
          ...(esm.startsWith('"use client";') ? [] : [`${m} (esm)`]),
          ...(/^"use strict";\s*"use client";/.test(cjs) || cjs.startsWith('"use client";') ? [] : [`${m} (cjs)`]),
        ];
      });
    expect(lost).toEqual([]);
  });
});
