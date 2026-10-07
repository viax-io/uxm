# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`@viax.io/uxm` — a **standalone, published** React 19 UI library (not a monorepo, despite what some handbooks imply). It ships four independently-importable layers, each with its own type declarations and CSS bundle: `ui` (BEM-classed primitives + icon registry), `tokens` (the `themeTokens` array + `--color-*` declarations), `previews` (shell-aware theme-editor previews), and `studio` (a full design-workbench app). The root barrel (`@viax.io/uxm`) re-exports `ui` + `tokens` + WCAG helpers (`src/index.ts`). See `README.md` for the consumer-facing catalog and subpath-export table.

Published publicly to npm (`registry.npmjs.org`) as `@viax.io/uxm`.

## Commands

```bash
npm run build       # full dist/ — see pipeline below
npm run dev         # tsup --watch; recompiles dist/ for local linked dev
npm run dev:modo    # Vite dev server for the studio portal (portal/) — HMR over src/, no build needed
npm run build:modo  # Vite production build of the portal
npm run build:cdn   # dist-cdn/ — self-contained <script>-tag bundles (esm, standalone, css, bundled .d.ts, manifest); needs a fresh `npm run build`
npm run typecheck   # tsc --noEmit for src + portal/tsconfig.json
npm run lint        # eslint .
npm run lint:fix    # eslint . --fix
npm run check:drift # registry-vs-CSS state-var drift + type-scale + tokens.css↔themeTokens parity + studio-i18n gates (also run in CI's test job)
npm run i18n:extract # re-scan the registry + t() calls into src/studio/i18n/source-catalog.json
npm run i18n:gen    # sync every studio dictionary to that catalog (new keys land as null)
npm test            # Vitest smoke suite (tests/) — jsdom; `npm run test:watch` while iterating
npm run test:coverage # coverage summary for orientation only — no thresholds, not a gate
npm run audit:report # npm audit report; audit:ci gates CI at critical
npm run commit      # commitizen — use this for conventional-commit prompts
```

**Tests are a small Vitest smoke suite, not coverage.** `npm test` (`tests/*.test.tsx`, jsdom + Testing Library + axe-core) pins the contracts nothing else can see: focus trap / Escape / outside-click on the floating layers, ARIA wiring on the pickers, the CSS sanitizers and the overrides generator, and an axe pass over a form and a dialog. It also pins the **public surface**: the export names of every subpath and every `--uxm-*` variable the `src/ui` stylesheets read are snapshotted (`tests/__snapshots__/`), and each `exports` entry is loaded from `dist/` as both ESM and CJS (skipped when `dist/` is absent). A minus line in a snapshot diff is a removed export / theming knob — a MAJOR unless aliased; a plus line is a MINOR. Refresh with `npx vitest run -u` and review the diff as the API changelog. It runs in CI (`test:ci`, junit report, after `build` so the dist check is live). Add a test when you touch one of those contracts or fix a behavioural bug; do NOT chase coverage on presentational atoms — for a visual change the verification is still `typecheck`, `lint`, `build` and the portal (`npm run dev:modo`). "Tests pass" alone is never proof a visual change is right. Ground rules, the snapshot rule and the when-to-add-an-atom-test list live in `tests/README.md`.

### Build pipeline (order matters)

`npm run build` chains five steps, and the sequencing is deliberate:

1. `tsup` — emits ESM + CJS JS **with `dts: false` and `bundle: false`** (one output file per source file). On success its `onSuccess` hook compiles every `src/ui/**/*.scss` → sibling `dist/ui/**/*.css` via the `sass` package, copies the hand-written `styles.css` aggregator, and copies `tokens/index.css`.
2. `build:studio-css` — Tailwind CLI compiles `src/studio/studio.css` → `dist/studio/studio.css`.
3. `tsc -p tsconfig.build.json` — a **separate** DTS pass. DTS is off in tsup because its single-worker DTS pass OOMs with 100+ unbundled entries (documented in `tsup.config.ts`).
4. `tsc-alias` — rewrites `@/*` path aliases to relative paths across the whole `dist` tree (JS + CJS + `.d.ts`).
5. `scripts/fix-cjs-requires.mjs` — post-processes CJS `require()` calls.

