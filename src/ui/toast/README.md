# Toast / Toaster

Compact transient notifications docked in a screen corner. This folder ships two exports plus an imperative API:

- **`Toaster`** — the mechanics: portal, position, queue, per-item auto-dismiss timer. No visual chrome of its own.
- **`Toast`** — the look: one compact card row. Rendered by `Toaster`; direct JSX use is supported but rare.
- **`toast.*()`** — the imperative API, and the primary entry point.

This mirrors `Dialog`: the container owns mechanics, the child owns appearance.

**Toast vs Banner.** Toast is *transient* — it auto-dismisses after `duration` (default 4000 ms) and floats above the page. [`Banner`](../banner/README.md) is *persistent* and sits inline in page flow. Use Toast for after-the-fact feedback ("Saved", "Copied"), Banner for system states and announcements.

Visually the two are deliberately different: Banner tints its whole background with the variant colour, while Toast keeps a **neutral card surface** and communicates the variant through the **icon colour alone** — no stripe, no pill, no tinted background. Same family, different prominence.

## Usage

Mount `Toaster` once at the app root:

```tsx
import { Toaster } from '@viax/uxm/ui';

<Toaster position="bottom-right" max={3} />
```

Then fire from anywhere — no React context needed, since the API writes to a module-level store the `Toaster` subscribes to:

```tsx
import { toast } from '@viax/uxm/ui';

toast.success('Saved');
toast.error('Network error', { duration: 6000 });

// Persistent toast: opt out of the timer, dismiss by id later.
const id = toast.info('Uploading…', { duration: Infinity });
await upload();
toast.dismiss(id);

// With an inline action. Clicking it fires onClick AND dismisses.
toast.info('Message archived', {
  action: { label: 'Undo', onClick: () => restore() },
});
```

## Props — `Toaster`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `ToastPosition` | `'top-right'` | Which corner or edge the stack docks against. |
| `max` | `number` | `5` | Maximum concurrent toasts; the **oldest** are dropped when exceeded. |

```ts
type ToastPosition =
  | 'top-right' | 'top-left'
  | 'bottom-right' | 'bottom-left'
  | 'top-center' | 'bottom-center';
```

`Toaster` renders into `document.body` via a portal and returns `null` until mounted, so it is safe in an SSR tree.

## Props — `Toast`

Extends `Omit<HTMLAttributes<HTMLDivElement>, 'title'>` — any other standard div attribute is forwarded to the root.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `message` | `string` | – | **Required.** The notification text. A `string`, not `ReactNode` — it truncates to a single line. |
| `variant` | `'success' \| 'info' \| 'warning' \| 'error'` | `'info'` | Drives the icon glyph and accent colour. |
| `action` | `ToastAction` | – | Inline button between message and close. Clicking fires `action.onClick` **and** dismisses. |
| `onDismiss` | `() => void` | – | Renders the close button. `Toaster` always wires this up. |
| `dismissLabel` | `string` | `'Dismiss'` | Accessible label for the close button. |
| `className` | `string` | – | Merged with the root class via `cn`. |
| _(any native div attribute except `title`)_ | – | – | Spread onto the root `<div>`. |

```ts
type ToastVariant = 'success' | 'info' | 'warning' | 'error';
interface ToastAction { label: string; onClick: () => void }
interface ToastOptions { duration?: number; action?: ToastAction }
```

Variant → glyph mapping — the same vocabulary `Banner` uses:

| Variant | Glyph |
|---------|-------|
| `success` | `check-circle` |
| `info` | `info` |
| `warning` | `exclamation-triangle` |
| `error` | `exclamation-circle` |

## The `toast` API

| Call | Returns | Description |
|------|---------|-------------|
| `toast.success(message, options?)` | `string` (id) | Push a success toast. |
| `toast.info(message, options?)` | `string` (id) | Push an info toast. |
| `toast.warning(message, options?)` | `string` (id) | Push a warning toast. |
| `toast.error(message, options?)` | `string` (id) | Push an error toast. |
| `toast.dismiss(id)` | `void` | Remove one toast by the id returned above. |
| `toast.clear()` | `void` | Remove every toast at once. |

