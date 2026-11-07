import { describe, expect, it } from 'vitest';

import { compiledCss } from './compiled-css';

/**
 * `toggle="edge"` on a touch-only device at rail widths (a tablet).
 *
 * The handle is the rail's only collapse control in edge mode, and it reveals
 * on hover. A touch-only device has no hover, so it must stay shown there.
 * It used to be `display: none` under `(hover: none)`, which left a tablet's
 * rail stuck in whichever state it was in.
 *
 * jsdom applies no media queries or cascade, so these read the compiled CSS.
 */

const css = compiledCss('src/ui/app-sidebar/app-sidebar.scss');

interface MediaBlock {
  condition: string;
  start: number;
  body: string;
}

/** Every top-level `@media` block, with its condition and body. */
function mediaBlocks(source: string): MediaBlock[] {
  const blocks: MediaBlock[] = [];
  for (const match of source.matchAll(/@media ([^{]+)\{/g)) {
    let depth = 1;
    let i = match.index + match[0].length;
    const bodyStart = i;
    while (depth > 0 && i < source.length) {
      if (source[i] === '{') depth += 1;
      else if (source[i] === '}') depth -= 1;
      i += 1;
    }
    blocks.push({ condition: match[1].trim(), start: match.index, body: source.slice(bodyStart, i - 1) });
  }
  return blocks;
}

const blocks = mediaBlocks(css);
const hidesEdge = (b: MediaBlock) => /\.uxm-app-sidebar__edge\s*\{[^}]*display:\s*none/.test(b.body);
const showsHandle = (b: MediaBlock) => /\.uxm-app-sidebar__edge-toggle\s*\{[^}]*opacity:\s*1/.test(b.body);

describe('AppSidebar edge toggle on touch-only devices', () => {
  it('is hidden only by the mobile-drawer breakpoint, never by (hover: none)', () => {
    const hiding = blocks.filter(hidesEdge);
    expect(hiding.map((b) => b.condition)).toEqual(['(max-width: 767px)']);
  });

  it('is shown on a touch-only device at rail widths', () => {
    const showing = blocks.filter(showsHandle);
    expect(showing.map((b) => b.condition)).toEqual(['(min-width: 768px) and (hover: none)']);
  });

  it('wins over the resting opacity: 0, which has the same specificity, by coming after it', () => {
    // The base rule is a bare `.uxm-app-sidebar__edge-toggle { … opacity: 0 … }`
    // outside any media block; the override must follow it in source order.
    const base = css.search(/\n\.uxm-app-sidebar__edge-toggle\s*\{[^}]*opacity:\s*0;/);
    const override = blocks.find(showsHandle);
    expect(base).toBeGreaterThan(-1);
    expect(override).toBeDefined();
    expect(override!.start).toBeGreaterThan(base);
  });
});
