# PropertyField & PropertyGrid

A pair of primitives for rendering `LABEL → value` metadata pairs and laying them out in a responsive auto-fill grid. `PropertyField` is the single label-value atom; `PropertyGrid` is its auto-fill wrapper.

Each owns its own `--uxm-*` registry namespace — `property-field` for the field-shape knobs (label/value colour and size, internal gap) and `property-grid` for the layout knobs (row and column gap). Editing one doesn't bleed into the other: a grid's spacing edit can't change a field's internal label-value gap.

## Usage

```tsx
import { PropertyField, PropertyGrid } from '@viax/uxm';

function MetadataPanel({ asset }) {
  return (
    <PropertyGrid>
      <PropertyField label="ID">{asset.id}</PropertyField>
      <PropertyField label="Status">{asset.status}</PropertyField>
      <PropertyField label="Created">{asset.createdAt}</PropertyField>
      <PropertyField label="Owner">{asset.owner}</PropertyField>
    </PropertyGrid>
  );
}
```

## Props

### `PropertyField`

Extends `HTMLAttributes<HTMLDivElement>` — any standard div attribute is forwarded to the root.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `ReactNode` | – | **Required.** Rendered into the upper `<span class="uxm-property-field__label">` (uppercase + tracking by default; themeable via `--uxm-property-field-label-transform` / `-tracking`). |
| `children` | `ReactNode` | – | **Required.** Field value, rendered into the lower `<span class="uxm-property-field__value">` (monospace by default; themeable via `--uxm-property-field-value-font`). |
| `className` | `string` | – | Merged with `uxm-property-field`. |
| _(any native div attribute)_ | – | – | Spread onto the root `<div>`. |

### `PropertyGrid`

Extends `HTMLAttributes<HTMLDivElement>` — any standard div attribute is forwarded to the root.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | – | **Required.** Typically `<PropertyField>` instances, but any node is allowed; the grid lays out direct children with `auto-fill, minmax(120px, 1fr)`. |
| `className` | `string` | – | Merged with `uxm-property-grid`. |
| _(any native div attribute)_ | – | – | Spread onto the root `<div>`. |

## CSS variables

### `PropertyField`

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-property-field-gap` | – | `4px` | Vertical gap between label and value. |
| `--uxm-property-field-label-color` | `--color-text-muted` | – | Label text colour. |
| `--uxm-property-field-label-size` | – | `11px` | Label font size. |
| `--uxm-property-field-value-color` | `--color-text` | – | Value text colour. |
| `--uxm-property-field-value-size` | – | `14px` | Value font size. |
| `--uxm-property-field-label-transform` | – | `uppercase` | Label `text-transform`. Set `none` for a sentence-case label (prose grids). |
| `--uxm-property-field-label-tracking` | – | `0.06em` | Label `letter-spacing`. Pair `normal` with `label-transform: none` — the tracking suits caps, not sentence case. |
| `--uxm-property-field-value-font` | – | `ui-monospace, SFMono-Regular, Menlo, monospace` | Value `font-family`. For proportional prose values pass an explicit body stack, e.g. `var(--brand-font, var(--font-sans, sans-serif))`. ⚠️ Do **not** pass the keyword `inherit` — a CSS-wide keyword as a custom-property value makes the property inherit (a no-op) rather than resolving to `font-family: inherit`, so it silently falls back to the mono default. |

Label additionally carries a hard-coded `font-weight: 600` (not exposed). The case, tracking, and value font are themeable via the variables above — their defaults reproduce the original uppercase-eyebrow label + monospace value exactly, so an unset instance is unchanged.

> **Studio note.** The workbench "Label Case" / "Value Font" presets are **preview-only** — they demonstrate the two looks but are not persisted to saved overrides (they're layout variants, and only the colour/size style knobs on this atom persist). To ship a sentence-case / proportional PropertyField, set the CSS variables above in your own code (e.g. `--uxm-property-field-value-font: var(--brand-font, var(--font-sans, sans-serif))` on the field or a wrapper); that is the intended persistence path.

### `PropertyGrid`

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-property-grid-column-gap` | – | `32px` | Column gap between fields. |
| `--uxm-property-grid-row-gap` | – | `16px` | Row gap between fields. |

Grid template is fixed: `repeat(auto-fill, minmax(120px, 1fr))`. The minmax floor is not exposed as a variable.

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-text-muted` | Text / Text Muted | Default label colour. |
| `--color-text` | Text / Text | Default value colour. |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`).

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Default field | – | Muted uppercase label above monospace value, 4px gap. |
| Default grid | – | Auto-fill columns floor at 120px, 32px column / 16px row gap. |
| Empty grid | No children | Grid renders empty — no placeholder treatment. |
| Override per instance | Inline `style={{ '--uxm-property-field-value-color': 'var(--color-accent-bold)' }}` | Field re-tints from the same surface the editor knobs write to. |

## Accessibility

- Both components render `<div>` / `<span>` — no built-in semantics. Screen readers will announce the label and value as consecutive text fragments with the label's source-order priority.
- For richer association (description lists, key-value semantics), wrap externally with `<dl>` / `<dt>` / `<dd>` or set `role="term"` / `role="definition"` on the spans via spread props.
- Label uppercase styling is `text-transform: uppercase` — the underlying text is still read in original case by screen readers (not actually rewritten in the DOM), which is the desired behaviour.
- Monospace value font is the default — intentional for IDs, timestamps, version strings. For prose values set `--uxm-property-field-value-font` to a proportional stack (e.g. `var(--brand-font, var(--font-sans, sans-serif))`), or use the workbench "Value Font: Proportional" preset, rather than overriding by class. (Passing `inherit` does not work — see the CSS-variables note above.)
- Grid is purely visual — focus / tab order follows source order regardless of visual column position.
