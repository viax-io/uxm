import { readFileSync } from 'node:fs';

import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { UxmProvider, resolveThemeMode, useUxm } from '@/studio/lib/context';
import { AccountMenu } from '@/studio/shell/account-menu';
import type { StudioAccount } from '@/studio/shell/account-menu';

const ADA: StudioAccount = {
  name: 'Ada Lovelace',
  email: 'ada@viax.io',
  role: 'Designer',
  realm: 'viax',
};

function mount(account: StudioAccount) {
  return render(
    <UxmProvider>
      <AccountMenu account={account} />
    </UxmProvider>,
  );
}

const openMenu = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole('button', { name: 'Account' }));
};

const openPane = async (user: ReturnType<typeof userEvent.setup>) => {
  await openMenu(user);
  await user.click(screen.getByText('Account settings'));
};

afterEach(() => {
  document.body.classList.remove('uxm-studio-pane-open');
  localStorage.clear();
  vi.useRealTimers();
});

describe('resolveThemeMode', () => {
  it('passes light and dark straight through', () => {
    expect(resolveThemeMode('light')).toBe('light');
    expect(resolveThemeMode('dark')).toBe('dark');
  });

  it('resolves auto by time of day — daytime light, night dark', () => {
    // Pinned rather than "whatever the test machine's clock says", which would
    // make this pass or fail depending on when CI happens to run.
    const at = (hour: number) => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 0, 15, hour, 30));
      return resolveThemeMode('auto');
    };
    expect(at(0), 'midnight').toBe('dark');
    expect(at(5), 'before the 06:00 boundary').toBe('dark');
    expect(at(6), 'the 06:00 boundary itself is daytime').toBe('light');
    expect(at(12), 'noon').toBe('light');
    expect(at(17), 'before the 18:00 boundary').toBe('light');
    expect(at(18), 'the 18:00 boundary itself is night').toBe('dark');
    expect(at(23), 'late evening').toBe('dark');
  });
});

describe('studio account menu', () => {
  it('shows the identity as a non-actionable header', async () => {
    const user = userEvent.setup();
    mount(ADA);
    await openMenu(user);

    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
    expect(screen.getByText('ada@viax.io')).toBeInTheDocument();
    // It is a header, not a command: it must not be offered as something to
    // activate, or keyboard users land on a row that does nothing.
    const rows = screen.getAllByRole('menuitem');
    const identity = rows.find((r) => r.textContent?.includes('Ada Lovelace'));
    expect(identity, 'identity row missing').toBeTruthy();
    expect(identity).toHaveAttribute('aria-disabled', 'true');
  });

  it('derives avatar initials from the name, and prefers an explicit value', () => {
    mount(ADA);
    expect(screen.getByRole('button', { name: 'Account' }).textContent).toContain('AL');
    screen.getByRole('button', { name: 'Account' }); // sanity: single trigger

    mount({ ...ADA, name: 'Prince', initials: 'ZZ' });
    const triggers = screen.getAllByRole('button', { name: 'Account' });
    expect(triggers[1].textContent, 'explicit initials should win').toContain('ZZ');
  });

  it('derives a single initial from a one-word name', () => {
    mount({ ...ADA, name: 'Prince' });
    expect(screen.getByRole('button', { name: 'Account' }).textContent).toContain('P');
  });

  it('offers Log out only when the host can actually sign out', async () => {
    const user = userEvent.setup();
    mount(ADA);
    await openMenu(user);
    expect(
      screen.queryByText('Log out'),
      'no onSignOut, so there is nothing Log out could do',
    ).not.toBeInTheDocument();
  });

  it('calls onSignOut when Log out is chosen', async () => {
    const user = userEvent.setup();
    const onSignOut = vi.fn();
    mount({ ...ADA, onSignOut });
    await openMenu(user);
    await user.click(screen.getByText('Log out'));
    expect(onSignOut).toHaveBeenCalledTimes(1);
  });
});

