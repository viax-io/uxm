import type { ComponentDef } from '../../types';

export const listItemDef: ComponentDef = {
  id: 'list-item',
  name: 'List Item',
  category: 'Composite',
  description: "Row with a leading slot (accent icon tile, or media rendered as-is for a thumbnail / avatar), title, and optional trailing slot — used in stacked lists. Renders as `<div>` (static) or `<button>` / `<a>` (interactive) depending on the atom's `interactive` / `href` props. State knobs gate on `mode` rather than trailing — trailing is purely a visual choice and the two are orthogonal: an interactive row can have any trailing, a static row can have a chevron decoration without being tappable.",
  styleProperties: [
    // ── Per-state row colors. Filtered into the "States" section by
    // the State variant. Default-state knobs (`inactiveBg`,
    // `inactiveText`) gate on `state: "default"` only — so the bg /
    // text are editable in both static and interactive modes. The
    // interactive-only state knobs (hover / focus / active)
    // additionally gate on `mode: "interactive"` so they hide
    // entirely when the row is rendered as a display-only `<div>`.
    // `disabled` is a visual treatment, not an interaction state, so
    // its knobs are NOT mode-gated.
    { key: 'inactiveBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'states', showWhen: { state: 'default' } },
    { key: 'inactiveText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'default' } },
    { key: 'hoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'states', showWhen: { state: 'hover', mode: 'interactive' } },
    { key: 'hoverText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'hover', mode: 'interactive' } },
    { key: 'focusText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'focus', mode: 'interactive' } },
    { key: 'activeBg', label: 'Background', control: 'color', defaultValue: 'var(--color-accent-subtle)', section: 'states', showWhen: { state: 'active', mode: 'interactive' } },
    { key: 'activeText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'states', showWhen: { state: 'active', mode: 'interactive' } },
    { key: 'disabledBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'states', showWhen: { state: 'disabled' } },
    { key: 'disabledText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'states', showWhen: { state: 'disabled' } },
    // Focus ring + disabled opacity in their own sections.
    { key: 'focusRing', label: 'Ring Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus', mode: 'interactive' } },
    { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.5, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
    // ── Container (List wrapper)
    { key: 'borderColor', label: 'Border Color', control: 'color', defaultValue: 'var(--color-border)', section: 'container' },
    { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px', section: 'container' },
    // ── Shared sizing (applies to every state)
    { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 16, min: 8, max: 32, step: 2, unit: 'px' },
    { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 12, min: 4, max: 24, step: 2, unit: 'px' },
    { key: 'gap', label: 'Icon Gap', control: 'number', defaultValue: 12, min: 4, max: 24, step: 2, unit: 'px' },
    { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 14, min: 11, max: 18, step: 1, unit: 'px' },
    // ── Sub-elements (shared across every state)
    { key: 'valueColor', label: 'Value Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'value', showWhen: { value: 'shown' } },
    { key: 'valueSize', label: 'Value Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px', section: 'value', showWhen: { value: 'shown' } },
    // Trailing slot is purely composable — the consumer passes whatever
    // ReactNode they want. The preview demos the canonical pattern per
    // mode (chevron for interactive nav rows, Tag for static status
    // rows), so a single Chevron Color knob covers the interactive
    // example. Other trailing decorations (Tag, Badge, Avatar, etc.)
    // bring their own styling via their respective atoms.
    { key: 'chevronColor', label: 'Chevron Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'trailing', showWhen: { mode: 'interactive' } },
    // High-contrast icon "stamp" — bright accent tile with a card-coloured
    // glyph inside. Keeps the icon visually distinct from the row bg in
    // every state (default / hover / active / disabled), so the shared
    // icon knobs don't need to vary per-state.
    { key: 'iconBg', label: 'Icon Bg', control: 'color', defaultValue: 'var(--color-accent)', section: 'icon', showWhen: { leading: 'icon' } },
    { key: 'iconColor', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-card)', section: 'icon', showWhen: { leading: 'icon' } },
    { key: 'iconSize', label: 'Icon Size', control: 'number', defaultValue: 24, min: 16, max: 40, step: 2, unit: 'px', section: 'icon', showWhen: { leading: 'icon' } },
    { key: 'iconRadius', label: 'Icon Radius', control: 'slider', defaultValue: 6, min: 0, max: 16, step: 1, unit: 'px', section: 'icon', showWhen: { leading: 'icon' } },
    // Media slot is the un-tiled leading alternative: the passed node
    // (Thumbnail / avatar / <img>) brings its own surface and radius, so
    // the row only owns the box it sits in — one size knob, no colours.
    { key: 'mediaSize', label: 'Media Size', control: 'number', defaultValue: 36, min: 24, max: 64, step: 2, unit: 'px', section: 'media', showWhen: { leading: 'media' } },
  ],
  layoutVariants: [
    {
      key: 'mode',
      label: 'Mode',
      options: [
        // `static` → renders as `<div>`; no hover / focus / active
        // styling. `interactive` → renders as `<button>` (or `<a>`
        // when href is passed); full state styling. Mode is
        // orthogonal to trailing: any trailing can sit in either mode.
        { value: 'static', label: 'Static' },
        { value: 'interactive', label: 'Interactive' },
      ],
      defaultValue: 'interactive',
    },
    {
      key: 'state',
      label: 'State',
      options: [
        // `default` and `disabled` are always available — every row
        // has a resting state, and `disabled` is a visual treatment
        // (dimmed, muted) that applies regardless of mode. The CSS
        // rule includes a bare `.uxm-list-item[aria-disabled]`
        // selector that fires on `<div>` as well as `<button>` /
        // `<a>`. The interactive-only states (hover / focus / active)
        // are option-level-gated to `mode: "interactive"`: when the
        // row is static, the picker collapses to "Default" +
        // "Disabled", which self-explains as "this row only has
        // visual states" without the picker disappearing.
        { value: 'default', label: 'Default' },
        { value: 'hover', label: 'Hover', showWhen: { mode: 'interactive' } },
        { value: 'focus', label: 'Focus', showWhen: { mode: 'interactive' } },
        { value: 'active', label: 'Active', showWhen: { mode: 'interactive' } },
        { value: 'disabled', label: 'Disabled' },
      ],
      defaultValue: 'default',
    },
    {
      key: 'leading',
      label: 'Leading',
      options: [
        // `icon` → the accent `IconTile` (the long-standing default, so an
        // existing saved theme opens on the same row it was saved against).
        // `media` → the node renders as-is; the preview passes a `Thumbnail`,
        // which is the shape this slot exists for (product / people rows).
        { value: 'icon', label: 'Icon' },
        { value: 'media', label: 'Media' },
      ],
      defaultValue: 'icon',
    },
    {
      key: 'value',
      label: 'Value Text',
      options: [
        { value: 'shown', label: 'Shown' },
        { value: 'hidden', label: 'Hidden' },
      ],
      defaultValue: 'shown',
    },
    // No `trailing` variant — the preview chooses what to show in
    // the trailing slot based on `mode` (chevron for interactive,
    // Tag for static). Real consumers pass any ReactNode via the
    // atom's `trailing` prop; the editor preview demos the
    // canonical patterns only.
  ],
};
