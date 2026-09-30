import { fireEvent, render, screen } from '@testing-library/react';
import { useLayoutEffect } from 'react';
import { afterEach, describe, expect, it } from 'vitest';

import { UxmProvider, useUxm } from '@/studio/lib/context';
import { ThemeSync } from '@/studio/theme-sync';

/**
 * ThemeSync writes `data-theme` onto <html>. WcagPanel reads every colour pair
 * back out with `getComputedStyle` from inside its own useLayoutEffect, so the
 * attribute has to be in place before layout effects run in the subtree.
 *
 * When this was a passive `useEffect` the panel sampled the OUTGOING theme and
 * sat exactly one toggle behind: in dark it printed the light ratios, and back
 * in light it printed the dark ones. A wrong contrast number in the a11y panel
 * looks exactly like a right one, so this ordering is pinned here rather than
 * left to a comment.
 */

// Stands in for WcagPanel: consumes the context and reads the document from a
// layout effect keyed on `theme`, exactly as the panel resolves its colour
// pairs. Consuming the context is what makes it re-render — UxmProvider's
// `children` element is reference-stable, so a non-consumer would be bailed
// out of the re-render entirely and its effect would never run again.
function LayoutEffectProbe({ seen }: { seen: string[] }) {
  const { theme } = useUxm();
  useLayoutEffect(() => {
    seen.push(document.documentElement.dataset.theme ?? 'unset');
  }, [theme, seen]);
  return null;
}

function ThemeToggle() {
  const { theme, setTheme } = useUxm();
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      toggle
    </button>
  );
}

afterEach(() => {
  delete document.documentElement.dataset.theme;
  localStorage.clear();
});

describe('ThemeSync', () => {
  it('applies data-theme before sibling layout effects read it', () => {
    const seen: string[] = [];
    render(
      <UxmProvider>
        <ThemeSync />
        <LayoutEffectProbe seen={seen} />
        <ThemeToggle />
      </UxmProvider>,
    );

    expect(document.documentElement.dataset.theme).toBe('light');
    expect(seen.at(-1)).toBe('light');

    fireEvent.click(screen.getByText('toggle'));

    // The attribute is dark AND the probe observed dark in the same commit.
    // (Reverting to a passive effect fails the MOUNT assertion above first —
    // the probe sees `unset`. Deleting that line, these toggle assertions fail
    // too, so the toggle path is genuinely covered and not just along for the
    // ride.)
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(seen.at(-1)).toBe('dark');

    fireEvent.click(screen.getByText('toggle'));

    expect(document.documentElement.dataset.theme).toBe('light');
    expect(seen.at(-1)).toBe('light');
  });
});
