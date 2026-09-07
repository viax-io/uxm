# Popover

A headless floating-panel primitive. It owns positioning, portal mounting, click-outside, Escape and optional focus management — and **no visual chrome at all**. Consumers style the panel through `className`.

This is the non-modal counterpart to [`Dialog`](../dialog/README.md): shells contribute positioning and z-index, the rendered child owns the look. `Listbox`, `Menu`, the `PhoneInput` country picker, `DateInput` and `HoverTooltip` all build on it.

**Trigger ownership stays with the consumer** — you pass a ref via `anchor` rather than a render prop. That is what makes composite fields like `PhoneInput` and `PillSelect`, where the trigger lives inside a larger field surface, wire-able without renderProp acrobatics.

## Usage

```tsx
import { Popover } from '@viax.io/uxm/ui';

const anchorRef = useRef<HTMLButtonElement>(null);
const [open, setOpen] = useState(false);

<>
  <button ref={anchorRef} onClick={() => setOpen((o) => !o)}>
    Options
  </button>

  <Popover
    open={open}
    onOpenChange={setOpen}
    anchor={anchorRef}
    placement="bottom-start"
    matchAnchorWidth="min"
    role="menu"
    aria-label="Options"
    className="my-panel-chrome"
  >
    …
  </Popover>
</>
```

Clicks **inside the anchor do not dismiss** — the consumer's own trigger handler toggles instead. That is why the example above can use a plain `onClick` toggle without the popover fighting it.

## Props

Does **not** extend a native attribute interface — the prop list is closed.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | – | **Required.** Controlled only. |
| `onOpenChange` | `(open: boolean) => void` | – | **Required.** Called with `false` on outside click or Escape. |
| `anchor` | `RefObject<HTMLElement \| null>` | – | **Required.** Element to position against, and part of the click-outside exclusion region. |
| `children` | `ReactNode` | – | **Required.** Only mounted while `open`. |
| `placement` | `'bottom-start' \| 'bottom-end' \| 'top-start' \| 'top-end'` | `'bottom-start'` | Preferred placement; flips if it would clip. |
| `offset` | `number` | `4` | Gap in px between anchor and panel edge. |
| `portal` | `boolean` | `true` | Render into `document.body`, escaping overflow / transform parents. |
| `matchAnchorWidth` | `boolean \| 'min'` | `false` | `true` pins `width` to the anchor's; `'min'` sets `minWidth` instead. |
| `minWidth` | `number` | – | Floor in px, when `matchAnchorWidth` is false. |
| `maxWidth` | `number` | – | Ceiling in px. |
| `closeOnEscape` | `boolean` | `true` | Escape anywhere dismisses. |
| `closeOnOutsideClick` | `boolean` | `true` | Mousedown outside anchor + panel dismisses. |
| `initialFocus` | `RefObject<HTMLElement \| null>` | – | Element focused on open (e.g. a search input). |
| `restoreFocus` | `boolean` | `true` | Restore focus to whatever was focused when it opened. |
| `role` | `string` | `'dialog'` | ARIA role on the panel. **Pickers should override** with `listbox` / `menu`. |
| `aria-label` / `aria-labelledby` | `string` | – | Accessible name for the panel. |
| `id` | `string` | – | Panel id — useful for `aria-controls` on the trigger. |
| `className` | `string` | – | Applied to the panel root. |
| `style` | `CSSProperties` | – | Merged **after** the computed position, so it can override placement. |

Returns `null` when closed or before mount — SSR-safe.

## Positioning

Always `position: fixed`, so transformed or clipped ancestors cannot break it.

- **Vertical flip**: if the preferred side lacks room for the panel and the opposite side has it, the panel flips. The resolved side is published as `data-placement` on the panel, so chrome can style the arrow or corner accordingly.
- **Horizontal clamp**: `left` is re-anchored if it would overflow either viewport edge, with a 4px margin.
- **Recomputed on** open, window resize, scroll in *any* ancestor (a capture-phase listener — `fixed` positioning means every scroll matters, not just window scroll), and on panel resize via `ResizeObserver` (a filtered list shortening would otherwise flip against stale dimensions).
- **No flash at 0,0**: `useLayoutEffect` positions before first paint, and the panel is `visibility: hidden` with `pointer-events: none` until the first measurement lands, so an unpositioned panel can never eat a click.

## Nested floating layers

A `Listbox` or `Select` opened *from inside* a popover portals to `document.body`, making it a DOM **sibling** of the panel rather than a descendant. A plain `contains()` check would read picking one of its options as an outside click and dismiss the parent. Popover therefore excludes anything matching `.uxm-popover` from outside-click dismissal — the same convention `Dialog` uses.

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-popover-z-index` | – | `50` | Stack order of the panel. |

That is the entire stylesheet, by design: `z-index` plus `outline: none`. Everything visible — background, border, radius, shadow, padding — belongs to whatever the consumer renders inside, or to the `className` they pass.

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| _(none)_ | – | The shell paints nothing. |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State | Trigger | Behaviour |
|-------|---------|-----------|
| Closed | `open={false}` | Renders `null`; cached position is cleared so a reopen recomputes. |
| Opening | first frame after open | `visibility: hidden` until measured, then visible. |
| Placed | after measurement | `data-placement` carries the **resolved** side, which may differ from the requested one. |
| Escape / outside click | per the two flags | Calls `onOpenChange(false)`. |

## Accessibility

- The panel defaults to `role="dialog"`, which is right for a genuine popover but **wrong for a picker** — a listbox or menu must override `role`, or assistive tech will mis-describe it. Pair the override with `aria-label` / `aria-labelledby`.
- Give the panel an `id` and point the trigger at it with `aria-controls` / `aria-expanded`; the trigger is the consumer's, so those attributes are the consumer's too.
- `restoreFocus` captures whatever was focused at open time and returns focus there on close. Since the anchor is the active element exactly when the user clicked it to open, this yields "restore to the anchor if the user opened it by click, otherwise leave focus alone" for free.
- **There is no focus trap** — that is `Dialog`'s job. A popover is non-modal: the rest of the page stays reachable and is not marked inert.
- `initialFocus` is worth setting whenever the panel has a primary input, so keyboard users are not forced to tab into it.
- The panel is not scroll-locked, so the page can scroll under it — the position updates to follow the anchor.
