# Disclosure

A header-only collapsible row — icon + label + right chevron that rotates 90° on open. The body slot is intentionally omitted: the consumer renders whatever content lives beneath this row, conditional on the open state.

`Disclosure` renders as a single `<button>` with three children: an optional icon slot, a content column holding the label, and a chevron (`Icon glyph="chevron-right"`) rotated via the `--open` class. Open state is **either controlled** (via `open` + `onOpenChange`) or **uncontrolled** (via `defaultOpen`, with internal `useState`). Click handlers chain — the component's toggle runs, then the consumer's `onClick` fires. Use for side-panel form sections and settings rows where a row reveals more detail when expanded.

## Usage

```tsx
import { Disclosure, Icon } from '@viax/uxm';

function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Disclosure
        icon={<Icon glyph="settings" />}
        label="Advanced settings"
        open={open}
        onOpenChange={setOpen}
      />
      {open && <div>{/* expanded body */}</div>}
    </>
  );
}
```

## Props

### `DisclosureProps`

Extends `Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'>` — all other native button attributes (`disabled`, `aria-*`, `data-*`, `id`) flow through to the root `<button>`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `ReactNode` | – | **Required.** Rendered into the content column. |
| `icon` | `ReactNode` | – | Optional leading slot. When omitted, the icon span is not rendered. |
| `open` | `boolean` | – | Controlled open state. When defined, `defaultOpen` is ignored and internal state isn't used. |
| `id` | `string` | – | Native button id. Also seeds the generated `` `${id}-panel` `` value used for `aria-controls` — see Accessibility. |
| `defaultOpen` | `boolean` | `false` | Initial open state for uncontrolled usage. |
| `onOpenChange` | `(open: boolean) => void` | – | Fires with the next open state on every click (controlled or uncontrolled). |
| `onClick` | `(e: MouseEvent) => void` | – | Standard click handler. Runs **after** the internal toggle + `onOpenChange`. |
| `disabled` | `boolean` | `false` | Native disabled state; CSS `:disabled` paints the dimmed treatment and clicks are blocked. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Overridden default — prevents accidental form submission. |
| `className` | `string` | – | Merged onto the root via `cn`. |
| _(any native button attribute)_ | – | – | Spread onto the root `<button>`. |

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-disclosure-background-color` | – | `transparent` | Button background. |
| `--uxm-disclosure-gap` | – | `12px` | Gap between icon, content, and chevron. |
| `--uxm-disclosure-padding-x` | – | `16px` | Horizontal padding. |
| `--uxm-disclosure-padding-y` | – | `12px` | Vertical padding. |
| `--uxm-disclosure-color` | `--color-text` | – | Label text color. |
| `--uxm-disclosure-font-size` | – | `14px` | Label font size. |
| `--uxm-disclosure-value-color` | `--color-text-muted` | – | Color for the `&__value` element (declared in CSS but not rendered by the current `.tsx`). |
| `--uxm-disclosure-value-size` | – | `12px` | Font size for the `&__value` element (same caveat). |
| `--uxm-disclosure-chevron-color` | `--color-text-muted` | – | Chevron color. |
| `--uxm-disclosure-chevron-size` | – | `16px` | Chevron width/height. |

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-text` | Text / Text | Label text. |
| `--color-text-muted` | Text / Text Muted | Chevron color, optional value slot. |

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Closed | `open` / `defaultOpen` falsy | Chevron points right (default rotation). |
| Open | `open` true (controlled) or internal state true (uncontrolled) | `--open` modifier rotates the chevron 90° clockwise (`transform: rotate(90deg)`), 150ms ease. |
| With icon | `icon` prop provided | Renders the `&__icon` span before the content column. |
| Disabled | `disabled` attribute | Native disabled treatment via CSS `:disabled` (no overrides in current SCSS — relies on UA dimming). |

## Accessibility

- Renders a native `<button>` with `type="button"` by default — full keyboard activation (`Space` / `Enter`) and screen-reader semantics come for free.
- `aria-expanded` is wired to the resolved `open` state, so screen readers announce the disclosure pattern correctly.
- The chevron is `aria-hidden="true"` — decorative only.
- The body is **not** rendered by this component, so `Disclosure` can't set an `id` on it directly. Instead it computes `aria-controls` as `` `${id}-panel` `` (falling back to a `useId()`-generated base when no `id` prop is passed) per the WAI-ARIA disclosure pattern (§F2). Pass an explicit `id` and give your rendered body the matching `` `${id}-panel` `` id to complete the wiring.
- Disabled state uses the native `disabled` attribute, removing the row from the tab order. The component comment notes `aria-disabled` selector parity for the family but does not set it automatically.
- No `role="button"` override — relies entirely on the native element semantics.
