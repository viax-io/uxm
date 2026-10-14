import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useEffect } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { StudioI18nProvider, useStudioI18n } from '@/studio/i18n';
import { STUDIO_LOCALE_LOADERS } from '@/studio/i18n/loaders';

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
      {setLocale && <button onClick={() => setLocale('fr')}>fr</button>}
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

    fireEvent.click(screen.getByRole('button', { name: 'de' }));
    await waitFor(() => expect(screen.getByTestId('locale').textContent).toBe('de'));
    expect(screen.getByTestId('label').textContent).toBe('Sprache');
    expect(onMount).toHaveBeenCalledTimes(1);
  });

  it('retries a dictionary that failed once the user picks it again', async () => {
    const load = vi
      .spyOn(STUDIO_LOCALE_LOADERS, 'fr')
      .mockRejectedValueOnce(new Error('chunk failed'));
    try {
      render(
        <StudioI18nProvider>
          <Probe />
        </StudioI18nProvider>,
      );
      fireEvent.click(screen.getByRole('button', { name: 'fr' }));
      await waitFor(() => expect(load).toHaveBeenCalledTimes(1));
      expect(screen.getByTestId('locale').textContent).toBe('en');

      fireEvent.click(screen.getByRole('button', { name: 'fr' }));
      await waitFor(() => expect(screen.getByTestId('locale').textContent).toBe('fr'));
      expect(load).toHaveBeenCalledTimes(2);
    } finally {
      load.mockRestore();
    }
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

  it('ignores a dictionary that arrives after a newer pick', async () => {
    const de = await STUDIO_LOCALE_LOADERS.de();
    let release: () => void = () => {};
    const load = vi.spyOn(STUDIO_LOCALE_LOADERS, 'de').mockImplementationOnce(
      () => new Promise((resolve) => {
        release = () => resolve(de);
      }),
    );
    const seen: string[] = [];
    function Recorder() {
      seen.push(useStudioI18n().locale);
      return null;
    }
    try {
      render(
        <StudioI18nProvider>
          <Probe />
          <Recorder />
        </StudioI18nProvider>,
      );
      fireEvent.click(screen.getByRole('button', { name: 'de' }));
      fireEvent.click(screen.getByRole('button', { name: 'fr' }));
      await waitFor(() => expect(screen.getByTestId('locale').textContent).toBe('fr'));

      await act(async () => {
        release();
        await Promise.resolve();
      });
      expect(load).toHaveBeenCalledTimes(1);
      expect(seen).not.toContain('de');
      expect(screen.getByTestId('locale').textContent).toBe('fr');
    } finally {
      load.mockRestore();
    }
  });

  it('hands the language back to its own switcher when the host stops passing one', async () => {
    const { rerender } = render(
      <StudioI18nProvider locale="uk">
        <Probe />
      </StudioI18nProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('locale').textContent).toBe('uk'));
    expect(screen.getByTestId('setter').textContent).toBe('no');

    rerender(
      <StudioI18nProvider>
        <Probe />
      </StudioI18nProvider>,
    );
    expect(screen.getByTestId('locale').textContent).toBe('en');
    expect(screen.getByTestId('setter').textContent).toBe('yes');
  });
});
