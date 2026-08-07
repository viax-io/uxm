# Calendar

A controlled (or uncontrolled) date picker with a unified single-and-range selection model, three drill-up views (day → month → year), and live range-hover preview.

`Calendar` renders a header (`prev` / title / `next`), then one of three grids depending on the active view: a 7-column day grid, a 4-column month grid, or a 4-column year grid (12-year blocks aligned iOS-style to multiples of 12). The title is itself a `<button>` that drills up; cell clicks drill back down. Selection is a single `{ start, end }` value — `end: null` after the first click of a new range, set after the second. The atom infers single-vs-range from the click sequence; consumers don't toggle a mode. Range hover-preview (`hoveredDate` state) updates the highlighted span during the in-flight window between clicks.

## Usage

```tsx
import { Calendar, type CalendarValue } from '@viax/uxm';

function Example() {
  const [value, setValue] = useState<CalendarValue>({ start: null, end: null });
  return (
    <Calendar
      value={value}
      onChange={setValue}
      weekStartsOn={1}
      locale="en-GB"
      isDisabled={(d) => d < new Date()}
    />
  );
}
```

## Props

`CalendarProps` extends `Omit<HTMLAttributes<HTMLDivElement>, 'onChange'>`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `month` | `Date` | uncontrolled (atom owns it, initialised to the selected value's month, else today's) | Currently-displayed month. When provided, controlled by the consumer. |
| `value` | `CalendarValue` | uncontrolled (atom owns it, initial `{ start: null, end: null }`) | Selection value. `{ start, end: null }` for a single date; `{ start, end }` for a range. |
| `today` | `Date` | `new Date()` | Override for "today" — useful for stories and tests. |
| `isDisabled` | `(date: Date) => boolean` | – | Predicate for disabled days. Disabled cells ignore clicks. |
| `weekStartsOn` | `0 \| 1` | `0` | `0` = Sunday (US), `1` = Monday. |
| `locale` | `string` | `'en-US'` | BCP-47 locale tag — drives month label and weekday names via `Intl.DateTimeFormat`. |
| `onChange` | `(value: CalendarValue) => void` | – | Fires after every click. `end` is `null` after the first click of a new range, set after the second. |
| `onMonthChange` | `(next: Date) => void` | – | Fires on prev/next nav, outside-month-cell click, or drill-down from month/year views. |
| `className` | `string` | – | Merged onto the root via `cn`. |
| _(any native div attribute)_ | – | – | Spread onto the root `<div className="uxm-calendar uxm-calendar--view-{view}">`. |
| `previousMonthLabel` | `string` | `'Previous'` | Accessible name for the previous-month button. |
| `nextMonthLabel` | `string` | `'Next'` | Accessible name for the next-month button. |
| `drillUpLabel` | `string` | `'Drill up'` | Accessible name for the month/year drill-up button. |

### `CalendarValue`

```ts
interface CalendarValue {
  start: Date | null;
  end: Date | null;
}
```

| Field | Type | Description |
|-------|------|-------------|
| `start` | `Date \| null` | Range start (or single date). Always the earlier endpoint after a range is committed. |
| `end` | `Date \| null` | Range end. `null` mid-flight (after the first click of a new range); set after the second click. |

