---
name: viax-uxm
description: >
  Build React 19 apps and components using @viax.io/uxm — the Viax UI primitive library
  (99 BEM-classed React components as of v4.70.0, design tokens, per-component/per-state themable
  previews, and an embeddable studio style editor). TRIGGER
  when: user asks to create, scaffold, or modify a React app/page/component AND mentions
  @viax.io/uxm or the Viax design system; the working directory contains @viax.io/uxm in package.json
  dependencies; user mentions Viax tokens, themeTokens, MODO brand-settings, the @viax.io/uxm/studio editor (UxmApp), or UXM previews;
  user asks which component to use for a UX task (e.g. "button vs link", "banner vs badge",
  "toast vs banner", "how to render a tabular list") within a Viax React context; user pastes a
  Figma design that needs to be implemented with Viax UI primitives in React. Use this skill to
  pick the right primitive, look up its props/CSS-vars/design-tokens, and produce code that
  conforms to the library's conventions (subpath imports, BEM classnames, token-driven theming,
  no `"use client"` unless required by Next.js App Router).
keywords: viax, uxm, viax-uxm, react, react-19, nextjs, design-tokens, design-system, modo, brand-settings, primitives, themable, previews, studio, style-editor, UxmApp, generateOverridesCss
---

# @viax.io/uxm — React 19 Component Library

> Documents `@viax.io/uxm` **v4.70.0** (99 components). The version/count markers are stamped by
> the library's release pipeline; a stale marker means the skill copy is behind the published package.
>
> ⚠️ **A consumer may install behind the published latest** — check the project's `@viax.io/uxm` pin
> in its `package.json` before relying on a recent addition (each "New in X.Y.Z" section below
> names the version that shipped it). The skill documents the released surface named in the
> heading above regardless of what any consumer currently installs. No other line in this file
> states a "current" version — the stamped heading is the single source of truth.

This skill turns Claude into a competent consumer of `@viax.io/uxm`. It does not generate Vue MFA
apps — for that, use `viax-mfa-component` instead. It assumes the target framework is React 19
(Next.js App Router or Vite SPA) and that `@viax.io/uxm` is or will be a dependency of the project.

## v4.70.0 — current API surface (overrides training data)

The library ships on a fast release train; if your knowledge of it or old code conflicts
with this list, THIS list wins. The sections below cover the **five most recent releases** plus
whatever is merged but unreleased. Everything older — from the 2.0.0 baseline through the
breaking changes in 3.0.0 (`Select` clear button) and 4.0.0 — lives in
`references/changelog.md`, in the same format; read it whenever a consumer is pinned below the
oldest version listed here (check its `package.json`) or a name in old code is not in the
catalog.

### New in 4.67.0

