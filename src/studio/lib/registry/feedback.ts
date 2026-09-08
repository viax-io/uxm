import type { ComponentDef } from '../types';

export const feedbackDefs: ComponentDef[] = [
  // ── Feedback ──
  {
    id: 'timeline-entry',
    name: 'Timeline Entry',
    category: 'Display',
    description: 'Single entry in a vertical history timeline — dot + connecting line + content card.',
    styleProperties: [
      { key: 'dotColor', label: 'Dot Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'colors' },
      { key: 'dotIdleColor', label: 'Idle Dot Color', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'dotSize', label: 'Dot Size', control: 'number', defaultValue: 8, min: 4, max: 20, step: 1, unit: 'px' },
      { key: 'dotRingColor', label: 'Dot Ring', control: 'color', defaultValue: 'var(--color-card)', section: 'colors' },
      { key: 'lineColor', label: 'Line Color', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'lineWidth', label: 'Line Width', control: 'number', defaultValue: 1, min: 1, max: 4, step: 1, unit: 'px' },
      { key: 'contentBg', label: 'Content Bg', control: 'color', defaultValue: 'var(--color-card)', section: 'colors' },
      { key: 'contentBorderColor', label: 'Content Border', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'contentRadius', label: 'Content Radius', control: 'slider', defaultValue: 5, min: 0, max: 12, step: 1, unit: 'px' },
      { key: 'contentPadding', label: 'Content Padding', control: 'number', defaultValue: 10, min: 4, max: 20, step: 2, unit: 'px' },
      { key: 'gap', label: 'Gap', control: 'number', defaultValue: 10, min: 4, max: 24, step: 2, unit: 'px' },
      { key: 'titleSize', label: 'Title Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px' },
      { key: 'titleColor', label: 'Title Color', control: 'color', defaultValue: 'var(--color-text)', section: 'colors' },
      { key: 'metaSize', label: 'Meta Size', control: 'number', defaultValue: 10.5, min: 9, max: 14, step: 0.5, unit: 'px' },
      { key: 'metaColor', label: 'Meta Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
    ],
    layoutVariants: [
      {
        key: 'state',
        label: 'State',
        options: [
          { value: 'active', label: 'Active' },
          { value: 'past', label: 'Past' },
        ],
        defaultValue: 'active',
      },
    ],
  },
  {
    id: 'loader',
    name: 'Loader',
    category: 'Feedback',
    description: 'Small in-flight indicator — spinner, pulsing dots, or indeterminate bar — with an optional message.',
    styleProperties: [
      { key: 'size', label: 'Size', control: 'number', defaultValue: 24, min: 12, max: 64, step: 2, unit: 'px' },
      { key: 'color', label: 'Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'colors' },
      { key: 'trackColor', label: 'Track Color', control: 'color', defaultValue: 'color-mix(in srgb, var(--color-accent-bold) 18%, transparent)', section: 'colors' },
      { key: 'speed', label: 'Speed (ms)', control: 'number', defaultValue: 800, min: 200, max: 2400, step: 50 },
      { key: 'barWidth', label: 'Bar Width', control: 'number', defaultValue: 200, min: 80, max: 480, step: 10, unit: 'px' },
      { key: 'message', label: 'Message', control: 'text', defaultValue: 'Loading…' },
      { key: 'messageInterval', label: 'Cycle (ms)', control: 'number', defaultValue: 2400, min: 600, max: 8000, step: 100 },
      { key: 'messageSize', label: 'Message Size', control: 'number', defaultValue: 13, min: 10, max: 18, step: 1, unit: 'px' },
      { key: 'messageColor', label: 'Message Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
      { key: 'gap', label: 'Gap', control: 'number', defaultValue: 12, min: 4, max: 32, step: 2, unit: 'px' },
    ],
    layoutVariants: [
      {
        key: 'variant',
        label: 'Variant',
        options: [
          { value: 'spinner', label: 'Spinner' },
          { value: 'dots', label: 'Dots' },
          { value: 'bar', label: 'Bar' },
        ],
        defaultValue: 'spinner',
      },
      {
        key: 'layout',
        label: 'Layout',
        options: [
          { value: 'stacked', label: 'Stacked' },
          { value: 'inline', label: 'Inline' },
        ],
        defaultValue: 'stacked',
      },
    ],
  },
  {
    id: 'progress-bar',
    name: 'Progress Bar',
    category: 'Feedback',
    description:
      'Determinate progress (0–100%) — the companion to Loader\'s indeterminate spinner/dots/bar. Use for uploads, batch operations, and stepped flows where the share of work done is known; for "something is happening, no ETA" use Loader instead. Two variants share one Value knob: a linear track+fill and a circular ring (CSS conic-gradient, no SVG). Root is layout-only — all theming routes through `--uxm-progress-bar-*` vars on inner elements, so saves need no PER_COMPONENT_MAPPING entry. The value drives the linear fill width and the ring sweep via the same var.',
    styleProperties: [
      // `value` is a preview proxy for what will be runtime/dynamic data — the
      // editor slider lets designers eyeball fill levels, but in production the
      // consumer drives it via the `value` prop (the saved
      // `--uxm-progress-bar-value` is always overridden inline). The numeric
      // percentage label is always shown (determinate by nature).
      { key: 'value', label: 'Value (%)', control: 'slider', defaultValue: 60, min: 0, max: 100, step: 1 },
      { key: 'fillColor', label: 'Fill Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'colors' },
      { key: 'trackColor', label: 'Track Color', control: 'color', defaultValue: 'color-mix(in srgb, var(--color-accent-bold) 16%, transparent)', section: 'colors' },
      // ── Linear shape (showWhen variant=linear) ──
      { key: 'barHeight', label: 'Bar Height', control: 'number', defaultValue: 8, min: 2, max: 24, step: 1, unit: 'px', showWhen: { variant: 'linear' } },
      { key: 'barRadius', label: 'Bar Radius', control: 'slider', defaultValue: 999, min: 0, max: 999, step: 1, unit: 'px', showWhen: { variant: 'linear' } },
      // ── Ring shape (showWhen variant=ring) ──
      { key: 'ringSize', label: 'Ring Size', control: 'number', defaultValue: 72, min: 40, max: 160, step: 2, unit: 'px', showWhen: { variant: 'ring' } },
      { key: 'ringThickness', label: 'Ring Thickness', control: 'number', defaultValue: 8, min: 2, max: 28, step: 1, unit: 'px', showWhen: { variant: 'ring' } },
      // ── Value label — always rendered; its own section ──
      { key: 'valueColor', label: 'Value Color', control: 'color', defaultValue: 'var(--color-text)', section: 'value' },
      { key: 'valueSize', label: 'Value Size', control: 'number', defaultValue: 13, min: 10, max: 28, step: 1, unit: 'px', section: 'value' },
      // ── Caption + layout ──
      { key: 'label', label: 'Caption', control: 'text', defaultValue: 'Uploading…' },
      { key: 'labelColor', label: 'Caption Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
      { key: 'labelSize', label: 'Caption Size', control: 'number', defaultValue: 13, min: 10, max: 18, step: 1, unit: 'px' },
      { key: 'stackGap', label: 'Gap', control: 'number', defaultValue: 8, min: 0, max: 24, step: 2, unit: 'px' },
    ],
    layoutVariants: [
      {
        key: 'variant',
        label: 'Variant',
        options: [
          { value: 'linear', label: 'Linear' },
          { value: 'ring', label: 'Ring' },
        ],
        defaultValue: 'linear',
      },
    ],
    api: {
      importPath: '@viax.io/uxm/ui',
      importNames: 'ProgressBar',
      props: [
        { name: 'value', type: 'number', required: true, description: 'Completion 0–100. Clamped into range. In production the consumer drives this from real progress data.' },
        { name: 'variant', type: '"linear" | "ring"', defaultValue: '"linear"', description: 'Linear track+fill or circular ring (CSS conic-gradient, no SVG). Both are determinate.' },
        { name: 'label', type: 'string', description: 'Optional caption — above the bar (linear) / below the ring (ring). Also becomes the accessible name.' },
        { name: 'valueText', type: 'string', description: 'Override the percentage text (defaults to `${Math.round(value)}%`).' },
        { name: '...rest', type: 'HTMLAttributes<HTMLDivElement>', description: 'Native attributes pass through to the root.' },
      ],
    },
  },
  {
    id: 'banner',
    name: 'Banner',
    category: 'Feedback',
    description: 'Persistent full-width strip rendered inline in page flow — stays until user dismisses or consumer removes. Use for system states and announcements (e.g. "Maintenance at 02:00", "Q1 forecast beat target"). For transient feedback ("Saved", "Copied") use Toast via `toast.*()` instead. Color knobs are variant-scoped via `showWhen` (success / info / warning / error) — switching the variant picker swaps which 3 color knobs are visible, each defaulting to its own semantic palette. Shape knobs (radius / paddings / font) apply across all variants.',
    styleProperties: [
      // ── Success colors (showWhen: variant=success) ──
      { key: 'successBg',     label: 'Background',  control: 'color', defaultValue: 'var(--color-success-bg)',     section: 'colors', showWhen: { variant: 'success' } },
      { key: 'successText',   label: 'Text Color',  control: 'color', defaultValue: 'var(--color-success-text)',   section: 'colors', showWhen: { variant: 'success' } },
      { key: 'successBorder', label: 'Border Color', control: 'color', defaultValue: 'var(--color-success-border)', section: 'colors', showWhen: { variant: 'success' } },
      // ── Info colors (showWhen: variant=info) ──
      { key: 'infoBg',     label: 'Background',  control: 'color', defaultValue: 'var(--color-info-bg)',     section: 'colors', showWhen: { variant: 'info' } },
      { key: 'infoText',   label: 'Text Color',  control: 'color', defaultValue: 'var(--color-info-text)',   section: 'colors', showWhen: { variant: 'info' } },
      { key: 'infoBorder', label: 'Border Color', control: 'color', defaultValue: 'var(--color-info-border)', section: 'colors', showWhen: { variant: 'info' } },
      // ── Warning colors (showWhen: variant=warning) ──
      { key: 'warningBg',     label: 'Background',  control: 'color', defaultValue: 'var(--color-warning-bg)',     section: 'colors', showWhen: { variant: 'warning' } },
      { key: 'warningText',   label: 'Text Color',  control: 'color', defaultValue: 'var(--color-warning-text)',   section: 'colors', showWhen: { variant: 'warning' } },
      { key: 'warningBorder', label: 'Border Color', control: 'color', defaultValue: 'var(--color-warning-border)', section: 'colors', showWhen: { variant: 'warning' } },
      // ── Error colors (showWhen: variant=error) — defaults reference the
      // `--color-danger-*` token family (existing token naming) but the
      // variant key itself is `error` to match the BannerVariant union. ──
      { key: 'errorBg',     label: 'Background',  control: 'color', defaultValue: 'var(--color-danger-bg)',     section: 'colors', showWhen: { variant: 'error' } },
      { key: 'errorText',   label: 'Text Color',  control: 'color', defaultValue: 'var(--color-danger-text)',   section: 'colors', showWhen: { variant: 'error' } },
      { key: 'errorBorder', label: 'Border Color', control: 'color', defaultValue: 'var(--color-danger-border)', section: 'colors', showWhen: { variant: 'error' } },
      // ── Shape (variant-agnostic) ──
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 16, min: 8, max: 32, step: 4, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 12, min: 4, max: 24, step: 4, unit: 'px' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 14, min: 10, max: 20, step: 1, unit: 'px' },
    ],
    layoutVariants: [
      {
        key: 'variant',
        label: 'Variant',
        options: [
          { value: 'success', label: 'Success' },
          { value: 'info', label: 'Info' },
          { value: 'warning', label: 'Warning' },
          { value: 'error', label: 'Error' },
        ],
        defaultValue: 'success',
      },
    ],
    events: [
      { name: 'onDismiss', description: 'Fires when the user clicks the close affordance — only present if the Banner was rendered with one.', payload: 'void' },
    ],
  },
  {
    id: 'bulk-action-bar',
    name: 'Bulk Action Bar',
    category: 'Feedback',
    description: "Floating toolbar that surfaces once rows are selected: \"{N} selected · actions · × clear\". Purely presentational — the consumer wires it to its own `selectedKeys` state and positions it (typically fixed/sticky near the bottom of a table view). Pairs with the DataTable's row selection. The `.uxm-bulk-action-bar` root IS the styled card surface (background / border / decomposed shadow); the per-part colours (action / danger / divider / clear ×) theme the inner buttons. Destructive actions get the danger treatment via `danger: true`.",
    styleProperties: [
      // ── Bar surface (the floating card) ──
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'bar' },
      { key: 'color', label: 'Count Text', control: 'color', defaultValue: 'var(--color-text)', section: 'bar' },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'bar' },
      { key: 'borderRadius', label: 'Radius', control: 'slider', defaultValue: 12, min: 0, max: 24, step: 1, unit: 'px', section: 'bar' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 12, min: 4, max: 28, step: 2, unit: 'px', section: 'bar' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 8, min: 2, max: 20, step: 1, unit: 'px', section: 'bar' },
      { key: 'gap', label: 'Gap', control: 'number', defaultValue: 8, min: 0, max: 20, step: 1, unit: 'px', section: 'bar' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 14, min: 10, max: 18, step: 1, unit: 'px', section: 'bar' },

      // ── Drop shadow — decomposed into Color / Blur / Offset Y (same
      //    pattern as the Menu / Calendar floating panels). Composed into
      //    a single box-shadow in styles.css. Default lifts the bar off
      //    the page (0 10px 28px rgba(0,0,0,0.16)). ──
      { key: 'shadowColor', label: 'Color', control: 'color', defaultValue: 'rgba(0, 0, 0, 0.16)', section: 'shadow' },
      { key: 'shadowBlur', label: 'Blur', control: 'slider', defaultValue: 28, min: 0, max: 60, step: 1, unit: 'px', section: 'shadow' },
      { key: 'shadowOffsetY', label: 'Offset Y', control: 'slider', defaultValue: 10, min: 0, max: 32, step: 1, unit: 'px', section: 'shadow' },

      // ── Action buttons (the plain commands) ──
      { key: 'actionColor', label: 'Text', control: 'color', defaultValue: 'var(--color-text)', section: 'actions' },
      { key: 'actionHoverBg', label: 'Hover Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'actions' },
      { key: 'actionRadius', label: 'Radius', control: 'slider', defaultValue: 6, min: 0, max: 12, step: 1, unit: 'px', section: 'actions' },

      // ── Destructive action (Delete etc.) — danger text at rest, a
      //    danger-tinted surface on hover. Reuses the danger token trio. ──
      { key: 'dangerColor', label: 'Text', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'danger' },
      { key: 'dangerHoverBg', label: 'Hover Background', control: 'color', defaultValue: 'var(--color-danger-bg)', section: 'danger' },

      // ── Divider ── (the clear × is the IconButton atom, themed there)
      { key: 'dividerColor', label: 'Divider', control: 'color', defaultValue: 'var(--color-border)', section: 'divider' },
    ],
    // No layout variants — the selection count is runtime data, not a
    // design knob, and the × clear is a behavioral prop (`onClear`), so the
    // preview just renders a representative count.
    layoutVariants: [],
    events: [
      { name: 'onClear', description: 'Fires when the user clicks the trailing × to clear the selection. Omit `onClear` to hide the ×.', payload: 'void' },
      { name: 'action.onClick', description: "Per-action handler — fires when an action button is clicked. Wired via each entry's `onClick`.", payload: 'void' },
    ],
    api: {
      importPath: '@viax.io/uxm/ui',
      importNames: 'BulkActionBar',
      props: [
        { name: 'count', type: 'number', required: true, description: 'Number of selected items. Drives the default "{n} selected" label.' },
        { name: 'actions', type: 'BulkAction[]', description: 'Action buttons in display order. Each: { key, label, icon?, danger?, disabled?, onClick? }. Set `danger: true` for destructive actions (Delete/Remove).' },
        { name: 'onClear', type: '() => void', description: 'When provided, renders a trailing × that clears the selection.' },
        { name: 'countLabel', type: '(count: number) => ReactNode', description: 'Override the count label — e.g. for pluralisation or a different noun ("3 rows").' },
        { name: 'className', type: 'string', description: "Extra classes appended after the atom's own `uxm-bulk-action-bar`." },
        { name: 'style', type: 'CSSProperties', description: 'Inline style — use for fixed/sticky positioning in the consuming layout.' },
      ],
    },
  },
  {
    id: 'toast',
    name: 'Toast',
    category: 'Feedback',
    description: 'Transient corner notification rendered inside the Toaster shell. Neutral elevated card surface (matches the active theme — white in light, raised-dark in dark) with a colored left-edge accent + colored icon communicating the variant. Fired imperatively via `toast.success("…")`. Use for brief after-the-fact feedback ("Saved", "Copied"); for persistent status messages inline in the page, use Banner instead.',
    styleProperties: [
      // ── Neutral surface (variant-agnostic) ──
      { key: 'backgroundColor', label: 'Background',  control: 'color', defaultValue: 'var(--color-card)',   section: 'colors' },
      { key: 'color',           label: 'Text Color',  control: 'color', defaultValue: 'var(--color-text)',   section: 'colors' },
      // Default `transparent` — the shadow does the lift; outer border
      // is opt-in for designers who want a visible outline. The colored
      // left-edge accent is set per-variant and isn't affected by this.
      { key: 'borderColor',     label: 'Border Color', control: 'color', defaultValue: 'transparent', section: 'colors' },
      // ── Per-variant icon color — only the active variant's knob is
      //    visible at a time. The icon is the sole variant signal; no
      //    stripe / pill / background tint. ──
      { key: 'successAccent', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-success-text)', section: 'colors', showWhen: { variant: 'success' } },
      { key: 'infoAccent',    label: 'Icon Color', control: 'color', defaultValue: 'var(--color-info-text)',    section: 'colors', showWhen: { variant: 'info' } },
      { key: 'warningAccent', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-warning-text)', section: 'colors', showWhen: { variant: 'warning' } },
      // Error variant: default references the `--color-danger-*` family
      // (existing brand-token naming). Save var name: `--uxm-toast-
      // error-accent`.
      { key: 'errorAccent',   label: 'Icon Color', control: 'color', defaultValue: 'var(--color-danger-text)',  section: 'colors', showWhen: { variant: 'error' } },
      // ── Shape (variant-agnostic) ──
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 10, min: 0, max: 16, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 16, min: 8, max: 24, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 12, min: 6, max: 20, step: 2, unit: 'px' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 14, min: 10, max: 16, step: 1, unit: 'px' },
      { key: 'iconSize', label: 'Icon Size', control: 'number', defaultValue: 16, min: 12, max: 24, step: 1, unit: 'px' },
    ],
    layoutVariants: [
      {
        key: 'variant',
        label: 'Variant',
        options: [
          { value: 'success', label: 'Success' },
          { value: 'info', label: 'Info' },
          { value: 'warning', label: 'Warning' },
          { value: 'error', label: 'Error' },
        ],
        defaultValue: 'success',
      },
    ],
    api: {
      importPath: '@viax.io/uxm/ui',
      importNames: ['Toaster', 'toast'],
      props: [
        { name: 'toast.success(message, options?)', type: '(message: string, options?: { duration?: number, id?: string }) => string', description: 'Fire a success toast. Returns the toast id for manual dismissal via toast.dismiss(id).' },
        { name: 'toast.info(message, options?)', type: '(message: string, options?: ToastOptions) => string', description: 'Fire an info toast.' },
        { name: 'toast.warning(message, options?)', type: '(message: string, options?: ToastOptions) => string', description: 'Fire a warning toast.' },
        { name: 'toast.error(message, options?)', type: '(message: string, options?: ToastOptions) => string', description: 'Fire an error toast.' },
        { name: '<Toaster position max />', type: 'ToasterProps', description: "Mount once at the app root. `position`: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'. `max`: stack cap." },
      ],
    },
    events: [
      { name: 'onDismiss', description: 'Fires when the user clicks the close X or the auto-dismiss timer elapses.', payload: 'void' },
    ],
  },
  {
    id: 'tooltip',
    name: 'Tooltip',
    category: 'Feedback',
    description: 'Small popup tooltip for extra information.',
    styleProperties: [
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-text)', section: 'colors' },
      { key: 'color', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-inverse)', section: 'colors' },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 6, min: 0, max: 16, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 12, min: 4, max: 24, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 6, min: 2, max: 16, step: 2, unit: 'px' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px' },
      { key: 'showArrow', label: 'Show Arrow', control: 'toggle', defaultValue: true },
    ],
    layoutVariants: [],
  },
];
