# ConfigComponentRow

A row in a Configuration model's middle-pane components list. Each row is a clickable card describing one component (a field) within the currently selected segment; selecting it swaps the right-pane editor.

Renders as a `<button>` (click = "select for edit", not navigate). Composes an `IconTile` in the leading slot whose size and radius are bridged to the row's own CSS variables (`--uxm-config-component-row-icon-tile-*` → `--uxm-icon-tile-*` via inline style). Two native button attributes are stripped from the props surface: `type` (always `"button"`) and `name` (consumers mean the visible field name, not the HTML form-control name).

## Usage

```tsx
import { ConfigComponentRow, Icon, Tag } from '@viax/uxm';

function ComponentsList({ rows, activeId, onSelect }: Props) {
  return (
    <>
      {rows.map((r) => (
        <ConfigComponentRow
          key={r.id}
          icon={<Icon glyph={r.icon} />}
          name={r.label}
          type={r.valueType}
          trailing={r.required && <Tag type="accent">Required</Tag>}
          active={r.id === activeId}
          onClick={() => onSelect(r.id)}
        />
      ))}
    </>
  );
}
```

## Props

`ConfigComponentRowProps` extends `Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'name'>`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `ReactNode` | – | Optional leading icon node — rendered inside an `<IconTile>`. Omit to drop the tile entirely. |
| `name` | `ReactNode` | – | **Required.** Component display name (primary text). |
| `type` | `ReactNode` | – | Optional value-type label rendered below the name (e.g. `"TEXT"`, `"BOOLEAN"`). The registry of value types is consumer-owned. |
| `trailing` | `ReactNode` | – | Trailing slot — typical content is a `<Tag>` flagging the component (required, deprecated, etc.). |
| `active` | `boolean` | `false` | Renders the selected state (accent border) and sets `aria-pressed="true"`. |
| `className` | `string` | – | Merged with `uxm-config-component-row` via `cn`. |
| `onClick` | `(e: MouseEvent) => void` | – | Selection handler. |
| _(any native button attribute except `type`, `name`)_ | – | – | Spread onto the root `<button>`. |

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-config-component-row-radius` | – | `4px` | Root border-radius. |
| `--uxm-config-component-row-padding` | – | `16px` | Root inner padding (all sides). |
| `--uxm-config-component-row-name-size` | – | `14px` | Name font size. |
| `--uxm-config-component-row-type-size` | – | `12px` | Type label font size. |
| `--uxm-config-component-row-icon-tile-size` | – | `28px` | Forwarded to `--uxm-icon-tile-size` on the inner `<IconTile>`. |
| `--uxm-config-component-row-icon-tile-radius` | – | `6px` | Forwarded to `--uxm-icon-tile-radius` on the inner `<IconTile>`. |

All colours are wired straight to the design-token layer below — no per-component colour vars.

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-card` | Surfaces / Card | Row background. |
| `--color-border` | Borders / Border | Default border. |
| `--color-text` | Text / Text | Name colour. |
| `--color-text-muted` | Text / Text Muted | Type-label colour. |
| `--color-accent` | Accent / Accent | Hover border (40% mix), focus-visible outline, active border. |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI. `IconTile` defaults (`--color-surface-alt` bg, `--color-text-muted` glyph) apply to the leading tile since no colour vars are projected from the row.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Default | – | `--color-card` bg, `--color-border` outline, `--color-text` name. |
| Hover | `:hover` | Border shifts to `color-mix(--color-accent 40%, transparent)`; 0.12s transition. |
| Active | `active` prop | Border becomes solid `--color-accent` (hover keeps the same border, no shift). Sets `aria-pressed="true"`. |
| Focus | `:focus-visible` | 2px `--color-accent` outline with 2px offset. |
| Icon omitted | `icon` undefined | The leading `<IconTile>` is skipped entirely; body becomes the first child. |
| Type omitted | `type` undefined | The `__type` span is skipped — body shows the name only. |
| Trailing omitted | `trailing` undefined | The trailing slot is skipped. |

## Accessibility

- Renders a native `<button>` — `Space`/`Enter` activation and screen-reader semantics come for free.
- `aria-pressed={active}` exposes the selected state as a toggle button — same rationale as `ConfigSegmentItem`.
- `type` is forcibly `"button"` so the row never accidentally submits a parent form, and the prop named `type` is repurposed for the value-type label.
- The leading `IconTile` is decorative; ensure its icon node is `aria-hidden` or contributes redundant info to the row's accessible name (which is the concatenated text content of `name` + `type` + `trailing`).
- The trailing slot accepts arbitrary `ReactNode` — if it contains its own interactive control (e.g. a `<button>` inside a `<Tag>`), nested-interactive semantics may confuse some screen readers. Prefer non-interactive trailing content.
