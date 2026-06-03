import { useState } from 'react';

import { cn } from '@/helpers';
import type { PreviewProps } from '@/previews/types';
import { Calendar } from '@/ui';

import type { CSSProperties } from 'react';

function stylesToCssVars(styles: PreviewProps['styles']): CSSProperties {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(styles)) {
    const cssVar = '--uxm-calendar-' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
    if (typeof value === 'boolean') {
      out[cssVar] = value ? '1' : '0';
    } else if (typeof value === 'number') {
      out[cssVar] = `${value}px`;
    } else {
      out[cssVar] = String(value);
    }
  }
  return out as CSSProperties;
}

// Pinned so today's outline always lands on a visible cell in the demo —
// real "today" would drift past the preview as the calendar ages.
const PREVIEW_INITIAL_MONTH = new Date(2024, 9, 1); // October 2024
const PREVIEW_TODAY = new Date(2024, 9, 13);

// Per-cell-type state → modifier class. Day cells support every state
// (in-range / range edges / outside / hover). Month and Year cells only
// support a subset — for the inapplicable states they render default.
const DAY_STATE_MODIFIERS: Record<string, string> = {
  default: '',
  today: 'uxm-calendar__day--today',
  selected: 'uxm-calendar__day--selected',
  'in-range': 'uxm-calendar__day--in-range',
  'range-start': 'uxm-calendar__day--range-start',
  'range-end': 'uxm-calendar__day--range-end',
  outside: 'uxm-calendar__day--outside',
  disabled: 'uxm-calendar__day--disabled',
  hover: 'uxm-calendar__day--hover',
};

// Month/Year cells support the four shared states (default, today, selected,
// hover). Day-only states (in-range, range edges, outside, disabled) don't
// apply — when one of those is active, the month/year samples dim to signal
// "this state doesn't reach me" without removing them from the layout.
const SHARED_STATES = new Set(['default', 'today', 'selected', 'hover']);

const MONTH_STATE_MODIFIERS: Record<string, string> = {
  default: '',
  today: 'uxm-calendar__month--today',
  selected: 'uxm-calendar__month--selected',
  hover: 'uxm-calendar__month--hover',
};

const YEAR_STATE_MODIFIERS: Record<string, string> = {
  default: '',
  today: 'uxm-calendar__year--today',
  selected: 'uxm-calendar__year--selected',
  hover: 'uxm-calendar__year--hover',
};

const captionStyle: CSSProperties = {
  fontSize: 10,
  color: 'var(--color-text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

const stateLabelStyle: CSSProperties = {
  fontSize: 11,
  color: 'var(--color-text-muted)',
};

const stateLabels: Record<string, string> = {
  default: 'Default',
  today: 'Today',
  selected: 'Selected',
  'in-range': 'In Range',
  'range-start': 'Range Start',
  'range-end': 'Range End',
  outside: 'Outside Month',
  disabled: 'Disabled',
  hover: 'Hover',
};

export function CalendarPreview({ styles, variants }: PreviewProps) {
  const cellState = (variants.cellState as string) ?? 'default';
  const calStyle = stylesToCssVars(styles);

  // Month is held in preview state so prev/next nav + outside-month clicks
  // actually move the displayed month in the live Calendar.
  const [month, setMonth] = useState<Date>(PREVIEW_INITIAL_MONTH);

  const dayMod = DAY_STATE_MODIFIERS[cellState] ?? '';
  const monthMod = MONTH_STATE_MODIFIERS[cellState] ?? '';
  const yearMod = YEAR_STATE_MODIFIERS[cellState] ?? '';
  const stateLabel = stateLabels[cellState] ?? 'Default';
  const isDisabled = cellState === 'disabled';
  // Dim month/year samples when the active state is day-only — visual cue
  // that the state doesn't apply to those cell types. Layout stays put so
  // designers can see the dimming "happen" as they toggle.
  const monthYearOpacity = SHARED_STATES.has(cellState) ? 1 : 0.4;

  return (
    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      {/* Live Calendar — fully interactive. Click the title to drill day → month
          → year. Atom owns selection state internally; starts clean. */}
      <Calendar
        month={month}
        onMonthChange={setMonth}
        today={PREVIEW_TODAY}
        style={calStyle}
      />

      {/* Three labeled cell samples — each reflects the active `cellState`
          variant in its own cell type. Column has a min-width so the centered
          canvas content stays put when the active state's name changes. The
          state label is on its own line below the static "Cell samples"
          caption so it never widens the column footprint. */}
      <div style={{ ...calStyle, display: 'flex', flexDirection: 'column', gap: 16, minWidth: 140 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={captionStyle}>Cell samples</div>
          <div style={{ fontSize: 11, color: 'var(--color-text)', fontWeight: 500 }}>{stateLabel}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
          <span style={stateLabelStyle}>Date Cell</span>
          <button
            type="button"
            disabled={isDisabled}
            className={cn('uxm-calendar__day', dayMod)}
          >
            15
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 6,
            opacity: monthYearOpacity,
            transition: 'opacity 0.18s',
          }}
        >
          <span style={stateLabelStyle}>Month Cell</span>
          <button
            type="button"
            className={cn('uxm-calendar__month', monthMod)}
          >
            Oct
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 6,
            opacity: monthYearOpacity,
            transition: 'opacity 0.18s',
          }}
        >
          <span style={stateLabelStyle}>Year Cell</span>
          <button
            type="button"
            className={cn('uxm-calendar__year', yearMod)}
          >
            2024
          </button>
        </div>
      </div>
    </div>
  );
}
