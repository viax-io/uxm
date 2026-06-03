import type { BrandConfig } from '@/lib/types';

export type Theme = 'light' | 'dark';

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
}

export interface PreviewProps {
  styles: Record<string, string | number | boolean>;
  variants: Record<string, string>;
  componentId: string;
  shell?: PreviewShellContext;
}
