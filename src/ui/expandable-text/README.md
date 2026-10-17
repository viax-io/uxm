# ExpandableText

Display-only long text: wraps in full up to `lines` lines, then clamps behind a "Show more" / "Show less" link.

It exists for the paragraph-long description that lands in a side pane or detail view. Truncating it to one ellipsised line hides the point of the text; letting it run unbounded pushes everything below it off screen. `ExpandableText` shows the first few lines in full and puts the rest one click away — and only offers that click when there *is* a rest. Short text renders exactly as a plain block of text, with no toggle.

For text the user can also **edit** in place, use [`EditableCell type="textarea"`](../editable-cell/README.md), which shares this atom's clamp and toggle.

## Usage

```tsx
import { ExpandableText } from '@viax.io/uxm';

<ExpandableText lines={3} moreLabel={t('showMore')} lessLabel={t('showLess')}>
  {entity.description}
</ExpandableText>
```

Controlled, when the surrounding UI needs to know (or remember) the state:

```tsx
const [expanded, setExpanded] = useState(false);

<ExpandableText expanded={expanded} onExpandedChange={setExpanded}>
  {description}
</ExpandableText>
```

### The words are yours

The atom ships no message catalogue. `moreLabel` and `lessLabel` default to English (`"Show more"`, `"Show less"`) and are the consuming app's copy — pass your translation, the same way `DateInput` takes `clearLabel`.

### Paragraphs and long tokens

The content is `white-space: pre-wrap`, so a newline in the source stays a line break and a blank line stays a paragraph gap. `overflow-wrap: anywhere` lets an unbroken token (a URL, an id) wrap instead of widening its container.

## When the toggle appears

The toggle is rendered **only when the collapsed text actually overflows** — measured as `scrollHeight > clientHeight + 1` on the clamped block and re-measured by a `ResizeObserver`, so resizing the pane or changing the text re-evaluates it. While **expanded** it is always rendered, so an open text can be collapsed again even if a resize later made it fit.

Hosts without `ResizeObserver` (jsdom, an old embedded webview) get the one-off measurement on mount and on every content / `lines` change, but no live re-measure on resize.

## Props

Extends `HTMLAttributes<HTMLDivElement>` — any standard div attribute (id, style, title, data-*, aria-*) is forwarded to the root.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | – | **Required.** The text. |
| `lines` | `number` | `4` | Lines shown before the clamp. Non-finite or below 1 falls back to `4`. |
| `expanded` | `boolean` | – | Controlled expanded state. |
| `defaultExpanded` | `boolean` | `false` | Initial state when uncontrolled. |
| `onExpandedChange` | `(expanded: boolean) => void` | – | Fires with the next state on every toggle, controlled or not. |
| `moreLabel` | `string` | `"Show more"` | Toggle label while collapsed. |
| `lessLabel` | `string` | `"Show less"` | Toggle label while expanded. |
| `className` | `string` | – | Merged with the root class via `cn`. |
| _(any native div attribute)_ | – | – | Spread onto the root `<div>`. |

## DOM

```html
<div class="uxm-expandable-text [uxm-expandable-text--expanded]">
  <div class="uxm-expandable-text__content [uxm-expandable-text__content--clamped]"
       id="…" style="-webkit-line-clamp: 4">…text…</div>
  <button type="button" class="uxm-expandable-text__toggle" aria-expanded="false" aria-controls="…">
    Show more <svg …/>
  </button>
</div>
```

- The clamp lives on a **non-button block** (`__content`). Chrome will not `-webkit-line-clamp` a `<button>`, which is why `EditableCell type="textarea"` also puts the clamp on an inner span rather than on its click-to-edit button.
- The line count is an **inline `-webkit-line-clamp` number**, not a CSS variable: the property does not reliably accept `var()` in every engine, so this is the one dynamic value that cannot ride a custom property.
- The toggle reads as a **link under the text** — borderless, accent-coloured, its left edge flush with the text — not as a bordered or centred button.

## CSS variables

Four of the knob names (`color`, `fontSize`, `lineHeight`, `gap`) are real CSS properties, so the atom is mapped explicitly in `PER_COMPONENT_MAPPING`; without that a saved brand would publish bare properties on the root that the toggle never inherits.

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-expandable-text-color` | `--color-text` | – | Text colour. |
| `--uxm-expandable-text-font-size` | – | `14px` (× `--type-scale`) | Text size. |
| `--uxm-expandable-text-line-height` | `--type-body-line-height` | `1.5` | Text line height. |
| `--uxm-expandable-text-gap` | – | `4px` | Space between the text and the toggle. |
| `--uxm-expandable-text-toggle-color` | `--color-accent-bold` | – | Toggle colour. |
| `--uxm-expandable-text-toggle-hover-color` | `--color-accent-bold` mixed 30% toward `--color-text` | – | Toggle colour on hover. |
| `--uxm-expandable-text-toggle-font-size` | – | `13px` (× `--type-scale`) | Toggle size. |
| `--uxm-expandable-text-toggle-font-weight` | `--font-weight-medium` | `500` | Toggle weight. |
| `--uxm-expandable-text-toggle-gap` | – | `4px` | Space between the label and the chevron. |
| `--uxm-expandable-text-toggle-padding-y` | – | `2px` | Vertical hit-area padding of the toggle. |
| `--uxm-expandable-text-toggle-radius` | – | `4px` | Toggle corner radius (focus ring). |
| `--uxm-expandable-text-focus-ring` | `--color-accent` | – | Toggle focus ring. |

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-text` | Text / Text | Text colour; hover mix target. |
| `--color-accent-bold` | Accent / Accent Bold | Toggle text. |
| `--color-accent` | Accent / Accent | Toggle focus ring. |
| `--type-scale`, `--type-body-line-height` | Typography | Global size multiplier and body line height. |

## States & variants

| State | Trigger | Visual |
|-------|---------|--------|
| Collapsed | default | Text clamped to `lines`, "Show more" + chevron-down beneath (only if it overflows). |
| Expanded | `expanded` / click | Full text, "Show less" + chevron-up beneath. |
| Fits | text shorter than `lines` | Plain text, no toggle. |
| Toggle hover | pointer | Colour firms up and underlines. |
| Toggle focus | keyboard | 2px accent ring, 2px offset. |

The studio forces the toggle's hover / focus states with `uxm-expandable-text--state-hover` / `--state-focus` on the root; they share their selectors with the real `:hover` / `:focus-visible` rules.

## Accessibility

- The toggle is a real `<button>` with `aria-expanded` and `aria-controls` pointing at the content block, so it is keyboard-operable (Tab, Enter, Space) and its state is exposed. Its visible label also changes with the state, as the original pane implementation did.
- **Contrast:** the toggle is text, so it reads `--color-accent-bold` (5.16:1 on the light surface), not `--color-accent`, which fails 4.5:1. If you override `--uxm-expandable-text-toggle-color`, check it the same way.
- The text is ordinary flow content in the document order; clamping is visual only — assistive technology reads the whole text regardless of the clamp.
- A visible `:focus-visible` ring is always present on the toggle.
