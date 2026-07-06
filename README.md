# @viax/uxm

**React 19 UI primitives, design tokens, and theming previews — packaged as a standalone library.**

76 BEM-classed components, a single design-token layer, and 88 themable previews. Built for React 19 + Next.js App Router, distributed as ESM + CJS with first-class `.d.ts`, no runtime dependencies beyond React, and `sideEffects: ["**/*.css"]` for full tree-shaking.

## What's in this package

- **UI primitives** (`@viax/uxm/ui`) — 76 BEM-classed React components for Next.js App Router (React 19).
- **Icon registry** (`@viax/uxm/ui`) — `ICONS`, `ICON_OPTIONS`, `getIcon`, `IconDef` for tooling that enumerates the bundled icon set.
- **Design tokens** (`@viax/uxm/tokens`) — the canonical `themeTokens` array plus helpers (`findToken`, `resolveHex`, `isTokenValue`) and the `ThemeToken` type.
- **Themable previews** (`@viax/uxm/previews`) — 88 preview components (one per atom + 10 composite previews) used by host shells like MODO's brand-settings editor to render live, knob-driven theme exploration.
- **WCAG / contrast helpers** (`@viax/uxm`) — `contrastRatio`, `parseColor`, `rgbToHex`, `suggestAccessibleColor`, `suggestAccessibleToken`, `wcagLevel`, plus `RGB` and `TokenCandidate` types.
- **Default stylesheets** — `@viax/uxm/ui.css` (component primitive defaults) and `@viax/uxm/tokens.css` (token declarations).

## Install

```bash
npm install @viax/uxm
```

Peer deps: `react@^19`, `react-dom@^19`. Node `>=20` for local dev.

