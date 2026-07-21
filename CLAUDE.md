# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`@viax/uxm` — a **standalone, published** React 19 UI library (not a monorepo, despite what some handbooks imply). It ships four independently-importable layers, each with its own type declarations and CSS bundle: `ui` (BEM-classed primitives + icon registry), `tokens` (the `themeTokens` array + `--color-*` declarations), `previews` (shell-aware theme-editor previews), and `studio` (a full design-workbench app). The root barrel (`@viax/uxm`) re-exports `ui` + `tokens` + WCAG helpers (`src/index.ts`). See `README.md` for the consumer-facing catalog and subpath-export table.

Published to the private Nexus registry (`nexus.viax.tech`), not public npm.

## Commands

```bash
npm run build       # full dist/ — see pipeline below
npm run dev         # tsup --watch; recompiles dist/ for local linked dev
npm run dev:modo    # Vite dev server for the studio portal (portal/) — HMR over src/, no build needed
npm run build:modo  # Vite production build of the portal
npm run typecheck   # tsc --noEmit for src + portal/tsconfig.json
npm run lint        # eslint .
npm run lint:fix    # eslint . --fix
npm run commit      # commitizen — use this for conventional-commit prompts
```

**There are no tests.** `test:ci` / `test:coverage` are intentional no-op stubs (`echo … && exit 0`). Do not report "tests pass" as verification — verify via `typecheck`, `lint`, `build`, or the portal (`npm run dev:modo`).

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

- **`src/ui/`** — one folder per primitive: `<name>.tsx`, `<name>.scss`, `index.ts` barrel, `<name>-preview.tsx` (the preview lives *next to* its component), and a per-component `README.md`. Re-exported from `src/ui/index.ts`.
- **`src/tokens/`** — `index.ts` is the canonical `themeTokens: ThemeToken[]` catalog (each entry has `name`, `cssVar`, `hex`, `darkHex`, `group`); `index.css` declares the matching `--color-*` variables on `:root` (+ dark overrides).
- **`src/previews/`** — preview components + `composite/` multi-atom previews. Uniform `PreviewProps = { componentId, styles, variants, shell? }`. Previews project knob values as inline CSS variables onto the real component so they exercise the production CSS path. **Tree-shake guarantee: no `Preview` symbol may leak into `/ui`** (verified at build).
- **`src/studio/`** — the UXM design workbench (`UxmApp`), the same app modo serves at `/uxm`. Backend-decoupled via the `StudioPersistence` contract (`src/studio/persistence/`): `createHttpPersistence()` (Hono API), `createClientPersistence()` (live-preview + client-side asset uploads), `createReadOnlyPersistence()` (static). `shell/` = canvas/sidebar/properties-panel/wcag-panel; `editors/` = the knob inputs; `lib/registry/` = the component registry driving the sidebar. Studio styling uses Tailwind (`studio.css`) — this is the **only** place Tailwind is allowed.

### Two-layer theming model (the core design)

Every component reads a **component-scoped variable with a global token as fallback**:

```scss
background-color: var(--uxm-button-primary-background-color, var(--color-accent-bold));
```

- `--uxm-{component}-{...}` — per-instance override the studio writes; unset by default so the fallback paints.
- `--color-*` — the global, MODO-configurable brand layer from `tokens/index.css`.

This is what lets the studio/brand-settings editor re-tint every consumer at once *and* lets a saved per-component override win locally. When adding CSS, always follow `var(--uxm-<comp>-<prop>, var(--color-<token>))` — never hardcode a color/spacing/radius.

### The portal (`portal/`)

A Vite dev shell that mounts `UxmApp` with `createClientPersistence`. `portal/main.tsx` pulls `src/ui/**/*.scss` via `import.meta.glob` so atoms render with real CSS in dev with **no prior library build**. This is the fastest way to see UI changes live — run `npm run dev:modo`.

## Conventions

**Authoritative style references live in `.claude/handbooks/`:**
- `react-style-guide.md` — component/props/hooks/TS/a11y conventions. This is the guide that matches the real code (`uxm-` prefix, canonical `--` BEM modifiers, `.scss` sources, named exports, `cn()` from `@/helpers`, controlled/uncontrolled pairs, extend native HTML attribute interfaces).
- `design-tokens.md`, `ui-components.md` — token and component references.

**⚠️ Handbook caveats — the handbooks were written against the *future* modo-monorepo state and drift from this repo. When they conflict, the real code wins:**
- **BEM prefix is `uxm-`, not `x-`.** `bem-style-guide.md` documents the *legacy Viax Vue* `x-block__element_modifier` convention with `.is-*` states — **that is not used here.** This repo uses `uxm-` blocks. (Note variant classes are often folded into the block name, e.g. `uxm-button-primary`, not `uxm-button--primary`.)
- **Styles are authored as `.scss`** (nested BEM), compiled to `.css` at build. The react-style-guide says `.css` and the `import` aliases say `@modo/uxm` — ignore those; sources are `.scss` and the only path alias here is `@/*` → `src/*` (`tsconfig.json`).
- The single hand-written `.css` under `src/ui/` is the aggregator `src/ui/styles.css` (an `@import` list). Every other `.css` in the tree is build output.

**Component-count numbers in `README.md` are stale** (e.g. "76 components") — the actual `src/ui` set is larger. Don't trust hard counts; enumerate the directory.

## Adding a component (repo-specific requirement)

Beyond the react-style-guide checklist: when you add/change a component you **must update the AI skill in the same change** — `skills/viax-uxm/` (catalog row + cheatsheet row marked "(unreleased)", a bullet under `### Unreleased` in `SKILL.md`). Do **not** touch version/count markers — CI stamps them at release (`scripts/stamp-skill-version.mjs`). See the `/update-ai-skill` command. Also add the `@import` for the new `<name>.scss`'s compiled CSS to `src/ui/styles.css` in cascade order, and re-export from both the folder `index.ts` and `src/ui/index.ts`.

## Commits

Conventional Commits, enforced by husky + commitlint; `lint-staged` runs `eslint --fix` on staged JS/TS. Scope by component/area (`feat(button): …`, `fix(config-component-row): …`). Releases are automated via semantic-release.
