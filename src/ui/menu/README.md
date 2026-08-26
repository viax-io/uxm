# Menu (Action Menu)

Action / dropdown menu — a list of commands invoked from a **consumer-owned trigger** (a ⋮ `IconButton`, a `Button`, anything). Built on the headless `Popover` (positioning, portal, outside-click, Escape) with proper menu semantics (`role="menu"` / `menuitem` / `separator`) and arrow-key navigation that skips separators + disabled rows.

Distinct from `Listbox`/`Select` by design: a menu **holds no value** — picking a row runs its action and closes. Reach for `Listbox`/`Select` when the panel must *own* the chosen value; reach for `Menu` for row ⋮ actions, overflow menus, command lists, and **context switchers**.

A switcher is still a menu, not a select, for two independent reasons: switching context is an action with side effects (scope change, data reload) rather than filling a field, and the panel usually hosts a command too ("New workspace") which `role="listbox"` has no legal way to contain. Mark where the user already is with `current` — that *reflects* state owned elsewhere, it does not make the menu hold a value.

## Two shapes, one atom

`Menu` covers two usages. They share every line of DOM, ARIA, CSS and every
`--uxm-menu-*` knob — what differs is the **entries you pass** plus two framing
props. That is why this is one atom and not two: a second one could only
duplicate the variables (letting a switcher panel drift away from an action
menu in MODO) or wrap this one without adding code.

| | Action menu | Context switcher |
|---|---|---|
| Rows | every row is a command | contexts, plus a command below a separator |
| `current` | none | exactly one |
| Trigger | a ⋮ `IconButton` | a field that displays the value |
| `placement` | `"bottom-end"` (default) — aligns to the trailing ⋮ | `"bottom-start"` |
| `matchAnchorWidth` | leave off — matching a 32px trigger gives a 32px panel | `"min"` |

If you find yourself wanting a second `current` row, or wanting the panel to
*hold* the chosen value rather than reflect it, you've left `Menu` — see
`Listbox`/`Select`.

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

### As a context switcher

The command row ("New workspace") is the reason a switcher is a `Menu` and not a
`Select`: `role="listbox"` has no legal way to hold a row that selects nothing.

