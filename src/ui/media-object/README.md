# MediaObject

Media beside content: a hero with its illustration, a row with an avatar, a card with a chart. Two columns that stack to one when the component's **own container** is narrow, measured on the component rather than the viewport, so the same block is side by side in a wide pane and stacked in a side panel.

`MediaObject` renders a container root (`className`, `style` and props go here) around an inner two-column grid: `.uxm-media-object__media` and `.uxm-media-object__body`. The DOM follows the visual order (media first when it sits at the start, last at the end), so reading order and Tab order match what's on screen.

## Usage

```tsx
import { ButtonPrimary, MediaObject } from '@viax.io/uxm/ui';

<MediaObject media={<img src="/penguin.svg" alt="" />} mediaPosition="end" mediaWidth="40%">
  <h1>Good morning, Dr. Smith</h1>
  <p>Two chairs are due for service this month.</p>
  <ButtonPrimary>Book a visit</ButtonPrimary>
</MediaObject>
```

## Props

Extends `HTMLAttributes<HTMLDivElement>`; every attribute goes to the root.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `media` | `ReactNode` | – | **Required.** The image, illustration, avatar or chart. A direct `img` child is capped at its column's width and keeps its ratio; a direct `svg` is capped too, and scales evenly only with a `viewBox`. |
| `mediaPosition` | `'start' \| 'end'` | `'start'` | Which side the media sits on (left in LTR for `start`). |
| `mediaWidth` | `string` | `'auto'` | The media column as a grid track: `'auto'` (the media's own width), `'40%'`, `'320px'`, `'1fr'` (half and half). Sets `--uxm-media-object-media-width`. It's trusted CSS: an invalid track drops the two-column template, and the cells stack. |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | Vertical alignment of the two columns. |
| `gap` | `string \| number` | `24px` | Gap between the columns (and between the rows when stacked). Sets `--uxm-media-object-gap`. |
| `stackAt` | `480 \| 640 \| 768 \| 960 \| false` | `640` | The component's own container width at or below which it stacks to one column, in DOM order. `false` never stacks. |
| `children` | `ReactNode` | – | The content. |

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-media-object-gap` | – | `24px` | Column gap; row gap when stacked. |
| `--uxm-media-object-media-width` | – | `auto` | The media column's track. |

## States & variants

| State | Trigger | Layout |
|-------|---------|--------|
| Side by side | container wider than `stackAt` | Media column + content column. |
| Stacked | container at or below `stackAt` | One column: media above the content (`start`) or below it (`end`). For a hero that wants the illustration on top when stacked but at the end when wide, use `start` with the illustration first, or `stackAt={false}` and your own layout below the breakpoint. |

## Accessibility

- Layout only: a `div` with two `div` cells. The semantics are the children's: give a decorative illustration `alt=""`, an informative one a real `alt`.
- The DOM follows the visual order on both sides, so a screen reader and Tab reach the cells as they appear.
- **Give it a width to fill.** The root is a size container, so it contributes no width of its own: as a block it takes its container's width, but inside a flex row, a centred flex column (`align-items: center`) or any shrink-to-fit parent it collapses to nothing. Give it a width there (`width: 100%` of a sized parent, or `flex: 1`).
