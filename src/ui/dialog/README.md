# Dialog

The mechanics of a centred, blocking floating layer. `Dialog` renders **no visible chrome of its own** — background, padding and shadow come from whatever the consumer renders inside it, typically a [`Modal`](../modal/README.md).

This mirrors the `Popover` / `Listbox` precedent: the shell is invisible behaviour, the rendered child owns the look. What the shell contributes is:

1. A backdrop covering the viewport, dimmed and blurred via global tokens.
2. Body scroll-lock while open.
3. A focus trap inside the panel — Tab cycles and cannot escape.
4. `role="dialog"` + `aria-modal="true"` on the panel.
5. Focus-on-open and focus-restore-on-close.

Backdrop styling is **global** (`--backdrop-color` / `--backdrop-blur`), not per-dialog, so every dialog in the app feels the same and designers tune it once at the brand level.

## Usage

```tsx
import { Dialog, Modal, ButtonPrimary, ButtonTertiary } from '@viax.io/uxm/ui';

const [open, setOpen] = useState(false);

<Dialog open={open} onOpenChange={setOpen}>
  <Modal size="md" onClose={() => setOpen(false)}>
    <Modal.Header>Add step</Modal.Header>
    <Modal.Body>…</Modal.Body>
    <Modal.Footer>
      <ButtonTertiary onClick={() => setOpen(false)}>Cancel</ButtonTertiary>
      <ButtonPrimary onClick={save}>Save</ButtonPrimary>
    </Modal.Footer>
  </Modal>
</Dialog>
```

Directing initial focus somewhere other than the first focusable element:

```tsx
const searchRef = useRef<HTMLInputElement>(null);

<Dialog open={open} onOpenChange={setOpen} initialFocus={searchRef}>
  <Modal>
    <Modal.Body><Input ref={searchRef} placeholder="Search…" /></Modal.Body>
  </Modal>
</Dialog>
```

A destructive flow that must not be dismissed by accident:

```tsx
<Dialog open={open} onOpenChange={setOpen} closeOnOutsideClick={false} closeOnEscape={false}>
  …
</Dialog>
```

## Props

Does **not** extend a native attribute interface — the prop list is closed.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | – | **Required.** Controlled only; there is no uncontrolled mode. |
| `onOpenChange` | `(open: boolean) => void` | – | **Required.** Called with `false` when the user requests close (Escape, backdrop click). |
| `children` | `ReactNode` | – | **Required.** Panel content. Usually a `<Modal>`. |
| `closeOnEscape` | `boolean` | `true` | Escape dismisses. |
| `closeOnOutsideClick` | `boolean` | `true` | Backdrop clicks dismiss. |
| `initialFocus` | `RefObject<HTMLElement \| null>` | – | Element focused on open. Without it, focus moves to the first focusable element in the panel. |
| `returnFocus` | `boolean` | `true` | Restore focus to the previously-active element on close. |
| `aria-labelledby` | `string` | – | Id of the labelling element, usually the title. |
| `aria-describedby` | `string` | – | Id of the describing element. |
| `className` | `string` | – | Applied to the **panel**, not the root or backdrop. |

Returns `null` when closed or before mount, and portals into `document.body` — safe in an SSR tree.

**Single-modal only (v1).** A module-level counter warns to the console if more than one `Dialog` is open at once; stacked behaviour is undefined. Stacking would need a refcount plus per-layer z-index increments.

**Nested floating layers are handled.** Popovers and Listboxes opened *inside* a dialog portal to the body, making them siblings of the panel rather than descendants — a bare `contains()` check would dismiss the dialog when the user picks a select option. The dismiss logic excludes `.uxm-popover` for exactly this reason.

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--z-dialog` | – | `60` | Stack order of the whole layer. |
| `--backdrop-color` | – | `rgba(0, 0, 0, 0.50)` | Backdrop fill. **Global, not per-dialog.** |
| `--backdrop-blur` | – | `4px` | Backdrop blur radius. **Global, not per-dialog.** |

The shell exposes no `--uxm-dialog-*` variables at all — that is the design. Everything visible belongs to the child surface, so re-theme through `--uxm-modal-*` instead.

Fixed layout values, deliberately not knobs: the root's `24px` padding and the panel's `calc(100vw - 48px)` / `calc(100vh - 48px)` ceilings. The root scrolls (`overflow-y: auto`) so a tall panel scrolls within the viewport while the page behind stays locked.

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| _(none from `themeTokens`)_ | – | The backdrop reads the global `--backdrop-*` variables, which are not `--color-*` entries. |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State | Trigger | Behaviour |
|-------|---------|-----------|
| Closed | `open={false}` | Renders `null` — nothing is in the DOM. |
| Open | `open={true}` | Portals the layer, locks body scroll, traps focus, sets `data-state="open"` on the root. |
| Escape | key press, `closeOnEscape` | Calls `onOpenChange(false)`. |
| Backdrop click | pointer down outside the panel, `closeOnOutsideClick` | Calls `onOpenChange(false)`. |
| Close | `open` → `false` | Releases scroll lock and trap; restores focus if `returnFocus`. |

## Accessibility

- The panel carries `role="dialog"` and `aria-modal="true"`, so assistive tech treats the rest of the page as inert while it is open.
- **Pass `aria-labelledby`.** A dialog with no accessible name is announced as just "dialog". `Modal.Header` generates a title id for exactly this purpose — wire it through, or use `aria-label` on your own surface.
- Focus moves into the panel on open and is restored to the previously-focused element on close (`returnFocus`, default on) — the behaviour keyboard users depend on for not losing their place.
- The panel is `tabIndex={-1}` so the trap can park focus on it when there are no focusable children; focus still cannot escape.
- `initialFocus` matters more than it looks. The default lands on the first focusable element, which is often Cancel or the close X — fine for a confirmation, wrong for a search dialog that should be ready to type into.
- The backdrop is `aria-hidden="true"` and is not itself clickable-by-keyboard; Escape is the keyboard equivalent of a backdrop click. **Turning off both `closeOnEscape` and `closeOnOutsideClick` leaves the rendered content as the only way out** — make sure it has a visible, reachable Cancel.
- Body scroll is locked while open, so the page behind cannot be scrolled away under the dialog.
