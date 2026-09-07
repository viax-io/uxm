# ProgressBar

Determinate progress (0–100%) — the companion to `Loader`'s indeterminate
spinner/dots/bar. Use for uploads, batch operations, and stepped flows where
the share of work done is known. For "something is happening, no ETA" reach for
`Loader` instead.

Two variants share one value:

- **`linear`** (default) — a track with a filling bar, caption + percentage above.
- **`ring`** — a circular gauge drawn with a CSS `conic-gradient` (no SVG),
  percentage centered, caption below.

```tsx
import { ProgressBar } from '@viax.io/uxm/ui';

<ProgressBar value={62} label="Uploading…" />
<ProgressBar variant="ring" value={62} />
```

## Props

| Prop        | Type                   | Default    | Notes |
| ----------- | ---------------------- | ---------- | ----- |
| `value`     | `number`               | —          | Completion 0–100. Clamped into range. |
| `variant`   | `'linear' \| 'ring'`   | `'linear'` | Linear track or circular ring. |
| `label`     | `string`               | —          | Optional caption. |
| `valueText` | `string`               | —          | Override the `${round(value)}%` text. |
| `...rest`   | `HTMLAttributes<div>`  | —          | Native attributes pass through to the root. |

## Theming

The root is layout-only; every themeable property reads a
`--uxm-progress-bar-*` custom property on an inner element, so style-editor
saves route through the kebab-fallback path — no `PER_COMPONENT_MAPPING` entry
needed. The single `--uxm-progress-bar-value` var drives both the linear fill
width and the ring sweep; it is set inline from `value`, so the runtime value
always wins over any saved rule.

## Accessibility

Renders `role="progressbar"` with `aria-valuenow` / `aria-valuemin` (0) /
`aria-valuemax` (100), plus `aria-label` when `label` is set.
