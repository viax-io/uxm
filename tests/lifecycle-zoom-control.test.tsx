import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { LifecycleZoomControl } from '@/ui';

const field = () => screen.getByRole('textbox', { name: 'Zoom percentage' });

/**
 * A host that clamps, which is what both real consumers do and what the
 * control's contract assumes. The interesting case is a rejected entry that
 * leaves `value` UNCHANGED — nothing re-renders from the prop, so only dropping
 * the draft can make the field snap back.
 */
function ClampingHost({ min = 25, max = 200, start = 100 }: { min?: number; max?: number; start?: number }) {
  const [zoom, setZoom] = useState(start);
  return (
    <LifecycleZoomControl
      value={zoom}
      onValueChange={(percent) => setZoom(Math.round(Math.min(max, Math.max(min, percent))))}
      presets={[25, 50, 100, 200]}
    />
  );
}

describe('LifecycleZoomControl — read-only by default', () => {
  it('renders no field, no preset trigger and no divider', () => {
    // The back-compat promise: rmb's call site passes none of the new props and
    // must keep the DOM it has.
    const { container } = render(<LifecycleZoomControl value={100} />);
    expect(screen.queryByRole('textbox')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Zoom presets' })).toBeNull();
    expect(container.querySelector('.uxm-lifecycle-zoom-control__divider')).toBeNull();
    expect(container.querySelector('.uxm-lifecycle-zoom-control__num')).toHaveTextContent('100');
  });

  it('does not render a divider for a trailing that renders nothing', () => {
    // `trailing={cond && <X/>}` is `false`, which must not leave a stray rule.
    const { container } = render(
      <LifecycleZoomControl value={100} trailing={false as unknown as React.ReactNode} />,
    );
    expect(container.querySelector('.uxm-lifecycle-zoom-control__divider')).toBeNull();
  });

  it('renders the divider when there is trailing content', () => {
    const { container } = render(<LifecycleZoomControl value={100} trailing={<button>map</button>} />);
    expect(container.querySelector('.uxm-lifecycle-zoom-control__divider')).not.toBeNull();
  });
});

describe('LifecycleZoomControl — editable percentage', () => {
  it('commits a typed value on Enter', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<LifecycleZoomControl value={100} onValueChange={onValueChange} />);
    await user.clear(field());
    await user.type(field(), '125{Enter}');
    expect(onValueChange).toHaveBeenCalledWith(125);
  });

  it('commits on blur', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<LifecycleZoomControl value={100} onValueChange={onValueChange} />);
    await user.clear(field());
    await user.type(field(), '75');
    await user.tab();
    expect(onValueChange).toHaveBeenCalledWith(75);
  });

  it('reverts on Escape, and the blur that follows does NOT commit', async () => {
    // The ordering trap: Escape clears the draft and blurs, and blur commits.
    // With the draft held only in state, the blur handler would still read the
    // pre-Escape value from its closure and commit the entry just cancelled.
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<LifecycleZoomControl value={100} onValueChange={onValueChange} />);
    await user.clear(field());
    await user.type(field(), '175{Escape}');
    expect(onValueChange, 'Escape committed the cancelled entry').not.toHaveBeenCalled();
    expect(field()).toHaveValue('100');
  });

  it('selects the text on focus, so typing replaces rather than appends', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<LifecycleZoomControl value={100} onValueChange={onValueChange} />);
    await user.click(field());
    await user.keyboard('50{Enter}');
    expect(onValueChange, 'typing appended to the old value instead of replacing it').toHaveBeenCalledWith(50);
  });

  it('snaps back to the clamped value even when the clamp leaves `value` unchanged', async () => {
    // 9999 clamps to 200; `value` was already... no — start at 200 so the clamp
    // is a no-op and the prop never changes. Nothing re-renders from `value`,
    // so the field can only recover by dropping its own draft.
    const user = userEvent.setup();
    render(<ClampingHost start={200} max={200} />);
    await user.clear(field());
    await user.type(field(), '9999{Enter}');
    expect(field(), 'the rejected draft stayed on screen').toHaveValue('200');
  });

  it('ignores junk rather than reporting NaN', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<LifecycleZoomControl value={100} onValueChange={onValueChange} />);
    await user.clear(field());
    await user.type(field(), 'abc{Enter}');
    expect(onValueChange).not.toHaveBeenCalled();
    expect(field()).toHaveValue('100');
  });

  it('reads the digits of an entry wherever they sit, not just its prefix', async () => {
    // `parseInt` alone already handles a TRAILING unit ("150 %" → 150), so that
    // case proves nothing about the parse. The rule is "the digits you typed",
    // and only leading junk — the shape a paste arrives in — discriminates it.
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<LifecycleZoomControl value={100} onValueChange={onValueChange} />);
    await user.clear(field());
    await user.type(field(), '~150 %{Enter}');
    expect(onValueChange).toHaveBeenCalledWith(150);
  });
});

