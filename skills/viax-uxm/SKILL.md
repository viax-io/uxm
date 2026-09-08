---
name: viax-uxm
description: >
  Build React 19 apps and components using @viax.io/uxm — the Viax UI primitive library
  (97 BEM-classed React components as of v4.40.1, design tokens, per-component/per-state themable
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

> Documents `@viax.io/uxm` **v4.40.1** (97 components). The version/count markers are stamped by
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

## v4.40.1 — current API surface (overrides training data)

The library ships on a fast release train; if your knowledge of it or old code conflicts
with this list, THIS list wins. The sections below cover the **five most recent releases** plus
whatever is merged but unreleased. Everything older — from the 2.0.0 baseline through the
breaking changes in 3.0.0 (`Select` clear button) and 4.0.0 — lives in
`references/changelog.md`, in the same format; read it whenever a consumer is pinned below the
oldest version listed here (check its `package.json`) or a name in old code is not in the
catalog.

### New in 4.36.0

- **`FileUpload` rows can hand the file back.** A `done` row now renders a trailing
  download control, via either `FileUploadFileMeta.href` (renders `<a href download>`) or
  the new `onOpenFile?(id)` prop (renders a `<button>`). **Pick by whether a browser can
  fetch the URL unauthenticated:** `href` is better where it works — only a real anchor
  gives ⌘/middle-click-to-new-tab, right-click "Save link as" and the native download UI
  — but an anchor navigation carries no `Authorization` header, so token-protected
  storage needs `onOpenFile` plus a `fetch` + blob (revoke the object URL, and pass the
  filename or the file saves as a UUID). Setting both is allowed; `onOpenFile` wins.
  Setting neither renders nothing, so existing consumers are untouched.
  ⚠️ `download` is **ignored cross-origin** — the browser navigates instead of saving.
  The anchor carries `target="_blank"` so that lands in a new tab rather than taking the
  app's; still pass `downloadGlyph="arrow-up-right"` AND `downloadLabel="Open"` so
  neither the icon nor the accessible name promises a save (the glyph alone fixes it for
  sighted users only), or use the blob route. While `disabled` the anchor drops its
  `href` — a greyed-out link that keeps one is still tab-reachable and Enter still
  follows it. New vars: `--uxm-file-upload-download-icon-color` / `-hover-color`.

### New in 4.37.0

- **New `UxmLocaleProvider` — one BCP-47 tag for every `Intl` call in the library.** Mount it
  once at the app root and `Calendar`, `DateInput`, `EditableCell` (via Calendar),
  `CurrencyInput`, and `FileUpload` format in that locale. `Calendar` and `CurrencyInput`
  previously hardcoded `locale = 'en-US'` as a default parameter; they now resolve
  prop → provider → `DEFAULT_UXM_LOCALE` (still `'en-US'`), so an app that mounts no provider
  renders exactly as before. Also exports `useUxmLocale(explicit?)` for the same resolution
  inside a consumer's own component. **It is not an i18n engine** — no catalogue, no runtime;
  translated copy still arrives through each atom's label props.
- **Every user-visible string in `/ui` is now reachable from props.** The library's standing rule
  was already "no user-facing string without an override prop", but ten strings had leaked past
  it. Closed:
  - `FileUpload` — new `labels?: FileUploadLabels` (`uploading`, `uploadFailed`, and the composed
    `uploadProgress(percent, size)` / `removeFile(name)` / `cancelFile(name)`), plus
    `formatSize?: (bytes) => string`.
  - `EditableCell` — new `saveErrorMessage`, `invalidNumberMessage`, `invalidDateMessage`,
    `invalidValueMessage`, joining the existing `requiredMessage`.
  - `DateInput` — new `invalidMessage`, overriding the mask-naming blur message. The exported
    `invalidDateMessage(format)` helper stays as the default.
  - `RangeSlider` — new `startLabel` / `endLabel`, used verbatim for the two thumbs. The old
    `` `${aria-label} (start)` `` composition remains the default.
- **File sizes are `Intl`-formatted.** `FileUpload` rows go through
  `Intl.NumberFormat(locale, { style: 'unit', unit: 'kilobyte', … })` instead of
  `` `${n.toFixed(1)} KB` ``, so both the decimal separator and the unit follow the locale
  (`482,3 кБ` under `uk-UA`, `482,3 ko` under `fr-FR`). ⚠️ **Both the unit and the number shift**
  in the English default: `Intl`'s `kilobyte` is SI (1000 B) while the old formatter divided by
  1024, so the same 482,304-byte file now reads `482.3 kB` where it read `471.0 KB`. Sub-1000
  sizes move from `512 B` to the pluralised `512 bytes` (CLDR's *short* byte form is neither
  short nor pluralised in English, so that tier alone uses `unitDisplay: "long"`). `Intl` has no
  binary unit to switch to — a product that wants `KiB`/`MiB` owns the formatter via
  `formatSize`. A runtime without `style: "unit"` support falls back to the English SI form
  rather than throwing.
- **New atom `LanguageSwitcher` — the one language control the library owns.** Globe + the
  current language's endonym + caret, opening the shared Listbox panel. It is deliberately
  **presentational and data-free**: `locales: string[]`, `value`, `onChange`, and nothing else —
  no query, no context read, no persistence. Where the list comes from and how the choice is
  stored stay the consumer's, which is what lets one component serve every viax surface instead
  of each one forking its own. Two behaviours worth knowing because they are easy to regress:
  it **renders `null`** (not hidden, not disabled) when `locales.length <= 1`, and its labels are
  **endonyms from `Intl.DisplayNames`** resolved on the base subtag — `Deutsch`, not
  `Deutsch (Deutschland)` and not `German` — with the region re-added only where two tags share a
  base language. Pair it with `UxmLocaleProvider`: the switcher picks the tag, the provider pushes
  it into every atom's `Intl` formatting.
- **Composed labels are functions, never prefixes.** Anywhere a name interpolates a value —
  `removeFile(name)`, `uploadProgress(percent, size)`, `BulkActionBar`'s `countLabel(count)` —
  the prop is a callback, because word order and pluralisation around the value are
  language-specific. Follow that shape for any new label prop instead of exposing a prefix string.

### New in 4.37.1

- **Style-contract sweep (no API change).** `Select`'s open chevron and `StatCard`'s
  `down` arrow now rotate via BEM modifiers (`uxm-select-dropdown__trigger-chevron--open`,
  `uxm-stat-card__trend--down .uxm-stat-card__trend-icon`) instead of inline `style`, so a
  consumer stylesheet can restyle them. Two new override hooks:
  `--uxm-toast-close-hover-background-color` (default `color-mix(in srgb, currentColor 10%,
  transparent)` — the old 6 % black wash vanished on dark) and
  `--uxm-date-input-popover-shadow` (default `--shadow-xl`, so the calendar popover now
  follows the theme's shadow scale instead of a fixed light-only literal).

### New in 4.38.0

- **Nine legacy palette names are `@deprecated`** — `--color-cream`, `--color-warm-gray`,
  `--color-ink`, `--color-green`, `--color-mint`, `--color-forest`, `--color-peach`,
  `--color-lavender`, `--color-lime`. They only ever existed inside `tokens.css`'s Tailwind
  `@theme inline` block (invisible to a plain-CSS host) and nothing in the library reads them;
  they are removed in the next major. `references/design-tokens.md` → "Deprecated palette
  names" has the replacement for each. The token catalog (`themeTokens`) is now gated against
  `tokens.css` in CI (`npm run check:tokens`), so a catalog entry and its `:root` / dark
  declaration can no longer drift apart.

### New in 4.39.0

- **`IconButton` gained `variant="filled"`; `ButtonIcon` is deprecated.** `filled` paints exactly
  what `ButtonIcon` painted (40px, `--color-surface-alt` fill, radius 8, accent-subtle hover,
  accent-bold pressed with inverse icon) under its own `--uxm-icon-button-filled-*` vars, and the
  studio themes it as a Variant of Icon Button. `ButtonIcon`, `uxm-button-icon` and
  `--uxm-button-icon-*` keep working until the next major — migrate with
  `<ButtonIcon>` → `<IconButton variant="filled">` (var map in the ButtonIcon README). This is the
  first application of the library's deprecation rule: replacement first, old surface marked
  everywhere, removal only in a major — see `references/component-catalog.md` → "Deprecated".
- **New subpath `@viax.io/uxm/hooks`.** `useDismiss`, `useFocusTrap`, `useFocusOnMount`,
  `useRovingTabIndex`, `useScrollLock`, `usePortal`, `useToastStore` — the behaviour hooks the
  atoms are built on, for hosts composing their own floating layers or keyboard widgets. Pure
  React, typed; see `references/component-catalog.md` → "Hooks".
- `Modal.Header` / `Modal.Body` / `Modal.Footer` take `ref` as a plain prop (React 19) — no API
  change for callers; `ModalSectionProps` is the exported props type of Body/Footer.

### Unreleased

<!-- Notes for changes merged but not yet published. Add a bullet here in the SAME
     MR as the change. At release the pipeline renames this heading to
     "New in X.Y.Z", stamps the version/count markers, and re-opens a fresh
     "### Unreleased" below it (scripts/stamp-skill-version.mjs) — never hand-edit
     the markers, and never append notes under an already-stamped heading. -->

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

1. Confirm the project is a React/Next.js consumer of `@viax.io/uxm`:
   - Check `package.json` for `@viax.io/uxm` in `dependencies`.
   - Check for `react@^19` peer.
   - If absent and the user wants to add it, refer them to the install section of the
     `@viax.io/uxm` README (the package is on public npm — `npm install @viax.io/uxm`,
     no registry configuration required).
2. Confirm CSS imports are in place. Both stylesheets must be imported once at the app entry:
   ```ts
   // app/layout.tsx (Next.js) or main.tsx (Vite/CRA)
   import '@viax.io/uxm/tokens.css';
   import '@viax.io/uxm/ui.css';
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
  - `import { ButtonPrimary } from '@viax.io/uxm/ui'` (preferred) over
    `import { ButtonPrimary } from '@viax.io/uxm'`.
  - `import { themeTokens } from '@viax.io/uxm/tokens'` for token-aware tooling.
  - `import { UxmApp } from '@viax.io/uxm/studio'` + `import '@viax.io/uxm/studio.css'` to embed the
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
**ready-made editor**: mount `UxmApp` from `@viax.io/uxm/studio` (see "Embedding the style editor").
Only drop down to raw `@viax.io/uxm/previews` (the `PreviewProps` preview primitives) when building a
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

## Embedding the style editor (`@viax.io/uxm/studio`)

The full MODO design workbench ships as a mountable component, so a host portal can offer a live
brand/style editor without rebuilding it. Import it from the `studio` subpath + its CSS once:

```tsx
import { UxmApp, createClientPersistence } from '@viax.io/uxm/studio';
import '@viax.io/uxm/studio.css'; // Tailwind v4 bundle — see leakage note below

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
`@viax.io/uxm/studio/generate-css`, run it over the saved `{ overrides, brand }`, and inject the result
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

**CSS-leakage caveat for non-Tailwind hosts.** `@viax.io/uxm/studio.css` is a Tailwind v4 bundle: a
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
   `@viax.io/uxm/previews` and are for editor/host shells only. Tree-shake guarantees they don't
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

## Out of scope

- **Vue MFA components** — use `viax-mfa-component` skill.
- **A *bespoke* editor surface hand-rolled from raw previews** — `@viax.io/uxm/previews` provides the
  preview primitives for that, but prefer the ready-made `UxmApp` from `@viax.io/uxm/studio`
  ("Embedding the style editor"). Only the bespoke-from-previews path is out of scope here.
- **Design token additions** — propose them via PR to the `@viax.io/uxm` repo, do not invent local
  `--color-*` declarations.
