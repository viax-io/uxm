import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AppTopBar } from '@/ui';

import { compiledCss } from './compiled-css';

/**
 * `collapseAt` moves the search slot onto a second row below a viewport width.
 * jsdom can't evaluate the media query, so this pins the two halves that have
 * to agree: the prop emits a class, and the stylesheet has a block for every
 * value that class can take, with the rules that do the moving.
 */
const header = (c: HTMLElement) => c.querySelector('header') as HTMLElement;

describe('AppTopBar collapseAt', () => {
  it('emits no modifier without it, so existing bars are untouched', () => {
    const { container } = render(<AppTopBar search={<input aria-label="Search" />} />);
    expect(header(container).className).toBe('uxm-app-top-bar');
  });

  it.each([640, 768, 960, 1024] as const)('emits the modifier for %i', (bp) => {
    const { container } = render(<AppTopBar collapseAt={bp} search={<input aria-label="Search" />} />);
    expect(header(container)).toHaveClass(`uxm-app-top-bar--collapse-${bp}`);
  });

  it('has a block for every value that wraps the bar and moves search to its own row', () => {
    const css = compiledCss('src/ui/app-top-bar/app-top-bar.scss');
    for (const bp of [640, 768, 960, 1024]) {
      const at = css.indexOf(`@media (max-width: ${bp}px)`);
      expect(at, `no block for ${bp}`).toBeGreaterThan(-1);
      const block = css.slice(at, css.indexOf('\n}', at));
      const sel = `.uxm-app-top-bar--collapse-${bp}`;
      expect(block).toMatch(new RegExp(`\\${sel}\\s*\\{[^}]*flex-wrap:\\s*wrap`));
      expect(block).toMatch(new RegExp(`\\${sel} \\.uxm-app-top-bar__left\\s*\\{[^}]*display:\\s*contents`));
      expect(block).toMatch(new RegExp(`\\${sel} \\.uxm-app-top-bar__search\\s*\\{[^}]*flex:\\s*1 0 100%[^}]*order:\\s*1`));
    }
  });
});
