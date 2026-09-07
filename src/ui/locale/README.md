# UxmLocaleProvider

Broadcasts one BCP-47 locale to every UXM atom that formats dates, numbers, or units through `Intl`.

**This is not an i18n engine.** UXM ships no message catalogue and no translation runtime, and it never will — that would force a translation dependency onto every consumer of a primitives library. Translated *copy* stays the consumer's job and arrives through each atom's label props (`clearLabel`, `labels`, `countLabel`, …). What this provider carries is the one thing those props cannot express: which locale `Intl` should format with, so month names, decimal separators, and byte units follow the app instead of silently defaulting to US English.

Only the atoms that actually call `Intl` read it: `Calendar`, `DateInput` (via `Calendar`), `EditableCell` (via `Calendar`), `CurrencyInput`, and `FileUpload`.

## Usage

Mount once near the app root:

```tsx
import { UxmLocaleProvider } from '@viax/uxm';

function App() {
  return (
    <UxmLocaleProvider locale="uk-UA">
      <Routes />
    </UxmLocaleProvider>
  );
}
```

Everything below it formats in Ukrainian — `Calendar` renders `серпень 2026`, `CurrencyInput` renders `1 234,56`, `FileUpload` renders `471,0 кБ`.

A `locale` prop on an individual atom still wins, so one always-USD amount or one always-ISO date can opt out locally:

```tsx
<UxmLocaleProvider locale="uk-UA">
  <CurrencyInput value={amount} onChange={setAmount} />        {/* uk-UA */}
  <CurrencyInput value={usdAmount} onChange={setUsd} locale="en-US" />
</UxmLocaleProvider>
```

Pair it with translated labels — the provider handles formatting, the props handle copy:

```tsx
<UxmLocaleProvider locale="uk-UA">
  <DateInput
    format="dmy"
    clearLabel={t('common.clear')}
    openCalendarLabel={t('date.openCalendar')}
    calendarDialogLabel={t('date.chooseDate')}
    invalidMessage={t('date.invalid')}
  />
</UxmLocaleProvider>
```

## API

| Export | Type | Description |
|--------|------|-------------|
| `UxmLocaleProvider` | `({ locale, children }) => JSX.Element` | Context provider. `locale` is a BCP-47 tag passed straight to `Intl`. |
| `useUxmLocale` | `(explicit?: string) => string` | Resolves the effective locale: explicit prop → nearest provider → `DEFAULT_UXM_LOCALE`. Atoms call this with their own `locale` prop. |
| `DEFAULT_UXM_LOCALE` | `'en-US'` | The fallback when nothing is provided. Matches the English defaults baked into the label props, so an app that localises nothing renders exactly as before. |

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `locale` | `string` | – | **Required.** BCP-47 tag — `"uk-UA"`, `"de-DE"`, `"en-GB"`. Not validated; passed verbatim to `Intl`, which falls back to the runtime default for an unrecognised tag. |
| `children` | `ReactNode` | – | Subtree that inherits the locale. |

## Notes

- **No re-render cost when static.** The context value is the locale string itself, so a constant `locale` never invalidates consumers.
- **Nesting works.** An inner provider overrides an outer one for its subtree — useful for a preview pane rendering a different market's formatting.
- **Server rendering is safe.** The provider holds no state and touches no browser API; `Intl` is available in Node.
- **It does not localise copy.** If a `Calendar` renders Ukrainian month names but its prev/next buttons still announce "Previous" / "Next", that is working as designed — pass `previousMonthLabel` / `nextMonthLabel`.
