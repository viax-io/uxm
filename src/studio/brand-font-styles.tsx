import { useUxm } from './lib/context';
import { fontFileUrl, resolveTypeRoles, safeFontFamily, safeFontWeight, safeLineHeight, safeTypeScale } from './persistence/generate-css';

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
 *
 * The heading vars follow the same always-declare rule, but their "unset"
 * state has no default stack to re-declare (an unset `--brand-heading-font`
 * means "let each component's own fallback paint"). `--x: initial` is the
 * spec's way to make a custom property guaranteed-invalid, i.e. genuinely
 * unset at use time — so this live block cancels a previously published
 * heading font and the components' `var(…, inherit)` / literal-weight
 * fallbacks take back over without waiting for the next Publish.
 */
export function BrandFontStyles() {
  const { brand } = useUxm();
  const fontFamily = safeFontFamily(brand.fontFamily);
  const headingFontFamily = safeFontFamily(brand.headingFontFamily);
  const headingFontWeight = safeFontWeight(brand.headingFontWeight);
  const roles = resolveTypeRoles(brand);
  const typeScale = safeTypeScale(brand.typeScale);
  const bodyLineHeight = safeLineHeight(brand.bodyLineHeight);

  // One <link> per distinct family; React 19 also dedupes by href.
  const families = [...new Set(
    [fontFamily, headingFontFamily, ...roles.map((r) => r.family)].filter((f): f is string => !!f),
  )];
  const stack = (f: string) => `"${f}", var(--font-inter), system-ui, sans-serif`;
  // `initial` = guaranteed-invalid = genuinely unset, so each line cancels a
  // previously PUBLISHED value and the atoms' own fallbacks repaint live.
  const roleVars = roles
    .flatMap(({ role, family, weight, scale }) => [
      `  --type-${role}-font: ${family ? stack(family) : 'initial'};`,
      `  --type-${role}-weight: ${weight ?? 'initial'};`,
      `  --type-${role}-scale: ${scale ?? 'initial'};`,
    ])
    .join('\n');

  return (
    <>
      {families.map((f) => (
        <link key={f} rel="stylesheet" precedence="default" href={fontFileUrl(f)} />
      ))}
      <style>{`:root { --brand-font: ${fontFamily ? `"${fontFamily}", ` : ''}var(--font-inter), system-ui, sans-serif;
  --brand-heading-font: ${headingFontFamily ? stack(headingFontFamily) : 'initial'};
  --brand-heading-weight: ${headingFontWeight ?? 'initial'};
${roleVars}
  --type-scale: ${typeScale ?? 'initial'};
  --type-body-line-height: ${bodyLineHeight ?? 'initial'}; }
body { font-family: var(--brand-font); }${bodyLineHeight ? `
body { line-height: var(--type-body-line-height, normal); }` : ''}`}</style>
    </>
  );
}
