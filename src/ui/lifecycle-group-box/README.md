# LifecycleGroupBox

A frosted frame drawn around the sibling nodes of one lifecycle group. On an editable diagram it doubles as the drop zone for adding a member to that group.

Visual language of a *region* — no business logic. Position and size come from the consumer (the box is `position: absolute`), the same contract [`LifecycleEdgeLabel`](../lifecycle-edge-label/README.md) documents: the canvas owns geometry, the atom owns look and states. Sibling of `LifecycleConnector`, `LifecycleNodeCard`, `LifecycleTerminal`, `LifecycleMinimap`, and `LifecycleZoomControl`.

## Usage

```tsx
import { LifecycleGroupBox, LifecycleNodeCard } from '@viax.io/uxm/ui';
import { useState } from 'react';

function FulfillmentGroup({ rect, members }) {
  const [over, setOver] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <LifecycleGroupBox
        style={rect}                       // top / left / width / height — yours
        target={over}
        interactive
        onDragEnter={() => setOver(true)}
        onDragLeave={() => setOver(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          setOver(false);
          addMemberToGroup(e.dataTransfer.getData('node-id'));
        }}
        data-group-id="fulfillment"
      />
      {members.map((m) => (
        <LifecycleNodeCard key={m.id} kind="state" title={m.name} style={m.rect} />
      ))}
    </div>
  );
}
```

The box is a frame **behind** the cards it frames, not their container — render the members as siblings, not children.

## Props

Extends `HTMLAttributes<HTMLDivElement>` — any standard div attribute is forwarded to the root `<div>`. That is part of the contract rather than boilerplate: `onDragEnter` / `onDragOver` / `onDragLeave` / `onDrop` and the consumer's own `data-*` go straight on the box.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `target` | `boolean` | `false` | Drop-target highlight while a drag is over this group. |
| `interactive` | `boolean` | `false` | Whether the box can receive pointer events / drops. Read-only diagrams leave it off. |
| `children` | `ReactNode` | – | Usually none — see above. |
| `className` | `string` | – | Merged with the root class via `cn`. |
| _(any native div attribute)_ | – | – | Spread onto the root `<div>`. |

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-lifecycle-group-box-bg` | `--color-card` | – | The colour the frame frosts. The atom mixes it to **55%** itself, so this takes a plain colour, not a translucent one. |
| `--uxm-lifecycle-group-box-border-color` | `--color-border` | – | Frame border colour. |
| `--uxm-lifecycle-group-box-border-width` | – | `1px` | Frame border thickness. |
| `--uxm-lifecycle-group-box-radius` | – | `14px` | Corner radius. |
| `--uxm-lifecycle-group-box-padding` | – | `20px` | Inner padding — **also the value a canvas should inset its members by.** |
| `--uxm-lifecycle-group-box-blur` | – | `4px` | Backdrop blur. `0` gives a flat, unblurred frame. |
| `--uxm-lifecycle-group-box-target-color` | `--color-drop-target` → `--color-accent` | – | Drop-target outline colour. |
| `--uxm-lifecycle-group-box-target-width` | – | `2px` | Drop-target outline thickness. |
| `--uxm-lifecycle-group-box-target-offset` | – | `2px` | Drop-target outline offset. |

Two values are internal and deliberately **not** knobs: the inner ring that keeps the frost readable over a dot-grid, and the 55% frost ratio itself. The ratio lives in the stylesheet rather than in the fill value so that *frosted, not solid* is an invariant — a knob carrying the whole background could be set opaque, and the region would then read as a container.

`interactive` has no studio knob either: it changes hit-testing only, never paint, so a variant for it would be a toggle that moves nothing on the canvas.

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-card` | Surfaces / Card | Frame fill (55% mix) and the internal inset ring (60% mix). |
| `--color-border` | Borders / Border | Frame border. |
| `--color-drop-target` | – (semantic alias of Accent) | Drop-target outline. |

`--color-drop-target` is declared in `src/tokens/index.css` as `var(--color-accent)` and is intentionally **absent from `themeTokens`**: an entry there carries a light/dark hex pair, and pinning one would freeze the colour away from the accent it is meant to follow. Every canvas atom that can receive a drag reads the same token, so all drop highlights match and re-tint together; a consumer that wants a distinct drop colour sets that one variable.

## States & variants

| State | Trigger | Visual |
|-------|---------|--------|
| default | – | Translucent card tint over a blurred canvas, hairline border, inset ring. No pointer events. |
| interactive | `interactive` | Identical paint; the box accepts hover / drag / drop. |
| target | `target` | Adds an offset outline in the shared drop-target colour. |

Three decisions worth keeping:

- **Frosted, not solid.** A translucent card tint over the blurred canvas reads as a region; a solid fill makes the nodes inside look *nested*, which is a different semantic.
- **`pointer-events: none` by default.** The frame is absolutely positioned, so it paints *over* the members it frames. On a read-only diagram it must not swallow their hover or clicks; `interactive` is the only thing that turns it into a target.
- **No title slot.** A group's name is an editable, clickable pill on the frame's edge — a `Chip` the canvas positions above the box. This atom is the frame and grows no title zone.

## Accessibility

- Renders a plain `<div>` with no role — a decorative region frame. The parent canvas owns diagram a11y, as with the other lifecycle atoms.
- `interactive={false}` (the default) removes the box from pointer interaction entirely, frame included, so it can never intercept a member's hover or click.
- The drop-target outline is colour-only. Drag-and-drop needs a non-visual channel of its own (live-region announcement, a keyboard "move to group" command) — that belongs to the canvas, not to this atom.
- **Contrast of the drop-target outline.** `--color-drop-target` resolves to the brand accent, which measures **1.93:1** against `--color-surface` in the light theme (10.29:1 in dark) — under the 3:1 WCAG floor for a non-text UI indicator. That is the same trade the rest of the canvas already makes (`LifecycleNodeCard`'s active ring and `LifecycleConnector`'s active stroke are both plain accent), and the outline is a transient drag affordance rather than the only signal of a state. A consumer who needs the AA floor sets `--color-drop-target: var(--color-accent-bold)` (5.56:1 light) once, and every drop target on the canvas follows.
- Provide a keyboard-operable alternative to dropping. Pointer drag is not keyboard-operable by itself, and this atom adds no key handling.
- When the group name pill is rendered, it — not the box — carries the accessible name of the region.
