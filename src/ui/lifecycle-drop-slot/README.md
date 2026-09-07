# LifecycleDropSlot

The dashed slot that shows where a dragged node can land on a lifecycle canvas. Two shapes: **card**-sized, standing in for the node a drop would create, and **pill**-sized, standing in for the group.

Position, size and the drag handlers are the consumer's — the same contract [`LifecycleEdgeLabel`](../lifecycle-edge-label/README.md) documents. Sibling of `LifecycleGroupBox`, `LifecycleNodeCard`, `LifecycleConnector`, `LifecycleTerminal`, `LifecycleMinimap`, and `LifecycleZoomControl`.

## One appearance, no states

The slot exists only while it **is** the target: the canvas creates it for the hovered zone and removes it when the cursor leaves. Its appearance is the signal, so there is no quiet variant — and consequently nothing here has to stay legible at a contrast a faint placeholder could not carry. Text and dashes sit at `--color-accent-bold` on a flat `--color-accent-subtle` fill: **5.54:1** in the light theme, 8.54:1 in dark, so AA holds for the label; the dashes measure 5.56:1 / 12.33:1 against the canvas, clearing the 3:1 non-text floor.

## Usage

```tsx
import { LifecycleDropSlot } from '@viax.io/uxm/ui';

// A real drop zone — mounted while the drag hovers it, unmounted on leave.
<LifecycleDropSlot
  interactive
  style={{ width: 200 }}                        // width is yours
  onDragOver={(e) => e.preventDefault()}
  onDragLeave={() => setHoveredZone(null)}
  onDrop={(e) => insertNode(e.dataTransfer.getData('node-kind'))}
  data-zone={zoneId}
/>

// The placeholder showing the group a drop would mint — never a target itself.
<LifecycleDropSlot shape="pill" label="New group" />
```

## Props

Extends `HTMLAttributes<HTMLDivElement>` — any standard div attribute is forwarded to the root `<div>`, which is how `onDragOver` / `onDrop` / `onDragLeave` and the consumer's `data-*` get attached.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `shape` | `'card' \| 'pill'` | `'card'` | Node-sized rectangle, or group-pill sized. |
| `label` | `ReactNode` | – | Text. Without it a card shows the plus glyph alone. |
| `interactive` | `boolean` | `false` | Accepts drops. A card slot in a real drop zone passes `true`; a preview placeholder stays `false` so the drag can't flicker between it and the real slot. |
| `className` | `string` | – | Merged with the root class via `cn`. |
| _(any native div attribute)_ | – | – | Spread onto the root `<div>`. |

```ts
type LifecycleDropSlotShape = 'card' | 'pill';
```

`interactive` has **no studio knob**: it changes hit-testing only, never paint, and the editor canvas has no drag to demonstrate it with — a toggle for it would be a control that cannot show what it does. It is verified by hit-testing instead: off → `pointer-events: none`, on → `auto`.

