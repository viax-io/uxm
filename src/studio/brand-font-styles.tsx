import { useUxm } from './lib/context';
import { fontFileUrl, safeFontFamily } from './persistence/generate-css';

/**
 * Live mirror of the brand-font output that `generateOverridesCss` emits
 * after Build: loads the Google Fonts stylesheet for `brand.fontFamily`
 * and applies it via `--brand-font` on `:root` + `body { font-family }`.
 * Without this, picking a typeface in Brand Settings has no visible
 * effect in hosts where persistence is a no-op (the static portal) — and
 * even in a persisting host nothing changed until Publish.
 *
 * `fontFamily` is sanitised with the same `safeFontFamily` guard the Build
 * path uses before being interpolated into the `<style>` tag. React 19
 * hoists the `<link rel="stylesheet">` (with `precedence`) into `<head>`
 * and dedupes it by href, so no manual DOM effects are needed.
 *
 * No `!important` here (unlike the generated `components.css`, which needs
 * it to beat the app cascade): a live `<style>` late in `<body>` already
 * wins over the stylesheets, and `!important` would fight the inline
 * monospace font samples the previews set.
 *
 * The `<style>` renders even when no font is picked: a host may carry a
 * previously PUBLISHED font in its own stylesheet (the generated
 * `components.css` / `#uxm-overrides` sets `--brand-font` + `body` with
 * `!important`), and reverting to the default live only works by
 * re-declaring `--brand-font` with the default stack — returning null
 * would leave the published font in charge until the next Publish.
 */
export function BrandFontStyles() {
  const { brand } = useUxm();
  const fontFamily = safeFontFamily(brand.fontFamily);

  return (
    <>
      {fontFamily && (
        <link rel="stylesheet" precedence="default" href={fontFileUrl(fontFamily)} />
      )}
      <style>{`:root { --brand-font: ${fontFamily ? `"${fontFamily}", ` : ''}var(--font-inter), system-ui, sans-serif; }
body { font-family: var(--brand-font); }`}</style>
    </>
  );
}
