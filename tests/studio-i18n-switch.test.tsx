import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useEffect } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { StudioI18nProvider, useStudioI18n } from '@/studio/i18n';

/**
 * With no host `locale` the studio owns the language for the session and
 * exposes `setLocale` to its top-bar switcher. Switching must NOT remount the
 * workbench: the provider used to render `null` while any dictionary loaded,
 * which unmounted everything below it — the selected component, unsaved edits,
 * and the very switcher that was clicked. A host-passed `locale` owns the
 * language outright, so no setter is offered.
 */

function Probe({ onMount = () => {} }: { onMount?: () => void }) {
  const { locale, setLocale, t } = useStudioI18n();
  useEffect(onMount, [onMount]);
  return (
    <div>
      <span data-testid="locale">{locale}</span>
      <span data-testid="label">{t('chrome', 'Language')}</span>
      <span data-testid="setter">{setLocale ? 'yes' : 'no'}</span>
      {setLocale && <button onClick={() => setLocale('de')}>de</button>}
    </div>
  );
}

describe('StudioI18nProvider locale ownership', () => {
  it('starts in English and offers a setter when the host passes no locale', () => {
    render(
      <StudioI18nProvider>
        <Probe />
      </StudioI18nProvider>,
    );
    expect(screen.getByTestId('locale').textContent).toBe('en');
    expect(screen.getByTestId('setter').textContent).toBe('yes');
  });

  it('switches language without remounting the tree', async () => {
    const onMount = vi.fn();
    render(
      <StudioI18nProvider>
        <Probe onMount={onMount} />
      </StudioI18nProvider>,
    );
    expect(onMount).toHaveBeenCalledTimes(1);

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'de' }));
    });
    await waitFor(() => expect(screen.getByTestId('locale').textContent).toBe('de'));
    expect(screen.getByTestId('label').textContent).toBe('Sprache');
    expect(onMount).toHaveBeenCalledTimes(1);
  });

  it('offers no setter when the host owns the locale', async () => {
    render(
      <StudioI18nProvider locale="uk">
        <Probe />
      </StudioI18nProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('locale').textContent).toBe('uk'));
    expect(screen.getByTestId('setter').textContent).toBe('no');
  });
});
