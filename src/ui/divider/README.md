# Divider

A 1px horizontal separator, with an optional inline label that splits the line in two.

`Divider` has two render branches keyed off the `label` prop: without a label it renders a `<div role="separator" className="uxm-divider">` — a flat 1px bar in the border token. With a label it renders a flex `<div className="uxm-divider uxm-divider--with-label">` containing two `&__line` spans and a centered `&__label` span (uppercase, letter-spaced, muted). The labeled variant drops the `role="separator"` attribute; the unlabeled variant carries it.

## Usage

```tsx
import { Divider } from '@viax/uxm';

function Example() {
  return (
    <>
      <Divider />
      <Divider label="Section break" />
    </>
  );
}
```

## Props

### `DividerProps`

Extends `HTMLAttributes<HTMLDivElement>` — all native div attributes (`id`, `style`, `data-*`, `aria-*`) flow through to the root `<div>`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `ReactNode` | – | When provided, switches to the labeled layout (line · label · line). Accepts text or composite nodes. |
| `className` | `string` | – | Merged onto the root via `cn`. |
| _(any native div attribute)_ | – | – | Spread onto the root `<div>`. |

## CSS variables

The divider has no `--uxm-divider-*` custom properties — all colors and sizes are hardcoded against the design-token layer.

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-border` | Borders / Border | The 1px line (unlabeled root + each `&__line` half in the labeled variant). |
| `--color-text-muted` | Text / Text Muted | Label text color. |

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Unlabeled | `label` omitted | 1px flat bar in the border token; `role="separator"`. |
| Labeled | `label` provided | Flex row with two equal-flex lines and a centered uppercase label (`11px`, `600` weight, `0.08em` tracking). |

## Accessibility

- The unlabeled variant carries `role="separator"` so assistive tech announces the structural break.
- The labeled variant **omits** `role="separator"` because the flex container holds visible text content; the heading-style label communicates the break visually. Consumers needing programmatic semantics can re-add `role="separator"` with `aria-orientation` via `...rest`.
- No interactive elements — purely presentational.
- Label uses muted-text against the parent background; verify contrast when consumers override either token.
