import type { ComponentDef } from '../../types';

export const menuDef: ComponentDef = {
  id: 'menu',
  name: 'Menu (Action Menu)',
  category: 'Inputs',
  description:
    "Action / dropdown menu — a list of commands invoked from a consumer-owned trigger (a ⋮ IconButton, a Button, anything). Built on the same headless Popover as Listbox (positioning, portal, outside-click, Escape) but with menu semantics (role=menu / menuitem / separator) and NO selected-value state: pick a row → run its action → dismiss. Reach for Listbox/Select when you need to HOLD a chosen value; reach for Menu for row ⋮ actions, overflow menus, and command lists. Supports leading icons (optionally tinted per row via the item's iconColor), trailing hints (e.g. shortcuts), optional two-line rows (a headline label + a supporting subtitle), separators, disabled rows, destructive (danger) items, and a Current row for context switchers — a workspace / scope / view picker (aria-current + a trailing checkmark + heavier label — it REFLECTS where the user is, it does not hold a value). Panel width follows the trigger when matchAnchorWidth is set (a field-like switcher trigger) and comes from content otherwise (a kebab trigger). The Shape picker swaps the live panel between the atom's two shapes — row actions (every row a command, destructive last, kebab trigger, default bottom-end) and a context switcher (sibling contexts plus one command under a separator, exactly one Current row, field trigger, matchAnchorWidth='min' + bottom-start). Both share every knob and class; only the entries differ. This entry themes the PANEL + rows; the trigger is owned entirely by the consumer's renderTrigger.",
  styleProperties: [
    // Panel chrome — the floating card.
    { key: 'panelBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'panel' },
    { key: 'panelBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'panel' },
    { key: 'panelRadius', label: 'Radius', control: 'slider', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px', section: 'panel' },
    { key: 'panelMaxHeight', label: 'Max Height', control: 'number', defaultValue: 360, min: 120, max: 600, step: 20, unit: 'px', section: 'panel' },

    // Drop shadow — decomposed into Color / Blur / Offset Y instead of a
    // raw `box-shadow` text field, so designers tune it with a colour
    // picker + sliders. Same pattern as the Calendar atom; the box-shadow
    // is composed from these three vars in styles.css. Defaults match the
    // floating-panel elevation (0 6px 20px rgba(0,0,0,0.10)).
    { key: 'shadowColor', label: 'Color', control: 'color', defaultValue: 'rgba(0, 0, 0, 0.10)', section: 'shadow' },
    { key: 'shadowBlur', label: 'Blur', control: 'slider', defaultValue: 20, min: 0, max: 48, step: 1, unit: 'px', section: 'shadow' },
    { key: 'shadowOffsetY', label: 'Offset Y', control: 'slider', defaultValue: 6, min: 0, max: 24, step: 1, unit: 'px', section: 'shadow' },

    // Item row — sizing knobs apply across all states.
    { key: 'itemPaddingX', label: 'Padding X', control: 'number', defaultValue: 10, min: 4, max: 20, step: 1, unit: 'px', section: 'item' },
    { key: 'itemPaddingY', label: 'Padding Y', control: 'number', defaultValue: 7, min: 2, max: 14, step: 1, unit: 'px', section: 'item' },
    { key: 'itemFontSize', label: 'Font Size', control: 'number', defaultValue: 13, min: 10, max: 18, step: 1, unit: 'px', section: 'item' },
    { key: 'itemRadius', label: 'Radius', control: 'slider', defaultValue: 4, min: 0, max: 12, step: 1, unit: 'px', section: 'item' },

    // Per-state colours — scoped by the `state` showcase variant so only
    // the knobs relevant to the displayed row state are visible. Mirrors
    // the listbox / select-dropdown convention. "Hover" covers both
    // mouse hover and keyboard arrow-key highlight (same `--active`
    // class). Default row has no surface of its own (panel bg shows
    // through), so only text colour is exposed there.
    { key: 'itemColor', label: 'Text', control: 'color', defaultValue: 'var(--color-text)', section: 'itemState', showWhen: { state: 'default' } },

    { key: 'itemActiveBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'itemState', showWhen: { state: 'hover' } },
    { key: 'itemActiveColor', label: 'Text', control: 'color', defaultValue: 'var(--color-text)', section: 'itemState', showWhen: { state: 'hover' } },

    { key: 'itemDisabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.4, min: 0.1, max: 1, step: 0.05, section: 'itemState', showWhen: { state: 'disabled' } },

    // Destructive rows (Delete etc.) — danger text at rest, danger-tinted
    // surface when highlighted.
    { key: 'itemDangerColor', label: 'Text', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'itemState', showWhen: { state: 'danger' } },
    { key: 'itemDangerActiveBg', label: 'Hover Background', control: 'color', defaultValue: 'var(--color-danger-bg)', section: 'itemState', showWhen: { state: 'danger' } },

    // The row the user is currently ON (a switcher's active workspace) —
    // weight + a trailing checkmark, no colour of its own so `itemColor`
    // and the danger tone keep reaching it and the checkmark inherits the
    // row. Background defaults to transparent: a resting tint collided
    // with the hover surface, whose default is the obvious
    // `--color-surface-alt`. The knob stays so a designer can opt in; the
    // CSS rule order keeps hover on top of it either way.
    { key: 'itemCurrentBg', label: 'Background', control: 'color', defaultValue: 'transparent', section: 'itemState', showWhen: { state: 'current' } },
    { key: 'itemCurrentFontWeight', label: 'Font Weight', control: 'select', defaultValue: '600', options: ['400', '500', '600', '700'], section: 'itemState', showWhen: { state: 'current' } },

    // Leading icon colour at rest (tracks the row text colour when
    // active / danger — no separate knobs for those states).
    //
    // `--color-text-strong`, not `--color-text-subtle`: subtle measures
    // 1.48:1 on the panel in the light theme (2.85:1 dark), below even the
    // 3:1 non-text floor, and ends up fainter than a disabled row — a live
    // glyph read as switched off. See the note in menu.scss.
    { key: 'itemIconColor', label: 'Color', control: 'color', defaultValue: 'var(--color-text-strong)', section: 'icon', showWhen: { withIcons: 'yes' } },

    // Trailing hint (a shortcut echo like ⌘C). Muted is BELOW the AA floor
    // for text at 2.54:1 — a deliberate exception because the hint carries
    // no content the label lacks. The subtitle below refuses the same token
    // for exactly the opposite reason; see menu.scss.
    { key: 'itemHintFontSize', label: 'Font Size', control: 'number', defaultValue: 12, min: 9, max: 16, step: 1, unit: 'px', section: 'hint', showWhen: { withHints: 'yes' } },
    { key: 'itemHintColor', label: 'Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'hint', showWhen: { withHints: 'yes' } },

    // Two-line rows — a headline (label) plus a supporting subtitle
    // beneath. Only shown when the Subtitles variant is on.
    { key: 'itemSubtitleFontSize', label: 'Font Size', control: 'number', defaultValue: 11, min: 9, max: 16, step: 1, unit: 'px', section: 'subtitle', showWhen: { withSubtitles: 'yes' } },
    // Default is text-STRONG, not text-muted: muted fails WCAG AA on the
    // panel in the light theme (2.54:1) and a subtitle carries real content.
    // See the note in menu.scss.
    { key: 'itemSubtitleColor', label: 'Color', control: 'color', defaultValue: 'var(--color-text-strong)', section: 'subtitle', showWhen: { withSubtitles: 'yes' } },
    { key: 'itemSubtitleGap', label: 'Row Gap', control: 'number', defaultValue: 2, min: 0, max: 8, step: 1, unit: 'px', section: 'subtitle', showWhen: { withSubtitles: 'yes' } },

    // Separator divider colour. A separator divides ROWS, so the single-row
    // static showcase has nothing to draw it between — open the live menu to
    // see this one land.
    { key: 'separatorColor', label: 'Color', control: 'color', defaultValue: 'var(--color-border)', section: 'separator', showWhen: { withSeparator: 'yes' } },
  ],
  layoutVariants: [
    {
      // Which state the static showcase rows paint. The interactive
      // instance (a real ⋮ trigger) below is always live — hover /
      // keyboard exercise the real CSS independently. This picker is
      // purely to VISUALLY confirm each per-state knob without having
      // to hover the live menu.
      key: 'state',
      label: 'Row State',
      options: [
        { value: 'default', label: 'Default' },
        { value: 'hover', label: 'Hover' },
        { value: 'disabled', label: 'Disabled' },
        { value: 'danger', label: 'Danger' },
        // `current` is ORTHOGONAL to the others — a row can be current and
        // hovered and disabled at once — so this option is a knob-scoping
        // device, not a claim of exclusivity (the same licence `hover` and
        // `disabled` already take here). The showcase paints the picked state
        // on its single row AT REST and never stacks one state on another:
        // forcing the highlight under `Current` made it contradict its own
        // knobs (`itemCurrentBg` defaults to `transparent`) and read as
        // "current has a background". Hover the current row in the LIVE menu
        // to see the two compose.
        { value: 'current', label: 'Current' },
      ],
      defaultValue: 'default',
    },
    {
      // Which of the atom's two shapes the LIVE panel demonstrates. Both are
      // legitimately this atom — they share every knob, every class and the
      // same ARIA; only the entries differ, plus the trigger and placement a
      // consumer would pick. Scopes no knobs on purpose: it changes the
      // example, not the knob set. It exists because collapsing the demo to
      // one shape hid the other, and mixing them into one list made a
      // switcher row stick out among commands — telling two stories at once.
      key: 'shape',
      label: 'Shape',
      options: [
        { value: 'actions', label: 'Row actions' },
        { value: 'switcher', label: 'Switcher' },
      ],
      defaultValue: 'actions',
    },
    {
      key: 'withIcons',
      label: 'Leading Icons',
      options: [
        { value: 'yes', label: 'On' },
        { value: 'no', label: 'Off' },
      ],
      defaultValue: 'yes',
    },
    {
      key: 'withSeparator',
      label: 'Separator',
      options: [
        { value: 'yes', label: 'On' },
        { value: 'no', label: 'Off' },
      ],
      defaultValue: 'yes',
    },
    {
      // Trailing shortcut hints. Off by default: with Subtitles also on, a
      // row concatenates label + subtitle + hint into one accessible name
      // — the anti-pattern the README warns about. Worth being able to SEE
      // (it is also visually tight inside maxWidth 280), not worth
      // shipping as the baseline.
      key: 'withHints',
      label: 'Hints',
      options: [
        { value: 'yes', label: 'On' },
        { value: 'no', label: 'Off' },
      ],
      defaultValue: 'no',
    },
    {
      // Turns each row into a two-line headline + subtitle item. Off by
      // default so the classic single-line menu is the baseline.
      key: 'withSubtitles',
      label: 'Subtitles',
      options: [
        { value: 'yes', label: 'On' },
        { value: 'no', label: 'Off' },
      ],
      defaultValue: 'no',
    },
  ],
  events: [
    { name: 'onSelect', description: "Fires when an item is invoked (click / Enter / Space). The menu closes afterward. Per-item — wired via each item's `onSelect`.", payload: 'void' },
    { name: 'onOpenChange', description: 'Fires when the menu opens or closes.', payload: 'boolean' },
  ],
  api: {
    importPath: '@viax/uxm/ui',
    importNames: 'Menu',
    props: [
      { name: 'items', type: 'MenuEntry[]', required: true, description: 'Menu entries — actionable items ({ key, label, subtitle?, icon?, iconColor?, hint?, onSelect?, disabled?, danger?, current? }) and separators ({ separator: true }), in display order. Pass `subtitle` to render a two-line row (label = headline), `iconColor` to tint ONE row\'s glyph (prefer a `var(--color-*)` reference; raw hex only for entity-identity colours), and `current` to mark the row the user is already on (aria-current + trailing checkmark + heavier label).' },
      { name: 'renderTrigger', type: '(api: { open, triggerProps }) => ReactNode', required: true, description: 'Render the trigger. Spread `triggerProps` on your interactive element (an IconButton ⋮, a Button) — wires ref + click + ARIA in one go.' },
      { name: 'placement', type: '"bottom-start" | "bottom-end" | "top-start" | "top-end"', defaultValue: '"bottom-end"', description: 'Preferred placement; flips on overflow. Defaults to bottom-end since menus usually align to a trailing ⋮.' },
      { name: 'open', type: 'boolean', description: 'Controlled open state. Pair with onOpenChange. Omit for uncontrolled.' },
      { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called whenever the menu wants to open/close.' },
      { name: 'minWidth', type: 'number', defaultValue: '160', description: 'Minimum panel width in px.' },
      { name: 'maxWidth', type: 'number', defaultValue: '280', description: 'Maximum panel width in px — long labels truncate beyond it. The default applies only while matchAnchorWidth is off.' },
      { name: 'matchAnchorWidth', type: 'boolean | "min"', defaultValue: 'false', description: 'Tie the panel width to the trigger: true makes it equal, "min" makes the trigger width a floor the panel can grow past. Use it for a field-like trigger that displays a value (a workspace switcher) — the panel then reads as a continuation of the control, the native <select> convention; "min" is the forgiving choice since user-authored labels outgrow a fixed width. Never use it with an icon-only / kebab trigger: you would get a 32px panel, which is why the default is false and placement is bottom-end. Setting it also drops the 160/280 defaults, which would otherwise clamp a wide trigger\'s panel narrower than the trigger. Restoring bounds is asymmetric: maxWidth is always honoured, but minWidth is ignored under \'min\' (Popover makes the measured anchor width the floor) — use true plus an explicit minWidth if you need a floor wider than the trigger.' },
    ],
  },
};
