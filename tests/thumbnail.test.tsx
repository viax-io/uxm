import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import axe from 'axe-core';
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
