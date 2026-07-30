# Menu (Action Menu)

Action / dropdown menu — a list of commands invoked from a **consumer-owned trigger** (a ⋮ `IconButton`, a `Button`, anything). Built on the headless `Popover` (positioning, portal, outside-click, Escape) with proper menu semantics (`role="menu"` / `menuitem` / `separator`) and arrow-key navigation that skips separators + disabled rows.

Distinct from `Listbox`/`Select` by design: a menu has **no selected value and no checkmarks** — picking a row runs its action and closes the menu. Reach for `Listbox`/`Select` when you need to hold a chosen value; reach for `Menu` for row ⋮ actions, overflow menus, and command lists.

## Usage

```tsx
import { Menu, IconButton, Icon, type MenuEntry } from '@viax/uxm/ui';

const items: MenuEntry[] = [
  { key: 'edit', label: 'Edit', icon: 'pencil', onSelect: rename },
  // Two-line row: `label` is the headline, `subtitle` the supporting line.
  { key: 'move', label: 'Move to…', subtitle: 'Currently in “Inbox”', icon: 'folder', onSelect: move },
  { separator: true, key: 'sep' },
  { key: 'delete', label: 'Delete', subtitle: 'Remove permanently', icon: 'trash', danger: true, onSelect: remove },
];

<Menu
  items={items}
  aria-label="Row actions"
  renderTrigger={({ open, triggerProps }) => (
    <IconButton {...triggerProps} aria-label="Open actions menu">
      <Icon glyph="kebab" size={18} />
    </IconButton>
  )}
/>;
```

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `items` | `MenuEntry[]` | — | Rows + separators, in display order. |
| `renderTrigger` | `(api: { open, triggerProps }) => ReactNode` | — | Spread `triggerProps` onto your interactive element — wires ref + click + ARIA. |
| `placement` | `PopoverPlacement` | `"bottom-end"` | Preferred placement; flips on overflow. |
| `open` / `onOpenChange` | `boolean` / `(open) => void` | uncontrolled | Controlled open state. |
| `minWidth` / `maxWidth` | `number` | `160` / `280` | Panel width bounds; long labels truncate past `maxWidth`. |
| `aria-label` | `string` | — | Accessible name for the panel. |

### `MenuItem`

| Field | Type | Notes |
|-------|------|-------|
| `key` | `string` | Stable identity (React key + focus tracking). |
| `label` | `ReactNode` | Row content. In a two-line row this is the **headline**. |
| `subtitle` | `ReactNode` | Optional. When set, the row becomes **two lines** — `label` on top, `subtitle` beneath. |
| `icon` | `string` | Optional leading glyph. |
| `hint` | `ReactNode` | Optional trailing hint (e.g. `⌘C`). |
| `onSelect` | `() => void` | Invoked on click / Enter / Space; the menu closes after. |
| `disabled` | `boolean` | Greyed, skipped by keyboard nav. |
| `danger` | `boolean` | Destructive styling. |

A separator is `{ separator: true, key? }`.

## CSS variables

Panel: `--uxm-menu-panel-{bg,border,radius,max-height}`, `--uxm-menu-shadow-{color,blur,offset-y}`, `--uxm-menu-list-padding`.

Row: `--uxm-menu-item-{gap,padding-x,padding-y,font-size,radius,color}`, `--uxm-menu-item-active-{bg,color}`, `--uxm-menu-item-disabled-opacity`, `--uxm-menu-item-danger-{color,active-bg}`, `--uxm-menu-item-icon-color`, `--uxm-menu-item-hint-{font-size,color}`.

Two-line row: `--uxm-menu-item-subtitle-font-size` (default `11px`), `--uxm-menu-item-subtitle-color` (default `--color-text-muted`), `--uxm-menu-item-subtitle-gap` (default `2px`, the space between headline and subtitle).

Separator: `--uxm-menu-separator-{color,margin}`.

## Design tokens (MODO-configurable)

Panel bg/border read `--color-card` / `--color-border`; rows read `--color-text` with `--color-surface-alt` highlight; danger reads `--color-danger-{text,bg}`; icons/hints/subtitle read `--color-text-subtle` / `--color-text-muted`. Editing any of these in MODO re-tints every menu.

## States & variants

- **Row states:** default · active (keyboard highlight *or* hover, same `--active` class) · disabled · danger.
- **Two-line rows:** any item with a `subtitle` renders a `.uxm-menu__item-text` column (headline + subtitle). Single-line rows are unchanged (no wrapper element). On an active/danger row the subtitle tracks the row's text colour at reduced opacity so it stays legible while reading as secondary.

## Accessibility

- WAI-ARIA menu-button pattern: `role="menu"` panel, `role="menuitem"` rows, `role="separator"` dividers; Enter/Space/ArrowDown open, arrows navigate (wrapping, skipping separators + disabled), Escape closes, focus restores to the trigger.
- The subtitle is plain descendant text inside the `menuitem`, so it's announced as part of the row's accessible name — keep it short and meaningful.
