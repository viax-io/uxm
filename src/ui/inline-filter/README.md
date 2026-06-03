# InlineFilter

A horizontal toolbar that lays out a search field, a row of filter controls, and a trailing slot on a single line — the standard "above-the-list" filter bar shape.

`InlineFilter` is a layout-only component: it owns no colours, borders, or typography of its own. It accepts three independent slots (`search`, `filters`, `trailing`) and renders each in a `<div>` with a fixed flex behaviour. Anything you pass in (`InputWithIcon`, `FilterTabs`, button groups, etc.) keeps its own styling.

## Usage

```tsx
import { InlineFilter, InputWithIcon, FilterTabs, ButtonPrimary, Icon } from '@viax/uxm';

function Example() {
  return (
    <InlineFilter
      search={
        <InputWithIcon
          type="search"
          icon={<Icon glyph="search" />}
          placeholder="Search…"
        />
      }
      filters={
        <FilterTabs
          options={[
            { value: 'all', label: 'All' },
            { value: 'active', label: 'Active' },
          ]}
        />
      }
      trailing={<ButtonPrimary onClick={() => add()}>New</ButtonPrimary>}
    />
  );
}
```

## Props

### `InlineFilterProps`

Extends `HTMLAttributes<HTMLDivElement>` — any standard div attribute (id, style, data-*, aria-*) is forwarded to the root.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `search` | `ReactNode` | – | Leading slot. Fixed-width-ish (`flex: 0 1 220px`) so the search field doesn't grow to fill the bar. Not rendered when omitted. |
| `filters` | `ReactNode` | – | Middle slot. Grows to fill remaining space (`flex: 1`). Not rendered when omitted. |
| `trailing` | `ReactNode` | – | Right slot. Pinned to the end via `margin-left: auto`. Not rendered when omitted. |
| `className` | `string` | – | Merged with the root class via `cn`. |
| _(any native div attribute)_ | – | – | Spread onto the root `<div>`. |

## CSS variables

The component defines no custom properties — layout is hard-coded for predictability.

| Property | Value | Affects |
|----------|-------|---------|
| `gap` | `12px` | Gap between slots. |
| `width` | `100%` | Bar spans its container. |
| `align-items` | `center` | Vertical centring of slot contents. |

If you need to tweak the bar (e.g. wider search slot), wrap or extend rather than override — the slots are simple flex children.

## Design tokens (MODO-configurable)

InlineFilter is layout-only and references no design tokens directly. Each slot inherits its own theming from whatever component you place inside it.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| All three slots | All props provided | Search (220px-ish) \| filters (flex) \| trailing (pushed right). |
| Search only | Only `search` set | Single 220px-ish field; nothing in the middle or right. |
| Filters only | Only `filters` set | Flex-fill row across the full bar. |
| Trailing only | Only `trailing` set | Single control pinned to the right edge. |
| Empty | No slots provided | Empty `<div>` (no children rendered). |

## Accessibility

- The root is a plain `<div>` with no implicit landmark role. If this bar is a primary control region, wrap it in a `<section aria-label="Filters">` or pass `role="toolbar"` + `aria-label` via the spread props.
- No keyboard interaction is implemented at the bar level — each slot's contents own their own keyboard behaviour.
- Tab order follows DOM order: search → filters → trailing. Visually reorder via flex if you need a different navigation flow, but be aware tab order will diverge from the visual layout.
- For long filter chip lists inside `filters`, consider rendering an overflow menu rather than letting the row wrap — the layout assumes a single line.