`options.duration` defaults to **4000 ms**. Pass `Infinity` for a persistent toast — the timer is skipped entirely (`Number.isFinite` guard), so it stays until dismissed by the user or by id.

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-toast-background-color` | `--color-card` | – | Card surface. Neutral by design — see above. |
| `--uxm-toast-color` | `--color-text` | – | Message text colour. |
| `--uxm-toast-border-color` | – | `transparent` | Outer border. **Off by default** — the shadow carries the lift in both themes; opt in by setting this. |
| `--uxm-toast-border-radius` | – | `10px` | Corner radius. |
| `--uxm-toast-padding-x` | – | `16px` | Horizontal padding. |
| `--uxm-toast-padding-y` | – | `12px` | Vertical padding. |
| `--uxm-toast-font-size` | – | `14px` | Message font size. |
| `--uxm-toast-icon-size` | – | `16px` | Rendered glyph size. Applied as CSS on the `svg`, which **wins over** the `Icon` component's inline `width`/`height` attributes — that is how the knob drives the glyph without plumbing a value through React props. |
| `--uxm-toast-success-accent` | `--color-success-text` | – | Icon + action colour, `success`. |
| `--uxm-toast-info-accent` | `--color-info-text` | – | Icon + action colour, `info`. |
| `--uxm-toast-warning-accent` | `--color-warning-text` | – | Icon + action colour, `warning`. |
| `--uxm-toast-error-accent` | `--color-danger-text` | – | Icon + action colour, `error`. |
| `--uxm-toast-close-hover-background-color` | – | `color-mix(in srgb, currentColor 10%, transparent)` | Close-button fill on hover. |
| `--z-toast` | – | `80` | Stack order of the container. |
| `--shadow-xl` | – | – | Card elevation (global shadow scale, not per-component). |

Each variant sets one internal `--accent`, consumed by both `__icon` and `__action`. As with `Banner`, the **variant key is `error`** while the token family is `danger`.

Container geometry (`380px` width, `24px` inset, `8px` gap between toasts) is layout-only and intentionally not themable.

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-card` | Surfaces / Card | Toast surface. |
| `--color-text` | Text / Text | Message text. |
| `--color-success-text` | Semantic / Success Text | `success` icon + action accent. |
| `--color-info-text` | Semantic / Info Text | `info` icon + action accent. |
| `--color-warning-text` | Semantic / Warning Text | `warning` icon + action accent. |
| `--color-danger-text` | Semantic / Danger Text | `error` icon + action accent. |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Variant | `variant="…"` | Sets `--accent`; icon and action button take that colour. Surface stays neutral. |
| Position | `Toaster position="…"` | Fixes the container to that corner; `*-center` also translates by −50%. |
| Enter (top docks) | mount | `uxm-toast-in` — fade + slide down 8px, 0.25s ease-out. |
| Enter (bottom docks) | mount | `uxm-toast-in-up` — fade + slide **up** 8px, so it rises from the edge it docks against. |
| With action | `action` set | Underlined accent-coloured button before the close X. |
| Action hover | pointer over `__action` | Underline thickens to 2px. |
| Close hover | pointer over `__close` | Full opacity plus a 10% `currentColor` wash (`--uxm-toast-close-hover-background-color`), so it reads on every variant and theme. |
| Overflow | more than `max` toasts | Oldest entries are trimmed. |
| Long message | text wider than the row | Truncates with an ellipsis — single line by design. |

## Accessibility

- The container is an `aria-live="polite"` / `aria-atomic="false"` region and each `Toast` additionally carries `role="status"`. The redundancy is deliberate: live-region support varies between screen-reader implementations.
- **Polite, never assertive.** Even `variant="error"` uses `role="status"`, unlike `Banner`, which escalates to `role="alert"` for errors. A transient corner notification that interrupts the current utterance is disruptive, and one that disappears after 4 seconds is the wrong place for something urgent. If a message *must* interrupt, use `Banner` with `variant="error"` or a `Dialog`.
- The icon slot is `aria-hidden="true"` — the variant must be evident from `message`, since colour and glyph are not announced.
- The container sets `pointer-events: none` so the gaps between toasts never swallow clicks meant for the page; each card re-enables them for its own surface only.
- Both buttons are real `<button type="button">` elements with visible `:focus-visible` outlines; the close button carries an `aria-label` (`dismissLabel`).
- **A 4-second default is short for a screen-reader or motor-impaired user.** For anything the user must act on, pass `duration: Infinity` and let them dismiss it, rather than relying on the timer.
- Enter animations are unconditional — there is no `prefers-reduced-motion` guard in this stylesheet. Consumers sensitive to that should override the `animation` property.