```tsx
const workspaces: MenuEntry[] = [
  { key: 'default', label: 'default', icon: 'product', onSelect: () => go('default') },
  // `iconColor` tints ONE row's glyph — for identity, not decoration.
  { key: 'support', label: 'support-triage', icon: 'product',
    iconColor: 'var(--color-category-composite)', current: true, onSelect: () => go('support') },
  { separator: true, key: 'sep' },
  { key: 'new', label: 'New workspace', icon: 'plus', onSelect: createWorkspace },
];

<Menu
  items={workspaces}
  aria-label="Switch workspace"
  placement="bottom-start"
  // Field-like trigger → tie the panel to it. `"min"` (not `true`) so a long
  // workspace name widens the panel instead of ellipsizing.
  matchAnchorWidth="min"
  renderTrigger={({ triggerProps }) => (
    <button {...triggerProps}>…</button>
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
| `minWidth` / `maxWidth` | `number` | `160` / `280` | Panel width bounds; long labels truncate past `maxWidth`. **The defaults apply only while `matchAnchorWidth` is off.** |
| `matchAnchorWidth` | `boolean \| "min"` | `false` | Tie the panel width to the trigger — see [Panel width](#panel-width). |
| `aria-label` | `string` | — | Accessible name for the panel. |
| `className` | `string` | — | Class on the wrapper that hosts the trigger. |
| `panelClassName` | `string` | — | Class on the portaled panel. |
| `panelStyle` | `CSSProperties` | — | Inline style on the portaled panel — the seam for pushing `--uxm-menu-*` overrides onto a panel that lives outside your subtree. |

### `MenuItem`

| Field | Type | Notes |
|-------|------|-------|
| `key` | `string` | Stable identity (React key + focus tracking). |
| `label` | `ReactNode` | Row content. In a two-line row this is the **headline**. |
| `subtitle` | `ReactNode` | Optional. When set, the row becomes **two lines** — `label` on top, `subtitle` beneath. |
| `icon` | `string` | Optional leading glyph. |
| `iconColor` | `string` | Optional per-row glyph colour, applied inline. For icons carrying **identity** (a workspace's colour), not decoration. Prefer `var(--color-*)`; a raw hex is only legitimate when the colour is entity *data*. Being inline it wins over the `color: inherit` that active/danger rows apply — so a `danger` row keeps this colour instead of folding to the danger tone. |
| `hint` | `ReactNode` | Optional trailing hint (e.g. `⌘C`). |
| `onSelect` | `() => void` | Invoked on click / Enter / Space; the menu closes after. |
| `disabled` | `boolean` | Greyed, skipped by keyboard nav. |
| `danger` | `boolean` | Destructive styling. |
| `current` | `boolean` | Marks the row the user is **on** — trailing ✓, heavier label, `aria-current="true"`. Composes with everything: a current row under the keyboard cursor reads as both. |

A separator is `{ separator: true, key? }`.

## Panel width

What the trigger *is* decides:

| Trigger | Setting | Why |
|---|---|---|
| Icon-only / ⋮ | `matchAnchorWidth` off (default) | Matching a 32px trigger gives a 32px panel. Width comes from content, clamped `160`–`280`, aligned to the trailing edge the ⋮ sits on (hence `placement: "bottom-end"`). `280` is also Material's documented menu maximum. |
| Field-like, displays a value | `matchAnchorWidth="min"` | The native `<select>` convention — the panel reads as a continuation of the control, not a separate floating card. `"min"` over `true` because user-authored labels outgrow a fixed width; `true` would ellipsize them. |

Setting `matchAnchorWidth` also **drops the `160`/`280` defaults**. `Popover` applies `maxWidth` unconditionally, so leaving `280` in place would paint a panel *narrower* than a trigger wider than 280 — and a `160` floor would make it wider than a narrow trigger.

Restoring bounds is **asymmetric**, because `Popover` treats the two differently:

- `maxWidth` — always honoured, in either mode.
- `minWidth` — honoured with `matchAnchorWidth={true}`, but **ignored with `"min"`**. That mode makes the *measured anchor width* the floor and discards whatever you pass, so you cannot demand a floor wider than the trigger there. Use `true` plus an explicit `minWidth` if you need one.

## CSS variables

Panel: `--uxm-menu-panel-{bg,border,radius,max-height}`, `--uxm-menu-shadow-{color,blur,offset-y}`, `--uxm-menu-list-padding`.

Row: `--uxm-menu-item-{gap,padding-x,padding-y,font-size,radius,color}`, `--uxm-menu-item-active-{bg,color}`, `--uxm-menu-item-disabled-opacity`, `--uxm-menu-item-danger-{color,active-bg}`.

Current row: `--uxm-menu-item-current-bg` (default `transparent` — a resting tint was tried and collided with the hover surface, whose own default is the obvious `--color-surface-alt`; the knob stays so a designer can opt in, and the rule order keeps hover on top either way) and `--uxm-menu-item-current-font-weight` (default `600`). Deliberately **no** colour var: the tone owns colour, `current` owns weight + ✓, so `--uxm-menu-item-color` and the danger tone keep reaching a current row and the ✓ inherits whatever the row paints.

Icon: `--uxm-menu-item-icon-color` — default **`--color-text-strong`**, not `--color-text-subtle`. Subtle measures 1.48:1 on the panel in the light theme (2.85:1 dark), below even the 3:1 non-text floor, and in practice fainter than a *disabled* row (which multiplies `--color-text` by 0.4) — a live glyph read as switched off.

Hint: `--uxm-menu-item-hint-{font-size,color}` — colour defaults to `--color-text-muted` — 2.54:1 on the panel in the **light** theme, below the 4.5:1 AA floor for text (dark measures 5.70:1 and passes). A deliberate, narrow exception: a hint is a redundant shortcut echo, the row is fully identified by its label without it, and nothing is lost if it goes unread. The subtitle refuses the same token for exactly the opposite reason. Don't unify the two.

Two-line row: `--uxm-menu-item-subtitle-font-size` (default `11px`), `--uxm-menu-item-subtitle-color` (default `--color-text-strong` — deliberately *not* the muted tone icons and hints use, which measures 2.54:1 on the panel in the light theme and would fail AA for real text), `--uxm-menu-item-subtitle-gap` (default `2px`, the space between headline and subtitle).

Separator: `--uxm-menu-separator-{color,margin}`.

The trailing ✓ (`.uxm-menu__item-checkmark`) has no vars of its own — it inherits the row's `color`, so tuning a row's text tunes its ✓ (same contract as Listbox's checkmark).

## Design tokens (MODO-configurable)

Panel bg/border read `--color-card` / `--color-border`; rows read `--color-text` with `--color-surface-alt` highlight; danger reads `--color-danger-{text,bg}`; icons and the subtitle read `--color-text-strong`; the hint reads `--color-text-muted`. Editing any of these in MODO re-tints every menu. A per-row `iconColor` is the one thing that escapes this — which is why it should carry a `var(--color-*)` reference unless the colour is genuinely entity data.

## States & variants

- **Row states:** default · active (keyboard highlight *or* hover, same `--active` class) · disabled · danger · current.
- **`current` composes, it isn't exclusive.** A row can be current *and* highlighted *and* danger. In CSS `--current` sits **before** `--active` on purpose: both are single-class selectors, so source order decides, and the highlight must win the surface while `--current` keeps contributing weight + ✓. Move it below `--active` and current rows stop highlighting.
- **A menu with a `current` row opens with nothing highlighted.** The `current` row already says where you are; lighting a second row competes with it, and since hover and keyboard highlight share one `--active` class, that row is indistinguishable from "your pointer is here". A menu **without** `current` still lights row one on open, exactly as before — so nothing changes for existing consumers, none of which pass `current`.
- **Except on a keyboard open.** Enter / Space / ArrowDown on the trigger always lands on the first row, `current` or not: otherwise ArrowDown-to-open would need a *second* ArrowDown just to enter the list. From "nothing highlighted", the first ArrowDown lands on the **first** row, not the second, and Enter / Space is a no-op.
- **Opening never follows `current`.** Even a keyboard-opened switcher starts at row one, not at the current row — menu semantics, not select semantics.
- **Two-line rows:** any item with a `subtitle` renders a `.uxm-menu__item-text` column (headline + subtitle). Single-line rows are unchanged (no wrapper element). On an active/danger row the subtitle inherits the row's text colour at **full strength** — no opacity is applied. Hierarchy comes from the smaller subtitle font instead, because an opacity multiplier composites 11px text toward the surface and can push it under AA.

## Accessibility

- WAI-ARIA menu-button pattern: `role="menu"` panel, `role="menuitem"` rows, `role="separator"` dividers; Enter/Space/ArrowDown open, arrows navigate (wrapping, skipping separators + disabled), Escape closes, focus restores to the trigger.
- **`current` uses `aria-current="true"`**, and the ✓ is `aria-hidden` (the attribute already carries the meaning). Not `aria-selected` — invalid on `menuitem`. Not `role="menuitemradio"` + `aria-checked` either, even though that is the canonical ARIA answer for "one of a set is checked in a menu": a radio set requires **every** member to carry `aria-checked`, which a flat `MenuEntry[]` cannot infer — consumers would have to pass `current: false` on each sibling, and forgetting one leaves a lone radio with no set, which is worse than no role at all. `aria-current` is also already this repo's idiom for "where you are" (`sidebar-nav-item`, `breadcrumb`, `calendar`). **Revisit `menuitemradio` if one panel ever needs two independent switcher sets.**
- The subtitle is plain descendant text inside the `menuitem`, so it's announced as part of the row's accessible name — keep it short and meaningful. A row carrying **both** a `subtitle` and a `hint` concatenates all three into one name ("Move to… Currently in Inbox ⌘M"), which gets unwieldy fast; if you need a long subtitle, put an explicit `aria-label` on the row's content or move the detail to `aria-describedby` so the *name* stays terse.
- The subtitle's resting colour is AA-compliant by default (see CSS variables). If you override `--uxm-menu-item-subtitle-color`, re-check it with the package's `contrastRatio()` helper — 11px text is body text for AA purposes and needs 4.5:1.
- **The subtitle (11px) and hint (12px) are floored against the global type scale.** Both sizes are AA-reasoned minimums, so their `font-size` is `max(<floor>, calc(<knob> * var(--type-scale, 1)))`: a Brand Settings base-size below 100% (down to 87.5% in the studio, 50% via the API) shrinks the rest of the menu but not these two; scaling **up** passes through. An explicit per-component knob value below the floor is floored too — lower it only with a deliberate contrast re-check.
