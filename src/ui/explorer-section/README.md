# ExplorerSection

A disclosure-style section header for grouping rows in a navigation list (e.g. component-explorer categories, file-tree folders). Renders a chevron that rotates with `open`, an optional indicator slot (typically a category color dot), the heading, and an optional trailing slot.

`ExplorerSection` renders as a `<button>` because clicking toggles the section. Like `Disclosure`, it supports both **controlled** (`open` + `onOpenChange`) and **uncontrolled** (`defaultOpen`, with internal `useState`) usage. Pass `open` when the caller owns the state (e.g. to persist it to localStorage); omit it to let the atom track it internally. `onClick` still fires either way — chain your own toggle handler off it if you need it, same as before. The chevron is always rendered as the first child, rotated `-90deg` when closed and `0deg` when open via the `--open` modifier.

## Usage

```tsx
import { ExplorerSection } from '@viax/uxm';

// Controlled — caller owns the state (e.g. to persist to localStorage).
function ControlledExample() {
  const [open, setOpen] = useState(false);
  return (
    <ExplorerSection
      open={open}
      onClick={() => setOpen((o) => !o)}
      indicator={<span style={{ width: 8, height: 8, background: 'hotpink', borderRadius: 999 }} />}
      trailing="12"
    >
      Components
    </ExplorerSection>
  );
}

// Uncontrolled — the atom tracks its own state.
function UncontrolledExample() {
  return (
    <ExplorerSection defaultOpen trailing="12">
      Components
    </ExplorerSection>
  );
}
```

## Props

### `ExplorerSectionProps`

Extends `Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>` — `children` is shadowed to a required `ReactNode` label. All other native button attributes (`onClick`, `disabled`, `aria-*`, `data-*`) flow through to the root `<button>`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | – | **Required.** Section heading text rendered in `&__label`. |
| `open` | `boolean` | – | Controlled open state. When defined, `defaultOpen` is ignored and internal state isn't used. Drives chevron rotation and `aria-expanded`. |
| `defaultOpen` | `boolean` | `false` | Initial open state for uncontrolled usage. |
| `onOpenChange` | `(open: boolean) => void` | – | Fires with the next open state on every click (controlled or uncontrolled). |
| `id` | `string` | – | Native button id. Also seeds the generated `` `${id}-panel` `` value used for `aria-controls` — see Accessibility. |
| `indicator` | `ReactNode` | – | Optional leading slot — typically a category color dot or small icon/swatch. |
| `trailing` | `ReactNode` | – | Optional trailing slot — typically a count or status (muted, tabular-nums). |
| `disabled` | `boolean` | `false` | Native disabled state — CSS `:disabled` paints the dimmed treatment and clicks are blocked. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Overridden default — prevents accidental form submission. |
| `onClick` | `(e: MouseEvent) => void` | – | Runs **after** the internal toggle + `onOpenChange`. Optional in uncontrolled usage; typically the caller's toggle handler in controlled usage. |
| `className` | `string` | – | Merged onto the root via `cn`. |
| _(any native button attribute)_ | – | – | Spread onto the root `<button>`. |

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-explorer-section-border-radius` | – | `6px` | Row corner radius. |
| `--uxm-explorer-section-color` | `--color-text-muted` | – | Label + base text color (idle). |
| `--uxm-explorer-section-gap` | – | `8px` | Gap between chevron, indicator, label, and trailing slot. |
| `--uxm-explorer-section-padding-y` | – | `4px` | Vertical padding. |
| `--uxm-explorer-section-padding-x` | – | `8px` | Horizontal padding. |
| `--uxm-explorer-section-hover-bg` | `color-mix(srgb, --color-surface 40%, transparent)` | – | Background on hover. |
| `--uxm-explorer-section-hover-color` | `--color-text-strong` | – | Text color on hover. |
| `--uxm-explorer-section-chevron-color` | `--color-text-muted` | – | Chevron stroke color. |
| `--uxm-explorer-section-chevron-size` | – | `12px` | Chevron width/height. |
| `--uxm-explorer-section-font-size` | – | `11px` | Label font size. |
| `--uxm-explorer-section-font-weight` | – | `600` | Label font weight. |
| `--uxm-explorer-section-trailing-color` | `--color-text-subtle` | – | Trailing-slot text color. |
| `--uxm-explorer-section-trailing-size` | – | `10px` | Trailing-slot font size. |

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-text-muted` | Text / Text Muted | Label + chevron (idle). |
| `--color-text-strong` | Text / Text Strong | Label color on hover. |
| `--color-text-subtle` | Text / Text Subtle | Trailing-slot text. |
| `--color-surface` | Surfaces / Surface | Hover bg (mixed). |

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Closed | `open={false}` | Chevron rotated `-90deg` (points right). |
| Open | `open={true}` | `--open` modifier — chevron rotated to `0deg` (points down), 0.15s ease. |
| Hover | `:hover` | Surface-mixed background, text shifts to text-strong (0.12s). |
| With indicator | `indicator` provided | Slot rendered between chevron and label, `aria-hidden="true"`. |
| With trailing | `trailing` provided | Right-aligned subtle slot, tabular-nums. |
| Disabled | `disabled` attribute | Native disabled treatment (UA defaults — no overrides in current SCSS). |
| Long label | Structural | Label uppercases (`text-transform: uppercase`), letter-spaced `0.06em`, and ellipsis-truncates. |

## Accessibility

- Renders a native `<button>` — full keyboard activation and screen-reader semantics come for free.
- `aria-expanded` is wired to the resolved `open` state, modeling the disclosure pattern correctly.
- Chevron and indicator both carry `aria-hidden="true"` — purely decorative.
- The grouped rows below this header are **not** rendered by this component, so `ExplorerSection` can't set an `id` on them directly. Instead it computes `aria-controls` as `` `${id}-panel` `` (falling back to a `useId()`-generated base when no `id` prop is passed) per the WAI-ARIA disclosure pattern (§F2). Pass an explicit `id` and give your rendered group wrapper the matching `` `${id}-panel` `` id to complete the wiring.
- Label uppercases visually via CSS but the underlying text node is preserved at its original casing for screen readers.
- No focus-visible styling defined — relies on the UA default focus ring.