The package is published to the Viax GitLab Packages npm registry; see [Configure the GitLab registry](#configure-the-gitlab-registry) below.

## Quick start (Next.js App Router)

```ts
// app/layout.tsx
import '@viax/uxm/tokens.css';
import '@viax/uxm/ui.css';
```

```tsx
// app/page.tsx
import { ButtonPrimary, Icon } from '@viax/uxm/ui';

export default function Page() {
  return (
    <ButtonPrimary>
      <Icon glyph="sparkles" /> Hello UXM
    </ButtonPrimary>
  );
}
```

Consume tokens programmatically:

```ts
import { themeTokens, findToken, resolveHex } from '@viax/uxm/tokens';

const accent = findToken('--color-accent-bold');
const hex = resolveHex(accent?.cssVar ?? '#000');
```

Both primary entry points are also re-exported from the root:

```ts
import { ButtonPrimary, themeTokens } from '@viax/uxm';
```

## Subpath exports

| Entry | Purpose |
|-------|---------|
| `@viax/uxm` | Root barrel — re-exports `ui` + `tokens` + WCAG helpers. |
| `@viax/uxm/ui` | All UI primitives + icon registry. Tree-shake-friendly per-component imports. |
| `@viax/uxm/ui.css` | Compiled component stylesheet — required for visual output. |
| `@viax/uxm/tokens` | `themeTokens` array + `findToken` / `resolveHex` / `isTokenValue` + `ThemeToken` type. |
| `@viax/uxm/tokens.css` | `--color-*` declarations on `:root`. |
| `@viax/uxm/previews` | 88 preview components for host shells building theme editors. **No preview symbol leaks into `/ui`** — tree-shake guarantee verified by build. |

## Component catalog

Each component folder ships a `README.md` documenting its props, CSS variables, MODO-configurable design tokens, states/variants, and accessibility. Click through any name for the full reference.

### Forms & inputs (19)
[`calendar`](src/ui/calendar/README.md) · [`checkbox`](src/ui/checkbox/README.md) · [`currency-input`](src/ui/currency-input/README.md) · [`date-input`](src/ui/date-input/README.md) · [`file-upload`](src/ui/file-upload/README.md) · [`form-field`](src/ui/form-field/README.md) · [`input`](src/ui/input/README.md) (TextInput + Select + Textarea) · [`input-with-icon`](src/ui/input-with-icon/README.md) · [`number-field`](src/ui/number-field/README.md) · [`number-input`](src/ui/number-input/README.md) · [`password-input`](src/ui/password-input/README.md) · [`phone-input`](src/ui/phone-input/README.md) · [`pill-select`](src/ui/pill-select/README.md) · [`radio-group`](src/ui/radio-group/README.md) · [`range-slider`](src/ui/range-slider/README.md) · [`search-dropdown`](src/ui/search-dropdown/README.md) · [`slider`](src/ui/slider/README.md) · [`time-input`](src/ui/time-input/README.md) · [`toggle-switch`](src/ui/toggle-switch/README.md)

### Buttons & actions (8)
[`back-link`](src/ui/back-link/README.md) · [`button`](src/ui/button/README.md) (Primary/Secondary/Tertiary/Ghost) · [`button-group`](src/ui/button-group/README.md) · [`button-icon`](src/ui/button-icon/README.md) · [`button-with-icon`](src/ui/button-with-icon/README.md) · [`icon-button`](src/ui/icon-button/README.md) · [`inline-action`](src/ui/inline-action/README.md) · [`link`](src/ui/link/README.md)

### Navigation (8)
[`app-sidebar`](src/ui/app-sidebar/README.md) · [`app-top-bar`](src/ui/app-top-bar/README.md) · [`breadcrumb`](src/ui/breadcrumb/README.md) · [`filter-tabs`](src/ui/filter-tabs/README.md) · [`sidebar-nav-item`](src/ui/sidebar-nav-item/README.md) · [`tabs`](src/ui/tabs/README.md) · [`tabs-underline`](src/ui/tabs-underline/README.md) · [`view-switcher`](src/ui/view-switcher/README.md)

### Feedback & status (8)
[`alert`](src/ui/alert/README.md) · [`badge`](src/ui/badge/README.md) · [`chip`](src/ui/chip/README.md) · [`empty-state`](src/ui/empty-state/README.md) · [`error-page`](src/ui/error-page/README.md) · [`loader`](src/ui/loader/README.md) · [`tag`](src/ui/tag/README.md) · [`tooltip`](src/ui/tooltip/README.md) (Tooltip + ContentTooltip)

### Layout & structure (11)
[`card`](src/ui/card/README.md) · [`cluster`](src/ui/cluster/README.md) · [`detail-section`](src/ui/detail-section/README.md) · [`divider`](src/ui/divider/README.md) · [`inline-filter`](src/ui/inline-filter/README.md) · [`page-header`](src/ui/page-header/README.md) · [`page-shell`](src/ui/page-shell/README.md) · [`responsive-grid`](src/ui/responsive-grid/README.md) · [`section-header`](src/ui/section-header/README.md) · [`side-flexpane`](src/ui/side-flexpane/README.md) · [`stack`](src/ui/stack/README.md)

### Data display (12)
[`avatar`](src/ui/avatar/README.md) · [`data-table`](src/ui/data-table/README.md) · [`disclosure`](src/ui/disclosure/README.md) · [`icon`](src/ui/icon/README.md) · [`icon-tile`](src/ui/icon-tile/README.md) · [`list`](src/ui/list/README.md) (List + ListItem) · [`meta-row`](src/ui/meta-row/README.md) · [`property-field`](src/ui/property-field/README.md) (PropertyField + PropertyGrid) · [`stat-card`](src/ui/stat-card/README.md) · [`thumbnail`](src/ui/thumbnail/README.md) · [`timeline-entry`](src/ui/timeline-entry/README.md) · [`type-overview-card`](src/ui/type-overview-card/README.md)

### Configuration editor (4)
[`config-component-row`](src/ui/config-component-row/README.md) · [`config-segment-item`](src/ui/config-segment-item/README.md) · [`explorer-list-item`](src/ui/explorer-list-item/README.md) · [`explorer-section`](src/ui/explorer-section/README.md)

### Lifecycle diagrams (6)
[`lifecycle-connector`](src/ui/lifecycle-connector/README.md) · [`lifecycle-edge-label`](src/ui/lifecycle-edge-label/README.md) · [`lifecycle-minimap`](src/ui/lifecycle-minimap/README.md) · [`lifecycle-node-card`](src/ui/lifecycle-node-card/README.md) · [`lifecycle-terminal`](src/ui/lifecycle-terminal/README.md) · [`lifecycle-zoom-control`](src/ui/lifecycle-zoom-control/README.md)

## Design tokens & MODO theming

The library is built on a **two-layer customisation model**:

1. **Component-scoped CSS variables** (`--uxm-{component}-*`) — per-instance fine-tuning set inline or via a higher CSS scope. Each component README lists its full surface.
2. **Global design tokens** (`--color-*`) — declared on `:root` by `tokens.css`, consumed as fallbacks inside every component-scoped variable. This is the **MODO-configurable layer**: brand-settings UIs (like MODO's `BrandSettingsPreview`) edit these tokens centrally and instantly re-tint every consumer.

The canonical token catalogue lives in `src/tokens/index.ts` as the `themeTokens` array. Each entry carries:

- `name` — display label shown in MODO's brand-settings editor (e.g. `"Accent Bold"`)
- `cssVar` — the `--color-*` identifier consumed by components
- `hex` / `darkHex` — light/dark defaults
- `group` — one of `surfaces` · `text` · `borders` · `accent` · `highlights` · `categories` · `semantic`

```ts
import { themeTokens, findToken } from '@viax/uxm/tokens';

themeTokens.forEach((t) => {
  console.log(`${t.group}/${t.name} → ${t.cssVar} = ${t.hex} (dark: ${t.darkHex})`);
});

const accent = findToken('--color-accent-bold');
//    ^ { name: 'Accent Bold', cssVar: '--color-accent-bold', hex: '#1E7150', … }
```

Each component README's **Design tokens (MODO-configurable)** section names every token the component reads, paired with its `Group / Name` from `themeTokens` — making it straightforward to look up "if I edit X in MODO, what re-tints?"

## Previews

Previews live under `@viax/uxm/previews` and are designed for **host shells building theme editors**. Each preview:

- Accepts a uniform `PreviewProps = { componentId, styles, variants, shell? }` signature.
- Reads `styles` (slider/colorpicker knob values) and projects them as inline CSS variables on the component instance, exercising the production CSS path so what designers see is what consumers ship.
- Optionally reads `shell` (host-provided context: brand, theme, `uploadAsset`) to integrate with the editor's broader state — e.g. `LoginPagePreview` and `BrandSettingsPreview` use `shell.uploadAsset` for logo uploads.

```tsx
import { ButtonPreview, type PreviewShellContext } from '@viax/uxm/previews';

<ButtonPreview
  componentId="button-primary"
  styles={{ backgroundColor: '#1E7150', borderRadius: 8, paddingX: 20, paddingY: 10 }}
  variants={{ state: 'hover' }}
  shell={shell satisfies PreviewShellContext}
/>;
```

**Tree-shake guarantee**: no preview symbols leak into `@viax/uxm/ui`. Consumers that only import primitives never pay for preview code. Verified at build time (`grep "Preview" dist/ui/index.js` → 0 results).

## Architecture

```
┌─────────────────────────────────────────────────┐
│  @viax/uxm/previews                             │  ← host editors (MODO brand-settings)
│  88 themable, shell-aware preview components    │
└────────────────┬────────────────────────────────┘
                 │ consumes
                 ▼
┌─────────────────────────────────────────────────┐
│  @viax/uxm/ui                                   │  ← application code
│  76 BEM-classed React components                │
│  + Icon registry (ICONS, getIcon, …)            │
└────────────────┬────────────────────────────────┘
                 │ reads fallbacks
                 ▼
┌─────────────────────────────────────────────────┐
│  @viax/uxm/tokens (+ tokens.css)                │  ← MODO brand-settings edits this
│  themeTokens array + --color-* declarations     │
└─────────────────────────────────────────────────┘
```

Every layer is independently importable; every layer has its own type declarations and own CSS bundle.

## Configure the GitLab registry

This package is private. Configure your local npm to authenticate against the Viax GitLab Packages registry. Copy `.npmrc.example` to your project root or `~/.npmrc` and replace `<PERSONAL_ACCESS_TOKEN>` with a GitLab personal access token (`read_api`, plus `write_api` if you intend to publish):

```ini
@viax:registry=https://gitlab.viax.tech/api/v4/projects/services-viax%2Fuxm/packages/npm/
//gitlab.viax.tech/api/v4/projects/services-viax%2Fuxm/packages/npm/:_authToken=<PERSONAL_ACCESS_TOKEN>
```

## Build & develop

```bash
npm install
npm run build      # tsup → dist/ (ESM + CJS + .d.ts + CSS)
npm run typecheck  # tsc --noEmit
npm run lint       # eslint .
npm run lint:fix   # eslint . --fix
npm run dev        # tsup --watch (useful for local linked dev)
```

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
└── previews/
    ├── index.{js,cjs,d.ts}
    └── …per-preview files…
```

## Local linked development (e.g. modo)

From the consumer project (`apps/modo`):

```bash
npm install file:../../uxm          # adjust path
```

Run `npm run dev` here to keep `dist/` fresh; Next.js dev server will pick up changes after recompiling.

## Publish

```bash
npm version <patch|minor|major>
npm publish
```

`prepublishOnly` runs `npm run build` automatically. Ensure your `.npmrc` contains a token with `write_api` scope.

## Contributing

- **Add a component**: create `src/ui/{name}/` with `{name}.tsx`, `{name}.scss`, `index.ts`. Export from `src/ui/index.ts`. Add a `README.md` mirroring the format of [`button/README.md`](src/ui/button/README.md) (simple) or [`data-table/README.md`](src/ui/data-table/README.md) (complex).
- **Add a preview**: create `{name}-preview.tsx` next to the component. Use `PreviewProps` and project knob values as inline CSS vars so production CSS rules paint them.
- **Add a token**: add an entry to `themeTokens` in `src/tokens/index.ts` and declare the `--color-*` variable in `src/tokens/index.css`. Reference the new token from component SCSS via `var(--uxm-foo-bar, var(--color-new-token))`.
- Commits follow conventional-commit format (`commitizen` + `commitlint` enforced via `husky`).
- Run `npm run lint && npm run build` before opening a PR.

## License

UNLICENSED — internal Viax use.