describe('studio theme mode wiring', () => {
  it('actually applies a picked mode, and persists it', async () => {
    const user = userEvent.setup();
    const seen: { theme?: string; mode?: string } = {};
    function Probe() {
      const { theme, themeMode } = useUxm();
      seen.theme = theme;
      seen.mode = themeMode;
      return null;
    }
    render(
      <UxmProvider>
        <AccountMenu account={ADA} />
        <Probe />
      </UxmProvider>,
    );
    await openMenu(user);
    await user.click(screen.getByText('Account settings'));
    await user.click(screen.getByRole('combobox', { name: 'Theme' }));
    await user.click(screen.getByRole('option', { name: 'Dark' }));

    // Without this the Select could be wired to nothing and the options test
    // would still pass — it only ever asserted the labels.
    expect(seen.mode, 'picking Dark did not reach the context').toBe('dark');
    expect(seen.theme).toBe('dark');
    expect(localStorage.getItem('uxm:theme'), 'mode was not persisted').toBe('dark');
  });

  it('restores a stored auto mode, and still hands back a resolved theme', () => {
    // The compatibility promise: `theme` is public and stays 'light' | 'dark'.
    // Returning a raw 'auto' would break every consumer branching on it.
    localStorage.setItem('uxm:theme', 'auto');
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 15, 22, 0)); // night
    const seen: { theme?: string; mode?: string } = {};
    function Probe() {
      const { theme, themeMode } = useUxm();
      seen.theme = theme;
      seen.mode = themeMode;
      return null;
    }
    render(<UxmProvider><Probe /></UxmProvider>);

    expect(seen.mode, 'a stored auto was not restored').toBe('auto');
    expect(seen.theme, '`theme` must stay resolved, never raw auto').toBe('dark');
  });
});

  it('re-resolves auto when the clock crosses a boundary', async () => {
    // Deriving in render is not enough: nothing re-renders at 18:00, so a tab
    // left open would keep painting the old theme. This is the timer.
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 15, 17, 59, 30)); // 30s before the switch
    localStorage.setItem('uxm:theme', 'auto');
    const seen: { theme?: string } = {};
    function Probe() {
      seen.theme = useUxm().theme;
      return null;
    }
    render(<UxmProvider><Probe /></UxmProvider>);
    expect(seen.theme, 'still daytime').toBe('light');

    await act(async () => {
      vi.advanceTimersByTime(60_000); // cross 18:00
    });
    expect(seen.theme, 'crossed 18:00 but the theme never re-resolved').toBe('dark');
  });

describe('studio shell stylesheet wiring', () => {
  // The studio has TWO entry stylesheets. Appending a rule to one leaves the
  // other stale — the dev portal and the published bundle then disagree, which
  // is silent and was hit for real while building this.
  const ENTRIES = ['src/studio/studio.css', 'portal/studio.css'];

  it('imports the shared shell stylesheet from BOTH entry points', () => {
    for (const entry of ENTRIES) {
      expect(
        /@import\s+['"][^'"]*studio-shell\.css['"]/.test(readFileSync(entry, 'utf8')),
        `${entry} does not @import studio-shell.css — it will miss shell rules the other entry has`,
      ).toBe(true);
    }
  });

  it('keeps the popover lift in that shared file, scoped to the pane class', () => {
    const css = readFileSync('src/studio/studio-shell.css', 'utf8');
    expect(css).toMatch(/body\.uxm-studio-pane-open\s*\{[^}]*--uxm-popover-z-index:\s*var\(--z-popover\)/);
    // The class the pane toggles must be the one the rule is keyed on.
    expect(readFileSync('src/studio/shell/account-menu.tsx', 'utf8')).toContain('uxm-studio-pane-open');
  });
});

describe('studio account settings pane', () => {
  it('renders the profile the host supplied', async () => {
    const user = userEvent.setup();
    mount(ADA);
    await openPane(user);

    expect(screen.getByText('Account settings')).toBeInTheDocument();
    expect(screen.getByText('Designer')).toBeInTheDocument();
    expect(screen.getByText('viax')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'ada@viax.io' })).toHaveAttribute(
      'href',
      'mailto:ada@viax.io',
    );
  });

  it('omits optional profile rows rather than rendering empty ones', async () => {
    const user = userEvent.setup();
    mount({ name: 'Ada Lovelace', email: 'ada@viax.io' });
    await openPane(user);

    expect(screen.queryByText('Role')).not.toBeInTheDocument();
    expect(screen.queryByText('Realm')).not.toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('lifts the popover tier for its lifetime, and only its lifetime', async () => {
    const user = userEvent.setup();
    mount(ADA);
    // The Theme control is a Select, whose panel is a Popover defaulting to
    // z-index 50 — BELOW the Dialog at 60. Without this class the dropdown
    // opens behind the pane and cannot be clicked. Scoped to body rather than
    // :root so embedding the studio never moves a host's own stacking.
    expect(document.body.classList.contains('uxm-studio-pane-open')).toBe(false);
    await openPane(user);
    expect(
      document.body.classList.contains('uxm-studio-pane-open'),
      'pane open but the popover tier was not lifted',
    ).toBe(true);

    await user.click(screen.getByRole('button', { name: /close/i }));
    expect(
      document.body.classList.contains('uxm-studio-pane-open'),
      'pane closed but the lift was left behind',
    ).toBe(false);
  });

  it('returns focus to the avatar when the pane closes', async () => {
    // useFocusOnMount restores focus to whatever was active at open time — the
    // menu row — and that row is gone by close, so focus would fall to <body>.
    // Menu-opens-dialog hits that documented edge case every time.
    const user = userEvent.setup();
    mount(ADA);
    await openPane(user);
    await user.click(screen.getByRole('button', { name: /close/i }));

    expect(
      document.activeElement,
      'focus fell to the document instead of returning to the avatar',
    ).toBe(screen.getByRole('button', { name: 'Account' }));
  });

  it('offers all three theme modes, auto included', async () => {
    const user = userEvent.setup();
    mount(ADA);
    await openPane(user);
    await user.click(screen.getByRole('combobox', { name: 'Theme' }));

    const labels = screen.getAllByRole('option').map((o) => o.textContent?.trim());
    expect(labels).toEqual(['Light', 'Dark', 'Auto · match time of day']);
  });
});