**Width is not a prop.** The slot is `inline-flex` with horizontal padding only, so it takes its width from the consumer — set it to match the members it stands among, the way the canvas sizes every other lifecycle atom.

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-lifecycle-drop-slot-border-color` | `--color-accent-bold` | – | Dash colour. |
| `--uxm-lifecycle-drop-slot-color` | `--color-accent-bold` | – | Label / glyph colour. |
| `--uxm-lifecycle-drop-slot-bg` | `--color-accent-subtle` | – | Fill. Flat — what is set here is what paints. |
| `--uxm-lifecycle-drop-slot-border-style` | – | `dashed` | Outline style — `dashed` / `solid` / `dotted`, the same select `FileUpload`'s drop area exposes. |
| `--uxm-lifecycle-drop-slot-border-width` | – | `1px` | Outline thickness — **and the only lever on dash length**, see below. |
| `--uxm-lifecycle-drop-slot-card-radius` | – | `10px` | Corner radius, `card` shape. |
| `--uxm-lifecycle-drop-slot-card-padding-x` | – | `16px` | Horizontal padding, `card` shape. |
| `--uxm-lifecycle-drop-slot-card-font-size` | – | `12px` | Label size, `card` shape. |
| `--uxm-lifecycle-drop-slot-pill-radius` | – | `999px` | Corner radius, `pill` shape. Anything at or above half the height reads as a full pill. |
| `--uxm-lifecycle-drop-slot-pill-padding-y` | – | `4px` | Vertical padding, `pill` shape. |
| `--uxm-lifecycle-drop-slot-pill-padding-x` | – | `12px` | Horizontal padding, `pill` shape. |
| `--uxm-lifecycle-drop-slot-pill-font-size` | – | `13px` | Label size, `pill` shape. Matches `Chip` assist. |
| `--uxm-lifecycle-drop-slot-card-min-width` | – | `72px` | Card floor width, so a labelless slot can't collapse to its glyph. Width itself is the consumer's. |
| `--uxm-lifecycle-drop-slot-card-min-height` | `--uxm-lifecycle-node-card-min-height` (undeclared by default) | `64px` | Card height floor. Set to `0` when the canvas owns node geometry — see [Height](#height). |

Dashes and label are separate variables that **share one default**, so out of the box they read as a single signal. Move one and you are deliberately splitting the pair — keep both dark enough for the fill they sit on (see the contrast figures above).

The pill's `13px` label matches `--uxm-chip-assist-font-size`, which is what the real group pill is drawn with, so the placeholder doesn't change size on drop.

**There is no dash-pattern variable.** `border-style` and `border-width` are the two levers on how the edge reads, but neither sets a *pattern*: CSS derives a dashed border's dash length from its width and exposes no property for the pattern itself. A themable pattern would mean drawing the outline as an SVG stroke with `stroke-dasharray` instead of a border; `border-image` is not a substitute because it ignores `border-radius`.

## Height

A card slot standing among real members has to agree with them, so its height resolves through a chain rather than a number of its own:

```
--uxm-lifecycle-drop-slot-card-min-height   (this atom's own escape hatch)
  → --uxm-lifecycle-node-card-min-height    (the shared hook LifecycleNodeCard reads too)
    → 64px                                  (a node card's content height at default knobs)
```

**Nothing declares the middle link by default.** `LifecycleNodeCard` reads it with a `0` fallback, so its height stays content-driven; this atom reads it with a `64px` fallback, so a slot standing on its own is still node-sized. On the card it is also a studio knob ("Min Height", default `0`) — but the studio writes that on `.uxm-lifecycle-node-card`, a class selector, so it never reaches a sibling slot. For a whole row to agree the value has to come from a common ancestor: custom properties inherit *downward* only, and siblings can share one no other way.

**It is a floor, not a pin.** A node card grows past any floor when its own knobs grow — `titleSize: 18` / `kindSize: 14` / `paddingY: 20` measures **90px** — and those knobs are not wired to the hook. Deriving it with `calc()` from them would not work either: the studio publishes knob overrides on `.uxm-lifecycle-node-card`, so a `calc()` on a common ancestor would silently compute from the defaults.

So on a canvas that must keep rows even, set the height explicitly — the canvas already computes node rects to route connectors, so it is the one place that knows. Because `min-height` outranks a smaller `height`, zero the floor when doing that:

```tsx
<LifecycleDropSlot
  style={{ height: nodeHeight, width: nodeWidth, ['--uxm-lifecycle-drop-slot-card-min-height']: 0 }}
/>
```

`LifecycleNodeCard` needs no equivalent escape hatch — its own fallback is already `0`.

In a flex row the two agree anyway under the default `align-items: stretch`; the floor is what carries a slot standing on its own.

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-accent-bold` | Accent / Accent Bold | Dashes and text. |
| `--color-accent-subtle` | Accent / Accent Subtle | Fill. |

**Why not `--color-drop-target`.** [`LifecycleGroupBox`](../lifecycle-group-box/README.md) routes its target ring through that shared alias, and this atom deliberately does not. The alias resolves to `--color-accent`, which measures **1.92:1** as ink on this fill and 1.93:1 as a line against the canvas. The two atoms have different jobs: the group box draws a bare ring on the canvas, where a vivid hue reads, while this slot carries *text on a filled surface* and needs the dark end of the accent ramp. Routing it through the alias would also split the editor from production — the alias is declared in `tokens.css`, so its own `accent-bold` fallback can never paint, while the studio's knob default writes `accent-bold` inline.

Re-theme this atom through `--uxm-lifecycle-drop-slot-color` (or `--color-accent-bold`) rather than the drop-target alias.

## Accessibility

- Renders a plain `<div>` with no role, and the plus glyph is `aria-hidden` — the slot has no accessible name of its own. Diagram a11y belongs to the parent canvas, as with the other lifecycle atoms; give the slot an `aria-label` if it is exposed as a standalone control.
- `interactive={false}` (the default) removes it from pointer interaction entirely, outline included.
- Nothing here is conveyed by colour alone: the slot's *existence* is the state. There is no second appearance to tell apart from this one.
- Provide a keyboard alternative to dropping. Pointer drag is not keyboard-operable and this atom adds no key handling.
- Because the slot appears and disappears during a drag, announce the change through the canvas's own live region — a purely visual affordance is invisible to a screen-reader user.
