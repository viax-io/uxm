# SegmentTreeRow

A collapsible tree node for a Configuration model's **segment**: a header row over a body that reveals the segment's component rows when open. Used in the left/middle pane of the config editor to group `ConfigComponentRow`s under an expandable segment.

The header composes (left → right): an optional drag handle · an accent rail · a chevron · the segment title · an optional item-count badge · an optional trailing `actions` slot. The chevron/title/count live inside a single toggle `<button>`; `actions` is a **sibling** of that button (never nested), so action controls stay valid interactive elements. Controlled or uncontrolled, mirroring `Disclosure` / `ExplorerSection`.

Every colour/dimension reads a `--uxm-segment-tree-row-*` custom property (with a design-token fallback), so the UXM studio knobs re-theme it live.

## Usage

```tsx
import { SegmentTreeRow, ConfigComponentRow, Icon, IconButton } from '@viax/uxm';

function SegmentList({ segments, onToggle }: Props) {
  return (
    <>
      {segments.map((s) => (
        <SegmentTreeRow
          key={s.id}
          name={s.label}
          count={s.components.length}
          defaultOpen={s.id === firstOpenId}
          dragHandle
          actions={
            <>
              <IconButton aria-label="Edit"><Icon glyph="pencil" size={14} /></IconButton>
              <IconButton aria-label="Delete"><Icon glyph="trash" size={14} /></IconButton>
            </>
          }
        >
          {s.components.map((c) => (
            <ConfigComponentRow key={c.id} name={c.label} type={c.valueType} />
          ))}
        </SegmentTreeRow>
      ))}
    </>
  );
}
```

## Props

`SegmentTreeRowProps` extends `Omit<HTMLAttributes<HTMLDivElement>, 'title'>` — `title` is omitted because `name` replaces it; other native div attributes (`id`, `data-*`, `onClick`, etc.) spread onto the root `<div>`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `ReactNode` | – | **Required.** Segment title (primary text). Truncates with ellipsis when it overflows. |
| `count` | `number` | – | Item count — renders a trailing `"N item(s)"` badge (singular at `1`). Omit for no badge. |
| `open` | `boolean` | – | Controlled open state. When set, the component defers to it and only calls `onOpenChange`. |
| `defaultOpen` | `boolean` | `true` | Initial open state for uncontrolled usage. Ignored when `open` is provided. |
| `onOpenChange` | `(open: boolean) => void` | – | Fires with the next open state whenever the header toggle is clicked. |
| `children` | `ReactNode` | – | Expanded body — typically the segment's `ConfigComponentRow`s. A body (and its border) renders only when there is at least one child **and** the row is open. |
| `dragHandle` | `boolean` | `false` | Show a leading drag-handle affordance (visual only — wire your own DnD). |
| `actions` | `ReactNode` | – | Trailing action controls (typically `IconButton`s), revealed on row hover / keyboard focus, kept outside the toggle button. On touch (no hover) they stay visible. |
| `className` | `string` | – | Merged with `uxm-segment-tree-row` on the root `<div>` via `cn`. |
| _(any native div attribute except `title`)_ | – | – | Spread onto the root `<div>`. |

## CSS variables

Set on the root (via `style` or a higher scope). All map 1-to-1 to the studio registry knobs for `segment-tree-row`.

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-segment-tree-row-background-color` | `--color-card` | – | Row background. |
| `--uxm-segment-tree-row-border-color` | `--color-border` | – | Row border. |
| `--uxm-segment-tree-row-border-radius` | – | `12px` | Row corner radius. |
| `--uxm-segment-tree-row-accent-color` | `--color-accent-subtle` | – | Leading accent rail colour. |
| `--uxm-segment-tree-row-accent-width` | – | `4px` | Accent rail width. |
| `--uxm-segment-tree-row-accent-height` | – | `20px` | Accent rail height. |
| `--uxm-segment-tree-row-title-size` | – | `15px` | Title font size. |
| `--uxm-segment-tree-row-title-color` | `--color-text` | – | Title colour. |
| `--uxm-segment-tree-row-count-badge-bg` | `--color-surface-alt` | – | Count badge background. |
| `--uxm-segment-tree-row-count-badge-text` | `--color-text-muted` | – | Count badge text. |
| `--uxm-segment-tree-row-padding-x` | – | `16px` | Header horizontal padding. |
| `--uxm-segment-tree-row-padding-y` | – | `18px` | Header vertical padding. |

The chevron (`--color-text-muted`), drag handle (`--color-text-subtle`), body border-top (`--color-border`), and focus outline (`--color-accent`) read design tokens directly — no per-component var.

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-card` | Surfaces / Card | Row background. |
| `--color-surface-alt` | Surfaces / Surface Alt | Count badge background. |
| `--color-border` | Borders / Border | Row + body border. |
| `--color-text` | Text / Text | Title colour. |
| `--color-text-muted` | Text / Text Muted | Chevron, count badge text. |
| `--color-text-subtle` | Text / Text Subtle | Drag handle. |
| `--color-accent` | Accent / Accent | Focus-visible outline. |
| `--color-accent-subtle` | Accent / Accent Subtle | Accent rail. |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`).

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Open | `open` / `defaultOpen` true | Chevron rotated 90°; body rendered below a `--color-border` top divider (only when there are children). |
| Closed | `open` / `defaultOpen` false | Chevron at rest; body not rendered. |
| Drag handle | `dragHandle` | Leading `drag-handle` glyph with `cursor: grab` (visual only). |
| Count badge | `count` provided | Trailing pill with tabular-nums `"N item(s)"`. |
| Actions | `actions` provided | `.uxm-segment-tree-row__actions` after the count, collapsed to zero width when idle and revealed on row `:hover` / `:focus-within`; always visible under `@media (hover: none)`. |
| Empty body | no children | The toggle still renders but no body strip is drawn, and `aria-controls` is omitted. |

## Accessibility

- The header caret/title/count are a single native `<button>` with `aria-expanded` reflecting the open state — `Space`/`Enter` toggle for free; `:focus-visible` draws a `--color-accent` outline.
- `aria-controls` points at the body's `useId` id only while the body is present (open **and** has children); it is omitted otherwise so it never dangles at a non-existent element.
- `actions` render as a **sibling** of the toggle button, never inside it, so action `IconButton`s stay valid (no nested-interactive violation). Give each its own `aria-label`.
- The drag handle, accent rail, and chevron are `aria-hidden` decorative spans — the accessible name comes from `name` (+ the count text).
- The root `<div>` is a non-interactive wrapper; all keyboard/SR semantics live on the toggle button.
