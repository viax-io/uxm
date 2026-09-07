import { useMemo } from 'react';

import { cn } from '@/helpers';

import { Icon } from '../icon';
import { Listbox } from '../listbox';

import type { CSSProperties } from 'react';

export type LanguageSwitcherVariant = 'full' | 'compact';

export interface LanguageSwitcherProps {
  /**
   * BCP-47 tags the app offers, e.g. `["en-US", "de-DE"]`.
   *
   * **The consumer supplies this — the atom never fetches it.** In a viax
   * portal it comes from the realm's `getSupportedLocales`; the library has no
   * data layer and must not grow one.
   *
   * When this holds **one entry or none, the component renders `null`** — not a
   * disabled control, not a hidden one. Nothing is emitted, so a single-locale
   * app pays zero layout cost.
   */
  locales: string[];
  /** The currently selected tag. Must be one of `locales`. Controlled. */
  value: string;
  /** Fires with the picked BCP-47 tag. */
  onChange: (locale: string) => void;
  /**
   * Override the label shown for a tag. The default renders the language's
   * **endonym** — its name in its own language (`Deutsch`, not `German`) — via
   * `Intl.DisplayNames`, which is why no hand-written name map ships here: a
   * static map goes stale and cannot cover a realm's arbitrary locale list.
   *
   * Pass this only for a genuinely different rendering (adding a region, a
   * flag, a marketing name). It is not the translation hook — endonyms are the
   * same in every UI language, so this does NOT change with the app's locale.
   */
  getLabel?: (locale: string) => string;
  /** `full` (default) shows the current endonym beside the globe; `compact` is icon-only, for tight top bars. */
  variant?: LanguageSwitcherVariant;
  /**
   * Accessible name for the trigger. Default `"Language"`. The trigger's
   * visible text is a language name, which tells a screen-reader user *what*
   * is selected but not *what the control does* — so this is the only thing
   * naming the control, and it must be translated by the consumer.
   */
  label?: string;
  /** Accessible name for the panel's search box. Default `"Search languages"`. */
  searchLabel?: string;
  /** Reveal the panel's search box. Defaults to `'auto'` — shown past the shared Listbox threshold (6). */
  searchable?: boolean | 'auto';
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * The endonym for a tag: the language's name written in that language.
 *
 * `Intl.DisplayNames` is asked for the name *in the target locale itself*
 * (`new Intl.DisplayNames([tag], …)`), which is what turns `de-DE` into
 * `Deutsch` rather than `German`. That is the accessibility requirement — a
 * reader who only speaks German has to recognise their own language in the list.
 *
 * Resolved on the **base language subtag**, not the full tag: `.of("de-DE")`
 * yields `"Deutsch (Deutschland)"` and `.of("en-US")` yields
 * `"American English"`, and a switcher listing countries when it is choosing
 * languages reads as noise. The region is added back by {@link buildLabels}
 * only where it actually disambiguates.
 *
 * Falls back to the bare tag on any runtime that rejects the locale, so an
 * unusual tag degrades to something selectable instead of throwing.
 */
function endonym(locale: string, withRegion: boolean): string {
  const base = locale.split('-')[0];
  try {
    const display = new Intl.DisplayNames([locale], { type: 'language' });
    const name = display.of(withRegion ? locale : base);
    if (!name || name === locale || name === base) return locale;
    // CLDR yields lowercase endonyms for several languages (`français`,
    // `español`). A standalone item in a picker reads as a proper noun in the
    // UI, so title-case the first character only — never the whole string,
    // which would corrupt scripts that have no case at all.
    return name.charAt(0).toLocaleUpperCase(locale) + name.slice(1);
  } catch {
    return locale;
  }
}

/**
 * Label every tag in the list, adding the region **only where two tags share a
 * base language**.
 *
 * A realm offering `["en-US", "de-DE"]` gets `English` / `Deutsch`. One
 * offering `["en-US", "en-GB"]` cannot: two rows both reading `English` are
 * unusable, so those become `American English` / `British English`. The
 * decision is per base language, so a list mixing both cases keeps the short
 * form where it is unambiguous.
 */
function buildLabels(locales: string[]): Map<string, string> {
  const perBase = new Map<string, number>();
  for (const locale of locales) {
    const base = locale.split('-')[0];
    perBase.set(base, (perBase.get(base) ?? 0) + 1);
  }
  return new Map(
    locales.map((locale) => [
      locale,
      endonym(locale, (perBase.get(locale.split('-')[0]) ?? 0) > 1),
    ]),
  );
}

/**
 * LanguageSwitcher — the single, library-owned control for changing the app's
 * language.
 *
 * Deliberately **presentational and data-free**: it takes the locale list, the
 * current value, and a change handler, and it renders. It issues no query,
 * reads no context, and persists nothing. Where the list comes from (a realm
 * config, a static array), how the choice is stored (localStorage, a user
 * preference mutation), and what re-renders afterwards are all the consumer's
 * concerns — the same separation `UxmLocaleProvider` keeps, and the reason one
 * switcher can serve every viax surface without any of them forking it.
 *
 * Pair it with `UxmLocaleProvider`: this control picks the tag, that provider
 * pushes it into every atom's `Intl` formatting.
 *
 * ```tsx
 * <LanguageSwitcher
 *   locales={supportedLocales}
 *   value={locale}
 *   onChange={setLocale}
 *   label={t('common.language')}
 * />
 * ```
 */
export function LanguageSwitcher({
  locales,
  value,
  onChange,
  getLabel,
  variant = 'full',
  label = 'Language',
  searchLabel = 'Search languages',
  searchable = 'auto',
  disabled = false,
  className,
  style,
}: LanguageSwitcherProps) {
  // Endonyms never change with the app's UI language, so this memo is keyed on
  // the list alone — switching locale does not invalidate it.
  const items = useMemo(() => {
    const labels = getLabel ? null : buildLabels(locales);
    return locales.map((locale) => ({
      locale,
      label: getLabel ? getLabel(locale) : labels!.get(locale) ?? locale,
    }));
  }, [locales, getLabel]);

  // Zero-cost absence, not a disabled control: a realm with one configured
  // locale has no choice to offer, and an inert affordance would imply it does.
  // Guarded AFTER the hooks above so hook order stays stable when a locale list
  // arrives asynchronously and grows from one entry to several.
  if (locales.length <= 1) return null;

  const selected = items.find((item) => item.locale === value) ?? null;

  return (
    <Listbox<{ locale: string; label: string }>
      items={items}
      getKey={(item) => item.locale}
      getLabel={(item) => item.label}
      value={selected}
      onChange={(next) => next && onChange(next.locale)}
      disabled={disabled}
      searchable={searchable}
      searchPlaceholder={searchLabel}
      searchAriaLabel={searchLabel}
      matchAnchorWidth={false}
      minPanelWidth={180}
      placement="bottom-end"
      className={cn('uxm-language-switcher', className)}
      aria-label={label}
      renderTrigger={({ open, triggerProps }) => (
        <button
          {...triggerProps}
          type="button"
          className={cn(
            'uxm-language-switcher__trigger',
            `uxm-language-switcher__trigger--${variant}`,
            open && 'uxm-language-switcher__trigger--open',
          )}
          style={style}
          aria-label={label}
        >
          <Icon glyph="globe" size={16} aria-hidden="true" />
          {variant === 'full' && (
            <span className="uxm-language-switcher__current">
              {selected?.label ?? value}
            </span>
          )}
          <span className="uxm-language-switcher__caret" aria-hidden="true">
            <Icon
              glyph="chevron-down"
              size={12}
              strokeWidth={2.2}
              style={{ transform: open ? 'rotate(180deg)' : 'none' }}
            />
          </span>
        </button>
      )}
      renderItem={(item) => (
        <span className="uxm-language-switcher__row" lang={item.locale}>
          {item.label}
        </span>
      )}
    />
  );
}