- **`AppSidebar`: `--uxm-app-sidebar-nav-padding-top`** (default `8px`, so nothing moves) — the
  space above the first nav section. Set it to start the sections level with the page content's
  first line, e.g. `24px` under a `32px` content padding (less the heading's own `8px`). Sides and
  bottom stay `8px` so the header/footer slots still align with the nav rows. Studio knob: Nav Top
  Padding. Replaces a consumer reaching into `.uxm-app-sidebar__nav`.
- **`AppSidebar`: `--uxm-app-sidebar-header-height`** — the brand (logo) row's height (the
  `__header` element, not the `header` prop's slot). It now **follows `--uxm-app-top-bar-height`**
  when unset (default `64px`), so a shell that thins its top bar at `:root` keeps the logo level
  with the bar — ⚠️ if you set `--uxm-app-top-bar-height` at `:root`, the logo row now matches it.
  Studio knob: Logo Row Height.

### New in 4.68.0

- **Editable columns: per-row options, and options that show but refuse** (unreleased).
  Two additive gaps closed for field-mapping grids. `DataTable`'s
  `column.editorOptions` now takes `EditableCellOption[]` **or** `(row) => EditableCellOption[]`,
  for a column whose choices differ row to row (type-compatible sources only, or
  nothing another row has claimed). It runs on every render for every
  EDITABLE row — a closed cell needs the list to resolve its label, and a row
  `isEditable` excludes never calls it — and is deliberately NOT cached, since a
  correct key would have to cover everything the function closes over. Keep the
  row's own current value in its list (disabled rather than omitted): a value
  missing from its list survives as a stand-in row, but shows as its raw id.
  `EditableCellOption` gained `disabled?: boolean`: the option renders greyed
  out, is skipped by arrow-key navigation and commits nothing on click, in both
  the select and multiselect panels. Use it where the option's absence would
  confuse, and leave the option out otherwise; the reason goes in `label`, since
  the atom ships no words of its own. `Listbox` needed no change — `isItemDisabled`
  already covered both panels. One caveat worth passing on: a disabled row
  inherits the shared `--uxm-listbox-option-disabled-opacity` (0.4), which
  measures 2.46:1 on a LIGHT panel (dark clears 3:1 at 3.60:1) — allowed (1.4.3 exempts inactive controls)
  but hard to read, so raise that knob when the label carries a reason the user
  is meant to read (0.55 → 3.78:1, 0.65 → 5.19:1). The default is shared
  library-wide and deliberately untouched.
  Two fixes came out of reviewing this: `Listbox`'s empty state now means
  "nothing to show" rather than "nothing pickable" (an all-disabled list, or a
  search narrowed to only disabled matches, used to render `No matches` and hide
  every option — which defeats the point of a disabled option), and a
  select/multiselect cell keeps a committed value its option list does not
  contain, as a plain stand-in row, instead of silently dropping it on the next
  commit.

### New in 4.68.1

- **`LifecycleZoomControl`: the `%` sits beside the number.** The editable value is right-aligned
  against its `%`, and the cell keeps the read-only shape's 10px end padding, so the `%` no longer
  sits on the divider; the field is sized for three digits (34px). Visual only — no API or knob
  change.

### New in 4.69.0

- **The AA fix for small labels is now reachable everywhere** (unreleased). Seven
  atoms default a 10–11px label to `--color-text-subtle`, a **3:1** token, which
  misses 1.4.3 in both themes. The defaults stay put — darkening them moves every
  listbox and settings panel, a major-release decision — but two of the seven had
  no knob at all, so an app could not fix them without overriding the global token
  and dragging every separator and disabled mark with it. They have one now:
  `--uxm-search-dropdown-option-meta-color` and
  `--uxm-timeline-entry-trailing-color`, both defaulting to exactly what they
  painted before, so nothing moves until a consumer opts in. The copy-paste fix is
  in `references/design-tokens.md` → "Small labels that fail AA".
  `--uxm-calendar-today-button-disabled-color` went in with them: WCAG exempts an
  inactive control, but Constitution I wants the knob anyway, and with it there
  is no bare subtle-token text declaration left — which let the gate below drop
  its exemption list entirely.

  `tests/subtle-text-reachable.test.ts` now enforces the promise: any `color` or
  `-webkit-text-fill-color` reading the subtle token without a knob fails the
  suite, with no selector classifier to get wrong. It also snapshots the 25
  declarations that default to the token, sorted and whitespace-normalised, so
  moving a rule is not a diff and a flipped default is. Worth knowing when
  reading the AA table: its headline figures are on `--color-card`; dark on
  `--color-surface-alt` is 2.85:1, below even the 3:1 floor the token exists
  for.

### New in 4.70.0

- **New atom: `ExpandableText`** (unreleased) — display-only long text for side
  panes and detail views: wraps in full up to `lines` lines (default 4), then
  clamps behind a "Show more" / "Show less" link. The link renders only when the
  collapsed text actually overflows (measured, `ResizeObserver`-re-measured) or
  while expanded, so short text shows nothing extra. `expanded` /
  `defaultExpanded` / `onExpandedChange`, and `moreLabel` / `lessLabel` — the
  atom ships no message catalogue, so the two labels are the app's copy (English
  defaults). `white-space: pre-wrap` keeps paragraph breaks. The toggle reads as
  an accent link flush with the text, not a bordered button. Knobs:
  `--uxm-expandable-text-{color,font-size,line-height,gap,toggle-color,toggle-hover-color,toggle-font-size,toggle-font-weight,toggle-gap}`.

