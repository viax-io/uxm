import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { useDismiss, useFocusTrap, useScrollLock } from '@/hooks';

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
});
