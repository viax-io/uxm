# FieldError

The shared error-message renderer for the whole input family. Leads with an `exclamation-circle` icon — the same glyph `Banner` and `Toast` use for their error variant — so an error reads as an error without relying on colour.

**This is a structural helper, not a themable atom.** It deliberately introduces **no `.uxm-field-error` block class**: the message keeps its owning atom's own `uxm-{atom}__error-message` class, which is what carries the themable `--uxm-{atom}-error-color` / `--uxm-{atom}-error-message-size` variables and what preserves the studio's "Match in N other Inputs" sync. All this helper DRYs is the icon + text structure, so every field's error message is identical to the others — and to `Banner` and `Toast`.

## Usage

Consumed by input atoms, not usually by application code:

```tsx
import { FieldError } from '@viax/uxm/ui';

{error && (
  <FieldError className="uxm-input__error-message" id={errorId}>
    {error}
  </FieldError>
)}

// …and on the control itself:
<input aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} />
```

## Props

Does **not** extend a native attribute interface — this helper renders a fixed `<span>` structure and forwards nothing else.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | – | **Required.** The owning atom's own message class (`uxm-{atom}__error-message`). Not optional and not merged with a shared class — it *is* the styling hook. |
| `id` | `string` | – | Stable id so the owning control can point at the message via `aria-describedby`. |
| `children` | `ReactNode` | – | **Required.** The message text. |

## CSS variables

This component declares **none of its own**. The only rule it ships is the icon's static layout:

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| _(none)_ | – | – | – |

`.uxm-field-error__icon` is sized in `em` (`1em` square, `0.4em` inline-end margin, `-0.15em` baseline nudge) and painted with `currentColor`. That is the whole point of the design: the glyph inherits the per-atom message's `font-size` and `color` automatically, so the atom's own `errorMessageSize` and `errorColor` knobs move the icon too — with no extra CSS and no shared class to keep in sync.

To re-theme an error message, reach for the owning atom's variables (e.g. `--uxm-input-error-color`), not for anything here.

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| _(none directly)_ | – | Colour is inherited from the owning atom's error variables via `currentColor`. |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

None. `FieldError` has a single appearance; visibility is the caller's decision (render it or don't).

## Accessibility

- The icon is `aria-hidden="true"` — the message text already conveys the error to assistive tech, and a decorative glyph would only add noise.
- **The icon is why this helper exists.** Error state on a field is otherwise signalled by colour alone, which colourblind users can miss; the glyph is the redundant non-colour channel.
- Pass `id` and point the control at it with `aria-describedby`. `aria-invalid` alone announces *that* a field is wrong, never *why* — the two attributes are complementary and both belong on the control.
- The element is a plain `<span>` with no role: it is expected to be rendered inside a field whose label and `aria-invalid` carry the semantics.