- **`EditableCell type="textarea"`** (unreleased) — the multi-line sibling of
  `text`, for a description or note in a form / side-pane row (not a `DataTable`
  cell: a table row must not grow). The display wraps in full and clamps to
  `lines` (default 4) behind the same Show more / Show less toggle as
  `ExpandableText` — `lines`, `moreLabel`, `lessLabel` are the new props, the
  labels English by default like every other label on the cell. The editor is the
  library's `Textarea`, sized to its content (3–10 lines, then it scrolls):
  `Enter` inserts a newline, `Cmd/Ctrl+Enter` commits, `Escape` cancels (and does
  not also dismiss a surrounding pane), blur commits; `validate`, `required`,
  async `onCommit` and the error banner are unchanged. The caret lands at the end,
  not select-all. The toggle is a sibling of the edit button — a button cannot
  nest in a button. Also: `Textarea` now keeps a caller-supplied `aria-invalid`
  when it has no `error` message (it used to overwrite it with `undefined`).
  New knobs: `--uxm-editable-cell-textarea-{line-height,min-lines,max-lines,gap}`.

### Unreleased

<!-- Notes for changes merged but not yet published. Add a bullet here in the SAME
     PR as the change. At release the pipeline renames this heading to
     "New in X.Y.Z", stamps the version/count markers, and re-opens a fresh
     "### Unreleased" below it (scripts/stamp-skill-version.mjs) — never hand-edit
     the markers, and never append notes under an already-stamped heading. -->

- **`EditableCell` leaves IME keys alone** (unreleased) — while an IME is composing,
  Enter (confirm the candidate) and Escape (dismiss the candidate window) no longer
  commit or cancel the cell. Most visible on `type="textarea"`, where Escape used to
  discard the whole draft; no API change.

## Workflow

### Where the documentation lives

The library lives at `https://github.com/viax-io/uxm` and publishes as `@viax.io/uxm`
to the public npm registry (`https://registry.npmjs.org`). When a checkout
of that repo is available (search the workspace for a `package.json` with
`"name": "@viax.io/uxm"`), **prefer the per-component READMEs there as the authoritative
reference** (paths relative to the repo root):

- Top-level: `README.md` — install, subpath exports, full component catalog, MODO theming flow,
  architecture diagram.
- Per-component: `src/ui/{component}/README.md` — props table, CSS vars, MODO-configurable
  design tokens, states/variants, accessibility caveats. Every atom has one; the `.tsx` JSDoc
  is the fallback for anything the README does not cover.
- Tokens: `src/tokens/index.ts` — canonical `themeTokens` array.

When no checkout is available (working in a project that only `npm install`s the package), the
installed package still carries `node_modules/@viax.io/uxm/README.md`, `CHANGELOG.md`, and full
`.d.ts` types with the same JSDoc. Beyond that, fall back to the bundled references in this
skill:

- `references/component-catalog.md` — every export, grouped by purpose, with one-line summaries
  and key prop signatures. Use this to pick the right primitive.
- `references/design-tokens.md` — all 31 MODO-configurable design tokens with hex values,
  groups, and intended use. Use this when wiring custom CSS or token-based styling.
- `references/quick-recipes.md` — copy-pasteable patterns for the most common compositions
  (page shell, form, list view, theme override).
- `references/changelog.md` — every "New in X.Y.Z" section older than the five kept in this
  file, including the 3.0.0 / 4.0.0 breaking changes. Read it for consumers pinned to an
  older version or when old code uses a name the catalog no longer has.

### Before writing any code

