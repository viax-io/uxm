# Checkbox

A label-wrapped native `<input type="checkbox">` with a custom box and a CSS-sized check icon.

The native input is visually hidden but kept in the accessibility tree (`opacity: 0`, `width/height: 1px`); the visible square (`__box`) sits next to it and reads its checked state via the adjacent-sibling selector (`:checked + .uxm-checkbox__box`). An optional label slot (`children`) renders to the right with a configurable gap. Disabled state both disables the native input and adds a `uxm-checkbox--disabled` modifier for cursor + opacity treatment.

## Usage

```tsx
import { Checkbox } from '@viax/uxm';

function Example() {
  return (
    <Checkbox checked={agreed} onChange={(next) => setAgreed(next)}>
      I agree to the terms
    </Checkbox>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | – | Controlled checked state. Pair with `onChange`. |
| `defaultChecked` | `boolean` | – | Initial checked state for uncontrolled usage. |
| `disabled` | `boolean` | `false` | Disables the input and adds the `--disabled` modifier (cursor + 0.6 opacity). |
| `onChange` | `(checked: boolean, e: ChangeEvent<HTMLInputElement>) => void` | – | Fires with the next boolean and the raw event. |
| `children` | `ReactNode` | – | Optional label rendered as `<span class="uxm-checkbox__label">`. Omit for an unlabeled checkbox (icon-only). |
| `className` | `string` | – | Merged onto the `<label>` root via `cn`. |
| `name` | `string` | – | Native input `name` — used when the checkbox participates in a form. |
| `value` | `string` | – | Native input `value` — paired with `name` for form submission. |

The component does not spread arbitrary HTML attributes onto the input; only the props listed above are forwarded.

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-checkbox-gap` | – | `10px` | Gap between the box and the label. |
| `--uxm-checkbox-border-color` | `--color-border` | – | Unchecked box border. |
| `--uxm-checkbox-border-radius` | – | `4px` | Box corner radius. |
| `--uxm-checkbox-size` | – | `20px` | Box width and height. |
| `--uxm-checkbox-check-color` | `--color-accent` | – | Checked-state background AND border (single knob — they always move together). |

The check glyph colour is hardcoded to `--color-text-inverse` so the SVG always reads on the checked background.

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-text` | Text / Text | Label text colour. |
| `--color-border` | Borders / Border | Unchecked box border (via `--uxm-checkbox-border-color` fallback). |
| `--color-accent` | Accent / Accent | Checked-state background + border (via `--uxm-checkbox-check-color` fallback). |
| `--color-text-inverse` | Text / Text Inverse | Check glyph colour (hardcoded — not consumer-configurable). |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Default (unchecked) | – | Transparent box with `--color-border` outline; check SVG present but `opacity: 0`. |
| Checked | `:checked` on the native input | Box fills with `--uxm-checkbox-check-color`; check SVG fades to `opacity: 1`. |
| Disabled | `disabled` prop | `--disabled` modifier: `cursor: not-allowed`, `opacity: 0.6`; native input also disabled. |
| Focus | `:focus` on the native input | Inherits browser default focus ring on the (visually hidden) input — the visible box has no custom focus treatment. |

## Accessibility

- Wrapped in a `<label>`, so clicking either the box or the label text toggles the checkbox.
- Uses a real `<input type="checkbox">` — screen readers announce role, name (via the label text), and checked state natively; keyboard activation via `Space` works without extra wiring.
- The hidden-but-not-display:none technique (`opacity: 0` + `width/height: 1px`) keeps the input in the focus order and accessibility tree.
- Aria caveat: the custom box has `aria-hidden="true"`, which is correct — the native input owns the semantics.
- Focus indication is delegated to the browser's default ring on the hidden input, which most browsers do NOT render visibly. Consumers needing a visible focus ring should add a `:focus-visible + .uxm-checkbox__box` rule downstream.
- For icon-only checkboxes (no `children`), supply an external `aria-label` via the consumer-rendered label — this component does not accept arbitrary input attributes.
