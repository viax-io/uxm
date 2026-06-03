# ToggleSwitch

An iOS-style on/off switch — a coloured pill track with a sliding thumb — built on a native checkbox input (`role="switch"`), with an optional inline label.

`ToggleSwitch` renders a `<label className="uxm-toggle-switch">` wrapping a visually-hidden `<input type="checkbox" role="switch">`, a `<span>` track (with `aria-hidden`), and a positioned `<span>` thumb. Track width and thumb size are driven by two CSS variables: `--uxm-toggle-switch-width` and `--uxm-toggle-switch-height`. The thumb's "on" position is computed as `width − height + 2px`, so changing either dimension preserves the inset without recompiling the SCSS. An optional `children` label renders to the right of the track.

## Usage

```tsx
import { ToggleSwitch } from '@viax/uxm';

function Example() {
  const [enabled, setEnabled] = useState(false);
  return (
    <ToggleSwitch
      checked={enabled}
      onChange={setEnabled}
      name="notifications"
    >
      Email notifications
    </ToggleSwitch>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | – | Controlled checked state. When set, the input is controlled. |
| `defaultChecked` | `boolean` | – | Initial checked state for uncontrolled usage. |
| `disabled` | `boolean` | – | Native disabled state; adds `uxm-toggle-switch--disabled` modifier and disables the input. |
| `onChange` | `(checked: boolean, e: ChangeEvent<HTMLInputElement>) => void` | – | Fires on input change with the next checked value and the raw event. |
| `children` | `ReactNode` | – | Optional label text rendered to the right of the track. |
| `name` | `string` | – | Forwarded to the native input — required when used inside an HTML form. |
| `className` | `string` | – | Merged with the root `<label>` class via `cn`. |
| `style` | `CSSProperties` | – | Inline style on the wrapping `<label>`. Use to project per-instance `--uxm-toggle-switch-*` overrides. |

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-toggle-switch-width` | – | `44px` | Track width. Drives the "on" thumb position arithmetic. |
| `--uxm-toggle-switch-height` | – | `24px` | Track height. Thumb size derives as `height − 4px`. |
| `--uxm-toggle-switch-track-off` | `--color-border` | – | Track background when off. |
| `--uxm-toggle-switch-track-on` | `--color-accent` | – | Track background when on (`:checked`). |
| `--uxm-toggle-switch-thumb` | `--color-card` | – | Thumb background. |

> The `--shadow-sm` token applies a small drop-shadow under the thumb. The "on" thumb position is computed via `calc()` from `width` / `height`, so the math survives custom dimensions.

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-text` | Text / Text | Label text. |
| `--color-border` | Borders / Border | Off-state track background. |
| `--color-accent` | Accent / Accent | On-state track background. |
| `--color-card` | Surfaces / Card | Thumb background. |

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Off | `checked` is falsy | Track painted `--color-border`; thumb sits at `left: 2px`. |
| On | `checked` is truthy | Track painted `--color-accent`; thumb slides to `calc(width − height + 2px)` (0.2s transition). |
| Disabled | `disabled` prop | `uxm-toggle-switch--disabled` modifier added; native disabled blocks interaction. |
| Hover | `:hover` | Cursor switches to `pointer` (no additional colour change in baseline styles). |

## Accessibility

- Renders a real `<input type="checkbox" role="switch">` inside a `<label>` — clicking the label or its text toggles the input natively, no synthetic events.
- `role="switch"` overrides the default checkbox semantics so screen readers announce "on" / "off" rather than "checked" / "unchecked".
- The track and thumb spans are `aria-hidden="true"`; the input carries all assistive-tech state.
- Keyboard: `Space` toggles when the input has focus (native checkbox behaviour). `Enter` does **not** toggle — this is native checkbox semantics, not a missing feature.
- Disabled state uses the native `disabled` attribute (removes from tab order, announces "unavailable").
- The `uxm-toggle-switch--disabled` modifier is added but the baseline SCSS does not visually dim the track — consumers wanting a dim disabled treatment should add an `opacity` rule scoped to that modifier.