1. Confirm the project consumes the library **through the `uxm` alias** — the convention every
   viax React app uses:
   ```jsonc
   // package.json
   "dependencies": {
     "uxm": "npm:@viax.io/uxm@^4.40.1"
   }
   ```
   and imports read `from 'uxm/ui'`, `import 'uxm/tokens.css'` — never `@viax.io/uxm/…`.
   - Check `package.json` for the `"uxm": "npm:@viax.io/uxm@…"` entry (and the `react@^19` peer).
   - If the app still lists `"@viax.io/uxm"` directly, switch it to the alias and rewrite the
     imports in the same change — mixing the two forms installs the package twice.
   - If absent and the user wants to add it: `npm i uxm@npm:@viax.io/uxm@latest`. Why the alias:
     short, stable import paths; ONE place to bump the version; and a package rename (it already
     happened once — `@viax/uxm` → `@viax.io/uxm`) never touches application code again.
   - **Check `.npmrc` for a registry override.** If the project's default registry points at
     Nexus (`registry=https://nexus.viax.tech/repository/viax-npm/` — a common viax-internal
     setup) rather than public npm, it MUST also carry
     `@viax.io:registry=https://registry.npmjs.org/`. Nexus mirrors `registry.npmjs.org` with a
     delay, so installing or bumping right after a fresh `@viax.io/uxm` release can 404 or
     silently resolve a stale version through Nexus without this override. Add it if missing —
     see `uxm-studio/.npmrc` for a working example.
2. Confirm CSS imports are in place. Both stylesheets must be imported once at the app entry:
   ```ts
   // app/layout.tsx (Next.js) or main.tsx (Vite/CRA)
   import 'uxm/tokens.css';
   import 'uxm/ui.css';
   ```
   If missing, add them before any visual work.

### Picking the right component

Open `references/component-catalog.md` (or the top-level README if uxm is local) and locate the
category that matches the user's intent. Categories are: **Forms & inputs · Buttons & actions ·
Navigation · Feedback & status · Layout & structure · Data display · Configuration editor ·
Lifecycle diagrams.**

Then read the chosen component's README (per-component, when uxm is local) before writing JSX —
the README documents the prop signature, states, design tokens, and a11y obligations. Do not
guess prop names from training data.

### Writing the JSX

- **Import from the narrowest subpath available** for tree-shaking:
  - `import { ButtonPrimary } from 'uxm/ui'` (preferred) over
    `import { ButtonPrimary } from 'uxm'`.
  - `import { themeTokens } from 'uxm/tokens'` for token-aware tooling.
  - `import { UxmApp } from 'uxm/studio'` + `import 'uxm/studio.css'` to embed the
    live style editor (see "Embedding the style editor").
- **No `"use client"` directive** unless the file uses client-only React features (hooks, state,
  event handlers). UXM components themselves do not require it.
- **BEM classnames are part of the public contract**. If the user wants to extend styling, they
  should target the `uxm-{component}` class or its modifier classes (e.g. `uxm-button-primary`,
  `uxm-chip--state-focus`). Document this when delivering.
- **`className` always merges via the library's `cn` helper internally** — pass any extra class
  freely; it composes with the BEM base class.

### Styling and theming

The library exposes a two-layer customisation model:

| Layer | Where to set | When to use |
|-------|--------------|-------------|
| **Component CSS vars** (`--uxm-{component}-*`, incl. per-state `--uxm-{component}-{hover,active,focus,disabled}-*`) | Inline `style`, a scoped CSS rule, or the studio's saved overrides | Per-instance / per-state tweaks (e.g. a specific button's hover background). |
| **Global design tokens** (`--color-*`) | App-level CSS file, or the embedded studio's brand settings | Brand-wide theming. Cascades into every component instantly. |

