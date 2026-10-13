import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Dialog, LifecycleZoomControl } from '@/ui';

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

  it.each([
    ['125', 125, 'a plain number'],
    ['~150 %', 150, 'a stray character and a trailing unit'],
    ['1.5', 1.5, 'a decimal — NOT 15, which a digit filter would give'],
    ['62.5', 62.5, 'a decimal with two significant digits — NOT 625'],
    ['62,5', 62.5, 'a comma decimal separator, as de/fr/it write it'],
    ['-50', -50, 'a minus, left for the host to clamp away rather than flipped to +50'],
    ['１２５', 125, 'fullwidth digits — what a Japanese IME produces'],
  ])('parses %s as %s (%s)', async (typed, expected) => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<LifecycleZoomControl value={100} onValueChange={onValueChange} />);
    await user.clear(field());
    await user.type(field(), `${typed}{Enter}`);
    expect(onValueChange).toHaveBeenCalledWith(expected);
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

describe('LifecycleZoomControl — the field does not fight its surroundings', () => {
  it('keeps Escape to itself while an edit is in flight', async () => {
    // `useDismiss` listens for Escape on the DOCUMENT, so an un-stopped Escape
    // cancels the edit AND closes whatever the canvas sits in.
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Dialog open onOpenChange={onOpenChange}>
        <LifecycleZoomControl value={100} onValueChange={vi.fn()} />
      </Dialog>,
    );
    await user.clear(field());
    await user.type(field(), '175{Escape}');
    expect(onOpenChange, 'Escape closed the dialog as well as cancelling the edit').not.toHaveBeenCalled();
    expect(field()).toHaveValue('100');
  });

  it('lets Escape through when there is nothing to cancel', async () => {
    // Swallowing it unconditionally would trap the user in a dialog whose only
    // open editor is idle.
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Dialog open onOpenChange={onOpenChange}>
        <LifecycleZoomControl value={100} onValueChange={vi.fn()} />
      </Dialog>,
    );
    await user.click(field());
    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalled();
  });

  it('keeps focus on Escape instead of dropping it to the document', async () => {
    const user = userEvent.setup();
    render(<LifecycleZoomControl value={100} onValueChange={vi.fn()} />);
    await user.clear(field());
    await user.type(field(), '175{Escape}');
    expect(document.activeElement, 'focus fell out of the field').toBe(field());
  });

  it('leaves an IME composition alone', async () => {
    // Enter confirms an IME candidate; claiming it commits a half-composed
    // entry. Japanese is a shipped studio locale.
    const onValueChange = vi.fn();
    render(<LifecycleZoomControl value={100} onValueChange={onValueChange} />);
    fireEvent.change(field(), { target: { value: '12' } });
    fireEvent.keyDown(field(), { key: 'Enter', isComposing: true, keyCode: 229 });
    expect(onValueChange, 'committed mid-composition').not.toHaveBeenCalled();
  });

  it('selects after Enter, so a second entry replaces rather than appends', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<LifecycleZoomControl value={100} onValueChange={onValueChange} />);
    await user.clear(field());
    await user.type(field(), '150{Enter}');
    await user.keyboard('75{Enter}');
    expect(onValueChange, 'the second entry appended to the first').toHaveBeenLastCalledWith(75);
  });

  it('does not report a value the canvas is already on', async () => {
    // Hosts act on this callback — recentring, dropping a zoom anchor — and
    // should not be made to do it for a no-op.
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<LifecycleZoomControl value={100} onValueChange={onValueChange} />);
    await user.clear(field());
    await user.type(field(), '100{Enter}');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('does not carry a draft across a lock/unlock of the field', () => {
    // The draft lives with the input, so it unmounts with it.
    const { rerender } = render(<LifecycleZoomControl value={100} onValueChange={vi.fn()} />);
    fireEvent.change(field(), { target: { value: '77' } });
    rerender(<LifecycleZoomControl value={100} />);
    rerender(<LifecycleZoomControl value={100} onValueChange={vi.fn()} />);
    expect(field(), 'an abandoned draft came back').toHaveValue('100');
  });

  it('renders no preset rows without a handler to receive them', async () => {
    // Rows that close the menu and do nothing are worse than no menu.
    const user = userEvent.setup();
    render(<LifecycleZoomControl value={100} presets={[25, 50]} onFit={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: 'Zoom presets' }));
    expect(screen.queryByText('25%')).toBeNull();
    expect(screen.getAllByRole('menuitem')).toHaveLength(1);
  });

  it('hides the trigger entirely when presets are all it would hold', () => {
    render(<LifecycleZoomControl value={100} presets={[25, 50]} />);
    expect(screen.queryByRole('button', { name: 'Zoom presets' })).toBeNull();
  });
});
