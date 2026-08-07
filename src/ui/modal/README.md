# Modal

The standard modal panel surface — a compound atom with `Header` / `Body` / `Footer` slots. Renders **inside** a [`Dialog`](../dialog/README.md), which supplies the mechanics (backdrop, scroll-lock, focus trap, `role="dialog"`).

`.uxm-modal` is itself the visible surface: background, border, radius and shadow live on the root. Padding, however, applies to the header, body and footer rather than the root — that is what lets the dividing lines span edge-to-edge instead of stopping short at a padded boundary.

Compound slots rather than a `title` / `actions` prop pair let consumers compose freely: a confirmation skips the body, a wizard puts a stepper in the header.

## Usage

```tsx
import { Dialog, Modal, ButtonPrimary, ButtonTertiary } from '@viax/uxm/ui';

<Dialog open={open} onOpenChange={setOpen}>
  <Modal size="md" onClose={() => setOpen(false)}>
    <Modal.Header>Add step</Modal.Header>
    <Modal.Body>
      <p>Pick a step type to add to the lifecycle.</p>
    </Modal.Body>
    <Modal.Footer>
      <ButtonTertiary onClick={() => setOpen(false)}>Cancel</ButtonTertiary>
      <ButtonPrimary onClick={save}>Save</ButtonPrimary>
    </Modal.Footer>
  </Modal>
</Dialog>
```

A form that must only close through an explicit action — omit `onClose` so no X renders, and disable backdrop dismissal on the `Dialog`:

```tsx
<Dialog open={open} onOpenChange={setOpen} closeOnOutsideClick={false} closeOnEscape={false}>
  <Modal>
    <Modal.Header hideClose>Unsaved changes</Modal.Header>
    …
  </Modal>
</Dialog>
```

## Props — `Modal`

Extends `Omit<HTMLAttributes<HTMLDivElement>, 'title'>` — any other standard div attribute is forwarded to the root.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg' \| 'fullscreen'` | `'md'` | Panel width preset. |
| `onClose` | `() => void` | – | When set, `Modal.Header` renders a close X that calls it. Omit for forms that should close only via an explicit action. |
| `closeLabel` | `string` | `'Close'` | Accessible name for that X. Lives here rather than on `Modal.Header` because it belongs with `onClose`, and reaches the header through context. |
| `children` | `ReactNode` | – | **Required.** Usually the three slots. |
| `className` | `string` | – | Merged with the root class via `cn`. |
| _(any native div attribute except `title`)_ | – | – | Spread onto the root `<div>`. |

```ts
type ModalSize = 'sm' | 'md' | 'lg' | 'fullscreen';
```

| Size | Max width |
|------|-----------|
| `sm` | `360px` |
| `md` | `480px` |
| `lg` | `640px` |
| `fullscreen` | none — fills the `Dialog` panel, `height: 100%`, radius `0` |

## Props — `Modal.Header`

Extends `HTMLAttributes<HTMLDivElement>`. Forwards a ref.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | – | **Required.** Visible heading; rendered in an `<h2>` that receives the auto-generated title id. |
| `hideClose` | `boolean` | `false` | Suppress the close X even when `Modal` received `onClose`. |

## Props — `Modal.Body` / `Modal.Footer`

Both extend `HTMLAttributes<HTMLDivElement>` and forward a ref. No props of their own. The body scrolls (`overflow-y: auto`) and grows to fill the space between header and footer; the footer is a right-aligned flex row with an `8px` gap.

All three slots throw if rendered outside `<Modal>` — they read the title id and close handler from its context.

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-modal-background-color` | `--color-card` | – | Panel surface. |
| `--uxm-modal-border-color` | `--color-border` | – | Outer border **and both dividers** — one knob controls every chrome line. |
| `--uxm-modal-border-radius` | – | `12px` | Corner radius (forced to `0` at `fullscreen`). |
| `--uxm-modal-padding-x` | – | `20px` | Horizontal padding of header, body and footer. |
| `--uxm-modal-padding-y` | – | `16px` | Vertical padding of header, body and footer. |
| `--uxm-modal-title-size` | – | `16px` | Title font size. |
| `--uxm-modal-title-color` | `--color-text` | – | Title colour. |
| `--shadow-modal` | `--shadow-2xl` | – | Panel elevation. A **global** shadow token — designers tune elevation once at brand level, not per modal. |

Padding lands on the slots, not the root, so the header and footer dividers run edge to edge. The close button exposes nothing of its own — it composes [`IconButton`](../icon-button/README.md), so re-theme it through `--uxm-icon-button-*`.

Every knob routes through a `--uxm-modal-*` variable rather than being written as a plain declaration, so a studio save cannot outrank the var-based base rule — the live-edit freeze hazard the input family documents.

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-card` | Surfaces / Card | Panel surface. |
| `--color-border` | Borders / Border | Outer border and both dividers. |
| `--color-text` | Text / Text | Title colour. |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Size | `size="…"` | Sets the panel's max width; `fullscreen` also drops the radius and fills the height. |
| Closable | `onClose` set | Header renders a trailing close X. |
| Close suppressed | `hideClose` on the header | X omitted even though `onClose` is set — the handler still exists for other triggers. |
| Long title | title wider than the row | Truncates with an ellipsis rather than pushing the close button off the edge. |
| Overflowing body | content taller than the panel | Body scrolls; header and footer stay put. |

## Accessibility

- `Modal.Header` renders a real `<h2>` and gives it a `useId()` title id automatically — consumers never touch ids by hand.
- **Wire that id to the `Dialog`.** The root also sets `aria-labelledby` on itself, which covers the rare Modal-without-Dialog case (styling previews), but the element that needs the name is the one carrying `role="dialog"` — pass `aria-labelledby` to `Dialog` so the dialog is announced with its title rather than as a bare "dialog".
- The close button is an `IconButton` whose accessible name comes from `closeLabel` (default `"Close"`). It has no visible text, so translate it in a localised UI.
- Omitting `onClose` removes the X entirely. If you also disable the `Dialog`'s Escape and backdrop dismissal, the content itself becomes the only way out — always leave a visible, reachable Cancel.
- The title truncates visually but the full text stays in the accessible name, since truncation is CSS-only.
- Focus management, the trap and `aria-modal` belong to `Dialog`, not here. A `Modal` rendered outside a `Dialog` has none of them.