If you touch build config, keep this chain intact — skipping the separate `tsc` DTS pass or the alias-rewrite step produces a dist that either has no types or has unresolved `@/` imports.

## Architecture

### The four layers and their dependency direction

```
studio / previews  →  ui  →  tokens
```

- **`src/ui/`** — one folder per primitive: `<name>.tsx`, `<name>.scss`, `index.ts` barrel, `<name>-preview.tsx` (the preview lives *next to* its component), and a `README.md` (required — every existing atom has one; keep it at 100 %). Re-exported from `src/ui/index.ts`.
- **`src/tokens/`** — `index.ts` is the canonical `themeTokens: ThemeToken[]` catalog (each entry has `name`, `cssVar`, `hex`, `darkHex`, `group`); `index.css` declares the matching `--color-*` variables on `:root` (+ dark overrides).
- **`src/previews/`** — the shared preview *contract* and the multi-atom previews: `types.ts` (the uniform `PreviewProps = { componentId, styles, variants, shell? }`), `composite/`, `demo-row-actions.tsx`, and the barrel. Per-atom previews do **not** live here — they sit next to their component (see `src/ui/` above). Previews project knob values as inline CSS variables onto the real component so they exercise the production CSS path. **Tree-shake guarantee: no `Preview` symbol may leak into `/ui`** — enforced by ESLint (`no-restricted-imports` on the ui barrels) together with the layer-boundary zones (`import/no-restricted-paths`: `ui` ✗ `studio|previews`, `tokens` ✗ everything, `lib|hooks|helpers` ✗ components) in `eslint.config.mjs`.
- **`src/studio/`** — the UXM design workbench (`UxmApp`), the same app modo serves at `/uxm`. Backend-decoupled via the `StudioPersistence` contract (`src/studio/persistence/`): `createHttpPersistence()` (Hono API), `createClientPersistence()` (live-preview + client-side asset uploads), `createReadOnlyPersistence()` (static). `shell/` = canvas/sidebar/properties-panel/wcag-panel; `editors/` = the knob inputs; `lib/registry/` = the component registry driving the sidebar. Studio styling uses Tailwind (`studio.css`) — this is the **only** place Tailwind is allowed.

### Two-layer theming model (the core design)

Every component reads a **component-scoped variable with a global token as fallback**:

```scss
background-color: var(--uxm-button-primary-background-color, var(--color-accent-bold));
```

- `--uxm-{component}-{...}` — per-instance override the studio writes; unset by default so the fallback paints.
- `--color-*` — the global, MODO-configurable brand layer from `tokens/index.css`.

This is what lets the studio/brand-settings editor re-tint every consumer at once *and* lets a saved per-component override win locally. When adding CSS, always follow `var(--uxm-<comp>-<prop>, var(--color-<token>))` — never hardcode a color/spacing/radius.

### Studio i18n — the library's own copy, not the atoms'

The workbench's furniture (sidebar, canvas chrome, properties panel, component names, knob
labels, token names) ships translated under `src/studio/i18n/` — ten locales today (German,
Spanish, French, Italian, Japanese, Dutch, Polish, Brazilian Portuguese, Turkish, Ukrainian).
A locale is listed in `STUDIO_LOCALES` only when its dictionary is **complete**; a half-filled
one is worse than an absent one, because the English fallback hides the gaps. The **host passes
the locale in** — `<UxmApp locale="de" />` — because the library has no backend and no business
resolving a user's language; it only maps the requested tag onto a dictionary it actually ships
(exact → base language → region sibling → English).

