import { createContext, useContext } from 'react';

import type { ReactNode } from 'react';

/**
 * Locale used by every UXM atom that formats dates, numbers, or units when
 * neither a `locale` prop nor a surrounding {@link UxmLocaleProvider} says
 * otherwise. Matches the English defaults baked into the atoms' label props,
 * so an app that localises nothing keeps its current rendering.
 */
export const DEFAULT_UXM_LOCALE = 'en-US';

const UxmLocaleContext = createContext<string | undefined>(undefined);

export interface UxmLocaleProviderProps {
  /** BCP-47 tag — e.g. `"uk-UA"`, `"de-DE"`. Passed straight to `Intl`. */
  locale: string;
  children?: ReactNode;
}

/**
 * Broadcasts one BCP-47 locale to every UXM atom below it.
 *
 * This is deliberately **not** an i18n engine — UXM ships no message
 * catalogue and no translation runtime. Translated *copy* stays the
 * consumer's job and arrives through each atom's label props (`clearLabel`,
 * `labels`, …). What this provider carries is the one thing those props
 * cannot express: which locale `Intl` should format with, so month names,
 * decimal separators, and byte units follow the app instead of defaulting to
 * US English.
 *
 * Mount it once near the app root; the atoms that need it read it themselves:
 *
 * ```tsx
 * <UxmLocaleProvider locale="uk-UA">
 *   <App />
 * </UxmLocaleProvider>
 * ```
 *
 * A `locale` prop on an individual atom still wins over the provider, so a
 * single always-USD amount or an always-ISO date can opt out locally.
 */
export function UxmLocaleProvider({ locale, children }: UxmLocaleProviderProps) {
  return <UxmLocaleContext.Provider value={locale}>{children}</UxmLocaleContext.Provider>;
}

/**
 * Resolve the locale an atom should format with, in precedence order:
 * explicit prop → nearest {@link UxmLocaleProvider} → {@link DEFAULT_UXM_LOCALE}.
 *
 * Atoms take `locale?: string` and pass it straight in, which keeps the
 * per-instance override working exactly as it did before the provider existed:
 *
 * ```tsx
 * const locale = useUxmLocale(localeProp);
 * ```
 */
export function useUxmLocale(explicit?: string): string {
  const fromContext = useContext(UxmLocaleContext);
  return explicit ?? fromContext ?? DEFAULT_UXM_LOCALE;
}
