import type { ComponentDef } from '../types';

export const appDefs: ComponentDef[] = [
  // ── App ──
  {
    id: 'brand-settings',
    name: 'Brand Settings',
    category: 'App',
    description: 'Configure the Modo logo, sidebar icon, and primary font.',
    styleProperties: [],
    layoutVariants: [],
    canvasBackground: false,
  },
  {
    id: 'app-sidebar',
    name: 'App Sidebar',
    category: 'App',
    description:
      'Left navigation: brand row, an optional header slot at the head of the rail, sectioned nav items, an optional footer slot, expand/collapse. Both slots survive collapse.',
    styleProperties: [
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'colors' },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'expandedWidth', label: 'Expanded Width', control: 'number', defaultValue: 256, min: 200, max: 320, step: 4, unit: 'px' },
      { key: 'collapsedWidth', label: 'Collapsed Width', control: 'number', defaultValue: 64, min: 48, max: 96, step: 4, unit: 'px' },
      // Top only: lets a shell start the first section level with its page
      // content's first line. Sides stay 8px so the lead/footer slots keep
      // aligning with the nav rows.
      { key: 'navPaddingTop', label: 'Nav Top Padding', control: 'number', defaultValue: 8, min: 0, max: 48, step: 1, unit: 'px' },
      // The brand (logo) row — `__header`, not the `header` prop's slot below it.
      // Unset, it follows `--uxm-app-top-bar-height` so it lines up with the bar.
      { key: 'headerHeight', label: 'Logo Row Height', control: 'number', defaultValue: 64, min: 40, max: 96, step: 2, unit: 'px' },
      { key: 'headingColor', label: 'Section Heading', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
      { key: 'footerColor', label: 'Footer Text', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
      // Section heading typography. Defaults equal the stylesheet's fallbacks.
      // Weight is a select of strings and letter spacing an em number: a plain
      // number knob saves as px (formatValue), which a weight can't take, and
      // `*LetterSpacing` is the one name it saves in em.
      { key: 'headingTextTransform', label: 'Text Transform', control: 'select', defaultValue: 'uppercase', options: ['uppercase', 'none', 'capitalize', 'lowercase'], section: 'sectionHeading' },
      { key: 'headingLetterSpacing', label: 'Letter Spacing', control: 'number', defaultValue: 0.06, min: 0, max: 0.2, step: 0.01, unit: 'em', section: 'sectionHeading' },
      { key: 'headingFontSize', label: 'Font Size', control: 'number', defaultValue: 11, min: 9, max: 16, step: 1, unit: 'px', section: 'sectionHeading' },
      { key: 'headingFontWeight', label: 'Font Weight', control: 'select', defaultValue: '600', options: ['400', '500', '600', '700'], section: 'sectionHeading' },
      // Both slots align to `__nav`'s 8px, so a control in either lines its text
      // up with the nav rows (8 + the child's own 12 = 20px, where a nav label
      // starts). The footer used to carry a 24px caption inset, which put a
      // control at 36px and cost it 32px of width — an address ellipsised for no
      // reason. The knobs stay so a caption can take the deeper inset back.
      //
      // Each sits in its OWN section rather than beside the width knobs. The
      // panel derives a section's subtitle from the union of `showWhen` keys
      // across every knob inside it, so a gated knob dropped in with the
      // ungated widths made the whole section read "Per Header Slot x Footer
      // Slot" — a claim that is false for Expanded/Collapsed Width. Same rule
      // the `avatar` entry states: a section is either all-shared or all-gated.
      // One key per section also keeps the subtitle to "Per Header Slot - On"
      // instead of an "A x B" that implies each knob depends on both.
      { key: 'leadPadding', label: 'Padding', control: 'number', defaultValue: 8, min: 0, max: 24, step: 1, unit: 'px', section: 'headerSlot', showWhen: { headerSlot: 'on' } },
      { key: 'footerPadding', label: 'Padding', control: 'number', defaultValue: 8, min: 0, max: 24, step: 1, unit: 'px', section: 'footerSlot', showWhen: { footerSlot: 'on' } },
      // `toggle="edge"`: the round handle on the rail's right border. All-gated
      // on the one key, per the section rule above. Left out on purpose: the
      // reveal zone (an invisible hit area, an interaction setting rather than
      // a design value), the z-index (integration, like the flyout's) and the
      // shadow (a toggle saves 1/0, which can't express a box-shadow).
      { key: 'edgeToggleSize', label: 'Handle Size', control: 'number', defaultValue: 24, min: 20, max: 32, step: 2, unit: 'px', section: 'edgeToggle', showWhen: { toggle: 'edge' } },
      // A select, not a number: a number knob saves as px, and the default is a
      // percentage of the rail's height.
      { key: 'edgeToggleOffsetY', label: 'Vertical Position', control: 'select', options: ['25%', '33%', '50%', '66%', '75%'], defaultValue: '50%', section: 'edgeToggle', showWhen: { toggle: 'edge' } },
      { key: 'edgeToggleBackgroundColor', label: 'Handle Fill', control: 'color', defaultValue: 'var(--color-card)', section: 'edgeToggle', showWhen: { toggle: 'edge' } },
      { key: 'edgeToggleColor', label: 'Chevron', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'edgeToggle', showWhen: { toggle: 'edge' } },
      // Per-state, the `icon-button` way: each knob shows under the Handle
      // state that paints it.
      { key: 'edgeToggleHoverColor', label: 'Chevron', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { toggle: 'edge', handle: ['hover', 'focus'] } },
      { key: 'edgeToggleFocusRingColor', label: 'Ring Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'states', showWhen: { toggle: 'edge', handle: 'focus' } },
    ],
    layoutVariants: [
      {
        key: 'state',
        label: 'State',
        options: [
          { value: 'expanded', label: 'Expanded' },
          { value: 'collapsed', label: 'Collapsed' },
        ],
        defaultValue: 'expanded',
      },
      {
        // The head slot is off in plenty of shells (a single-tenant app has no
        // switcher), so it is a picker rather than always-on content — and with
        // it off you can still see that the sidebar reserves nothing for it.
        key: 'headerSlot',
        label: 'Header Slot',
        options: [
          { value: 'on', label: 'On' },
          { value: 'off', label: 'Off' },
        ],
        defaultValue: 'on',
      },
      {
        // Both slots are optional, so both get a picker. One without the other
        // would imply the footer is structural — and with either off you can see
        // that the sidebar reserves no space for a slot it was not given.
        key: 'footerSlot',
        label: 'Footer Slot',
        options: [
          { value: 'on', label: 'On' },
          { value: 'off', label: 'Off' },
        ],
        defaultValue: 'on',
      },
      {
        // Auto-assign a distinct icon colour per item from a categorical
        // palette (cycling) for scannability, vs the monochromatic default.
        key: 'autoIconColors',
        label: 'Auto Icon Colors',
        options: [
          { value: 'off', label: 'Off' },
          { value: 'on', label: 'On' },
        ],
        defaultValue: 'off',
      },
      {
        // `collapsedFlyout`: hover or focus a collapsed-rail icon to see its
        // label in a pill beside it. Only visible with State = Collapsed.
        key: 'collapsedFlyout',
        label: 'Collapsed Flyout',
        options: [
          { value: 'off', label: 'Off' },
          { value: 'on', label: 'On' },
        ],
        defaultValue: 'on',
      },
      // The 4.85.0 options last, so the Variant Matrix keeps its State x Header
      // Slot axes (it expands the first two eligible variants in order).
      {
        // `toggle`: where the collapse toggle sits. A code prop, so this only
        // picks what the preview shows; the app chooses it.
        key: 'toggle',
        label: 'Collapse Toggle',
        options: [
          { value: 'header', label: 'Header' },
          { value: 'edge', label: 'Edge' },
        ],
        defaultValue: 'header',
      },
      {
        // The edge handle appears only while the pointer is over the rail, so
        // a designer editing its fill would see nothing change. The preview
        // forces it: Shown (resting colours), Hover, or Focus. Inert while
        // Collapse Toggle is Header (the label says whose it is).
        //
        // Deliberately NOT `showWhen: { toggle: 'edge' }`: the Variant Matrix
        // treats a variant named in another's `showWhen` as a gate and pins it
        // to that value in every cell, so the matrix would only ever show the
        // edge handle and never the default header toggle. Its knobs stay
        // gated on `toggle: 'edge'` (knob `showWhen` doesn't feed the matrix).
        key: 'handle',
        label: 'Edge Handle',
        options: [
          { value: 'shown', label: 'Shown' },
          { value: 'hover', label: 'Hover' },
          { value: 'focus', label: 'Focus' },
        ],
        defaultValue: 'shown',
      },
      {
        // `brand` is optional: an app with its logo in a full-width top bar
        // passes none, and the rail starts at the nav.
        key: 'brandRow',
        label: 'Brand Row',
        options: [
          { value: 'on', label: 'On' },
          { value: 'off', label: 'Off' },
        ],
        defaultValue: 'on',
      },
    ],
  },
  {
    id: 'app-top-bar',
    name: 'App Top Bar',
    category: 'App',
    description: 'Top header: search, mobile menu trigger, primary action, theme toggle, avatar slot.',
    styleProperties: [
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'color-mix(in srgb, var(--color-surface-alt) 50%, transparent)', section: 'colors' },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'height', label: 'Height', control: 'number', defaultValue: 64, min: 48, max: 96, step: 4, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 16, min: 8, max: 32, step: 2, unit: 'px' },
      { key: 'gap', label: 'Gap', control: 'number', defaultValue: 12, min: 4, max: 24, step: 2, unit: 'px' },
      { key: 'searchMaxWidth', label: 'Search Max Width', control: 'number', defaultValue: 320, min: 160, max: 480, step: 8, unit: 'px' },
      { key: 'brandHeight', label: 'Logo Height', control: 'number', defaultValue: 24, min: 16, max: 40, step: 2, unit: 'px', section: 'brandSlot', showWhen: { brandSlot: 'logo' } },
      { key: 'brandGap', label: 'Gap After Logo', control: 'number', defaultValue: 16, min: 0, max: 32, step: 2, unit: 'px', section: 'brandSlot', showWhen: { brandSlot: 'logo' } },
    ],
    layoutVariants: [
      {
        // `brand` slot: the logo at the start of a full-width top bar
        // (`PageShell topBarPlacement="above"`). The preview shows the Brand
        // Settings logo.
        key: 'brandSlot',
        label: 'Brand Slot',
        options: [
          { value: 'off', label: 'Off' },
          { value: 'logo', label: 'Logo' },
        ],
        defaultValue: 'off',
      },
    ],
  },
];
