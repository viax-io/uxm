# InputWithIcon

A text input with a leading icon slot and (optionally) a trailing clear button. The standard "search field" shape, but generalised — any icon can lead, and clearability is opt-in for non-search inputs.

`InputWithIcon` composes three elements: a positioned icon span (`aria-hidden`), a native `<input>`, and an optional clear `<button>`. Left padding is computed from `iconOffset + iconSize + 8px` so the input text can never overlap the leading glyph. The browser's native search-clear button is suppressed via `::-webkit-search-cancel-button` so `type="search"` doesn't render two clear affordances.

## Usage

```tsx
import { InputWithIcon, Icon } from '@viax/uxm';

function SearchField() {
  const [query, setQuery] = useState('');

  return (
    <InputWithIcon
      type="search"
      icon={<Icon glyph="search" />}
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onClear={() => setQuery('')}
      placeholder="Search…"
    />
  );
}
```

## Props

### `InputWithIconProps`

Extends `InputHTMLAttributes<HTMLInputElement>` — any standard input attribute (name, value, onChange, disabled, data-*, aria-*) is forwarded to the inner `<input>`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `ReactNode` | – | **Required.** Leading icon — typically `<Icon glyph="…" />` or a raw `<svg>`. |
| `type` | `string` | `'text'` | Overridden default. For `'search'`, `clearable` defaults to `true` and the native webkit clear button is suppressed. |
| `clearable` | `boolean` | `type === 'search'` | Reserve trailing space for a clear button and render it when the input has a non-empty `value` and an `onClear` handler. |
| `onClear` | `() => void` | – | Required for the clear button to render. Typically `() => setValue('')`. Only fires when the input has a string `value` — uncontrolled inputs can't be reset from the outside. |
| `value` | `string \| number \| readonly string[]` | – | Forwarded to the `<input>`. The clear button is only rendered when `typeof value === 'string'` and `value.length > 0`. |
| `className` | `string` | – | Applied to the wrapper `<div>` (not the input). |
| _(any native input attribute)_ | – | – | Spread onto the inner `<input>` (except `value`, which is handled explicitly). |

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-input-with-icon-bg` | `--color-surface` | – | Input background. |
| `--uxm-input-with-icon-border-color` | `--color-border` | – | Input border. |
| `--uxm-input-with-icon-radius` | – | `8px` | Input corner radius. |
| `--uxm-input-with-icon-color` | `--color-text` | – | Input text colour. |
| `--uxm-input-with-icon-font-size` | – | `14px` | Input font size. |
| `--uxm-input-with-icon-padding-y` | – | `8px` | Input vertical padding. |
| `--uxm-input-with-icon-padding-x` | – | `12px` | Input horizontal padding (also drives leading icon room). |
| `--uxm-input-with-icon-icon-color` | `--color-text-muted` | – | Leading icon colour. |
| `--uxm-input-with-icon-icon-size` | – | `16px` | Leading icon SVG sizing (used in the left-padding computation). |
| `--uxm-input-with-icon-icon-offset` | – | `12px` | Leading and trailing icon offsets from the edge. |

> Leading padding is computed as `iconOffset + iconSize + 8px`. When `clearable`, trailing padding is `iconOffset + 18px + 8px` so the input text never slides under the clear button.

Focus border (`var(--color-accent)`) and the clear button styling (`color-mix` derived from `--color-text`) are hard-coded — not exposed as `--uxm-*` overrides.

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-surface` | Surfaces / Surface | Input background. |
| `--color-border` | Borders / Border | Input border. |
| `--color-text` | Text / Text | Input text colour and clear-button colour-mix base. |
| `--color-text-muted` | Text / Text Muted | Leading icon and clear button resting colour. |
| `--color-accent` | Accent / Accent | Focused border colour. |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Default | – | Leading icon, surface background, border, 8px radius. |
| Focus | `:focus` on `<input>` | Border colour transitions (0.15s) to `--color-accent`. |
| Clearable (reserved) | `type="search"` or `clearable={true}` | Extra trailing padding reserved even when value is empty (prevents jitter). |
| Clearable (button visible) | `clearable` + non-empty `value` + `onClear` | 18×18 pill button at the trailing edge with `close` icon. |
| Clear button hover | `:hover` on clear | Background and colour shift via `color-mix` to a stronger token-derived shade. |

## Accessibility

- The leading icon span is marked `aria-hidden="true"` — purely decorative. Pair the input with a `FormField` label or supply `aria-label` for screen-reader naming.
- The clear button is a real `<button type="button">` with `aria-label="Clear"`, so it's keyboard-focusable and announced.
- Webkit-native search clear is suppressed via CSS to avoid double clear buttons; non-webkit browsers don't render a native one for `type="search"` anyway.
- The clear button only appears for controlled inputs (`typeof value === 'string'`). Uncontrolled inputs intentionally have no clear affordance — there's no way to externally reset their DOM value from React.
- Default focus indication is border-only (no outline). Verify against your background; add a `:focus-visible` box-shadow on critical surfaces if needed.
- Clear-button hit target is 18×18 — below WCAG 2.1 AAA 44×44. Acceptable for dense desktop search bars but consider enlarging for touch-primary surfaces.
