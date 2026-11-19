import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import axe from 'axe-core';
import { StrictMode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Thumbnail } from '@/ui';

/**
 * Thumbnail's contracts beyond looks: an image the browser finished with
 * before React hydrated is still caught (a broken one shows the placeholder,
 * not the browser's broken mark); a failure belongs to its address, so a new
 * `src` gets a fresh try; `onStatusChange` reports each status once per
 * address and nothing without a `src`; `aspectRatio` hands the height to the
 * ratio.
 *
 * jsdom never loads images (`complete` stays false for an <img> with a src),
 * so "already finished" is stubbed on the prototype.
 */
const proto = HTMLImageElement.prototype as HTMLImageElement & { decode: () => Promise<void> };
const originalDecode = proto.decode;

function browserAlreadyFinished(outcome: 'loaded' | 'broken') {
  vi.spyOn(HTMLImageElement.prototype, 'complete', 'get').mockReturnValue(true);
  proto.decode = () => (outcome === 'loaded' ? Promise.resolve() : Promise.reject(new Error('EncodingError')));
}

afterEach(() => {
  vi.restoreAllMocks();
  proto.decode = originalDecode;
});

describe('Thumbnail', () => {
  it('catches an image that failed before hydration and shows the placeholder', async () => {
    browserAlreadyFinished('broken');
    const onStatusChange = vi.fn();
    const { container } = render(<Thumbnail src="https://cdn.example.invalid/x.jpg" alt="Chair" onStatusChange={onStatusChange} />);
    await waitFor(() => expect(container.querySelector('img')).toBeNull());
    expect(container.querySelector('.uxm-thumbnail__placeholder')).not.toBeNull();
    expect(onStatusChange.mock.calls).toEqual([['error']]);
  });

  it('reports an image that loaded before hydration as loaded, once', async () => {
    browserAlreadyFinished('loaded');
    const onStatusChange = vi.fn();
    render(<Thumbnail src="/chair.jpg" alt="Chair" onStatusChange={onStatusChange} />);
    await waitFor(() => expect(onStatusChange).toHaveBeenCalledWith('loaded'));
    fireEvent.load(screen.getByRole('img', { name: 'Chair' }));
    expect(onStatusChange.mock.calls).toEqual([['loaded']]);
    expect(screen.getByRole('img', { name: 'Chair' })).toBeInTheDocument();
  });

  it('reports loading then loaded, each once, for an image still coming in', () => {
    const onStatusChange = vi.fn();
    render(<Thumbnail src="/chair.jpg" alt="Chair" onStatusChange={onStatusChange} />);
    const img = screen.getByRole('img', { name: 'Chair' });
    fireEvent.load(img);
    fireEvent.load(img);
    expect(onStatusChange.mock.calls).toEqual([['loading'], ['loaded']]);
  });

  it('gives a new src a fresh try after a failure, without re-keying', () => {
    const onStatusChange = vi.fn();
    const { container, rerender } = render(<Thumbnail src="/dead.jpg" alt="Chair" onStatusChange={onStatusChange} />);
    act(() => {
      fireEvent.error(screen.getByRole('img', { name: 'Chair' }));
    });
    expect(container.querySelector('img')).toBeNull();
    rerender(<Thumbnail src="/drawn.jpg" alt="Chair" onStatusChange={onStatusChange} />);
    expect(screen.getByRole('img', { name: 'Chair' })).toHaveAttribute('src', '/drawn.jpg');
    expect(onStatusChange.mock.calls).toEqual([['loading'], ['error'], ['loading']]);
  });

  it('retries an address that failed before when it comes back (A fails, B, A)', () => {
    const onStatusChange = vi.fn();
    const { container, rerender } = render(<Thumbnail src="/a.jpg" alt="Chair" onStatusChange={onStatusChange} />);
    act(() => {
      fireEvent.error(screen.getByRole('img', { name: 'Chair' }));
    });
    rerender(<Thumbnail src="/b.jpg" alt="Chair" onStatusChange={onStatusChange} />);
    fireEvent.load(screen.getByRole('img', { name: 'Chair' }));
    rerender(<Thumbnail src="/a.jpg" alt="Chair" onStatusChange={onStatusChange} />);
    expect(container.querySelector('img')).toHaveAttribute('src', '/a.jpg');
    expect(onStatusChange.mock.calls).toEqual([['loading'], ['error'], ['loading'], ['loaded'], ['loading']]);
  });

  it('reports the same address again after a gap with no src', async () => {
    browserAlreadyFinished('loaded');
    const onStatusChange = vi.fn();
    const { rerender } = render(<Thumbnail src="/chair.jpg" alt="Chair" onStatusChange={onStatusChange} />);
    await waitFor(() => expect(onStatusChange).toHaveBeenCalledTimes(1));
    rerender(<Thumbnail alt="Chair" onStatusChange={onStatusChange} />);
    rerender(<Thumbnail src="/chair.jpg" alt="Chair" onStatusChange={onStatusChange} />);
    await waitFor(() => expect(onStatusChange).toHaveBeenCalledTimes(2));
    expect(onStatusChange.mock.calls).toEqual([['loaded'], ['loaded']]);
  });

  it('reports once under StrictMode', async () => {
    browserAlreadyFinished('broken');
    const onStatusChange = vi.fn();
    render(
      <StrictMode>
        <Thumbnail src="/dead.jpg" alt="Chair" onStatusChange={onStatusChange} />
      </StrictMode>,
    );
    await waitFor(() => expect(onStatusChange).toHaveBeenCalled());
    await new Promise((r) => setTimeout(r, 0));
    expect(onStatusChange.mock.calls).toEqual([['error']]);
  });

  it('starts a new address on a fresh <img>, so the old image’s state is never trusted', () => {
    const onStatusChange = vi.fn();
    const { rerender } = render(<Thumbnail src="/a.jpg" alt="Chair" onStatusChange={onStatusChange} />);
    const first = screen.getByRole('img', { name: 'Chair' });
    fireEvent.load(first);
    rerender(<Thumbnail src="/b.jpg" alt="Chair" onStatusChange={onStatusChange} />);
    const second = screen.getByRole('img', { name: 'Chair' });
    expect(second).not.toBe(first);
    // A late load from the old element no longer counts for the new address.
    fireEvent.load(first);
    expect(onStatusChange.mock.calls).toEqual([['loading'], ['loaded'], ['loading']]);
  });

  it('says nothing when unmounted while the browser is still deciding', async () => {
    vi.spyOn(HTMLImageElement.prototype, 'complete', 'get').mockReturnValue(true);
    let settle: (() => void) | undefined;
    proto.decode = () => new Promise<void>((_, reject) => {
      settle = () => reject(new Error('EncodingError'));
    });
    const onStatusChange = vi.fn();
    const { unmount } = render(<Thumbnail src="/dead.jpg" alt="Chair" onStatusChange={onStatusChange} />);
    unmount();
    settle?.();
    await new Promise((r) => setTimeout(r, 0));
    expect(onStatusChange).not.toHaveBeenCalled();
  });

  it('reports nothing without a src', () => {
    const onStatusChange = vi.fn();
    const { container } = render(<Thumbnail onStatusChange={onStatusChange} />);
    expect(container.querySelector('.uxm-thumbnail__placeholder')).not.toBeNull();
    expect(onStatusChange).not.toHaveBeenCalled();
  });

  it('hands the height to the ratio when aspectRatio is set', () => {
    const { container } = render(<Thumbnail aspectRatio="16 / 9" style={{ color: 'red' }} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass('uxm-thumbnail', 'uxm-thumbnail--ratio');
    expect(root.style.getPropertyValue('--uxm-thumbnail-aspect-ratio')).toBe('16 / 9');
    expect(root.style.color).toBe('red');
    const square = render(<Thumbnail />).container.firstElementChild as HTMLElement;
    expect(square).not.toHaveClass('uxm-thumbnail--ratio');
    // An empty, zero or non-finite ratio is no ratio, not a frame with no height.
    for (const bad of [' ', 0, -1, Number.NaN, Number.POSITIVE_INFINITY]) {
      const root = render(<Thumbnail aspectRatio={bad} />).container.firstElementChild as HTMLElement;
      expect(root).not.toHaveClass('uxm-thumbnail--ratio');
    }
    expect(render(<Thumbnail aspectRatio={1.5} />).container.firstElementChild).toHaveClass('uxm-thumbnail--ratio');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <>
        <Thumbnail src="/chair.jpg" alt="Oak chair" />
        <Thumbnail />
      </>,
    );
    const results = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });
});
