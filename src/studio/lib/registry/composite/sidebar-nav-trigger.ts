import type { ComponentDef } from '../../types';

export const sidebarNavTriggerDef: ComponentDef = {
  id: 'sidebar-nav-trigger',
  name: 'Sidebar Nav Trigger',
  category: 'Composite',
  description:
    "A rail row that OPENS something rather than navigating to it — a workspace switcher, an account menu, an environment picker. A <button> extending ButtonHTMLAttributes, so a Menu's or Listbox's `triggerProps` spread straight onto it, ref and ARIA included. Four optional slots: icon (a bare Icon in a switcher, an Avatar in the account row), caption (the small line beside the value; captionPlacement 'above' | 'below', default above — above LABELS the level this control changes, below QUALIFIES the value), children (the value) and trailing (the chevron — shown as soon as it is passed; no hover-reveal, unlike Sidebar Nav Item's trailing slot. The Trailing picker here decides whether the showcase PASSES the slot at all, exactly like Mark and Caption — it is not a visibility gate in the component). The atom draws NO tile behind the icon: it reserves the slot, sizes it, aligns it, and paints nothing. And it reserves nothing it was not given — no icon and the text starts at the padding edge, no caption and the value centres, no trailing and there is no gap where a chevron would have been. Sibling of Sidebar Nav Item rather than a variant of it: that one renders an <a>, hides trailing until hover, paints an icon tile and has a single-line label. `collapsed` renders it for a 64px rail: a 46px tile, the chevron dropped, and caption + value clipped but kept in the DOM so the accessible name survives. Pair it with a 32px mark. See the collapsed prop below for the reasoning.",
  styleProperties: [
    // ── Per-state surface. Hover and open paint the SAME thing in both
    // variants, so they share one knob — a second one would only let a
    // designer make them disagree, and they mean the same thing to the eye.
    // Open has no prop: it is read from [aria-expanded="true"], which Menu
    // and Listbox already set through triggerProps.
    { key: 'bg', label: 'Background', control: 'color', defaultValue: 'transparent', section: 'states', showWhen: { state: 'default' } },
    { key: 'hoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface)', section: 'states', showWhen: { state: ['hover', 'open'] } },
    { key: 'focusRing', label: 'Ring Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
    // Dimmed, not recoloured — a disabled `outlined` trigger has to stay the
    // same box. One opacity covers both variants, so there is nothing to keep
    // in sync between them.
    { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.45, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },

    // ── The outlined variant's resting chrome. The border is deliberately
    // NOT per-state: it holds through hover and open, because a border that
    // moved too would be a second signal for a fact the surface carries.
    { key: 'outlinedBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'outlined', showWhen: { variant: 'outlined' } },
    { key: 'outlinedBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'outlined', showWhen: { variant: 'outlined' } },

    // ── The value.
    // Gated on `collapsed: no` — the collapsed row clips its text away, so
    // every type knob below is a slider with no visible effect there. Same
    // reasoning for the caption group, the trailing colour, and padding/gap.
    { key: 'valueColor', label: 'Color', control: 'color', defaultValue: 'var(--color-text)', section: 'value', showWhen: { collapsed: 'no' } },
    { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 14, min: 11, max: 18, step: 1, unit: 'px', section: 'value', showWhen: { collapsed: 'no' } },
    { key: 'fontWeight', label: 'Font Weight', control: 'select', defaultValue: '500', options: ['400', '500', '600', '700'], section: 'value', showWhen: { collapsed: 'no' } },

    // ── The caption. Muted is under the AA text floor on the card surface
    // (2.54:1), which is acceptable here ONLY because a caption names the
    // control rather than carrying content — the value beneath it is the
    // content. Swap to --color-text-strong if that ever stops being true.
    { key: 'captionColor', label: 'Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'caption', showWhen: { withCaption: 'yes', collapsed: 'no' } },
    { key: 'captionFontSize', label: 'Font Size', control: 'number', defaultValue: 10, min: 8, max: 14, step: 1, unit: 'px', section: 'caption', showWhen: { withCaption: 'yes', collapsed: 'no' } },
    { key: 'captionFontWeight', label: 'Font Weight', control: 'select', defaultValue: '500', options: ['400', '500', '600', '700'], section: 'caption', showWhen: { withCaption: 'yes', collapsed: 'no' } },
    // Uppercase is the DEFAULT, not the definition — an eyebrow in most rails,
    // but a sentence-case caption under an address is the same slot read
    // differently, and a brand font may not carry caps well. Paired knob: the
    // tracking below exists to open up caps, so turning this off usually means
    // turning that down too.
    { key: 'captionTextTransform', label: 'Text Transform', control: 'select', defaultValue: 'uppercase', options: ['uppercase', 'none', 'capitalize', 'lowercase'], section: 'caption', showWhen: { withCaption: 'yes', collapsed: 'no' } },
    // A number in `em`, not a free-text CSS length: the unit is fixed, so the
    // only thing a text field adds is the chance to type `6px` (catastrophic
    // tracking at a 10px caption) or a bare `0.06`, which is invalid CSS the
    // browser drops in silence. `em` and not `px` so the tracking scales with
    // the caption's own size — and with the brand font, which Brand Settings
    // can change under it.
    { key: 'captionLetterSpacing', label: 'Letter Spacing', control: 'number', defaultValue: 0.06, min: 0, max: 0.2, step: 0.01, unit: 'em', section: 'caption', showWhen: { withCaption: 'yes', collapsed: 'no' } },
    { key: 'captionGap', label: 'Row Gap', control: 'number', defaultValue: 2, min: 0, max: 8, step: 1, unit: 'px', section: 'caption', showWhen: { withCaption: 'yes', collapsed: 'no' } },

    // ── The mark. `iconSize` is a MIN box, not a fixed one: it reserves and
    // aligns without squeezing a child that brings its own size (an Avatar).
    // Gated to the Icon mark alone. Being a FLOOR, it does nothing while it
    // sits below the mark's own size — measured, a 32px `Avatar size='small'`
    // in a 28px slot yields a 32px slot, and Avatar's 40px default is further
    // out still. Exposed for Avatar it was a knob a designer drags through its
    // whole default range for no visible effect, waking up only past 32. The
    // lever that actually sizes an avatar is Avatar's own `size` preset; two
    // knobs competing to answer "how big is the mark" is worse than one.
    { key: 'iconSize', label: 'Slot Size', control: 'number', defaultValue: 28, min: 16, max: 44, step: 2, unit: 'px', section: 'icon', showWhen: { mark: 'icon' } },
    // Only the Icon mark inherits this colour — an Avatar paints itself.
    { key: 'iconColor', label: 'Color', control: 'color', defaultValue: 'var(--color-text-strong)', section: 'icon', showWhen: { mark: 'icon' } },

    { key: 'trailingColor', label: 'Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'trailing', showWhen: { withTrailing: 'yes', collapsed: 'no' } },

    // ── Shared sizing. Padding and gap are the two that STOP applying when
    // collapsed (the tile sets `padding: 0` and has one in-flow child left),
    // so they are gated; radius still paints the 32x32 box and stays.
    { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 12, min: 4, max: 24, step: 1, unit: 'px', showWhen: { collapsed: 'no' } },
    { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 8, min: 4, max: 16, step: 1, unit: 'px', showWhen: { collapsed: 'no' } },
    { key: 'gap', label: 'Gap', control: 'number', defaultValue: 10, min: 2, max: 20, step: 1, unit: 'px', showWhen: { collapsed: 'no' } },
    { key: 'borderRadius', label: 'Radius', control: 'slider', defaultValue: 8, min: 0, max: 20, step: 1, unit: 'px' },
    // The collapsed tile's own footprint — a MINIMUM, so a mark larger than it
    // (an `Avatar`) grows the row rather than being clipped. 46px deliberately
    // differs from the 32px `app-sidebar` gives its collapsed nav items: a
    // trigger has lost its chevron and its text at rail width, so footprint is
    // the only thing left saying it opens something rather than navigating.
    // It is also a composition choice: the tile is a surface AROUND the mark,
    // so a 32px mark (`Avatar size="small"`) sits with ~7px on every side,
    // mirroring `sidebar-nav-item`'s 32px tile around a smaller icon.
    { key: 'collapsedSize', label: 'Tile Size', control: 'number', defaultValue: 46, min: 24, max: 64, step: 2, unit: 'px', showWhen: { collapsed: 'yes' } },
  ],
  layoutVariants: [
    {
      key: 'variant',
      label: 'Variant',
      options: [
        { value: 'outlined', label: 'Outlined' },
        { value: 'plain', label: 'Plain' },
      ],
      defaultValue: 'outlined',
    },
    {
      // `open` and `disabled` are not classes the showcase fakes — it applies
      // the real `aria-expanded="true"` and the real `disabled` attribute,
      // which ARE the atom's selectors for those states, so the picker
      // exercises the production mechanism. Only `hover` / `focus` need the
      // kit's `--state-*` forced classes (a pointer and the tab ring cannot be
      // parked on demand); those share a declaration block with the real
      // pseudo-selectors and so cannot drift from them.
      key: 'state',
      label: 'State',
      options: [
        { value: 'default', label: 'Default' },
        { value: 'hover', label: 'Hover' },
        { value: 'open', label: 'Open' },
        { value: 'focus', label: 'Focus' },
        { value: 'disabled', label: 'Disabled' },
      ],
      defaultValue: 'default',
    },
    {
      // The mark slot takes either kind of child, and `Avatar` is the case
      // worth being able to see: it proves the slot paints no tile and does
      // not squeeze a child that brings its own size. `None` is here for the
      // same reason as the other two slot pickers — to show what the atom
      // does NOT reserve: turn a slot off and the row closes up rather than
      // leaving a hole. The showcase's caption and value follow this pick,
      // since an avatar beside a workspace name would misrepresent the atom.
      key: 'mark',
      label: 'Mark',
      options: [
        { value: 'icon', label: 'Icon' },
        { value: 'avatar', label: 'Avatar' },
        { value: 'none', label: 'None' },
      ],
      defaultValue: 'icon',
    },
    {
      // The 64px rail. Its own picker rather than a value on `state`, because
      // it is orthogonal to every state — a collapsed row still hovers, opens
      // and disables, and folding the two would make five of those
      // combinations unreachable.
      key: 'collapsed',
      label: 'Rail',
      options: [
        { value: 'no', label: 'Expanded' },
        { value: 'yes', label: 'Collapsed' },
      ],
      defaultValue: 'no',
    },
    {
      key: 'withCaption',
      label: 'Caption',
      options: [
        { value: 'yes', label: 'On' },
        { value: 'no', label: 'Off' },
      ],
      defaultValue: 'yes',
      // Collapsed clips the caption and drops the chevron, so both slot
      // toggles (and the placement picker) would be no-ops there — they
      // disappear rather than sit dead, per the list-item precedent.
      showWhen: { collapsed: 'no' },
    },
    {
      // Above the value the caption LABELS the level ("Workspace"); below it,
      // it QUALIFIES the value ("Tenant owner" under an address). Swapped in
      // the markup, not with `column-reverse` — reversing visually while the
      // DOM stays put would split reading order from visual order (WCAG
      // 1.3.2) and keep announcing the pair the wrong way round.
      key: 'captionPlacement',
      label: 'Caption Position',
      options: [
        { value: 'above', label: 'Above' },
        { value: 'below', label: 'Below' },
      ],
      defaultValue: 'above',
      showWhen: { withCaption: 'yes', collapsed: 'no' },
    },
    {
      key: 'withTrailing',
      label: 'Trailing',
      options: [
        { value: 'yes', label: 'On' },
        { value: 'no', label: 'Off' },
      ],
      defaultValue: 'yes',
      showWhen: { collapsed: 'no' },
    },
  ],
  events: [
    { name: 'onClick', description: 'Fires when the row is activated. Wired for you when the trigger is spread with a Menu/Listbox `triggerProps` — do not add your own on top, it would override theirs.', payload: 'MouseEvent' },
  ],
  api: {
    importPath: '@viax.io/uxm/ui',
    importNames: 'SidebarNavTrigger',
    props: [
      { name: 'icon', type: 'ReactNode', description: 'The mark on the left — a bare Icon in a switcher, an Avatar in an account row. No tile is drawn behind it: the slot is reserved, sized and aligned, and paints nothing.' },
      { name: 'caption', type: 'ReactNode', description: 'The small line beside the value. It sits inside the button, so it joins the accessible name — pass an explicit aria-label if a pairing reads badly.' },
      { name: 'captionPlacement', type: '"above" | "below"', defaultValue: '"above"', description: 'Which side of the value the caption sits on. Above it LABELS the level this control changes (a switcher\'s "Workspace"); below it QUALIFIES the value (an account row\'s "Tenant owner" under the address). Swapped in the markup rather than with flex-direction: column-reverse, so reading order keeps matching visual order (WCAG 1.3.2) and the accessible name follows the row.' },
      { name: 'children', type: 'ReactNode', description: 'The value — the workspace name, the signed-in address.' },
      { name: 'trailing', type: 'ReactNode', description: 'The chevron. Visible at rest, with no reveal-on-hover behaviour: a control that opens something has to advertise it before you point at it.' },
      { name: 'variant', type: '"plain" | "outlined"', defaultValue: '"plain"', description: 'plain — nothing at rest, for the account row at the foot of the rail. outlined — a hairline plus the card surface, for the switcher, which stands in a box because it names the level everything below it belongs to.' },
      { name: 'collapsed', type: 'boolean', defaultValue: 'false', description: 'Render for a 64px rail: a 46px tile (--uxm-sidebar-nav-trigger-collapsed-size, a MINIMUM rather than a clamp — a mark larger than it grows the row instead of being clipped), the trailing chevron dropped, and caption + value kept in the DOM but visually hidden — so the button announces identically collapsed and expanded rather than becoming a nameless icon. 46 deliberately differs from the 32px AppSidebar gives its collapsed nav items: a trigger has lost both chevron and text at this width, so footprint is the only signal left that it opens something. The tile is a surface AROUND the mark rather than a frame hugging it — pair it with Avatar size="small" (32px) for ~7px on every side. outlined keeps its border at this size, since the box is then the only thing distinguishing a switcher from a plain account row. Pass title as well: with the chevron gone, only position and the mark still say the row opens something.' },
    ],
  },
};
