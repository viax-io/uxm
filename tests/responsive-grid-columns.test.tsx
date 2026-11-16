import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { GridItem, ResponsiveGrid } from '@/ui';

import { compiledCss } from './compiled-css';

/**
 * `columns` turns the auto-fit grid into fixed or weighted tracks that collapse
 * at a container width. What needs pinning: the default mode keeps its single
 * element (nothing changes for existing grids), the columns mode renders the
 * container root + track and the track list, `stackAt` picks a class the
 * stylesheet actually has a block for, and `GridItem` spans reach the CSS.
 */
const root = (c: HTMLElement) => c.firstElementChild as HTMLElement;

describe('ResponsiveGrid columns', () => {
  it('keeps the auto-fit grid a single element without `columns`', () => {
    const { container } = render(
      <ResponsiveGrid min="240px">
        <div>a</div>
      </ResponsiveGrid>,
    );
    expect(root(container).className).toBe('uxm-responsive-grid');
    expect(root(container).querySelector('.uxm-responsive-grid__track')).toBeNull();
    expect(root(container).style.getPropertyValue('--uxm-responsive-grid-columns')).toBe('');
  });

  it('renders a container root and a track, with equal tracks for a count', () => {
    const { container } = render(
      <ResponsiveGrid columns={3}>
        <div>a</div>
      </ResponsiveGrid>,
    );
    const el = root(container);
    expect(el).toHaveClass('uxm-responsive-grid', 'uxm-responsive-grid--columns', 'uxm-responsive-grid--stack-480');
    expect(el.style.getPropertyValue('--uxm-responsive-grid-columns')).toBe('repeat(3, minmax(0, 1fr))');
    expect(el.querySelector(':scope > .uxm-responsive-grid__track > div')).toHaveTextContent('a');
  });

  it('passes a track list through, and honours stackAt', () => {
    const { container, rerender } = render(<ResponsiveGrid columns="2fr 1fr" stackAt={768} />);
    expect(root(container).style.getPropertyValue('--uxm-responsive-grid-columns')).toBe('2fr 1fr');
    expect(root(container)).toHaveClass('uxm-responsive-grid--stack-768');
    rerender(<ResponsiveGrid columns="2fr 1fr" stackAt={false} />);
    expect(root(container).className).not.toMatch(/--stack-/);
  });

  it('sets GridItem spans as the vars the stylesheet reads', () => {
    const { container } = render(
      <>
        <GridItem span={2} rowSpan={3} />
        <GridItem span="full" />
        <GridItem />
      </>,
    );
    const [a, b, c] = Array.from(container.children) as HTMLElement[];
    expect(a).toHaveClass('uxm-grid-item');
    expect(a.style.getPropertyValue('--uxm-grid-item-column')).toBe('span 2');
    expect(a.style.getPropertyValue('--uxm-grid-item-row')).toBe('span 3');
    expect(b.style.getPropertyValue('--uxm-grid-item-column')).toBe('1 / -1');
    expect(c.getAttribute('style')).toBeNull();
  });

  it('has a collapse block for every stackAt value', () => {
    const css = compiledCss('src/ui/responsive-grid/responsive-grid.scss');
    for (const bp of [480, 640, 768, 960]) {
      const at = css.indexOf(`@container (max-width: ${bp}px)`);
      expect(at, `no block for ${bp}`).toBeGreaterThan(-1);
      const block = css.slice(at, css.indexOf('\n}', at));
      expect(block).toMatch(new RegExp(`--stack-${bp} > \\.uxm-responsive-grid__track\\s*\\{[^}]*grid-template-columns:\\s*minmax\\(0, 1fr\\)`));
      expect(block).toMatch(new RegExp(`--stack-${bp} > \\.uxm-responsive-grid__track > \\.uxm-grid-item\\s*\\{[^}]*grid-column:\\s*auto`));
    }
  });
});
