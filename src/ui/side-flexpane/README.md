# SideFlexpane

A right-docked panel surface with an optional eyebrow + title header, an optional close button, an optional footer, and a drag-resizable left edge. Used for detail / properties / create panels that overlay or sit alongside a main view.

The pane is a semantic `<aside>` with `position: relative`, a card background, drop shadow, and rounded corners. A vertical `role="separator"` handle on the left edge supports both mouse drag and keyboard resize (Arrow Left/Right with Shift for larger steps). The resize state is intentionally session-local — once the user drags, an inline `width` style takes over until the next page reload, at which point the CSS rule (and any MODO editor-saved override) reclaims control. The `defaultWidth` prop is retained on the public API for forward compatibility but is not currently read for the visual default; the CSS `width: 380px` rule supplies it.

## Usage

```tsx
import { SideFlexpane, ButtonPrimary, ButtonTertiary } from '@viax/uxm';

function UserDetail({ user, onClose }) {
  return (
    <SideFlexpane
      eyebrow="User"
      title={user.name}
      onClose={onClose}
      footer={
        <>
          <ButtonTertiary onClick={onClose}>Cancel</ButtonTertiary>
          <ButtonPrimary onClick={save}>Save</ButtonPrimary>
        </>
      }
      minWidth={320}
      maxWidth={640}
    >
      {/* form fields */}
    </SideFlexpane>
  );
}
```

## Props

Extends `Omit<HTMLAttributes<HTMLDivElement>, 'title'>` (the `title` prop is taken over for the heading) — other standard attributes are forwarded to the root `<aside>`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `ReactNode` | – | **Required.** Heading text rendered as `<h3>`. |
| `eyebrow` | `ReactNode` | – | Small uppercase label above the title. |
| `onClose` | `() => void` | – | When provided, renders a close `IconButton` in the header. |
| `footer` | `ReactNode` | – | Bottom strip separated by a top border; typical use is button rows. |
| `children` | `ReactNode` | – | Body content; scrolls inside its own padded area. |
| `defaultWidth` | `number` | `380` | Initial width in px. Currently informational — CSS supplies the visual default. |
| `minWidth` | `number` | `280` | Minimum width during resize. |
| `maxWidth` | `number` | `720` | Maximum width during resize. |
| `resizable` | `boolean` | `true` | Renders the left-edge drag handle when true. |
| `className` | `string` | – | Merged with `uxm-side-flexpane` via `cn`. |
| `style` | `CSSProperties` | – | Consumer styles WIN over the resize-driven inline width — useful for locking width without disabling resize. |
| _(any native div attribute)_ | – | – | Spread onto the root `<aside>`. |

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-side-flexpane-padding-x` | – | `16px` | Horizontal padding for header, body, footer. |
| `--uxm-side-flexpane-padding-y` | – | `12px` (header/footer) / `16px` (body) | Vertical padding for header, body, footer. |
| `--uxm-side-flexpane-title-size` | – | `15px` | Title font size. |
| `--uxm-side-flexpane-label-color` | `--color-text-muted` | – | Eyebrow text colour. |

The root pane also reads `--shadow-xl` for its drop shadow and a hardcoded `--color-card` / `--color-border` for surface and border — these are not exposed as component-scoped knobs.

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-card` | Surfaces / Card | Pane background. |
| `--color-border` | Borders / Border | Pane border, header / footer divider. |
| `--color-text` | Text / Text | Title text. |
| `--color-text-muted` | Text / Text Muted | Eyebrow text (fallback). |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Default | – | Card background, rounded `8px`, `xl` shadow, width from CSS (`380px`). |
| Resizable | `resizable` (default) | 6px-wide handle on left edge with `col-resize` cursor; hover shows a soft accent tint. |
| Dragging | Mouse down on handle | Document-level `mousemove` updates width; document cursor pinned to `col-resize`, text selection disabled. |
| Keyboard resize | Focus handle + Arrow Left/Right | Arrow Left grows by 10px, Arrow Right shrinks by 10px; Shift accelerates to 50px. |
| With close | `onClose` provided | Close `IconButton` appears top-right of header. |
| With footer | `footer` provided | Bottom strip with top border; otherwise omitted entirely. |
| Header / body / footer padding | – | All three share the same `--padding-x` / `--padding-y` knobs by default. |

## Accessibility

- Renders a semantic `<aside>` — assistive tech announces it as a complementary region.
- Title is an `<h3>`; ensure it lands at the right depth in your page's heading hierarchy.
- Close affordance uses `IconButton` with `aria-label="Close"`.
- Resize handle implements the WAI-ARIA `separator` pattern: focusable (`tabIndex={0}`), `role="separator"`, `aria-orientation="vertical"`, `aria-label="Resize panel"`, and responds to Arrow keys per the windowsplitter spec. The component disables specific `eslint-plugin-jsx-a11y` rules that wrongly flag this otherwise-conformant shape.
- During drag the document's `user-select` is suspended to avoid accidental text selection — restored on mouseup.
- The pane does not trap focus — consumers should layer a focus-trap themselves when using the pane as a modal-style overlay.
- No `aria-valuenow` / `aria-valuemin` / `aria-valuemax` are exposed on the separator; screen-reader users get the resize affordance but no width feedback while dragging. Consider wiring those in a higher-level wrapper if exact width announcement is required.
