import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { UxmProvider, useUxm } from '@/studio/lib/context';
import { useGlobalTheme } from '@/studio/lib/use-global-theme';

/**
 * WcagPanel resolves every colour pair with `getComputedStyle`, so the theme it
 * must follow is the `data-theme` actually on <html> — not the studio's own
 * context state. The two diverge in `embed`, where the studio does not render
 * ThemeSync and the HOST drives the attribute: context `theme` never changes on
 * a host toggle, so the panel's effect never re-ran and it reported the wrong
 * theme's ratios indefinitely. That is the mode consuming apps run it in.
 *
 * This pins the difference between the two sources directly, without CSS —
 * jsdom has no cascade, so asserting real ratios here is not possible, but the
 * re-render trigger is the part that was broken.
 */

function ViaGlobalTheme() {
  return <span data-testid="dom">{useGlobalTheme()}</span>;
}

function ViaContext() {
  return <span data-testid="ctx">{useUxm().theme}</span>;
}

// Stands in for the embedding host: sets the attribute itself, exactly as modo
// and rmb do. Nothing in the studio tree is involved.
const hostSetsTheme = (theme: 'light' | 'dark') => {
  document.documentElement.dataset.theme = theme;
};

afterEach(() => {
  delete document.documentElement.dataset.theme;
  localStorage.clear();
});

describe('WcagPanel theme source (embed)', () => {
  it('follows a host-driven data-theme change, which context state does not', async () => {
    hostSetsTheme('light');

    render(
      <UxmProvider>
        <ViaGlobalTheme />
        <ViaContext />
      </UxmProvider>,
    );

    expect(screen.getByTestId('dom')).toHaveTextContent('light');
    expect(screen.getByTestId('ctx')).toHaveTextContent('light');

    // The host toggles. No studio API is called — this is the embed case.
    hostSetsTheme('dark');

    // The DOM-backed source picks it up...
    await waitFor(() => expect(screen.getByTestId('dom')).toHaveTextContent('dark'));

    // ...and the context does NOT. This is not a wart to fix in the context:
    // in embed the studio genuinely does not own the theme. It is the reason
    // the panel had to stop keying its effect on `theme`.
    expect(screen.getByTestId('ctx')).toHaveTextContent('light');
  });

  it('reports the attribute already present at mount', async () => {
    hostSetsTheme('dark');
    render(
      <UxmProvider>
        <ViaGlobalTheme />
      </UxmProvider>,
    );
    expect(screen.getByTestId('dom')).toHaveTextContent('dark');
  });
});
