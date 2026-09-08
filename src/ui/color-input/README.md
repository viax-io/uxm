# ColorInput / ColorInputPopover

A full inline colour picker: a saturation/brightness area, hue and opacity sliders, a swatch, an optional screen eyedropper, a format select, and a per-format value editor — one hex text field, or R/G/B(/A) or H/S/L numeric fields.

Two exports:

- **`ColorInput`** — the picker itself, rendered inline.
- **`ColorInputPopover`** — a compact swatch trigger that opens the same picker in a [`Popover`](../popover/README.md).

**The working model is HSVA, not RGB.** That is a deliberate choice, not an implementation detail: hue and alpha are preserved even when saturation or value hit `0`, where an RGB→HSV round-trip cannot recover them. Without it, dragging the saturation area to black would silently discard the hue the user had picked. Switching format re-derives the fields from the current colour — that *is* the conversion.

## Usage

```tsx
import { ColorInput, ColorInputPopover } from '@viax.io/uxm/ui';

// Inline, controlled.
<ColorInput
  value={color}
  onChange={setColor}
  outputFormat="hex"
/>

// Compact swatch that opens the picker.
<ColorInputPopover
  value={color}
  onChange={setColor}
  triggerLabel="Brand colour"
  alpha={false}
  placement="bottom-end"
/>

// Uncontrolled, RGBA output, no eyedropper.
<ColorInput
  defaultValue="#3ECC87"
  outputFormat="rgba"
  eyedropper={false}
  onEnter={(c) => commit(c)}
  onEsc={() => cancel()}
/>
```

## Props — `ColorInput`

Extends `Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'>` — both are dropped because this component redefines them with colour-specific signatures. Any other standard div attribute is forwarded to the root.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | – | Controlled value — any supported colour string. |
| `defaultValue` | `string` | `'#000000'` | Initial value for uncontrolled use. |
| `onChange` | `(color: string) => void` | – | Fires on every commit, formatted per `outputFormat`. |
| `formats` | `ColorFormat[]` | all four | Which formats the representation select offers. |
| `outputFormat` | `ColorFormat` | `'hex'` | Format of the string handed to `onChange` / `onEnter`. |
| `onEnter` | `(color: string) => void` | – | Enter in a value field commits and fires this. |
| `onEsc` | `() => void` | – | Escape reverts the field draft to the last committed value, then fires this. |
| `alpha` | `boolean` | `true` | Show the opacity slider. |
| `eyedropper` | `boolean` | `true` | Show the screen eyedropper. **Chromium only** — auto-hidden where the EyeDropper API is unavailable. |
| `disabled` | `boolean` | `false` | Disable all interaction. |
| `error` | `string` | – | Non-empty renders the error state plus a message below the panel. |
| `labels` | `ColorInputLabels` | English defaults | Accessible names for the unlabelled controls; merged over the defaults. |
| `className` / `style` | – | – | Applied to the root. |

```ts
interface ColorInputLabels {
  area?: string;            // "Color" — the saturation/brightness area
  areaValueText?: (saturation: number, brightness: number) => string;
  hue?: string;             // "Hue"
  alpha?: string;           // "Opacity"
  eyedropper?: string;      // "Pick color from screen"
  format?: string;          // "Color format"
  hex?: string;             // "Hex color value"
}
```

These are grouped into one object rather than seven flat props because none is individually interesting and a consumer localising the picker sets **all** of them at once — one object keeps that a single spread from their own dictionary. Every field is optional and falls back to the English default.

```ts
type ColorFormat = 'hex' | 'rgb' | 'rgba' | 'hsl';
```

**`outputFormat` and the visible format are independent.** The in-component select changes only what the user edits; `outputFormat` fixes what `onChange` returns. A user can work in HSL while the consumer keeps receiving hex.

Carries a static `ColorInput.hasError = true` flag, which the studio reads to know the atom has an error state.

## Props — `ColorInputPopover`

Extends `ColorInputProps` — everything above applies — plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | – | Controlled open state. |
| `defaultOpen` | `boolean` | `false` | Uncontrolled initial state. |
| `onOpenChange` | `(open: boolean) => void` | – | |
| `placement` | `PopoverPlacement` | `'bottom-start'` | |
| `triggerLabel` | `string` | `'Choose color'` | Accessible name for the trigger swatch. |

