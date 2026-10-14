import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { getStudioLocaleMeta, STUDIO_SOURCE_LOCALE } from './catalog';
import { STUDIO_LOCALE_LOADERS } from './loaders';
import { resolveStudioLocale } from './resolve';

import type {
  StudioLocaleMeta,
  StudioMessages,
  StudioNamespace,
  StudioPluralForms,
  StudioTranslate,
  StudioTranslatePlural,
} from './types';
import type { ReactNode } from 'react';

export interface StudioI18nValue {
  /** The tag actually in use — always one the studio ships a dictionary for. */
  locale: string;
  meta: StudioLocaleMeta;
  /** Writing direction for the resolved locale. */
  dir: 'ltr' | 'rtl';
  t: StudioTranslate;
  tp: StudioTranslatePlural;
  /**
   * Switch the workbench language. Present only when the host passed no
   * `locale` — then the studio offers its own switcher and keeps the pick in
   * memory (never storage, never `navigator`). A host that passes `locale`
   * owns it, and this is `undefined`.
   */
  setLocale?: (tag: string) => void;
}

/** Substitute `{name}` placeholders. Unknown names are left as written. */
function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (whole, name) =>
    name in vars ? String(vars[name]) : whole);
}

/** Substitute `{count}`, formatted in the locale's own digits and grouping. */
function withCount(template: string, count: number, locale: string): string {
  return interpolate(template, { count: new Intl.NumberFormat(locale).format(count) });
}

const SOURCE_META = getStudioLocaleMeta(STUDIO_SOURCE_LOCALE) as StudioLocaleMeta;

/** English identity: every key is its own value, so `t` is the identity function. */
const SOURCE_VALUE: StudioI18nValue = {
  locale: STUDIO_SOURCE_LOCALE,
  meta: SOURCE_META,
  dir: 'ltr',
  t: (_ns: StudioNamespace, source: string, vars?: Record<string, string | number>) =>
    interpolate(source, vars),
  tp: (_ns: StudioNamespace, forms: StudioPluralForms, count: number) =>
    withCount(count === 1 ? forms.one : forms.other, count, STUDIO_SOURCE_LOCALE),
};

const StudioI18nContext = createContext<StudioI18nValue>(SOURCE_VALUE);

export interface StudioI18nProviderProps {
  /**
   * BCP-47 tag from the host app. The library does **not** work out which
   * language the user is in — it has no backend, no storage and no business
   * guessing. The host resolves that however it resolves it and passes the
   * answer down; anything the studio doesn't ship degrades to the base
   * language or to English.
   *
   * Omitted → the studio starts in English and exposes `setLocale` so its
   * own switcher can change it for the session, in memory only.
   */
  locale?: string;
  children: ReactNode;
}

/**
 * Carries one studio dictionary to the workbench chrome below it.
 *
 * Mounted by `UxmApp` from its `locale` prop — a consumer never mounts this
 * directly. Non-English dictionaries load lazily, and the tree is held back
 * until the dictionary is in: rendering English first and swapping a tick
 * later is the one failure mode worth avoiding, since it is visible on every
 * single boot. English resolves synchronously, so the default path never
 * waits.
 */
export function StudioI18nProvider({ locale, children }: StudioI18nProviderProps) {
  // Used only when the host passes nothing: the user's explicit pick from the
  // studio's own switcher, held for the session. Not detection — the library
  // still never reads storage or `navigator` to guess it.
  const [ownLocale, setOwnLocale] = useState<string>(STUDIO_SOURCE_LOCALE);
  const hostOwned = locale !== undefined;
  const { tag } = resolveStudioLocale(hostOwned ? locale : ownLocale);
  const [loaded, setLoaded] = useState<{ tag: string; messages: StudioMessages } | null>(null);
  // A chunk that will not load must not wedge the workbench. Recorded rather
  // than retried: the same import would fail the same way, and English is a
  // worse experience than German but it is an experience.
  const [failedTag, setFailedTag] = useState<string | null>(null);
  // The tag the workbench booted with — the only one worth holding the tree for.
  const [bootTag] = useState(tag);

  useEffect(() => {
    if (tag === STUDIO_SOURCE_LOCALE) return;
    const load = STUDIO_LOCALE_LOADERS[tag];
    if (!load || loaded?.tag === tag || failedTag === tag) return;
    let cancelled = false;
    load()
      .then((mod) => {
        if (!cancelled) setLoaded({ tag, messages: mod.messages });
      })
      .catch(() => {
        if (!cancelled) setFailedTag(tag);
      });
    return () => {
      cancelled = true;
    };
  }, [tag, loaded?.tag, failedTag]);

  const setLocale = hostOwned ? undefined : setOwnLocale;

  const value = useMemo<StudioI18nValue>(() => {
    // While a switch is in flight `loaded` still holds the previous
    // dictionary — keep showing it rather than flashing English. Switching
    // to English, or a dictionary that failed, renders the source.
    if (!loaded || tag === STUDIO_SOURCE_LOCALE || failedTag === tag) {
      return setLocale ? { ...SOURCE_VALUE, setLocale } : SOURCE_VALUE;
    }
    const shown = loaded.tag;
    const meta = getStudioLocaleMeta(shown) ?? SOURCE_META;
    const { messages } = loaded;
    return {
      locale: shown,
      setLocale,
      meta,
      dir: meta.dir,
      // `null` ("not translated here") and `''` both fall through to the
      // English source. The source text is a readable last resort, which is
      // why the dictionaries are keyed by it rather than by dotted codes.
      t: (ns, source, vars) => interpolate(messages[ns]?.[source] || source, vars),
      tp: (ns, forms, count) => {
        const category = new Intl.PluralRules(shown).select(count);
        const bucket = messages[ns];
        const picked =
          bucket?.[`${forms.other}#${category}`] ||
          bucket?.[`${forms.other}#other`] ||
          (count === 1 ? forms.one : forms.other);
        return withCount(picked, count, shown);
      },
    };
  }, [loaded, tag, failedTag, setLocale]);

  // Hold the tree only while the boot dictionary is in flight. Rendering
  // English first and swapping a tick later is the one failure mode worth
  // avoiding on boot. A later switch keeps the previous dictionary on screen
  // instead: returning null then would unmount the whole workbench and drop
  // its state (the selected component, unsaved edits).
  const pending =
    !loaded
    && tag === bootTag
    && tag !== STUDIO_SOURCE_LOCALE
    && !!STUDIO_LOCALE_LOADERS[tag]
    && failedTag !== tag;
  if (pending) return null;

  return <StudioI18nContext.Provider value={value}>{children}</StudioI18nContext.Provider>;
}

/** The whole i18n value — locale, metadata, direction and `t`. */
export function useStudioI18n(): StudioI18nValue {
  return useContext(StudioI18nContext);
}

/** Just the counted-string translator — see {@link useStudioT}. */
export function useStudioTp(): StudioTranslatePlural {
  return useContext(StudioI18nContext).tp;
}

/**
 * Just the translator:
 *
 * ```tsx
 * const t = useStudioT();
 * <h2>{t('component', def.name)}</h2>
 * ```
 *
 * Outside a provider it is the identity function, so a studio surface rendered
 * in isolation (a test, a story) shows English rather than throwing.
 */
export function useStudioT(): StudioTranslate {
  return useContext(StudioI18nContext).t;
}