The atom automatically swaps `start` / `end` if the user clicks the later date first, so the committed range is always normalised low → high.

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-calendar-background-color` | `--color-surface` | – | Root background. |
| `--uxm-calendar-border-color` | `--color-border` | – | Root border. |
| `--uxm-calendar-border-radius` | – | `12px` | Root border-radius. |
| `--uxm-calendar-padding` | – | `16px` | Root inner padding. |
| `--uxm-calendar-title-color` | `--color-text` | – | Header title button text. |
| `--uxm-calendar-title-size` | – | `14px` | Header title font size. |
| `--uxm-calendar-nav-color` | `--color-text-muted` | – | Prev/next chevron colour. |
| `--uxm-calendar-weekday-color` | `--color-text-muted` | – | Weekday-label colour. |
| `--uxm-calendar-weekday-size` | – | `11px` | Weekday-label font size. |
| `--uxm-calendar-cell-radius` | – | `8px` | Day / month / year cell border-radius. |
| `--uxm-calendar-cell-size` | – | `36px` | Day cell width and height. |
| `--uxm-calendar-cell-font-size` | – | `13px` | Day cell font size. |
| `--uxm-calendar-month-cell-size` | – | `64px` | Month / year cell width and height. |
| `--uxm-calendar-month-cell-font-size` | – | `13px` | Month / year cell font size. |
| `--uxm-calendar-default-color` | `--color-text` | – | Day / month / year default text colour. |
| `--uxm-calendar-hover-bg` | `color-mix(in srgb, --color-text 6%, transparent)` | – | Cell hover background (all views). |
| `--uxm-calendar-outside-color` | `--color-text-subtle` | – | Day-cell text for outside-month dates. |
| `--uxm-calendar-in-range-bg` | `--color-accent-subtle` | – | In-range day background. |
| `--uxm-calendar-in-range-color` | `--color-accent-bold` | – | In-range day text. |
| `--uxm-calendar-range-start-bg` | `--color-accent-bold` | – | Range start day background. |
| `--uxm-calendar-range-start-color` | `--color-text-inverse` | – | Range start day text. |
| `--uxm-calendar-range-end-bg` | `--color-accent-bold` | – | Range end day background. |
| `--uxm-calendar-range-end-color` | `--color-text-inverse` | – | Range end day text. |
| `--uxm-calendar-today-border-color` | `--color-accent-bold` | – | Today-cell outline (day / month / year). |
| `--uxm-calendar-today-color` | `--color-accent-bold` | – | Today-cell text. |
| `--uxm-calendar-selected-bg` | `--color-accent-bold` | – | Single-day selected bg; month / year selected bg. |
| `--uxm-calendar-selected-color` | `--color-text-inverse` | – | Selected text colour. |
| `--uxm-calendar-disabled-color` | `--color-text-subtle` | – | Disabled day text. |

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-surface` | Surfaces / Surface | Root background. |
| `--color-border` | Borders / Border | Root border. |
| `--color-text` | Text / Text | Title text, default cell text, hover-bg mix source. |
| `--color-text-muted` | Text / Text Muted | Nav chevrons, weekday labels. |
| `--color-text-subtle` | Text / Text Subtle | Outside-month days, disabled days. |
| `--color-text-inverse` | Text / Text Inverse | Selected / range-endpoint text. |
| `--color-accent-bold` | Accent / Accent Bold | Selected bg, range endpoints, today outline + text, in-range text. |
| `--color-accent-subtle` | Accent / Accent Subtle | In-range background. |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| View: `day` | initial | 7-column day grid with weekday header; title shows month + year. |
| View: `month` | title click from day view | 4-column month grid; title shows year. |
| View: `year` | title click from month view | 4-column year grid (12-year block); title shows e.g. `2016–2027`; title button is `disabled`. |
| Nav step | prev/next click | Day: ±1 month; month: ±1 year; year: ±12 years. |
| Today | `sameDay(date, today)` | Outline in `--color-accent-bold`; bold weight. |
| Selected (single) | `value.start` set, no range | Filled `--color-accent-bold` background. |
| Range start / end | range committed or in-flight preview | Filled `--color-accent-bold` background on both endpoints. |
| In-range | dates strictly between start and previewEnd | `--color-accent-subtle` bg, `--color-accent-bold` text. |
| Hover preview | range in-flight + mouse enter | Hovered cell becomes the previewEnd; in-range band updates live. |
| Outside month | day cell outside current month | `--color-text-subtle` text. Clicking jumps the month to that date's month. |
| Disabled | `isDisabled(date) === true` | `cursor: not-allowed`, opacity 0.4, click suppressed. |

## Accessibility

- The grid containers use `role="grid"` and cells use `role="gridcell"`. Selected cells carry `aria-selected`; today's cell carries `aria-current="date"` (day view) or `aria-current="true"` (month/year views).
- Header navigation buttons have `aria-label="Previous"` / `"Next"`; the title button has `aria-label="Drill up"` (or no label when at the topmost year view, where it's also `disabled`).
- All cells are real `<button>`s, so `Space`/`Enter` activation and tab traversal work natively. Arrow-key roving focus is NOT implemented — every cell is its own tab stop, which is verbose for keyboard users on the day grid.
- `disabled` is the native HTML attribute, so disabled cells are removed from the tab order and announced as unavailable.
- Range-hover preview is mouse-only — keyboard users see no preview band between clicks. Acceptable since the committed range still updates `aria-selected` on the endpoints.
- The weekday row is `aria-hidden="true"` (the day cells carry the date semantics directly).
- Locale support: month and weekday labels come from `Intl.DateTimeFormat(locale)`; verify your target locales render correctly in your environment.