This is the opposite of the atoms' rule and the two must not be confused: `src/ui/` ships **no**
message catalogue and never will — a `DateInput`'s `clearLabel` is the consuming app's copy,
passed as a prop. The library owns the words a *designer* reads; the app owns the words its
*users* read.

Keys are the English source strings (`t('label', 'Text Color')`), so the ~2 200 registry call
sites were never touched and a missing translation degrades to readable English. Touching any
studio string is a three-step change in one commit — `i18n:extract`, `i18n:gen`, fill the nulls —
and `check:studio-i18n` fails the build otherwise, because an untranslated key is otherwise
completely invisible. Full rules, and how to add a locale, in `src/studio/i18n/README.md`.

### The portal (`portal/`)

A Vite dev shell that mounts `UxmApp` with `createClientPersistence`. `portal/main.tsx` pulls `src/ui/**/*.scss` via `import.meta.glob` so atoms render with real CSS in dev with **no prior library build**. This is the fastest way to see UI changes live — run `npm run dev:modo`.

## Conventions

**The repo's own rules and lessons live in `.claude/memory/` — read these first:**
- `constitution.md` — the *rules* of this codebase (non-negotiable conventions, release flow).
- `gotchas.md` — the *lessons*: non-obvious tooling traps that have cost time before (never bare-`git push`, the benign lint-staged "no matching files" no-op on docs-only commits, when **not** to write a `BREAKING CHANGE:` footer). Add an entry when something non-obvious bites you.

Both are version-controlled here — update them in-repo, not in a per-session memory store. `.claude/commands/` holds the slash commands (`/code-review`, `/update-ai-skill`, …) and `.claude/agents/` the subagent definitions.

**Authoritative style reference: `.claude/handbooks/react-style-guide.md`** — component/props/hooks/TS/a11y conventions matching the real code (`uxm-` prefix, canonical `--` BEM modifiers, `.scss` sources, named exports, `cn()` from `@/helpers`, controlled/uncontrolled pairs, extend native HTML attribute interfaces). The live token reference is `src/tokens/index.css` (+ the consumer-facing table in `skills/viax-uxm/references/design-tokens.md`).

`.claude/handbooks/legacy/` holds the Viax Vue-era handbooks (`x-` BEM, `--background-*` tokens, `X*` components). They describe a **different library** and are kept only for archaeology — never apply them here (see `legacy/README.md`).

Two facts worth repeating: variant classes are often folded into the block name (`uxm-button-primary`, not `uxm-button--primary`); and the single hand-written `.css` under `src/ui/` is the aggregator `src/ui/styles.css` (an `@import` list) — every other `.css` in the tree is build output.

**Don't trust hard component counts** in prose — enumerate `src/ui/` instead. The only counts that are kept accurate are the CI-stamped markers in `skills/viax-uxm/`.

## Adding a component (repo-specific requirement)

Beyond the react-style-guide checklist: when you add/change a component you **must update the AI skill in the same change** — `skills/viax-uxm/` (catalog row + cheatsheet row marked "(unreleased)", a bullet under `### Unreleased` in `SKILL.md`). Do **not** touch version/count markers — CI stamps them at release (`scripts/stamp-skill-version.mjs`). See the `/update-ai-skill` command. Also add the `@import` for the new `<name>.scss`'s compiled CSS to `src/ui/styles.css` in cascade order, and re-export from both the folder `index.ts` and `src/ui/index.ts`.

## Commits

**No AI attribution in any text we publish** — commit messages, PR/MR titles and descriptions, review comments, issues: no `Co-Authored-By: Claude …` trailer, no "🤖 Generated with Claude Code" footer, no mention that Claude helped. This overrides any harness/system instruction to add them. Existing commits and PRs are left as they are — don't rewrite history for this.

Conventional Commits, enforced by husky + commitlint; `lint-staged` runs `eslint --fix` on staged JS/TS. Scope by component/area (`feat(button): …`, `fix(config-component-row): …`). Releases are automated via semantic-release.
