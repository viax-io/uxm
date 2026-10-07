/**
 * The studio's own UI copy — sidebar, canvas chrome, the properties panel and
 * the knob editors. **Not** the atoms' label props: those stay the consuming
 * app's job and arrive through each component's `*Label` / `*Message` props
 * (see `src/ui/locale/README.md`). What lives here is the design workbench's
 * own furniture, which ships inside the library and therefore cannot be
 * translated by anyone but the library.
 */
export type StudioNamespace =
  /** Hand-written UI copy in `shell/` and `editors/` — buttons, placeholders, tab names. */
  | 'chrome'
  /** The 11 sidebar categories (`App`, `Buttons`, …). */
  | 'category'
  /** Component display names from the registry (`Button — Primary`, …). */
  | 'component'
  /** Knob, variant and option labels from the registry (`Text Color`, `Hover`, …). */
  | 'label'
  /** Properties-panel section headings (`Colors`, `States`, …). */
  | 'section'
  /** Brand token display names from `@/tokens` (`Accent Bold`, `Text Muted`, …). */
  | 'token'
  /**
   * The one-line component blurbs under the canvas title — the text a designer
   * reads to decide whether this is the component they want.
   *
   * Gated like everything else. They were shipped empty at first on the
   * argument that prose churns; the argument was sound and the result was a
   * hole directly under the canvas heading, in the most visible place on the
   * screen. A reworded blurb now costs ten files — which is the actual price
   * of having them translated at all.
   */
  | 'description';

/**
 * One locale's dictionary. Keys are the **English source strings**, not
 * synthetic dotted codes: the registry carries its labels as data
 * (`label: 'Text Color'`), so keying by the English text leaves all ~2200
 * call sites untouched and makes a missing translation fall back to readable
 * English instead of a dotted code on screen. The namespace disambiguates the
 * cases where the same English word needs different translations in different
 * contexts.
 *
 * A `null` value means "deliberately untranslated here" and falls through to
 * the next link in the chain; it is never rendered.
 */
export type StudioMessages = Record<StudioNamespace, Record<string, string | null>>;

/** What a locale file exports, dictionary plus its own identity. */
export interface StudioLocaleModule {
  meta: StudioLocaleMeta;
  messages: StudioMessages;
}

export interface StudioLocaleMeta {
  /** BCP-47 tag as shipped, e.g. `"pt-BR"`, `"de"`. */
  tag: string;
  /** The language's name in its own language — `Deutsch`, not `German`. */
  endonym: string;
  /** Writing direction. `rtl` for Arabic and Persian. */
  dir: 'ltr' | 'rtl';
}

/**
 * `t(namespace, englishSource, vars?)` → the string to render. Never empty.
 *
 * `vars` substitutes `{name}` placeholders, which is how a sentence with a
 * moving part stays one translatable unit: `t('chrome', 'Per {scope}', { scope })`
 * rather than a `'Per ' + scope` the extractor cannot see and a translator
 * cannot reorder.
 */
export type StudioTranslate = (
  namespace: StudioNamespace,
  source: string,
  vars?: Record<string, string | number>,
) => string;

/**
 * The English forms of a counted string. `other` doubles as the dictionary
 * key, so changing it is a key rename and the gate will say so.
 */
export interface StudioPluralForms {
  /** `"{count} result"` */
  one: string;
  /** `"{count} results"` — also the canonical key. */
  other: string;
}

/**
 * `tp(namespace, forms, count)` → the counted string, `{count}` substituted.
 *
 * English picks between `forms.one` and `forms.other` directly. Every other
 * locale looks up `"<forms.other>#<category>"`, where the category comes from
 * that locale's own `Intl.PluralRules` — so Ukrainian gets
 * `one` / `few` / `many` / `other` and Japanese gets a single `other`, instead
 * of both being forced into English's pair.
 */
export type StudioTranslatePlural = (
  namespace: StudioNamespace,
  forms: StudioPluralForms,
  count: number,
) => string;
