import type { BrandConfig } from '@/lib/types';

export type Theme = 'light' | 'dark';

/**
 * Translator for a preview's own CHROME — the labels, hints and buttons of the
 * previews that are real editors (brand-settings, login-page), not the sample
 * content of the demo previews.
 *
 * **Sample copy stays English on purpose.** A demo button reading
 * `Speichern` implies the library chose that word, when in a real app the
 * host passes it in as a prop and the library has no opinion at all. Only the
 * furniture a designer actually operates gets translated.
 *
 * Takes the English source as its key, like the rest of the studio's
 * dictionaries. Absent — a host with no dictionaries, or a preview rendered
 * outside the studio — means the source renders as written.
 */
export type PreviewTranslate = (
  source: string,
  vars?: Record<string, string | number>,
) => string;

/**
 * Shell-side state a preview may read. Pure previews ignore this — only
 * the 9 shell-coupled previews (brand-settings, app-sidebar, button-group,
 * filter-tabs, login-page, search-dropdown, tabs, tabs-underline,
 * view-switcher) destructure from it.
 *
 * MODO provides `shell` by reshaping its own `useUxm()` context. Hosts
 * that don't render shell-coupled previews can omit it.
 */
export interface PreviewShellContext {
  brand: BrandConfig;
  setBrand: (patch: Partial<BrandConfig>) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  /**
   * Optional uploader for the brand-settings and login-page previews.
   * When absent, those previews keep their upload UI inert.
   */
  uploadAsset?: (file: File, kind: string) => Promise<{ url: string }>;
  /**
   * Translator for the editor-style previews' own chrome. Injected by the
   * studio; see {@link PreviewTranslate} for what does and does not go
   * through it.
   */
  t?: PreviewTranslate;
  /**
   * Display name of a theme token (`ThemeToken.name`) in the studio's locale —
   * the `token` namespace, which `t` (always `chrome`) cannot reach. Absent,
   * the English name renders.
   */
  tToken?: (name: string) => string;
}

export interface PreviewProps {
  styles: Record<string, string | number | boolean>;
  variants: Record<string, string>;
  componentId: string;
  shell?: PreviewShellContext;
}
