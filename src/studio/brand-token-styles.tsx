import { useUxm } from './lib/context';
import { safeTokenKey, safeTokenValue } from './persistence/generate-css';
import { DARK_TOKENS_SELECTOR, LIGHT_TOKENS_SELECTOR } from './persistence/theme-selectors';

// `brand.tokens` come from the network (loaded via persistence) and are
// interpolated into a live `<style>` tag below — sanitise every key/value
// first so an attacker-controlled token can't break out of its declaration
// and inject arbitrary CSS/HTML into every session that renders this page.
function renderBlock(selector: string, overrides: Record<string, string> | undefined): string | null {
  if (!overrides) return null;
  const entries = Object.entries(overrides).flatMap(([k, v]) => {
    if (!safeTokenKey(k)) return [];
    const safeValue = safeTokenValue(v);
    return safeValue === undefined ? [] : [[k, safeValue] as const];
  });
  if (entries.length === 0) return null;
  const body = entries.map(([k, v]) => `  ${k}: ${v};`).join('\n');
  return `${selector} {\n${body}\n}`;
}

export function BrandTokenStyles() {
  const { brand } = useUxm();
  const tokens = brand.tokens;
  if (!tokens) return null;

  const blocks = [
    // The same selectors as the published sheet; see theme-selectors.ts.
    renderBlock(LIGHT_TOKENS_SELECTOR, tokens.light),
    renderBlock(DARK_TOKENS_SELECTOR, tokens.dark),
  ].filter(Boolean);

  if (blocks.length === 0) return null;

  return <style>{blocks.join('\n\n')}</style>;
}
