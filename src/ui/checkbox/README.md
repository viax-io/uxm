# Checkbox

A label-wrapped native `<input type="checkbox">` with a custom box and a CSS-sized check icon.

The native input is visually hidden but kept in the accessibility tree (`opacity: 0`, `width/height: 1px`); the visible square (`__box`) sits next to it and reads its checked state via the adjacent-sibling selector (`:checked + .uxm-checkbox__box`). An optional label slot (`children`) renders to the right with a configurable gap. Disabled state both disables the native input and adds a `uxm-checkbox--disabled` modifier for cursor + opacity treatment.

## Usage

```tsx
import { Checkbox } from '@viax.io/uxm';

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
| `disabled` | `boolean` | `false` | Disables the input and adds the `--disabled` modifier (cursor + 0.4 opacity). |
| `error` | `string` | – | Non-empty string sets `aria-invalid` + `aria-describedby` and renders an icon-led message below via the shared `FieldError` (2.8.0). Per the small-control convention the box and label stay neutral — the message is the sole signal. |
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
| `--uxm-checkbox-unchecked-bg` | – | `transparent` | Box background while unchecked (Studio's Default › Unchecked › Background). |
| `--uxm-checkbox-unchecked-border` | `--uxm-checkbox-border-color` → `--color-border` | – | Box border while unchecked (Default › Unchecked › Border). |
| `--uxm-checkbox-border-color` | `--color-border` | – | Legacy name for the unchecked border, still read as the fallback of `--uxm-checkbox-unchecked-border`. |
| `--uxm-checkbox-border-radius` | – | `4px` | Box corner radius. |
| `--uxm-checkbox-size` | – | `20px` | Box width and height. |
| `--uxm-checkbox-checked-bg` | `--uxm-checkbox-check-color` → `--color-accent` | – | Box background while checked (Default › Checked › Background). |
| `--uxm-checkbox-checked-border` | `--uxm-checkbox-check-color` → `--color-accent` | – | Box border while checked (Default › Checked › Border). |
| `--uxm-checkbox-check-color` | `--color-accent` | – | Legacy single knob for the checked background AND border, still read as the fallback of both `-checked-*` vars. |
| `--uxm-checkbox-check-glyph-color` | `--color-text-inverse` | – | Check glyph while checked (Default › Checked › Check Glyph). |
| `--uxm-checkbox-hover-unchecked-bg` | `--uxm-checkbox-unchecked-bg` → `transparent` | – | Box background on hover while unchecked (the resting background by default — the border carries the hover). |
| `--uxm-checkbox-hover-unchecked-border` | `--color-text-strong` | – | Box border on hover while unchecked. |
| `--uxm-checkbox-hover-checked-bg` | `--color-accent-bold` | – | Box background on hover while checked. |
| `--uxm-checkbox-hover-checked-border` | `--color-accent-bold` | – | Box border on hover while checked. |
| `--uxm-checkbox-hover-check-glyph-color` | `--uxm-checkbox-check-glyph-color` → `--color-text-inverse` | – | Check glyph on hover (the resting glyph colour by default — it still has to read on the deeper fill). |
| `--uxm-checkbox-focus-ring` | `--color-accent` | – | `:focus-visible` outline colour on the box (2px, 2px offset). |
| `--uxm-checkbox-error-color` | `--color-danger-text` | – | Colour of the `error` message below the control (icon included — it uses `currentColor`). |
| `--uxm-checkbox-error-message-size` | – | `12px` | Font size of the `error` message. |

> ⚠️ A studio-saved override for the two `error` vars does not currently reach the message: `generateOverridesCss` emits per-component vars on `.uxm-checkbox`, the message renders as that element's *sibling*, and custom properties only cascade downwards. Tracked separately — set the vars on a shared ancestor if you need to re-tone messages today.
| `--uxm-checkbox-disabled-opacity` | – | `0.4` | Opacity when disabled (`.uxm-checkbox--disabled`). |

Hover is scoped with `:not(.uxm-checkbox--disabled)`, so a disabled checkbox does not react to the pointer. Where the registry's hover default differs from the resting one (the borders, the checked fill), the hover var falls back to that hover default, so a themed `-checked-bg` still deepens to `--color-accent-bold` on hover unless `-hover-checked-bg` is set too. Where they are the same (unchecked background, glyph), the hover var falls back through the resting var, so a themed value holds under the pointer.

The resting vars are the names Studio's `generateOverridesCss` emits for the Default-state knobs. Before they were read here, a saved Background / Border / Check Glyph painted only the `Listbox` checkbox marker (which reads the same names), never the `Checkbox` itself. The older `-border-color` / `-check-color` names stay in the chains, so overrides written against them keep working; the registry names win when both are set.

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-text` | Text / Text | Label text colour. |
| `--color-border` | Borders / Border | Unchecked box border (via the `--uxm-checkbox-unchecked-border` → `-border-color` fallback). |
| `--color-accent` | Accent / Accent | Checked-state background + border (via the `--uxm-checkbox-checked-*` → `-check-color` fallback). |
| `--color-accent-bold` | Accent / Accent Bold | Checked box background + border on hover. |
| `--color-text-strong` | Text / Text Strong | Unchecked box border on hover. |
| `--color-text-inverse` | Text / Text Inverse | Check glyph colour (via `--uxm-checkbox-check-glyph-color`, and `--uxm-checkbox-hover-check-glyph-color` on hover). |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Default (unchecked) | – | Transparent box with `--color-border` outline; check SVG present but `opacity: 0`. |
| Checked | `:checked` on the native input | Box fills with `--uxm-checkbox-checked-bg` and borders with `--uxm-checkbox-checked-border` (both `--color-accent`); check SVG fades to `opacity: 1`. |
| Disabled | `disabled` prop | `--disabled` modifier: `cursor: not-allowed`, `opacity: 0.4`; native input also disabled. Hover is skipped. |
| Hover (unchecked) | `:hover` on the root, input unchecked | Border moves to `--color-text-strong`; the box stays unfilled. |
| Hover (checked) | `:hover` on the root, input checked | Box (fill + border) deepens to `--color-accent-bold`; glyph holds its resting colour (`--color-text-inverse`). |
| Focus | `:focus-visible` on the native input | The visible box gets a `2px` outline in `--uxm-checkbox-focus-ring` (`--color-accent`) at `2px` offset. |
| Error | non-empty `error` prop | `aria-invalid` on the input; icon-led `FieldError` message below in `--uxm-checkbox-error-color`; box and label stay neutral. |

## Accessibility

- Wrapped in a `<label>`, so clicking either the box or the label text toggles the checkbox.
- Uses a real `<input type="checkbox">` — screen readers announce role, name (via the label text), and checked state natively; keyboard activation via `Space` works without extra wiring.
- The hidden-but-not-display:none technique (`opacity: 0` + `width/height: 1px`) keeps the input in the focus order and accessibility tree.
- Aria caveat: the custom box has `aria-hidden="true"`, which is correct — the native input owns the semantics.
- Keyboard focus is visible: `:focus-visible` on the hidden input draws the outline on the custom box, so the ring is not left to the browser's default on an `opacity: 0` element.
- For icon-only checkboxes (no `children`), supply an external `aria-label` via the consumer-rendered label — this component does not accept arbitrary input attributes.
