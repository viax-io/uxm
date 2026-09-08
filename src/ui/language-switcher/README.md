# LanguageSwitcher

The single, library-owned control for changing an app's language. A globe + the current language's endonym + a caret, opening the shared `Listbox` panel.

**It is presentational and data-free by design.** It takes the locale list, the current value, and a change handler, and it renders. It issues no query, reads no context, and persists nothing. Where the list comes from (a realm's `getSupportedLocales`, a static array), how the choice is stored (`localStorage`, a user-preference mutation), and what re-renders afterwards are all the consumer's concerns.

That constraint is the reason one component can serve every viax surface without any of them forking it — the moment a switcher knows how to fetch its own options, it is coupled to one backend and the next surface writes its own.

Pair it with [`UxmLocaleProvider`](../locale/README.md): this control picks the tag, that provider pushes it into every atom's `Intl` formatting.

## Usage

```tsx
import { LanguageSwitcher, UxmLocaleProvider } from '@viax.io/uxm/ui';

function App({ supportedLocales }) {          // e.g. from getSupportedLocales
  const [locale, setLocale] = useLocale();    // your store, your persistence

  return (
    <UxmLocaleProvider locale={locale}>
      <AppTopBar
        actions={
          <LanguageSwitcher
            locales={supportedLocales}
            value={locale}
            onChange={setLocale}
            label={t('common.language')}
          />
        }
      />
      <Routes />
    </UxmLocaleProvider>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `locales` | `string[]` | – | **Required.** BCP-47 tags the app offers. Supplied by the consumer; the atom never fetches it. **One entry or none → the component renders `null`.** |
| `value` | `string` | – | **Required.** The selected tag. Controlled — must be one of `locales`. |
| `onChange` | `(locale: string) => void` | – | **Required.** Fires with the picked tag. |
| `getLabel` | `(locale: string) => string` | endonym | Override the label for a tag. Not the translation hook — endonyms are the same in every UI language, so this does **not** change with the app's locale. Use it only for a genuinely different rendering (a flag, a marketing name). |
| `variant` | `'full' \| 'compact'` | `'full'` | `full` shows the endonym beside the globe; `compact` is icon-only, for tight top bars (keeps a ≥34px target). |
| `label` | `string` | `'Language'` | Accessible name for the trigger. See Accessibility — this is the **only** thing naming the control, so translate it. |
| `searchLabel` | `string` | `'Search languages'` | Accessible name **and** placeholder for the panel's search box. |
| `searchable` | `boolean \| 'auto'` | `'auto'` | Reveals the search box past the shared Listbox threshold (6 locales). |
| `disabled` | `boolean` | `false` | Disables the trigger. |
| `className` | `string` | – | Merged onto the Listbox root via `cn`. |
| `style` | `CSSProperties` | – | Applied to the trigger button — the natural place to project `--uxm-language-switcher-*` knobs. |

## Zero-cost absence

With `locales.length <= 1` the component returns `null`. Not `visibility: hidden`, not a disabled control, not an empty wrapper — **nothing is emitted**.

A realm with one configured language has no choice to offer, and an inert affordance would imply it does. The guard sits *after* the internal hooks, so a list that arrives asynchronously and grows from one entry to several does not change hook order.

## Language names

The default label is the language's **endonym** — its name in its own language. `Deutsch`, not `German`; `日本語`, not `Japanese`. A reader who speaks only German has to be able to recognise their own language in the list, which they cannot do if it is labelled in a language they do not read.

Names come from `Intl.DisplayNames`, never a bundled map — a static map goes stale and cannot cover a realm's arbitrary locale list.

Resolution is on the **base language subtag**, because `.of("de-DE")` returns `"Deutsch (Deutschland)"` and `.of("en-US")` returns `"American English"` — a switcher listing countries while it is choosing languages reads as noise. The region is added back **only where two tags share a base language**, decided per base language:

| `locales` | Rendered |
|---|---|
| `["en-US", "de-DE", "ja-JP"]` | English · Deutsch · 日本語 |
| `["en-US", "en-GB"]` | American English · British English |
| `["en-US", "en-GB", "de-DE"]` | American English · British English · **Deutsch** |
| `["xx-YY"]` (unknown tag) | `xx-YY` — degrades to the tag rather than throwing |

CLDR yields lowercase endonyms for several languages (`français`, `español`); the first character is upper-cased for the locale, never the whole string, which would corrupt scripts that have no case.

## It sizes to its content

The atom passes its class into `Listbox`, which merges it onto its own root
(`cn('uxm-listbox', className)`). That root is `width: 100%` — right for the
field-embedded pickers (`CurrencyInput`, `PhoneInput`) and wrong for a
standalone trigger.

Both are single-class selectors, so specificity ties and cascade order decides
— and `listbox.css` is imported *after* `language-switcher.css`. Left alone,
`width: 100%` wins, the switcher stretches across its flex parent, and whatever
follows it (a Sign out button, say) is pushed out of the row. The scss therefore
pins it with `.uxm-listbox.uxm-language-switcher { width: auto; flex-shrink: 0 }`
at specificity (0,2,0), so it holds regardless of import order.

Do **not** try to fix a related problem by reordering the `@import` list in
`src/ui/styles.css` — that ordering is alphabetical and load-bearing elsewhere.

## CSS variables

The **panel is not styled here** — it inherits the library-wide `--uxm-listbox-*` surface, so every picker in the app agrees and a studio save on Listbox themes this dropdown too. Only the trigger is this atom's own surface.

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-language-switcher-bg` | – | `transparent` | Trigger fill. Transparent by default so it sits cleanly on a top bar. |
| `--uxm-language-switcher-border-color` | `--color-border` | – | Trigger border. |
| `--uxm-language-switcher-radius` | – | `8px` | Trigger corner radius. |
| `--uxm-language-switcher-color` | `--color-text` | – | Endonym text. |
| `--uxm-language-switcher-font-size` | – | `13px` | Endonym text size. |
| `--uxm-language-switcher-gap` | – | `6px` | Gap between globe, label and caret. |
| `--uxm-language-switcher-padding-x` | – | `10px` | Trigger horizontal padding. |
| `--uxm-language-switcher-padding-y` | – | `7px` | Trigger vertical padding. |
| `--uxm-language-switcher-hover-bg` | `--color-surface` | – | Hover fill. |
| `--uxm-language-switcher-hover-border-color` | `--color-border-strong` → `--color-border` | – | Hover border. |
| `--uxm-language-switcher-open-bg` | `--color-surface` | – | Fill while the panel is open. |
| `--uxm-language-switcher-open-border-color` | `--color-accent` | – | Border while the panel is open. |
| `--uxm-language-switcher-focus-ring` | `--color-accent` | – | `:focus-visible` outline. |
| `--uxm-language-switcher-caret-color` | `--color-text-muted` | – | Chevron colour. |
| `--uxm-language-switcher-compact-size` | – | `34px` | Min width of the `compact` trigger. |
| `--uxm-language-switcher-compact-padding-x` | – | `8px` | Horizontal padding of the `compact` trigger. |
| `--uxm-language-switcher-disabled-opacity` | – | `0.5` | Dim applied when disabled. |

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-border` | Borders / Border | Trigger border. |
| `--color-text` | Text / Text | Endonym text. |
| `--color-text-muted` | Text / Text Muted | Caret. |
| `--color-surface` | Surfaces / Surface | Hover + open fill. |
| `--color-accent` | Accent / Accent | Focus ring + open border. |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`).

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Default | – | Transparent fill, hairline border, globe + endonym + caret. |
| Hover | `:hover` | Surface fill, stronger border. |
| Focus | `:focus-visible` | 2px accent outline, 2px offset. |
| Open | Panel open | Surface fill, accent border, caret rotated 180°. |
| Disabled | `disabled` | Dimmed, `not-allowed` cursor, removed from tab order by the native `disabled`. |
| `compact` | `variant="compact"` | Icon-only, centred, ≥34px wide. |
| One locale | `locales.length <= 1` | Renders nothing at all. |

## Accessibility

- **`label` is the only accessible name.** The trigger's visible text is a language name, which tells a screen-reader user *what is selected* but not *what the control does* — "English, button" gives no hint that pressing it changes the language. `label` supplies that, and it is a prop because it must be translated by the consumer.
- Each panel row carries `lang={locale}`, so a screen reader switches voice to the right language when reading an endonym. Without it `Deutsch` is announced with English phonetics and is often unintelligible.
- The trigger is a real `<button>` with `aria-haspopup="listbox"` and `aria-expanded`, both supplied by `Listbox`'s `triggerProps` — keyboard interaction, roving focus, type-ahead and Escape-to-close all come from the shared panel rather than being re-implemented here.
- The focus ring uses `outline` (not `box-shadow`) so it survives Windows High Contrast mode, at 2px with a 2px offset to clear ≥3:1 against both the trigger fill and the surface behind it.
- The `compact` variant keeps a ≥34px target so dropping the label does not shrink the hit area below pointer-target guidance.
- Both icons are `aria-hidden` — the globe and the caret are decorative next to the accessible name.
