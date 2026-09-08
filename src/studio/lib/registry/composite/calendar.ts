import type { ComponentDef } from '../../types';

export const calendarDef: ComponentDef = {
  id: 'calendar',
  name: 'Calendar',
  category: 'Display',
  description: "Month-view calendar. Selects today on mount; click a day to move the selection. Today's outline stays put regardless of selection. Light-touch atom — selection state internal (overridable), no library binding.",
  styleProperties: [
    // ── Frame: the outer container's surface, border, corners, padding.
    { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-surface)', section: 'frame' },
    { key: 'borderColor', label: 'Border Color', control: 'color', defaultValue: 'var(--color-border)', section: 'frame' },
    { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 12, min: 0, max: 24, step: 1, unit: 'px', section: 'frame' },
    { key: 'padding', label: 'Padding', control: 'number', defaultValue: 16, min: 4, max: 32, step: 2, unit: 'px', section: 'frame' },
    // Elevation — on by default (the floating-surface look), tunable rather
    // than a bare on/off: the box-shadow is built from these three vars.
    // (Code can still drop it entirely with the `shadow={false}` prop.)
    { key: 'shadowColor', label: 'Color', control: 'color', defaultValue: 'rgba(0, 0, 0, 0.12)', section: 'shadow' },
    { key: 'shadowBlur', label: 'Blur', control: 'slider', defaultValue: 20, min: 0, max: 48, step: 1, unit: 'px', section: 'shadow' },
    { key: 'shadowOffsetY', label: 'Offset Y', control: 'slider', defaultValue: 6, min: 0, max: 24, step: 1, unit: 'px', section: 'shadow' },

    // ── Header: month / year label + prev/next nav buttons.
    { key: 'titleColor', label: 'Title Color', control: 'color', defaultValue: 'var(--color-text)', section: 'header' },
    { key: 'titleSize', label: 'Title Size', control: 'number', defaultValue: 14, min: 12, max: 20, step: 1, unit: 'px', section: 'header' },
    { key: 'navColor', label: 'Nav Button Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'header' },

    // ── Weekday row: the "Sun Mon Tue..." labels above the day grid.
    { key: 'weekdayColor', label: 'Weekday Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'weekday' },
    { key: 'weekdaySize', label: 'Weekday Size', control: 'number', defaultValue: 11, min: 9, max: 14, step: 1, unit: 'px', section: 'weekday' },

    // ── Shared States: state colors that apply across day, month, and
    // year cells. Tuning these once changes all three cell types in the
    // matching state. Section appears only for the four states whose
    // knobs live here (default / today / selected / hover). Listed before
    // per-cell-type sections so designers tune cross-cutting concerns first.
    { key: 'defaultColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'shared-states', showWhen: { cellState: 'default' } },
    { key: 'todayBorderColor', label: 'Outline Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'shared-states', showWhen: { cellState: 'today' } },
    { key: 'todayColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'shared-states', showWhen: { cellState: 'today' } },
    { key: 'selectedBg', label: 'Background', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'shared-states', showWhen: { cellState: 'selected' } },
    { key: 'selectedColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-inverse)', section: 'shared-states', showWhen: { cellState: 'selected' } },
    { key: 'hoverBg', label: 'Background', control: 'color', defaultValue: 'color-mix(in srgb, var(--color-text) 6%, transparent)', section: 'shared-states', showWhen: { cellState: 'hover' } },

    // ── Date Cell: dimensions + day-only state colors. In-range / range
    // edges / outside-month / disabled only exist on day cells, so their
    // color knobs live here gated by `cellState`. (Today, selected, hover,
    // and default text color are shared across all cell types — those
    // live in "Shared States" above.)
    { key: 'cellSize', label: 'Cell Size', control: 'number', defaultValue: 36, min: 28, max: 48, step: 2, unit: 'px', section: 'day-cell' },
    { key: 'cellFontSize', label: 'Cell Font Size', control: 'number', defaultValue: 13, min: 11, max: 18, step: 1, unit: 'px', section: 'day-cell' },
    { key: 'cellRadius', label: 'Cell Radius', control: 'slider', defaultValue: 8, min: 0, max: 24, step: 1, unit: 'px', section: 'day-cell' },
    { key: 'inRangeBg', label: 'Background', control: 'color', defaultValue: 'var(--color-accent-subtle)', section: 'day-cell', showWhen: { cellState: 'in-range' } },
    { key: 'inRangeColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'day-cell', showWhen: { cellState: 'in-range' } },
    { key: 'rangeStartBg', label: 'Background', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'day-cell', showWhen: { cellState: 'range-start' } },
    { key: 'rangeStartColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-inverse)', section: 'day-cell', showWhen: { cellState: 'range-start' } },
    { key: 'rangeEndBg', label: 'Background', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'day-cell', showWhen: { cellState: 'range-end' } },
    { key: 'rangeEndColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-inverse)', section: 'day-cell', showWhen: { cellState: 'range-end' } },
    { key: 'outsideColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-subtle)', section: 'day-cell', showWhen: { cellState: 'outside' } },
    { key: 'disabledColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-subtle)', section: 'day-cell', showWhen: { cellState: 'disabled' } },

    // ── Month & Year Cells: drill-up navigation surfaces. One Cell Size
    // knob drives both dimensions (square cells, same pattern as Date Cell)
    // and is shared between month and year cells — they live in the same
    // 4-col grid with the same visual role, so one set of knobs is enough.
    // Knob keeps the `monthCell` prefix; CSS for both `.uxm-calendar__month`
    // and `.uxm-calendar__year` reads it.
    { key: 'monthCellSize', label: 'Cell Size', control: 'number', defaultValue: 64, min: 40, max: 120, step: 4, unit: 'px', section: 'month-year-cells' },
    { key: 'monthCellFontSize', label: 'Cell Font Size', control: 'number', defaultValue: 13, min: 11, max: 18, step: 1, unit: 'px', section: 'month-year-cells' },

    // ── Today button: the footer action that jumps the view back to the
    // current month. Its own knobs (not the today-CELL ones above).
    { key: 'todayButtonColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'todayButton' },
    { key: 'todayButtonHoverBg', label: 'Hover Background', control: 'color', defaultValue: 'color-mix(in srgb, var(--color-accent) 12%, transparent)', section: 'todayButton' },
    { key: 'todayButtonSize', label: 'Font Size', control: 'number', defaultValue: 13, min: 11, max: 18, step: 1, unit: 'px', section: 'todayButton' },
  ],
  layoutVariants: [
    {
      key: 'cellState',
      label: 'Cell State',
      options: [
        { value: 'default', label: 'Default' },
        { value: 'today', label: 'Today' },
        { value: 'selected', label: 'Selected' },
        { value: 'in-range', label: 'In Range' },
        { value: 'range-start', label: 'Range Start' },
        { value: 'range-end', label: 'Range End' },
        { value: 'outside', label: 'Outside Month' },
        { value: 'disabled', label: 'Disabled' },
        { value: 'hover', label: 'Hover' },
      ],
      defaultValue: 'default',
    },
  ],
  events: [
    { name: 'onChange', description: 'Fires when the user picks a date cell.', payload: '{ value: Date }' },
    { name: 'onMonthChange', description: 'Fires when the user navigates to a different month via the prev/next chevrons or by tapping the header.', payload: '{ year: number, month: number }' },
  ],
};
