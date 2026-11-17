import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { MediaObject, Stepper } from '@/ui';

/**
 * React 19 delivers `ref` as a plain prop, so it always reached the element at
 * runtime; what failed was the TYPE, because the props extended
 * `HTMLAttributes`. `npm run typecheck` covers this file, so it pins both.
 */
describe('ref on Stepper and MediaObject', () => {
  it('reaches the root element', () => {
    const list = createRef<HTMLOListElement>();
    const media = createRef<HTMLDivElement>();
    render(
      <>
        <Stepper ref={list} aria-label="Progress" steps={[{ label: 'Quoted', state: 'done' }]} />
        <MediaObject ref={media} media={<span>img</span>}>body</MediaObject>
      </>,
    );
    expect(list.current?.tagName).toBe('OL');
    expect(media.current).toHaveClass('uxm-media-object');
  });
});