Enter and Escape inside the panel additionally **close** the popover — Enter after committing, Escape after reverting the draft. Popover's own Escape and outside-click dismissal covers everything else. The trigger is announced as `` `${triggerLabel}: ${currentColor}` ``, so the current value is part of its accessible name.

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-color-input-width` | – | `260px` | Overall picker width. |
| `--uxm-color-input-area-height` | – | `160px` | Saturation/brightness area height. |
| `--uxm-color-input-bg` | `--color-card` | – | Field and eyedropper surface. |
| `--uxm-color-input-color` | `--color-text` | – | Text in the fields. |
| `--uxm-color-input-border-color` | `--color-border` | – | Field, swatch and eyedropper borders. |
| `--uxm-color-input-border-radius` | – | `8px` | Radius across area, fields, swatch. |
| `--uxm-color-input-padding-y` | – | `8px` | Field vertical padding. |
| `--uxm-color-input-padding-x` | – | `10px` | Field horizontal padding. |
| `--uxm-color-input-font-size` | – | `14px` | Field font size. |
| `--uxm-color-input-format-width` | – | `88px` | Width of the format select. |
| `--uxm-color-input-hover-border` | `--color-accent` | – | Field border on hover. |
| `--uxm-color-input-focus-border` | `--color-accent` | – | Field border on focus. |
| `--uxm-color-input-focus-ring` | `--color-accent` | – | 2px focus outline on area, sliders and fields. |
| `--uxm-color-input-error-border` | `--color-danger-text` | – | Field border in the error state. |
| `--uxm-color-input-error-color` | `--color-danger-text` | – | Error message colour. |
| `--uxm-color-input-error-message-size` | – | `12px` | Error message font size. |
| `--uxm-color-input-disabled-opacity` | – | `0.6` | Opacity when disabled (picker and trigger). |
| `--uxm-color-input-trigger-size` | – | `32px` | `ColorInputPopover` swatch trigger, width and height. |
| `--uxm-color-input-panel-bg` | `--color-card` | – | Popover panel surface. |
| `--uxm-color-input-panel-border` | `--color-border` | – | Popover panel border. |
| `--uxm-color-input-panel-radius` | – | `8px` | Popover panel radius. |
| `--uxm-color-input-panel-padding` | – | `12px` | Popover panel padding. |

Three variables are **written by the TSX at runtime, not by a theme** — they carry live state into the gradients and are not knobs:

| Variable | Carries |
|----------|---------|
| `--uxm-color-input-hue` | Current hue in degrees; feeds the saturation area and hue track. |
| `--uxm-color-input-solid` | Current fully-opaque colour; the right end of the alpha gradient. |
| `--uxm-color-input-value` | Current colour including alpha; painted over the swatch's checkerboard. |

The format select is a nested `Select` re-themed **from** this atom's own variables — `--uxm-select-dropdown-*` are re-pointed at the `--uxm-color-input-*` values, so the dropdown matches the picker without a second set of knobs to keep in sync.

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-card` | Surfaces / Card | Field, eyedropper and panel surface. |
| `--color-text` | Text / Text | Field text. |
| `--color-border` | Borders / Border | Field, swatch, eyedropper and panel borders. |
| `--color-accent` | Accent / Accent | Hover border, focus border, focus ring. |
| `--color-danger-text` | Semantic / Danger Text | Error border and error message. |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Default | – | Area, hue slider, optional alpha slider, swatch, controls row. |
| No alpha | `alpha={false}` | Opacity slider omitted; swatch shows an opaque colour. |
| No eyedropper | `eyedropper={false}`, or a non-Chromium browser | Eyedropper button omitted. |
| Hover | pointer over a field | Accent border. |
| Focus | keyboard focus on area, slider or field | Accent border plus a 2px accent outline. |
| Invalid hex | unparseable text in the hex field | `--invalid` on that field; `aria-invalid` set. |
| Error | `error` non-empty | `--error` on the root paints every field's border danger; message below. |
| Disabled | `disabled` | Whole picker at 0.6 opacity, interaction blocked, `aria-disabled` on each slider. |

Note the two distinct invalid signals: `--invalid` is the **hex field's own** parse failure, while `--error` is the **consumer's** validation state. They can appear independently.

## Accessibility

- The saturation/brightness area is `role="slider"` with `aria-valuemin={0}`, `aria-valuemax={100}` and `aria-valuenow` tracking saturation. Because a 2-D control cannot express both axes in one `aria-valuenow`, it also carries an **`aria-valuetext`** spelling out both — `"Saturation 62%, Brightness 40%"` by default — which is what a screen-reader user actually hears. That string is a function (`labels.areaValueText`), not a template, so a translation can reorder the two numbers.
- The hue slider is `role="slider"` over 0–360, and the opacity slider over 0–100, each with its own name (`labels.hue`, `labels.alpha`).
- All three sliders set `aria-disabled` when the picker is disabled.
- The swatch is `aria-hidden="true"` — it is a redundant visual of a value already available in the fields.
- The hex field carries `aria-label="Hex color value"` and `aria-invalid` when the text does not parse.
- Every one of these names — the area, its `aria-valuetext`, both sliders, the eyedropper, the format select and the hex field — comes from `labels` and defaults to English. Pass the whole object in a localised UI; `ColorInputPopover`'s `triggerLabel` is separate and needs translating too.
- `ColorInputPopover`'s trigger carries `aria-haspopup="dialog"`, `aria-expanded`, and an accessible name that **includes the current colour**, so a screen-reader user knows the value without opening the panel. The panel is `role="dialog"` labelled by `triggerLabel`.
- Escape reverts the field draft rather than discarding the committed value, so a mistyped hex cannot silently destroy the previous colour.
- **Colour is the subject here, so it cannot be the only channel** — the value fields are always present and always carry the exact value as text, which is what makes the picker usable without colour perception.
