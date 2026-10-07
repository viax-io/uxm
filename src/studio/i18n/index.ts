export { STUDIO_LOCALES, STUDIO_SOURCE_LOCALE, getStudioLocaleMeta } from './catalog';
export { StudioI18nProvider, useStudioI18n, useStudioT, useStudioTp } from './context';
export { resolveStudioLocale } from './resolve';

export type { StudioI18nProviderProps, StudioI18nValue } from './context';
export type { ResolvedStudioLocale, StudioLocaleSource } from './resolve';
export type {
  StudioLocaleMeta,
  StudioLocaleModule,
  StudioMessages,
  StudioNamespace,
  StudioPluralForms,
  StudioTranslate,
  StudioTranslatePlural,
} from './types';
