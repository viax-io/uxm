# Chip

Material Design's interactive label component — four modes (`assist`, `filter`, `input`, `suggestion`), four states (default, hover, selected, disabled).

`Chip` renders as a `<button>` when interactive (`onClick` provided or `mode="filter"`) and a `<span>` otherwise. Mode is inferred from props when omitted: `onRemove` → `input`, else → `assist`. Each mode owns a full set of `--uxm-chip-{mode}-*` CSS variables (bg, border, text, font-size, font-weight, padding, gap, icon-size, border-radius) so MODO's editor can tune each mode independently without bleed-through. Hover / selected / disabled states attach to native pseudo-classes (`:hover`, `[aria-pressed="true"]`, `:disabled`) — no JS state tracking.

## Usage

```tsx
import { Chip, Icon } from '@viax/uxm';

function Example() {
  return (
    <>
      <Chip iconLeft={<Icon glyph="sparkle" />}>Assist</Chip>
      <Chip mode="filter" selected={active} onClick={() => setActive(!active)}>
        Filter
      </Chip>
      <Chip onRemove={() => remove(tag)}>{tag.label}</Chip>
      <Chip mode="suggestion" onClick={() => apply()}>Suggestion</Chip>
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | – | **Required.** Label content rendered inside `<span class="uxm-chip__label">`. |
| `mode` | `'assist' \| 'filter' \| 'input' \| 'suggestion'` | inferred (`input` if `onRemove` set, else `assist`) | Visual mode. Drives which `--uxm-chip-{mode}-*` vars apply. |
| `selected` | `boolean` | `false` | Toggle state for `mode="filter"` (ignored on other modes). Maps to `aria-pressed`. |
| `disabled` | `boolean` | `false` | Disables interaction. On a `<button>`, sets the native `disabled` attribute; on a `<span>`, sets `aria-disabled="true"`. |
| `iconLeft` | `ReactNode` | – | Optional leading icon. Rendered inside `<span class="uxm-chip__icon-left">`. |
| `onClick` | `(e: MouseEvent<HTMLButtonElement>) => void` | – | When set (or `mode="filter"`), the chip renders as a `<button>`. |
| `onRemove` | `() => void` | – | When set, mode defaults to `"input"` and a trailing × button appears. Click stops propagation so it doesn't trigger the chip's `onClick`. |
| `className` | `string` | – | Merged via `cn`. |
| `style` | `CSSProperties` | – | Inline style on the rendered chip — used by the editor preview to project draft `--uxm-chip-*` vars. |
| `aria-label` | `string` | – | Forwarded to the root element. |

### `ChipMode`

```ts
type ChipMode = 'assist' | 'filter' | 'input' | 'suggestion';
```

Exported as a string union for consumers who need to enumerate or store the mode externally.

## CSS variables

Each mode has its own complete set; the table below lists the per-mode variable names with a single representative row. Substitute `{mode}` with `assist`, `filter`, `input`, or `suggestion`.

| Variable | Fallback token (assist / filter / input / suggestion) | Default | Affects |
|----------|---------------------------------------------------|---------|---------|
| `--uxm-chip-{mode}-default-bg` | `--color-card` / `--color-card` / `--color-accent-subtle` / `--color-surface` | – | Default background. |
| `--uxm-chip-{mode}-default-border` | `--color-border` / `--color-border` / `--color-accent-subtle` / `--color-surface` | – | Default border. |
| `--uxm-chip-{mode}-default-text` | `--color-text` / `--color-text` / `--color-accent-bold` / `--color-text-strong` | – | Default text. |
| `--uxm-chip-{mode}-hover-bg` | `--color-surface-alt` (all modes) | – | Hover background. |
| `--uxm-chip-{mode}-hover-border` | `--color-border` (assist/filter/input) / `--color-surface-alt` (suggestion) | – | Hover border. |
| `--uxm-chip-{mode}-hover-text` | `--color-text` (assist/filter/input) / `--color-text-strong` (suggestion) | – | Hover text. |
| `--uxm-chip-{mode}-disabled-bg` | `--color-surface-alt` (assist/filter/input) / `--color-surface` (suggestion) | – | Disabled background. |
| `--uxm-chip-{mode}-disabled-border` | `--color-border` (assist/filter/input) / `--color-surface` (suggestion) | – | Disabled border. |
| `--uxm-chip-{mode}-disabled-text` | `--color-text-subtle` (all modes) | – | Disabled text. |
| `--uxm-chip-filter-selected-bg` | `--color-accent-bold` | – | Selected (filter only) background. |
| `--uxm-chip-filter-selected-border` | `--color-accent-bold` | – | Selected (filter only) border. |
| `--uxm-chip-filter-selected-text` | `--color-text-inverse` | – | Selected (filter only) text. |
| `--uxm-chip-{mode}-border-radius` | – | `999px` | Border radius (pill shape). |
| `--uxm-chip-{mode}-font-size` | – | `13px` | Font size. |
| `--uxm-chip-{mode}-font-weight` | – | `500` | Font weight. |
| `--uxm-chip-{mode}-gap` | – | `8px` | Gap between icon, label, and remove button. |
| `--uxm-chip-{mode}-padding-x` | – | `12px` | Horizontal padding. |
| `--uxm-chip-{mode}-padding-y` | – | `4px` | Vertical padding. |
| `--uxm-chip-{mode}-icon-size` | – | `16px` | Leading icon width/height (applied to the inner `<svg>`). |

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-card` | Surfaces / Card | `assist` + `filter` default backgrounds. |
| `--color-surface` | Surfaces / Surface | `suggestion` default background + border + disabled bg. |
| `--color-surface-alt` | Surfaces / Surface Alt | All hover backgrounds, disabled bg (assist/filter/input), `suggestion` hover border. |
| `--color-border` | Borders / Border | Default + hover + disabled borders (assist/filter/input). |
| `--color-text` | Text / Text | `assist` / `filter` text (default + hover); `input` hover text. |
| `--color-text-strong` | Text / Text Strong | `suggestion` text (default + hover). |
| `--color-text-subtle` | Text / Text Subtle | Disabled text (all modes). |
| `--color-text-inverse` | Text / Text Inverse | `filter` selected text. |
| `--color-accent-subtle` | Accent / Accent Subtle | `input` default background + border. |
| `--color-accent-bold` | Accent / Accent Bold | `input` default text; `filter` selected bg + border. |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Mode: `assist` | default / `mode="assist"` | Neutral card-on-border, text-coloured label. Always a `<span>` unless `onClick` is provided. |
| Mode: `filter` | `mode="filter"` | Always renders as `<button>`. Toggle state driven by `aria-pressed`. |
| Mode: `input` | `onRemove` set or `mode="input"` | Accent-subtle pill with accent-bold text; trailing × button. |
| Mode: `suggestion` | `mode="suggestion"` | Flat / borderless surface look — bg + border share `--color-surface`. |
| Hover | `:hover:not(:disabled)` (filter excludes `[aria-pressed="true"]`) | Per-mode hover bg/border/text from the variables above; 120ms transition. |
| Selected | `[aria-pressed="true"]` on `filter` | Accent-bold fill, inverse text. |
| Disabled | `disabled` prop | Per-mode disabled palette; cursor `not-allowed`. On `<button>`: native `disabled`. On `<span>`: `aria-disabled="true"`. |
| Remove button | `onRemove` set | Trailing 16px button with `Icon glyph="close"`; `stopPropagation` on click so the parent chip's handler doesn't fire. Tab index drops to `-1` when disabled. |

## Accessibility

- Renders semantic HTML based on intent: interactive chips are `<button>`s, static labels are `<span>`s — screen readers get the right role automatically.
- `mode="filter"` uses `aria-pressed` to communicate toggle state, matching MD3 filter-chip conventions.
- Disabled `<span>` chips set `aria-disabled="true"` (native `disabled` is invalid on non-form elements).
- The remove button has `aria-label="Remove"` and an `aria-hidden` close icon. When the chip is disabled, the remove button drops from the tab order (`tabIndex={-1}`) but stays visible.
- `iconLeft` is wrapped in `aria-hidden="true"` — supply a meaningful chip label via `children` (or `aria-label` for icon-only chips).
- Hover transitions are 120ms — well within WCAG flicker thresholds.
- The remove button stops click propagation so removing a chip never accidentally triggers the chip's main `onClick` — a quiet but important contract.
