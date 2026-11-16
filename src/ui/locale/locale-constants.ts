/* Kept out of the component module on purpose: that module is 'use client',
   and a server component importing a value from one gets a client reference,
   not the value. Here, it stays a plain value on the server too. */

/**
 * Locale used by every UXM atom that formats dates, numbers, or units when
 * neither a `locale` prop nor a surrounding {@link UxmLocaleProvider} says
 * otherwise. Matches the English defaults baked into the atoms' label props,
 * so an app that localises nothing keeps its current rendering.
 */
export const DEFAULT_UXM_LOCALE = 'en-US';