describe('LifecycleZoomControl — presets', () => {
  it('marks the preset the canvas is already on', async () => {
    const user = userEvent.setup();
    render(
      <LifecycleZoomControl value={50} presets={[25, 50, 100]} onValueChange={vi.fn()} />,
    );
    await user.click(screen.getByRole('button', { name: 'Zoom presets' }));
    const rows = screen.getAllByRole('menuitem');
    const current = rows.filter((r) => r.getAttribute('aria-current') === 'true');
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveTextContent('50%');
  });

  it('commits the chosen preset', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<LifecycleZoomControl value={100} presets={[25, 50]} onValueChange={onValueChange} />);
    await user.click(screen.getByRole('button', { name: 'Zoom presets' }));
    await user.click(screen.getByText('25%'));
    expect(onValueChange).toHaveBeenCalledWith(25);
  });

  it('formats preset labels through the callback, not a hardcoded suffix', async () => {
    const user = userEvent.setup();
    render(
      <LifecycleZoomControl
        value={100}
        presets={[50]}
        onValueChange={vi.fn()}
        formatPreset={(p) => `${p} Prozent`}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Zoom presets' }));
    expect(screen.getByText('50 Prozent')).toBeInTheDocument();
  });

  it('offers Fit to screen only when a handler is given', async () => {
    const user = userEvent.setup();
    render(<LifecycleZoomControl value={100} presets={[50]} onValueChange={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: 'Zoom presets' }));
    expect(screen.queryByText('Fit to screen')).toBeNull();
  });

  it('calls onFit from the fit row', async () => {
    const user = userEvent.setup();
    const onFit = vi.fn();
    render(<LifecycleZoomControl value={100} presets={[50]} onFit={onFit} onValueChange={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: 'Zoom presets' }));
    await user.click(screen.getByText('Fit to screen'));
    expect(onFit).toHaveBeenCalledTimes(1);
  });

  it('opens the menu for a lone Fit entry, with no stray separator', async () => {
    // A separator is not a menuitem, so counting rows would pass with a rule
    // floating above the only entry. Ask for the separator itself.
    const user = userEvent.setup();
    const onFit = vi.fn();
    render(<LifecycleZoomControl value={100} onFit={onFit} />);
    await user.click(screen.getByRole('button', { name: 'Zoom presets' }));
    expect(screen.getAllByRole('menuitem')).toHaveLength(1);
    expect(screen.getByText('Fit to screen')).toBeInTheDocument();
    expect(screen.queryAllByRole('separator'), 'a rule above the only row').toHaveLength(0);
  });

  it('separates Fit from the presets when there are presets', async () => {
    const user = userEvent.setup();
    render(<LifecycleZoomControl value={100} presets={[50]} onFit={vi.fn()} onValueChange={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: 'Zoom presets' }));
    expect(screen.getAllByRole('separator')).toHaveLength(1);
  });

  it('renders no trigger when there is neither presets nor onFit', () => {
    render(<LifecycleZoomControl value={100} onValueChange={vi.fn()} />);
    expect(screen.queryByRole('button', { name: 'Zoom presets' })).toBeNull();
  });
});
