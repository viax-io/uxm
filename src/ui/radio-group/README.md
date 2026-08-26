# RadioGroup

A pair of components — `RadioGroup` (the wrapper) and `RadioOption` (the individual choice) — that wrap native `<input type="radio">` elements into a themable, role-correct radio set.

`RadioGroup` is a presentational wrapper carrying `role="radiogroup"` and the orientation modifier; the actual `name` binding, value tracking, and change handling live on each `RadioOption`. The wrapper exposes a single sizing knob (`--uxm-radio-group-size`) that the circle and inner dot inherit — the dot derives its diameter from `size / 2`, so one variable keeps the proportions in lock.

## Usage

```tsx
import { RadioGroup, RadioOption } from '@viax/uxm';
import { useState } from 'react';

function PlanPicker() {
  const [plan, setPlan] = useState('pro');
  return (
    <RadioGroup name="plan" value={plan} onChange={setPlan} direction="vertical">
      <RadioOption name="plan" value="free" checked={plan === 'free'} onChange={setPlan}>
        Free
      </RadioOption>
      <RadioOption name="plan" value="pro" checked={plan === 'pro'} onChange={setPlan}>
        Pro
      </RadioOption>
      <RadioOption name="plan" value="team" checked={plan === 'team'} onChange={setPlan} disabled>
        Team (coming soon)
      </RadioOption>
    </RadioGroup>
  );
}
```

## Props

### `RadioGroup`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | – | **Required.** Form field name; pass the same value to every `RadioOption` child for native group semantics. |
| `value` | `string` | – | Currently selected value (for controlled usage at the group level). |
| `defaultValue` | `string` | – | Initial selection for uncontrolled usage. |
| `onChange` | `(value: string, e: ChangeEvent<HTMLInputElement>) => void` | – | Group-level change callback. |
| `direction` | `'vertical' \| 'horizontal'` | `'vertical'` | Lays children out as a column or row. |
| `className` | `string` | – | Merged with the root class via `cn`. |
| `children` | `ReactNode` | – | One or more `RadioOption` elements. |

### `RadioOption`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | – | **Required.** Native radio group name; must match the enclosing `RadioGroup`. |
| `value` | `string` | – | **Required.** Value submitted / reported when this option is selected. |
| `checked` | `boolean` | – | Controlled checked state. |
| `defaultChecked` | `boolean` | – | Initial checked state for uncontrolled usage. |
| `disabled` | `boolean` | `false` | Disables the input and adds the `--disabled` modifier (`cursor: not-allowed` + `0.4` opacity via `--uxm-radio-group-disabled-opacity`). |
| `onChange` | `(value: string, e: ChangeEvent<HTMLInputElement>) => void` | – | Fires with the option's value when selected. |
| `children` | `ReactNode` | – | Label content next to the circle. When omitted, only the circle renders. |
| `className` | `string` | – | Merged with `uxm-radio` via `cn`. |

### `RadioGroupDirection`

```ts
type RadioGroupDirection = 'vertical' | 'horizontal';
```

Exported as a string union so consumers can build orientation toggles without re-declaring literals.

## CSS variables

`RadioGroup` exposes a handful of `--uxm-radio-group-*` knobs on the wrapper that the descendant `.uxm-radio__circle` / `__dot` elements read via CSS custom-property inheritance.

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-radio-group-gap` | – | `16px` | Spacing between options in the group. |
| `--uxm-radio-group-size` | – | `20px` | Outer circle diameter; the inner dot is `size / 2`. |
| `--uxm-radio-group-border-color` | `--color-border` | – | Idle circle border. |
| `--uxm-radio-group-active-color` | `--color-accent` | – | Checked circle border + inner dot fill. |
| `--uxm-radio-group-hover-unselected-bg` | `transparent` | – | Circle background on hover while unselected (unfilled by default — the border carries the hover). |
| `--uxm-radio-group-hover-unselected-border` | `--color-text-strong` | – | Circle border on hover while unselected. |
| `--uxm-radio-group-hover-selected-border` | `--color-accent-bold` | – | Circle border on hover while selected. |
| `--uxm-radio-group-hover-dot-color` | `--color-accent-bold` | – | Inner dot on hover while selected. |
| `--uxm-radio-group-focus-ring` | `--color-accent` | – | `:focus-visible` outline colour on the circle (2px, 2px offset). |
| `--uxm-radio-group-disabled-opacity` | – | `0.4` | Opacity when disabled (`.uxm-radio--disabled`). |
| `--uxm-radio-group-error-color` | `--color-danger-text` | – | Colour of the `error` message below the group (icon included — it uses `currentColor`). |
| `--uxm-radio-group-error-message-size` | – | `12px` | Font size of the `error` message. |

> ⚠️ A studio-saved override for the two `error` vars does not currently reach the message: `generateOverridesCss` emits per-component vars on `.uxm-radio-group`, the message renders as that element's *sibling*, and custom properties only cascade downwards. Tracked separately — set the vars on a shared ancestor if you need to re-tone messages today.

Hover is scoped with `:not(.uxm-radio--disabled)`, so a disabled option does not react to the pointer.

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-text` | Text / Text | Label text colour. |
| `--color-border` | Borders / Border | Idle circle border (fallback). |
| `--color-accent` | Accent / Accent | Checked border + dot fill (fallback). |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Direction: `vertical` | `direction="vertical"` (default) | Column layout, gap `16px`. |
| Direction: `horizontal` | `direction="horizontal"` | Row layout, same gap. |
| Idle | `input` not checked | Circle border `--color-border`; dot at `opacity: 0`. |
| Checked | `input:checked` | Border + dot fill switch to `--color-accent`; dot at `opacity: 1`. |
| Disabled | `disabled` prop | Native `disabled` on the input + `--disabled` modifier on the label: `cursor: not-allowed` and `opacity: 0.4` (`--uxm-radio-group-disabled-opacity`). |
| Hover (unselected) | `:hover` on the label, input unselected | Circle border moves to `--color-text-strong`; the circle stays unfilled. |
| Hover (selected) | `:hover` on the label, input selected | Circle border and inner dot deepen to `--color-accent-bold`. |

## Accessibility

- Wrapper carries `role="radiogroup"`; each option renders a real `<label>` wrapping a native `<input type="radio">` — keyboard activation (Arrow keys to step, Space to select), tab semantics, and screen-reader group announcements all come from the native primitive.
- The decorative circle + dot carry `aria-hidden="true"` so assistive tech sees only the input + label text.
- `disabled` uses the native attribute — the input is removed from the tab order and announced as unavailable.
- The `--disabled` modifier dims the option to `0.4` (`--uxm-radio-group-disabled-opacity`) and sets `cursor: not-allowed`.
- No group-level `aria-labelledby` is wired automatically; if the group needs a visible label, pair it with an external heading and set `aria-labelledby` on the `RadioGroup` via the spread `...rest` (note: `RadioGroup` does not currently spread arbitrary HTML attributes — add one via the `className` + a wrapping element if needed).