For any custom colour, **prefer mapping to an existing design token** before introducing a literal
hex. Use `references/design-tokens.md` to find the right token by intent (e.g. "I need a success
green" → `--color-success-text`, not `#166534`).

If the user is building a host shell that lets designers tune the brand live, prefer the
**ready-made editor**: mount `UxmApp` from `uxm/studio` (see "Embedding the style editor").
Only drop down to raw `uxm/previews` (the `PreviewProps` preview primitives) when building a
bespoke editor surface — see `references/quick-recipes.md`.

### Accessibility

Each component README's **Accessibility** section is the authoritative checklist for that
primitive (native semantics it provides, what's missing, ARIA hooks the consumer must wire). Cite
those when delivering work — do not invent your own a11y story without checking.

Some honestly-flagged gaps to know about:
- `data-table` has no `scope` attribute on `<th>`; for sortable / large tables, consumers must
  layer additional ARIA.
- `loader` does not honour `prefers-reduced-motion`.
- `app-sidebar` references `--mobile-*` rules that are missing from its SCSS.
- Several `lifecycle-*` primitives are visual-only and rely on the parent canvas for a11y.

## Embedding the style editor (`uxm/studio`)

The full MODO design workbench ships as a mountable component, so a host portal can offer a live
brand/style editor without rebuilding it. Import it from the `studio` subpath + its CSS once:

```tsx
import { UxmApp, createClientPersistence } from 'uxm/studio';
import 'uxm/studio.css'; // Tailwind v4 bundle — see leakage note below

<UxmApp embed persistence={createClientPersistence({ brand: seed })} />
```

**`UxmApp` props:** `embed` (no full-page chrome — use when mounting inside a host), `persistence`
(the backend contract), `syncFavicon` (drive the tab favicon from the brand).

**Persistence adapters** — pick by whether you have a backend:

- `createHttpPersistence('/api/uxm')` — full read/write/upload against a Hono backend (Save / Quick
  Save / Publish enabled).
- `createClientPersistence({ brand })` — preview-only: live edits + working logo/favicon upload via
  `data:` URLs, nothing saved across reload. For static portals with no backend.
- `createReadOnlyPersistence({ brand })` — live-preview only, uploads disabled.
- For a no-backend portal that still wants **Save-that-persists**, implement the tiny
  `StudioPersistence` interface (`load` / `save` / `uploadAsset` / `capabilities`) over `localStorage`.

**Apply the editor's config to the host globally.** Import `generateOverridesCss` from
`uxm/studio/generate-css`, run it over the saved `{ overrides, brand }`, and inject the result
into a single global `<style>`. It emits the `:root` / `[data-theme="dark"]` brand-token blocks plus
per-component override rules (which the per-state atom CSS now reads), re-theming the whole host on
every route — and survives reload if you persist the state. When the brand carries a typeface
(`brand.fontFamily`, set via Brand Settings → Typography), the same output also includes the
Google-Fonts `@import`, `--brand-font`, and `body { font-family: var(--brand-font) !important }`
— so the host's base font follows the brand automatically. Host CSS should therefore declare its
base font as `html, body, #root { font-family: var(--brand-font, var(--font-sans)); }` and never
hardcode a competing family (see `references/design-tokens.md` → "Typography").

> ⚠️ **A non-Tailwind host must alias `--font-sans` first, or everything renders in Times New
> Roman.** `tokens.css` declares `--font-sans` only inside its `@theme inline { … }` block, a
> Tailwind v4 at-rule that browsers drop wholesale — so the var never actually exists in a plain
> BEM/SCSS host. With no brand font published, `--brand-font` is unset too, so the `body` rule
> above collapses to the guaranteed-invalid value, becomes invalid at computed-value time, and
> `<body>` inherits the browser's default serif. Every uxm atom uses `font-family: inherit`, so the
> serif spreads across the whole app. Add this once, after `tokens.css`:
>
> ```css
> :root { --font-sans: var(--font-inter, 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif); }
> button, input, select, textarea { font: inherit; }
> ```
>
> `--font-inter` *is* declared in the real `:root`, so it resolves. The second rule is needed
> because native form controls do NOT inherit the document font (UA default → Arial): uxm atoms
> set `font-family: inherit` themselves, but any raw `<button>`/`<input>`/`<select>` in host code
> would otherwise render in Arial next to the body font. There is no `--font-mono` token —
> use `var(--font-mono, monospace)` with the literal fallback.
>
> These two lines are the emergency fix. **The complete host baseline — including the
> `html, body, #root { height: 100% }` that `PageShell` needs in order to bound its own scroll
> area, and the `DetailSection` / `List` corrections — is
> [`references/quick-recipes.md` § 0](references/quick-recipes.md).** Apply that once and none of
> these come up.

**Brand tokens.** Seed the studio's `brand.tokens.light` / `.dark` with the host's brand colours so
the editor adopts them as its own managed Accent tokens; `BrandTokenStyles` (rendered even in
`embed`) writes them to `:root`, so editing re-tints the host live. The host owns `data-theme`
(light/dark) in `embed` mode — drive it yourself.

**CSS-leakage caveat for non-Tailwind hosts.** `uxm/studio.css` is a Tailwind v4 bundle: a
global preflight reset (`@layer base`, lower priority than your unlayered CSS) plus an UNLAYERED
`:root { … }` block of the library's *default* tokens. In a non-Tailwind host (e.g. a BEM/SCSS
portal), import it **before** the host's own global stylesheet so the host's `:root` brand stays the
base; the studio's runtime `<style>` still wins live on the editor route.

## Hard rules

1. **Never guess prop names.** Always read the component's README (or `component-catalog.md` if
   not available) before writing the JSX.
