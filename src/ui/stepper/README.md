# Stepper

A record's progress through its lifecycle, left to right: done steps checked, the current step ringed, steps ahead hollow, skipped steps dashed. Use it on a record page to show where an order, a claim or an application stands. For a vertical history with content per entry, use [`TimelineEntry`](../timeline-entry/README.md).

`Stepper` renders an ordered list (`<ol>`), one `<li>` per step: a marker, the label and an optional meta line (a date, an owner). Steps share the row equally, each at least `--uxm-stepper-step-min-width` wide, and the list scrolls sideways when they don't fit. The connecting line is filled up to the current step.

## Usage

```tsx
import { Stepper } from '@viax.io/uxm/ui';

<Stepper
  aria-label="Order progress"
  steps={[
    { label: 'Quoted', state: 'done', meta: '12 Oct' },
    { label: 'Approved', state: 'done', meta: '14 Oct' },
    { label: 'Ordered', state: 'current', meta: 'Today' },
    { label: 'Delivered', state: 'ahead' },
    { label: 'Invoiced', state: 'ahead' },
  ]}
/>
```

## Props

Extends `ComponentPropsWithRef<'ol'>`; every attribute (`ref`, `aria-label`, `id`, `style`, …) goes to the `<ol>`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `steps` | `StepperStep[]` | – | **Required.** The steps, in order. |
| `stateLabels` | `{ done?: string; off?: string }` | `{ done: 'Done', off: 'Skipped' }` | The word a screen reader hears after a done or skipped step's label (the marker shows it only as a shape). Pass your own copy to translate: it follows the label after a space, so include any punctuation your language wants. |
| `className` | `string` | – | Merged with `uxm-stepper` via `cn`. |

### `StepperStep`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `label` | `ReactNode` | yes | The step's name. |
| `state` | `'done' \| 'current' \| 'ahead' \| 'off'` | yes | Passed, where the record is, not reached yet, or skipped. |
| `meta` | `ReactNode` | no | A second line under the label. |
| `key` | `string` | no | React key; defaults to the index. |

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-stepper-marker-size` | – | `20px` | Marker diameter. The check in a done marker scales with it (60%: 12px at the default). |
| `--uxm-stepper-line-width` | – | `2px` | Connecting line and hollow-marker border width. |
| `--uxm-stepper-step-min-width` | – | `96px` | Minimum width per step before the list scrolls. |
| `--uxm-stepper-line-color` | `--color-border` | – | Line into a step not yet reached. |
| `--uxm-stepper-done-color` | `--color-accent-bold` | – | Done markers and the line into reached steps. |
| `--uxm-stepper-done-icon-color` | `--color-text-inverse` | – | The check in a done marker. |
| `--uxm-stepper-current-color` | `--color-accent-bold` | – | The current marker. |
| `--uxm-stepper-current-ring` | `--color-accent-bold` at 25% | – | The 4px ring round the current marker (`color-mix(in srgb, var(--color-accent-bold) 25%, transparent)`). |
| `--uxm-stepper-ahead-color` | `--color-text-subtle` | – | Border of upcoming and skipped (dashed) markers. |
| `--uxm-stepper-marker-bg` | `--color-card` | – | Fill of upcoming and skipped markers. |
| `--uxm-stepper-label-color` | `--color-text` | – | Done and current labels. |
| `--uxm-stepper-muted-label-color` | `--color-text-muted` | – | Upcoming and skipped labels. |
| `--uxm-stepper-label-size` | – | `13px` | Label size. |
| `--uxm-stepper-meta-color` | `--color-text-muted` | – | Meta line. |
| `--uxm-stepper-meta-size` | – | `12px` | Meta size. |
| `--uxm-stepper-focus-ring` | `--color-accent` | – | Focus ring on the list (it's a Tab stop as a scroller). |

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-accent-bold` | Accent / Accent Bold | Done and current markers, the reached line, and (at 25%) the current ring. |
| `--color-text-subtle` | Text / Text Subtle | Upcoming marker border (3:1 on card and surface). |
| `--color-border` | Borders / Border | Line ahead. |

## States & variants

| State | Marker | Label |
|-------|--------|-------|
| `done` | Filled, with a check | Text colour |
| `current` | Filled, ringed | Text colour, strong weight; `aria-current="step"` |
| `ahead` | Hollow | Muted |
| `off` | Hollow, dashed | Muted, struck through |

## Accessibility

- An `<ol>`: the order is the meaning, and screen readers announce "list, N items". Name it with `aria-label`.
- The current step carries `aria-current="step"`. Done and skipped steps add a visually hidden word after the label (`stateLabels`), since the marker shows the state only as a shape.
- State is never colour alone: done has a check; current is filled without a check, with a heavier label and `aria-current`; skipped has a dashed marker and a struck-through label. The ring round the current marker is decoration on top of those: at 25% accent it measures about 1.4:1 against the card in light and 1.9:1 in dark, below the 3:1 a cue on its own would need. Raise `--uxm-stepper-current-ring` if you want it to carry the state.
- Markers are `aria-hidden`; the list is not interactive. To let people jump to a step, put links in the labels.
- The list is a Tab stop (`tabIndex={0}`, with a focus ring), because it scrolls sideways when the steps don't fit and a scroller has to be reachable from the keyboard. Pass `tabIndex={-1}` where the steps always fit.
- The default hidden word follows the label after a comma ("Quoted, Done"). Your own `stateLabels` follow after a space, with no comma added, so a language that doesn't use ", " isn't given one.
- RTL: the steps and lines run right to left (logical properties).
