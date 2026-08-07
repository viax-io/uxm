# HoverTooltip

The behaviour layer the [`Tooltip`](../tooltip/README.md) atom deliberately lacks. It pairs a hover trigger (with an owned open-delay) and an optional truncation gate with [`Popover`](../popover/README.md) for positioning and portalling, then renders the existing `Tooltip` inside.

**Non-interactive by design**: it closes as soon as the pointer leaves the anchor, so the tooltip content can never be hovered or clicked. Use it for revealing a value, not for offering an action.

Its most common job is **showing the full text of something that visually truncates** — which is why `truncatedOnly` defaults to `true`.

## Usage

```tsx
import { HoverTooltip } from '@viax/uxm/ui';

// Only opens when the cell actually overflows.
<HoverTooltip content={row.description}>
  <span className="truncate">{row.description}</span>
</HoverTooltip>

// Always open on hover, regardless of truncation.
<HoverTooltip content="Delete permanently" truncatedOnly={false} placement="bottom">
  <IconButton aria-label="Delete"><Icon glyph="trash" /></IconButton>
</HoverTooltip>
```

`children` must be a **single `ReactElement` that accepts a `ref` and mouse/focus handlers** — the component clones it to attach `ref`, `onMouseEnter`, `onMouseLeave`, `onFocus` and `onBlur`. Any handlers already on the child are preserved and called first. A plain string, a fragment, or a component that drops `ref` will not work.

## Props

Does **not** extend a native attribute interface — the prop list is closed and nothing is spread onto the trigger beyond the wired handlers.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `ReactNode` | – | **Required.** What the tooltip shows — typically the full, un-truncated value. Nothing opens if this is `null`/`undefined`/`''`. |
| `children` | `ReactElement` | – | **Required.** The trigger. Cloned to receive a ref and the four handlers. |
| `placement` | `'top' \| 'bottom'` | `'top'` | Side the tooltip appears on. Maps to Popover's `top-start` / `bottom-start`. |
| `truncatedOnly` | `boolean` | `true` | Only open when the anchor actually overflows (`scrollWidth > clientWidth`). |
| `openDelay` | `number` | `300` | Milliseconds of hover/focus before opening. |
| `disabled` | `boolean` | – | Never open. |
| `showArrow` | `boolean` | – | Forwarded to the inner `Tooltip`. |

The truncation check measures **the anchor element itself**, so the element you wrap must be the one carrying the ellipsis CSS. Wrapping a padded parent instead will read as "not truncated" and the tooltip will never open.

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| _(none)_ | – | – | – |

`.uxm-hover-tooltip` is a **reset, not a skin**: it zeroes the popover panel's padding, background, border, radius and shadow so the inner `Tooltip` renders flush without a double border. All visual treatment — surface, text colour, arrow, radius — belongs to `Tooltip`, so re-theme through `--uxm-tooltip-*`.

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| _(none directly)_ | – | Colour and surface come from the nested `Tooltip`. |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State | Trigger | Behaviour |
|-------|---------|-----------|
| Idle | – | Nothing rendered beyond the trigger. |
| Pending | pointer enters / trigger focused | Timer armed for `openDelay` ms. |
| Open | timer elapses | `Tooltip` rendered in a portaled popover, positioned against the anchor. |
| Closed | pointer leaves / trigger blurs | Timer cleared and tooltip removed immediately — no close delay. |
| Suppressed | `disabled`, empty `content`, or `truncatedOnly` with no overflow | Never opens. |

A pending timer is cleared on unmount, so a component that disappears mid-delay cannot open a tooltip for an element that is gone.

## Accessibility

- **Focus opens it too.** `onFocus` / `onBlur` are wired to the same timer as the pointer handlers, so a keyboard-only user gets exactly the reveal a mouse user gets — this is what satisfies WCAG 1.4.13 (Content on Hover or Focus) for the *hoverable-equivalent* requirement.
- The popover is opened with `closeOnEscape={false}`, so **Escape does not dismiss it**. WCAG 1.4.13 asks that hover/focus content be dismissible without moving the pointer; here blur/mouse-leave is the only dismissal. For a tooltip that must be escapable, or whose content the user needs to hover (to select text or click a link), this component is the wrong tool.
- `role="presentation"` on the popover panel keeps the floating layer itself out of the accessibility tree. **The tooltip text is therefore not announced** — it is a visual affordance only. When the content carries meaning that is not already available, put it on the trigger with `aria-label` or `title`, or use `aria-describedby` pointing at your own element.
- With the default `truncatedOnly`, the tooltip is purely a convenience for sighted users reading clipped text: the DOM already contains the full string, so screen readers were never affected by the visual truncation.
- `restoreFocus={false}` — a tooltip must never move focus.
- The `openDelay` of 300 ms prevents tooltips firing while the pointer merely crosses an element.
