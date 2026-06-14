import { useUxm } from './lib/context';

function renderBlock(selector: string, overrides: Record<string, string> | undefined): string | null {
  if (!overrides) return null;
  const entries = Object.entries(overrides);
  if (entries.length === 0) return null;
  const body = entries.map(([k, v]) => `  ${k}: ${v};`).join('\n');
  return `${selector} {\n${body}\n}`;
}

export function BrandTokenStyles() {
  const { brand } = useUxm();
  const tokens = brand.tokens;
  if (!tokens) return null;

  const blocks = [
    renderBlock(':root', tokens.light),
    renderBlock('[data-theme="dark"]', tokens.dark),
  ].filter(Boolean);

  if (blocks.length === 0) return null;

  return <style>{blocks.join('\n\n')}</style>;
}
