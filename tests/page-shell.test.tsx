import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PageShell } from '@/ui';

/**
 * `topBarPlacement` decides the DOM order, not just the paint: `above` puts the
 * full-width top bar first, ahead of the sidebar, so the brand and app switcher
 * it holds come first in reading and tab order too.
 */
function slots(container: HTMLElement) {
  return [...container.querySelectorAll('.uxm-page-shell__top-bar, .uxm-page-shell__sidebar, .uxm-page-shell__content')].map(
    (el) => el.className.replace('uxm-page-shell__', ''),
  );
}

const shell = (placement?: 'beside' | 'above') => (
  <PageShell topBarPlacement={placement} sidebar={<nav>Nav</nav>} topBar={<header>Bar</header>}>
    Page
  </PageShell>
);

describe('PageShell topBarPlacement', () => {
  it('beside (default): the sidebar comes first and the top bar heads the column', () => {
    const { container } = render(shell());
    expect(slots(container)).toEqual(['sidebar', 'top-bar', 'content']);
    expect(container.querySelector('.uxm-page-shell__body > .uxm-page-shell__top-bar')).not.toBeNull();
    expect(container.firstElementChild).not.toHaveClass('uxm-page-shell--top-bar-above');
  });

  it('above: the top bar comes first, outside the row of sidebar and content', () => {
    const { container } = render(shell('above'));
    expect(slots(container)).toEqual(['top-bar', 'sidebar', 'content']);
    expect(container.querySelector('.uxm-page-shell__body > .uxm-page-shell__sidebar')).not.toBeNull();
    expect(container.firstElementChild).toHaveClass('uxm-page-shell--top-bar-above');
  });
});
