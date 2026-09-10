# @viax.io/uxm

**React 19 UI primitives, design tokens, and theming previews — packaged as a standalone library.**

BEM-classed components, a single design-token layer, and themable previews. Framework-agnostic React 19 — distributed as ESM + CJS with first-class `.d.ts`, no runtime dependencies beyond React, and `sideEffects: ["**/*.css"]` for full tree-shaking.

The package ships **no `"use client"` / `"use server"` directives** by design: consumers are client-side SPAs, and framework-specific pragmas would leak into every one of them. Under a React Server Components setup (e.g. Next.js App Router) the consuming file is responsible for its own `"use client"` boundary.

## What's in this package

- **UI primitives** (`@viax.io/uxm/ui`) — BEM-classed React 19 components.
- **Icon registry** (`@viax.io/uxm/ui`) — `ICONS`, `ICON_OPTIONS`, `getIcon`, `IconDef` for tooling that enumerates the bundled icon set.
- **Design tokens** (`@viax.io/uxm/tokens`) — the canonical `themeTokens` array plus helpers (`findToken`, `resolveHex`, `isTokenValue`) and the `ThemeToken` type.
- **Behaviour hooks** (`@viax.io/uxm/hooks`) — `useDismiss`, `useFocusTrap`, `useFocusOnMount`, `useRovingTabIndex`, `useScrollLock`, `usePortal`, `useToastStore` for hosts composing their own floating layers or keyboard widgets.
- **Themable previews** (`@viax.io/uxm/previews`) — preview components (one per atom, plus composite previews) used by host shells like MODO's brand-settings editor to render live, knob-driven theme exploration.
- **Studio** (`@viax.io/uxm/studio`) — `UxmApp`, the full design workbench MODO serves at `/uxm`, backend-decoupled through the `StudioPersistence` contract; see [Studio](#studio).
- **WCAG / contrast helpers** (`@viax.io/uxm`) — `contrastRatio`, `parseColor`, `rgbToHex`, `suggestAccessibleColor`, `suggestAccessibleToken`, `wcagLevel`, plus `RGB` and `TokenCandidate` types.
- **Default stylesheets** — `@viax.io/uxm/ui.css` (component primitive defaults) and `@viax.io/uxm/tokens.css` (token declarations).

## Install

```bash
npm i @viax.io/uxm
```

Every example in this README imports from `@viax.io/uxm` and its subpaths.

> **Tip: install under an alias.** viax apps install the package as `uxm` so the real name
> appears once, in `package.json`, and imports stay short and rename-proof:
>
> ```bash
> npm i uxm@npm:@viax.io/uxm@latest
> ```
>
> That writes `"uxm": "npm:@viax.io/uxm@^4.40.1"` and lets you write `import { Button } from 'uxm/ui'`
> or `import 'uxm/tokens.css'`. The subpath exports are identical under either name — read `@viax.io/uxm`
> as `uxm` throughout.

Peer deps: `react@^19`, `react-dom@^19`. Node `>=20` for local dev.

Published publicly on npm — no registry configuration, credentials or VPN required.

## Quick start

Import both stylesheets once, at your application entry point:

```ts
// e.g. src/main.tsx
import '@viax.io/uxm/tokens.css';
import '@viax.io/uxm/ui.css';
```

Then use the primitives anywhere:

```tsx
import { ButtonPrimary, Icon } from '@viax.io/uxm/ui';

export function Page() {
  return (
    <ButtonPrimary>
      <Icon glyph="sparkles" /> Hello UXM
    </ButtonPrimary>
  );
}
```

Consume tokens programmatically:

```ts
import { themeTokens, findToken, resolveHex } from '@viax.io/uxm/tokens';

const accent = findToken('--color-accent-bold');
const hex = resolveHex(accent?.cssVar ?? '#000');
```

Both primary entry points are also re-exported from the root:

```ts
import { ButtonPrimary, themeTokens } from '@viax.io/uxm';
```

## Subpath exports

| Entry | Purpose |
|-------|---------|
| `@viax.io/uxm` | Root barrel — re-exports `ui` + `tokens` + WCAG helpers. |
| `@viax.io/uxm/ui` | All UI primitives + icon registry. Tree-shake-friendly per-component imports. |
| `@viax.io/uxm/ui.css` | Compiled component stylesheet — required for visual output. |
| `@viax.io/uxm/tokens` | `themeTokens` array + `findToken` / `resolveHex` / `isTokenValue` + `ThemeToken` type. |
| `@viax.io/uxm/tokens.css` | `--color-*` declarations on `:root`. |
| `@viax.io/uxm/hooks` | The behaviour hooks the atoms are built on — `useDismiss`, `useFocusTrap`, `useFocusOnMount`, `useRovingTabIndex`, `useScrollLock`, `usePortal`, `useToastStore` — for hosts composing their own floating layers or keyboard widgets. Pure React, no atom imports. |
| `@viax.io/uxm/previews` | Preview components for host shells building theme editors. **No preview symbol leaks into `/ui`** — see the tree-shake guarantee below. |
| `@viax.io/uxm/studio` | `UxmApp` + `UxmProvider` / `useUxm`, the component `registry`, the `StudioPersistence` contract and its three adapters (`createHttpPersistence`, `createClientPersistence`, `createReadOnlyPersistence`). |
| `@viax.io/uxm/studio/generate-css` | `generateOverridesCss` + the CSS sanitizers — turn saved studio overrides and a `BrandConfig` into a stylesheet on the server, without pulling in the workbench UI. |
| `@viax.io/uxm/studio.css` | Tailwind utilities for the studio shell + token declarations. Does **not** bundle the atom CSS — a studio host imports `ui.css` alongside it. |

## Component catalog

Every component folder ships a `README.md` documenting props, CSS variables, MODO-configurable design tokens, states/variants, and accessibility. Click through any name for the full reference.

> The catalog below covers every folder in `src/ui/`. If you add a component, add it here too — and keep `src/ui/` the authoritative source if the two ever drift.

### Forms & inputs
[`calendar`](src/ui/calendar/README.md) · [`checkbox`](src/ui/checkbox/README.md) · [`code-editor`](src/ui/code-editor/README.md) (CodeEditor + CodeBlock) · [`color-input`](src/ui/color-input/README.md) (ColorInput + ColorInputPopover) · [`currency-input`](src/ui/currency-input/README.md) · [`date-input`](src/ui/date-input/README.md) · [`editable-cell`](src/ui/editable-cell/README.md) · [`field-error`](src/ui/field-error/README.md) · [`file-upload`](src/ui/file-upload/README.md) · [`form-field`](src/ui/form-field/README.md) · [`input`](src/ui/input/README.md) (TextInput + Select + Textarea) · [`input-with-icon`](src/ui/input-with-icon/README.md) · [`number-input`](src/ui/number-input/README.md) · [`number-stepper`](src/ui/number-stepper/README.md) · [`password-input`](src/ui/password-input/README.md) · [`phone-input`](src/ui/phone-input/README.md) · [`pill-select`](src/ui/pill-select/README.md) · [`radio-group`](src/ui/radio-group/README.md) · [`range-slider`](src/ui/range-slider/README.md) · [`search-dropdown`](src/ui/search-dropdown/README.md) · [`slider`](src/ui/slider/README.md) · [`time-input`](src/ui/time-input/README.md) · [`toggle-switch`](src/ui/toggle-switch/README.md)

### Buttons & actions
[`back-link`](src/ui/back-link/README.md) · [`bulk-action-bar`](src/ui/bulk-action-bar/README.md) · [`button`](src/ui/button/README.md) (Primary/Secondary/Tertiary/Ghost) · [`button-group`](src/ui/button-group/README.md) · [`button-icon`](src/ui/button-icon/README.md) (deprecated → `icon-button` `variant="filled"`) · [`button-with-icon`](src/ui/button-with-icon/README.md) · [`icon-button`](src/ui/icon-button/README.md) · [`inline-action`](src/ui/inline-action/README.md) · [`link`](src/ui/link/README.md)

### Navigation
[`app-sidebar`](src/ui/app-sidebar/README.md) · [`app-top-bar`](src/ui/app-top-bar/README.md) · [`breadcrumb`](src/ui/breadcrumb/README.md) · [`filter-tabs`](src/ui/filter-tabs/README.md) · [`menu`](src/ui/menu/README.md) · [`sidebar-nav-item`](src/ui/sidebar-nav-item/README.md) · [`sidebar-nav-trigger`](src/ui/sidebar-nav-trigger/README.md) · [`tabs`](src/ui/tabs/README.md) · [`tabs-underline`](src/ui/tabs-underline/README.md) · [`view-switcher`](src/ui/view-switcher/README.md)

### Overlays & floating layers
[`dialog`](src/ui/dialog/README.md) · [`hover-tooltip`](src/ui/hover-tooltip/README.md) · [`listbox`](src/ui/listbox/README.md) (Listbox + MultiListbox) · [`modal`](src/ui/modal/README.md) · [`option-list`](src/ui/option-list/README.md) · [`popover`](src/ui/popover/README.md) · [`toast`](src/ui/toast/README.md) (Toast + Toaster + the `toast.*` API)

### Feedback & status
[`badge`](src/ui/badge/README.md) · [`banner`](src/ui/banner/README.md) · [`chip`](src/ui/chip/README.md) · [`empty-state`](src/ui/empty-state/README.md) · [`error-page`](src/ui/error-page/README.md) · [`loader`](src/ui/loader/README.md) · [`progress-bar`](src/ui/progress-bar/README.md) · [`tag`](src/ui/tag/README.md) · [`tooltip`](src/ui/tooltip/README.md) (Tooltip + ContentTooltip)

### Layout & structure
[`card`](src/ui/card/README.md) · [`cluster`](src/ui/cluster/README.md) · [`detail-section`](src/ui/detail-section/README.md) · [`divider`](src/ui/divider/README.md) · [`inline-filter`](src/ui/inline-filter/README.md) · [`page-header`](src/ui/page-header/README.md) · [`page-shell`](src/ui/page-shell/README.md) · [`responsive-grid`](src/ui/responsive-grid/README.md) · [`section-header`](src/ui/section-header/README.md) · [`side-flexpane`](src/ui/side-flexpane/README.md) · [`stack`](src/ui/stack/README.md)

### Data display
[`avatar`](src/ui/avatar/README.md) · [`data-table`](src/ui/data-table/README.md) · [`disclosure`](src/ui/disclosure/README.md) · [`icon`](src/ui/icon/README.md) · [`icon-tile`](src/ui/icon-tile/README.md) · [`list`](src/ui/list/README.md) (List + ListItem) · [`meta-row`](src/ui/meta-row/README.md) · [`property-field`](src/ui/property-field/README.md) (PropertyField + PropertyGrid) · [`stat-card`](src/ui/stat-card/README.md) · [`thumbnail`](src/ui/thumbnail/README.md) · [`timeline-entry`](src/ui/timeline-entry/README.md) · [`type-overview-card`](src/ui/type-overview-card/README.md)

### Configuration editor
[`component-row`](src/ui/component-row/README.md) · [`config-component-row`](src/ui/config-component-row/README.md) · [`config-segment-item`](src/ui/config-segment-item/README.md) · [`explorer-list-item`](src/ui/explorer-list-item/README.md) · [`explorer-section`](src/ui/explorer-section/README.md) · [`segment-card`](src/ui/segment-card/README.md) · [`segment-row`](src/ui/segment-row/README.md)

### Localisation
[`language-switcher`](src/ui/language-switcher/README.md) · [`locale`](src/ui/locale/README.md) (UxmLocaleProvider + `useUxmLocale`)

### Lifecycle diagrams
[`lifecycle-connector`](src/ui/lifecycle-connector/README.md) · [`lifecycle-drop-slot`](src/ui/lifecycle-drop-slot/README.md) · [`lifecycle-edge-label`](src/ui/lifecycle-edge-label/README.md) · [`lifecycle-group-box`](src/ui/lifecycle-group-box/README.md) · [`lifecycle-minimap`](src/ui/lifecycle-minimap/README.md) · [`lifecycle-node-card`](src/ui/lifecycle-node-card/README.md) · [`lifecycle-terminal`](src/ui/lifecycle-terminal/README.md) · [`lifecycle-zoom-control`](src/ui/lifecycle-zoom-control/README.md)

## Design tokens & MODO theming

The library is built on a **two-layer customisation model**:

1. **Component-scoped CSS variables** (`--uxm-{component}-*`) — per-instance fine-tuning set inline or via a higher CSS scope. Each component README lists its full surface.
2. **Global design tokens** (`--color-*`) — declared on `:root` by `tokens.css`, consumed as fallbacks inside every component-scoped variable. This is the **MODO-configurable layer**: brand-settings UIs (like MODO's `BrandSettingsPreview`) edit these tokens centrally and instantly re-tint every consumer.

The canonical token catalogue lives in `src/tokens/index.ts` as the `themeTokens` array. Each entry carries:

- `name` — display label shown in MODO's brand-settings editor (e.g. `"Accent Bold"`)
- `cssVar` — the `--color-*` identifier consumed by components
- `hex` / `darkHex` — light/dark defaults
- `group` — one of `surfaces` · `text` · `borders` · `accent` · `highlights` · `categories` · `semantic`
- `identity` (optional) — promotes the token into the brand editor's Identity section as a top-level knob; reserved for tokens that fan out (the accent base drives the whole ramp)

`tokens.css` and `themeTokens` must stay in lockstep — `npm run check:drift` fails when a `--color-*` variable exists on one side only.

```ts
import { themeTokens, findToken } from '@viax.io/uxm/tokens';

themeTokens.forEach((t) => {
  console.log(`${t.group}/${t.name} → ${t.cssVar} = ${t.hex} (dark: ${t.darkHex})`);
});

const accent = findToken('--color-accent-bold');
//    ^ { name: 'Accent Bold', cssVar: '--color-accent-bold', hex: '#1E7150', … }
```

Each component README's **Design tokens (MODO-configurable)** section names every token the component reads, paired with its `Group / Name` from `themeTokens` — making it straightforward to look up "if I edit X in MODO, what re-tints?"

## Localisation

**The library formats; you translate.** `@viax.io/uxm` ships no i18n engine — no message catalogue, no translation runtime — because a primitives library that owns translation forces its choice of engine onto every consuming app. Localisation splits in two:

**Copy is yours, and arrives as props.** Every user-visible string a component can render or announce has a prop with an English default — `clearLabel`, `closeLabel`, `emptyState`, `requiredMessage`, `placeholder`, or a grouped `labels={{ … }}` object where a component owns several. Translate in your app and pass the result down. A string you cannot reach from props is a bug — [open an issue](#contributing).

**Formatting is ours, and follows one locale.** Month names, decimal separators, and byte units come from `Intl` and can't be expressed as a prop string, so the components that need them read a locale instead. Mount [`UxmLocaleProvider`](src/ui/locale/README.md) once at the app root:

```tsx
import { UxmLocaleProvider } from '@viax.io/uxm';

<UxmLocaleProvider locale="uk-UA">
  <App />
</UxmLocaleProvider>;
```

`Calendar`, `DateInput`, `EditableCell`, `CurrencyInput`, and `FileUpload` pick it up automatically. Each still takes a `locale` prop that wins locally, so one always-USD amount can opt out. Without a provider everything falls back to `en-US`, exactly as before.

To let the user *change* the language, use [`LanguageSwitcher`](src/ui/language-switcher/README.md) — the one control the library owns. It takes the locale list rather than fetching it, and disappears entirely (no wrapper, no disabled control) when only one locale is configured:

```tsx
<LanguageSwitcher locales={supportedLocales} value={locale} onChange={setLocale} label={t('language')} />
```

Labels that interpolate a value take a **function**, not a prefix — `removeFile(name)`, `uploadProgress(percent, size)`, `countLabel(count)` — because word order and pluralisation around the value are language-specific:

```tsx
<FileUpload
  files={files}
  titleText={t('upload.title')}
  labels={{
    uploading: t('upload.busy'),
    removeFile: (name) => t('upload.remove', { name }),
  }}
/>
```

## Previews

Previews live under `@viax.io/uxm/previews` and are designed for **host shells building theme editors**. Each preview:

- Accepts a uniform `PreviewProps = { componentId, styles, variants, shell? }` signature.
- Reads `styles` (slider/colorpicker knob values) and projects them as inline CSS variables on the component instance, exercising the production CSS path so what designers see is what consumers ship.
- Optionally reads `shell` (host-provided context: brand, theme, `uploadAsset`) to integrate with the editor's broader state — e.g. `LoginPagePreview` and `BrandSettingsPreview` use `shell.uploadAsset` for logo uploads.

```tsx
import { ButtonPreview, type PreviewShellContext } from '@viax.io/uxm/previews';

<ButtonPreview
  componentId="button-primary"
  styles={{ backgroundColor: '#1E7150', borderRadius: 8, paddingX: 20, paddingY: 10 }}
  variants={{ state: 'hover' }}
  shell={shell satisfies PreviewShellContext}
/>;
```

**Tree-shake guarantee**: no preview symbols leak into `@viax.io/uxm/ui`, so consumers that only import primitives never pay for preview code. **ESLint enforces it** (`eslint.config.mjs`): `no-restricted-imports` rejects any `*-preview` re-export from `src/ui/index.ts` or a `src/ui/*/index.ts`, and the `import/no-restricted-paths` zones pin the layer direction — `ui` may not import `studio` or the previews barrel, `tokens` imports nothing, and `lib` / `hooks` / `helpers` may not import components. After a build, `grep "Preview" dist/ui/index.js` still returns nothing.

## Studio

`@viax.io/uxm/studio` ships `UxmApp`, the design workbench MODO serves at `/uxm`: sidebar, canvas, properties panel and WCAG panel over the same previews. It is decoupled from any backend through the `StudioPersistence` contract — pick an adapter per host:

- `createHttpPersistence()` — reads and writes against a Hono API.
- `createClientPersistence()` — live preview plus client-side asset uploads (what the `portal/` dev shell uses).
- `createReadOnlyPersistence()` — a static, view-only portal.

```tsx
import '@viax.io/uxm/tokens.css';
import '@viax.io/uxm/ui.css';
import '@viax.io/uxm/studio.css';
import { UxmApp, createHttpPersistence } from '@viax.io/uxm/studio';

<UxmApp persistence={createHttpPersistence('/api/uxm')} />;
```

`@viax.io/uxm/studio/generate-css` exposes `generateOverridesCss` and the CSS sanitizers on their own, so a server can render the saved overrides into a stylesheet without loading the workbench. The studio is the only layer styled with Tailwind; `studio.css` bundles those utilities and the token declarations but not the atom CSS.

## Architecture

```
┌─────────────────────────────────────────────────┐
│  @viax.io/uxm/studio (+ studio.css)             │  ← the design workbench (MODO /uxm)
│  UxmApp, registry, StudioPersistence adapters   │
└────────────────┬────────────────────────────────┘
                 │ renders
                 ▼
┌─────────────────────────────────────────────────┐
│  @viax.io/uxm/previews                          │  ← host editors (MODO brand-settings)
│  themable, shell-aware preview components       │
└────────────────┬────────────────────────────────┘
                 │ consumes
                 ▼
┌─────────────────────────────────────────────────┐
│  @viax.io/uxm/ui (+ ui.css)                     │  ← application code
│  BEM-classed React components                   │
│  + Icon registry (ICONS, getIcon, …)            │
│  built on @viax.io/uxm/hooks                    │
└────────────────┬────────────────────────────────┘
                 │ reads fallbacks
                 ▼
┌─────────────────────────────────────────────────┐
│  @viax.io/uxm/tokens (+ tokens.css)             │  ← MODO brand-settings edits this
│  themeTokens array + --color-* declarations     │
└─────────────────────────────────────────────────┘
```

The dependency direction is `studio / previews → ui → tokens`, enforced by the ESLint layer zones. Every layer is independently importable; every layer has its own type declarations and own CSS bundle.

## Build & develop

```bash
npm install
npm run dev:modo     # Vite dev server for the studio portal — fastest loop, no build needed
npm run build:modo   # Vite production build of the portal
npm run build        # full dist/ (see the pipeline below)
npm run typecheck    # tsc --noEmit for src + portal
npm run lint         # eslint .
npm run lint:fix     # eslint . --fix
npm run check:drift  # state-var drift, type-scale and tokens.css ↔ themeTokens parity gates
npm test             # Vitest smoke suite (tests/), jsdom — `npm run test:watch` while iterating
npm run test:coverage # coverage summary for orientation only — no thresholds, not a gate
npm run dev          # tsup --watch — only for local linked dev against a consumer
```

**`npm run dev:modo` is the fastest way to see a UI change.** The portal pulls `src/ui/**/*.scss` through `import.meta.glob`, so components render with real CSS over HMR without building `dist/` first.

**Tests are a small Vitest smoke suite, not coverage.** `npm test` (`tests/*.test.tsx`, jsdom + Testing Library + axe-core) pins the contracts nothing else can see: focus trap / Escape / outside-click on the floating layers, ARIA wiring on the pickers, the CSS sanitizers and the overrides generator, and an axe pass over a form and a dialog. It also pins the public surface: the export names of every subpath, every `--uxm-*` variable the stylesheets read, and that `dist/` loads as ESM and CJS (snapshots in `tests/__snapshots__/`; a minus line in the diff is a removed export or knob, i.e. a MAJOR). See `tests/README.md`. Add a test when you touch one of those contracts or fix a behavioural bug; do not chase coverage on presentational atoms. For a visual change "tests pass" proves nothing — the verification is `typecheck`, `lint`, `build` and the portal.

CI (`.github/workflows/ci.yml`) runs `lint`, `typecheck`, `check:drift`, `build` and `test:ci` on every pull request, plus an `npm audit` job that fails at critical.

`npm run build` chains five steps, and the order is deliberate:

1. **`tsup`** — ESM + CJS JS with `bundle: false` and **`dts: false`** (one output per source file). Its `onSuccess` hook compiles `src/ui/**/*.scss` → sibling `dist/ui/**/*.css`, then copies `styles.css` and `tokens/index.css`.
2. **`build:studio-css`** — Tailwind CLI compiles `src/studio/studio.css`.
3. **`tsc -p tsconfig.build.json`** — a **separate** declaration pass. DTS is off in tsup because its single-worker DTS pass runs out of memory with 100+ unbundled entries.
4. **`tsc-alias`** — rewrites `@/*` path aliases to relative paths across `dist` (JS + CJS + `.d.ts`).
5. **`scripts/fix-cjs-requires.mjs`** — post-processes CJS `require()` calls.

Skipping the separate `tsc` pass or the alias rewrite yields a `dist` with either no types or unresolved `@/` imports.

Output layout under `dist/`:

```
dist/
├── index.{js,cjs,d.ts}
├── ui/
│   ├── index.{js,cjs,d.ts}
│   ├── styles.css
│   └── …per-component files…
├── tokens/
│   ├── index.{js,cjs,d.ts}
│   └── index.css
├── hooks/
│   └── index.{js,cjs,d.ts}
├── previews/
│   ├── index.{js,cjs,d.ts}
│   └── …per-preview files…
└── studio/
    ├── index.{js,cjs,d.ts}
    ├── studio.css
    └── persistence/generate-css.{js,cjs,d.ts}
```

## Local linked development (e.g. modo)

From the consumer project (`apps/modo`):

```bash
npm install file:../../uxm          # adjust path
```

Run `npm run dev` here to keep `dist/` fresh; the consumer's dev server picks up changes after each recompile.

To iterate on the components themselves rather than on the integration, prefer `npm run dev:modo` — it needs no build step at all.

## Releases

**Releases are fully automated — never publish by hand.** Merging to `master` runs semantic-release in CI, which derives the version bump from the Conventional Commit types, writes `CHANGELOG.md`, stamps the AI-skill version markers, publishes to npm, and creates the GitHub release.

This makes commit types carry semver meaning: `fix` → PATCH, `feat` → MINOR, a `BREAKING CHANGE:` footer → MAJOR. Running `npm version` or `npm publish` locally would desynchronise the tags from what CI has already released.

## Contributing

- **Add a component**: create `src/ui/{name}/` with `{name}.tsx`, `{name}.scss`, `index.ts`. Re-export from **both** the folder `index.ts` and `src/ui/index.ts`. Add the compiled stylesheet to `src/ui/styles.css` as `@import "./{name}/{name}.css";` in cascade order — the aggregator is hand-written, and a component whose `@import` is missing ships with no CSS. Add a `README.md` mirroring [`button/README.md`](src/ui/button/README.md) (simple) or [`data-table/README.md`](src/ui/data-table/README.md) (complex).
- **Update the AI skill in the same change**: `skills/viax-uxm/` needs a catalog row, a cheatsheet row, and a bullet under `### Unreleased` in `SKILL.md`. Leave the version and component-count markers alone — CI stamps those at release via `scripts/stamp-skill-version.mjs`.
- **Add a preview**: create `{name}-preview.tsx` next to the component — previews live beside their component, not in `src/previews/`. Use `PreviewProps` and project knob values as inline CSS vars so production CSS rules paint them. Never re-export a preview from a `src/ui/` barrel (see the tree-shake guarantee above).
- **Add a token**: add an entry to `themeTokens` in `src/tokens/index.ts` and declare the `--color-*` variable in `src/tokens/index.css` — `npm run check:drift` fails if only one side changes. Reference it from component SCSS via `var(--uxm-foo-bar, var(--color-new-token))` — never hardcode a colour, spacing, or radius.
- Commits follow conventional-commit format (`commitizen` + `commitlint` enforced via `husky`); `npm run commit` walks you through it. Commit types drive the released version — see [Releases](#releases).
- Run `npm run lint && npm run typecheck && npm run check:drift && npm test && npm run build` before opening a pull request — the same gates CI runs.

## License

[MIT](LICENSE.md) © viax.io
