import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { MediaObject } from '@/ui';

import { compiledCss } from './compiled-css';

/**
 * The DOM has to follow the visual order (media first at the start, last at
 * the end), so reading and Tab order match the screen; and every `stackAt`
 * the prop accepts needs a container block in the stylesheet.
 */
const cells = (c: HTMLElement) =>
  Array.from(c.querySelectorAll('.uxm-media-object__inner > div')).map((d) => d.className.replace('uxm-media-object__', ''));

describe('MediaObject', () => {
  it('puts the media first at the start and last at the end', () => {
    const { container, rerender } = render(<MediaObject media={<img alt="" />}>Body</MediaObject>);
    expect(cells(container)).toEqual(['media', 'body']);
    rerender(<MediaObject media={<img alt="" />} mediaPosition="end">Body</MediaObject>);
    expect(cells(container)).toEqual(['body', 'media']);
  });

  it('carries the position, alignment and stacking as classes, and the width and gap as vars', () => {
    const { container, rerender } = render(
      <MediaObject media="m" mediaPosition="end" align="start" mediaWidth="40%" gap={32} className="mine">
        b
      </MediaObject>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass('uxm-media-object', 'uxm-media-object--end', 'uxm-media-object--align-start', 'uxm-media-object--stack-640', 'mine');
    expect(root.style.getPropertyValue('--uxm-media-object-media-width')).toBe('40%');
    expect(root.style.getPropertyValue('--uxm-media-object-gap')).toBe('32px');
    rerender(<MediaObject media="m" stackAt={false}>b</MediaObject>);
    expect((container.firstElementChild as HTMLElement).className).not.toMatch(/--stack-/);
  });

  it('has a stacking block for every stackAt value', () => {
    const css = compiledCss('src/ui/media-object/media-object.scss');
    for (const bp of [480, 640, 768, 960]) {
      const at = css.indexOf(`@container (max-width: ${bp}px)`);
      expect(at, `no block for ${bp}`).toBeGreaterThan(-1);
      expect(css.slice(at, css.indexOf('\n}', at))).toMatch(
        new RegExp(`--stack-${bp} > \\.uxm-media-object__inner\\s*\\{[^}]*grid-template-columns:\\s*minmax\\(0, 1fr\\)`),
      );
    }
  });
});
