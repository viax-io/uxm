import type { StudioLocaleModule } from './types';

/**
 * Lazy dictionary loaders, one static entry per shipped locale.
 *
 * Written out rather than built from a template literal on purpose: a
 * `import(\`./locales/${tag}\`)` is opaque to every bundler, which then either
 * inlines every dictionary into the studio chunk or drops them all. Spelled
 * out like this, each locale becomes its own chunk and a session in German
 * downloads German and nothing else.
 *
 * `en` is absent by design — it is the source language, its text is its own
 * key, and resolving it needs no fetch at all.
 */
export const STUDIO_LOCALE_LOADERS: Record<string, () => Promise<StudioLocaleModule>> = {
  de: () => import('./locales/de'),
  es: () => import('./locales/es'),
  fr: () => import('./locales/fr'),
  it: () => import('./locales/it'),
  ja: () => import('./locales/ja'),
  nl: () => import('./locales/nl'),
  pl: () => import('./locales/pl'),
  'pt-BR': () => import('./locales/pt-BR'),
  tr: () => import('./locales/tr'),
  uk: () => import('./locales/uk'),
};
