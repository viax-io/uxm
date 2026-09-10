import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { toastStore, useDismiss, useFocusOnMount, useFocusTrap, usePortal, useRovingTabIndex, useScrollLock } from '@/hooks';

// The export list of `@viax.io/uxm/hooks` is pinned in public-api.test.ts;
// here the most-copied hooks are checked to behave on their own.
describe('@viax.io/uxm/hooks', () => {
  it('useDismiss fires on Escape and on a mousedown outside the refs', async () => {
    const onDismiss = vi.fn();
    function Host() {
      const ref = useRef<HTMLDivElement>(null);
      useDismiss({ enabled: true, onDismiss, refs: [ref] });
      return (
        <>
          <div ref={ref}><button type="button">Inside</button></div>
          <p>Outside</p>
        </>
      );
    }
    render(<Host />);
    await userEvent.keyboard('{Escape}');
    expect(onDismiss).toHaveBeenCalledTimes(1);
    await userEvent.pointer({ keys: '[MouseLeft>]', target: screen.getByRole('button', { name: 'Inside' }) });
    expect(onDismiss).toHaveBeenCalledTimes(1);
    await userEvent.pointer({ keys: '[MouseLeft>]', target: screen.getByText('Outside') });
    expect(onDismiss).toHaveBeenCalledTimes(2);
  });

  it('useFocusTrap keeps Tab inside the container; useScrollLock locks body overflow', async () => {
    function Host() {
      const container = useRef<HTMLDivElement>(null);
      const [active] = useState(true);
      useFocusTrap({ active, container });
      useScrollLock(active);
      return (
        <div ref={container}>
          <button type="button">One</button>
          <button type="button">Two</button>
        </div>
      );
    }
    render(<Host />);
    expect(document.body.style.overflow).toBe('hidden');
    screen.getByRole('button', { name: 'Two' }).focus();
    await userEvent.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'One' }));
  });

  it('useRovingTabIndex moves along its axis, skips disabled items, does not wrap, and honours Home / End', async () => {
    const onNavigate = vi.fn();
    function Host({ orientation }: { orientation?: 'horizontal' | 'vertical' }) {
      const [active, setActive] = useState(0);
      const { getItemRef, onItemKeyDown } = useRovingTabIndex({
        count: 4,
        activeIndex: active,
        orientation,
        isDisabled: (i) => i === 2,
        onNavigate: (i) => {
          onNavigate(i);
          setActive(i);
        },
      });
      return (
        <div>
          {['A', 'B', 'C', 'D'].map((label, i) => (
            <button key={label} type="button" ref={getItemRef(i)} tabIndex={i === active ? 0 : -1} onKeyDown={(e) => onItemKeyDown(e, i)}>
              {label}
            </button>
          ))}
        </div>
      );
    }
    const { unmount } = render(<Host />);
    const byName = (name: string) => screen.getByRole('button', { name });
    expect(byName('A')).toHaveAttribute('tabindex', '0');
    expect(byName('B')).toHaveAttribute('tabindex', '-1');

    byName('A').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(byName('B'));
    await userEvent.keyboard('{ArrowRight}'); // C is disabled → D
    expect(document.activeElement).toBe(byName('D'));
    expect(byName('D')).toHaveAttribute('tabindex', '0');
    await userEvent.keyboard('{ArrowRight}'); // no wrap
    expect(document.activeElement).toBe(byName('D'));
    await userEvent.keyboard('{ArrowUp}'); // wrong axis: ignored
    expect(document.activeElement).toBe(byName('D'));
    await userEvent.keyboard('{Home}');
    expect(document.activeElement).toBe(byName('A'));
    await userEvent.keyboard('{End}');
    expect(document.activeElement).toBe(byName('D'));
    expect(onNavigate.mock.calls.map(([i]) => i)).toEqual([1, 3, 0, 3]);
    unmount();

    render(<Host orientation="vertical" />);
    byName('A').focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(byName('B'));
    await userEvent.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(byName('B'));
  });

  it('useFocusOnMount focuses the target (or the first focusable) on activate and restores focus on deactivate', async () => {
    function Host({ active, returnFocus, explicit }: { active: boolean; returnFocus?: boolean; explicit?: boolean }) {
      const panel = useRef<HTMLDivElement>(null);
      const second = useRef<HTMLButtonElement>(null);
      useFocusOnMount({ active, focusFirstIn: panel, initialFocus: explicit ? second : undefined, returnFocus });
      return (
        <>
          <button type="button">Trigger</button>
          {active && (
            <div ref={panel}>
              <button type="button">First</button>
              <button type="button" ref={second}>Second</button>
            </div>
          )}
        </>
      );
    }
    const nextFrame = () => act(() => new Promise<void>((r) => requestAnimationFrame(() => r())));

    const { rerender, unmount } = render(<Host active={false} />);
    screen.getByRole('button', { name: 'Trigger' }).focus();
    rerender(<Host active />);
    await nextFrame();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'First' }));
    rerender(<Host active={false} />);
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Trigger' }));
    unmount();

    const opted = render(<Host active={false} returnFocus={false} explicit />);
    screen.getByRole('button', { name: 'Trigger' }).focus();
    opted.rerender(<Host active returnFocus={false} explicit />);
    await nextFrame();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Second' }));
    document.body.focus();
    opted.rerender(<Host active={false} returnFocus={false} explicit />);
    expect(document.activeElement).toBe(document.body);
  });

  it('usePortal is false on the first render and true once mounted', () => {
    const seen: boolean[] = [];
    function Host() {
      seen.push(usePortal());
      return null;
    }
    render(<Host />);
    expect(seen[0]).toBe(false);
    expect(seen[seen.length - 1]).toBe(true);
  });

  it('toastStore adds newest-first, overwrites by id, dismisses, trims to the newest and clears — publishing a new frozen array each time', () => {
    toastStore.clear();
    const before = toastStore.getSnapshot();
    const a = toastStore.add('info', 'one');
    const b = toastStore.add('error', 'two', { duration: Infinity });
    const after = toastStore.getSnapshot();
    expect(after).not.toBe(before);
    expect(Object.isFrozen(after)).toBe(true);
    expect(after.map((t) => t.id)).toEqual([b, a]);
    expect(after[1]).toMatchObject({ id: a, variant: 'info', message: 'one', duration: 4000 });
    expect(after[0].duration).toBe(Infinity);

    expect(toastStore.add('success', 'one again', { id: a })).toBe(a);
    expect(toastStore.getSnapshot().map((t) => t.message)).toEqual(['two', 'one again']);

    toastStore.add('info', 'three');
    toastStore.trim(2);
    expect(toastStore.getSnapshot().map((t) => t.message)).toEqual(['three', 'two']);

    toastStore.dismiss(b);
    expect(toastStore.getSnapshot().map((t) => t.message)).toEqual(['three']);
    const stable = toastStore.getSnapshot();
    toastStore.dismiss('missing');
    expect(toastStore.getSnapshot()).toBe(stable);

    toastStore.clear();
    expect(toastStore.getSnapshot()).toEqual([]);
    expect(toastStore.getServerSnapshot()).toEqual([]);
  });
});
