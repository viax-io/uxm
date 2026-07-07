# ConfigSegmentItem

A row in a Configuration model's left-pane segment list. Renders as a `<button>` — selecting a segment swaps the components shown in the middle pane.

A segment groups a set of components (e.g. Account Profile → Account Name, Account Type, …). The user selects one segment at a time; active state is "selected" (not navigated-to), so this is a button, not a link. Two native `<button>` attributes are stripped from the public props surface, matching `ConfigComponentRow`: `type` (always rendered as `"button"`, so the row can never accidentally submit a parent form) and `name` (consumers reach for `name` meaning "segment display name", which is the `ReactNode` prop below).

## Usage

```tsx
import { ConfigSegmentItem } from '@viax/uxm';

function SegmentList({ segments, activeId, onSelect }: Props) {
  return (
    <>
      {segments.map((s) => (
        <ConfigSegmentItem
          key={s.id}
          name={s.label}
          meta={`${s.components.length} components`}
          active={s.id === activeId}
          onClick={() => onSelect(s.id)}
        />
      ))}
    </>
  );
}
```

## Props

`ConfigSegmentItemProps` extends `Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'name'>`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `ReactNode` | – | **Required.** Segment display name — the primary row label. |
| `meta` | `ReactNode` | – | Optional small line below the name (e.g. `"5 components"`). Hidden when omitted. |
| `active` | `boolean` | `false` | Renders the selected state and sets `aria-pressed="true"`. |
| `className` | `string` | – | Merged with `uxm-config-segment-item` via `cn`. |
| `onClick` | `(e: MouseEvent) => void` | – | Selection handler. |
| _(any native button attribute except `type`, `name`)_ | – | – | Spread onto the root `<button>`. |

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-config-segment-item-radius` | – | `6px` | Root border-radius. |
| `--uxm-config-segment-item-padding-y` | – | `8px` | Vertical padding. |
| `--uxm-config-segment-item-padding-x` | – | `12px` | Horizontal padding. |
| `--uxm-config-segment-item-name-size` | – | `14px` | Name font size. |
| `--uxm-config-segment-item-meta-size` | – | `12px` | Meta font size. |

All colours are wired straight to the design-token layer below — no per-component colour vars.

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-text` | Text / Text | Name colour (default + active). |
| `--color-text-muted` | Text / Text Muted | Meta colour. |
| `--color-surface-alt` | Surfaces / Surface Alt | Hover background. |
| `--color-accent` | Accent / Accent | Focus-visible outline. |
| `--color-accent-subtle` | Accent / Accent Subtle | Active-state background. |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Default | – | Transparent background, transparent 1px border, `--color-text` name. |
| Hover | `:hover` | Background fades to `--color-surface-alt` (0.12s transition). |
| Active | `active` prop | Background sits on `--color-accent-subtle`; hover keeps the same background (no shift). Also sets `aria-pressed="true"`. |
| Focus | `:focus-visible` | 2px `--color-accent` outline with 2px offset. |

## Accessibility

- Renders a native `<button>` — `Space`/`Enter` activation and screen-reader semantics come for free.
- `aria-pressed={active}` exposes the selected state to assistive tech as a toggle button — even though selection is single-choice across the list, this matches the "I am the chosen one" semantic without requiring `role="radio"` and the keyboard-navigation overhead that comes with it.
- `type` is forcibly `"button"` (not overridable) so the row never accidentally submits a parent form — same guarantee as `ConfigComponentRow`.
- The native HTML `name` attribute is intentionally stripped from the props surface; if you need form-control name semantics here, you're using the wrong component.
- The hover background is the same lightness as the active background's parent (`--color-surface-alt`) — verify legibility of `--color-text` against both when overriding tokens.