2. **Never duplicate primitives.** If `@viax.io/uxm` already ships a `Card`, do not handroll a div
   with the same intent. The component count in the heading above is the current catalog size —
   check `references/component-catalog.md` first.
3. **Never inline literal hex codes** when an existing design token covers the intent. Map to
   `--color-*` via `var()` so MODO brand-settings can re-tint.
4. **Never import preview components into application code.** Previews live in
   `uxm/previews` and are for editor/host shells only. Tree-shake guarantees they don't
   leak into `/ui` consumers — keep it that way.
5. **For new components that don't fit any existing primitive**, propose extending the library
   rather than building one-offs. The contribution flow is in the top-level README's
   "Contributing" section.
6. **`PropertyField`'s value is `children`, never a `value` prop.** `value="…"` silently renders
   an empty cell. `PropertyGrid` has no `columns` / `minColumnWidth` prop — its grid template is
   fixed.
7. **`PageHeader`'s `meta` renders inside a `<p>` — inline content only.** A block-level primitive
   (`Stack`, a `<div>`) there is invalid `<div>`-in-`<p>` nesting and triggers a hydration warning.
8. **`ResponsiveGrid`'s `min` is a CSS length string** (`"280px"`), not a bare number — a bare
   number emits an invalid, dropped `minmax()`.
9. **`Stack` is flex-column only — never override it with `flexDirection: 'row'`.** Use `Cluster`
   for horizontal layouts (avatar/name rows, button groups, inline chips).
10. **`BackLink` always needs a real `href`**, even when the click is intercepted for
    client-side nav (`preventDefault()`) — it's an `<a>`, and `onClick`-only breaks keyboard focus
    and right-click/open-in-new-tab.
11. **Import only through the `uxm` alias** (`from 'uxm/ui'`, `import 'uxm/tokens.css'`). Never
    write `@viax.io/uxm/…` in application code — the real package name lives in ONE place, the
    `"uxm": "npm:@viax.io/uxm@^x.y.z"` dependency line, so a version bump or a rename is a one-line
    change. The subpaths are unchanged: `uxm`, `uxm/ui`, `uxm/tokens`, `uxm/hooks`, `uxm/previews`,
    `uxm/studio`, `uxm/studio/generate-css`, plus `uxm/ui.css`, `uxm/tokens.css`, `uxm/studio.css`.

## Out of scope

- **Vue MFA components** — use `viax-mfa-component` skill.
- **A *bespoke* editor surface hand-rolled from raw previews** — `uxm/previews` provides the
  preview primitives for that, but prefer the ready-made `UxmApp` from `uxm/studio`
  ("Embedding the style editor"). Only the bespoke-from-previews path is out of scope here.
- **Design token additions** — propose them via PR to the `@viax.io/uxm` repo, do not invent local
  `--color-*` declarations.
