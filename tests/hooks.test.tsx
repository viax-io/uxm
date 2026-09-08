import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { useDismiss, useFocusTrap, useScrollLock } from '@/hooks';
import * as hooks from '@/hooks';

// The subpath is the contract: every hook the atoms are built on is reachable
// from `@viax/uxm/hooks`, and the two most-copied ones behave on their own.
describe('@viax/uxm/hooks', () => {
  it('exports the behaviour hooks', () => {
    for (const name of ['useDismiss', 'useFocusTrap', 'useFocusOnMount', 'useRovingTabIndex', 'useScrollLock', 'usePortal', 'useToastStore']) {
      expect(typeof (hooks as Record<string, unknown>)[name], name).toBe('function');
    }
  });

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
});
