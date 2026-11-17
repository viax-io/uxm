import { render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';

import { Stepper } from '@/ui';
import type { StepperStep } from '@/ui';

/**
 * The marker shows a step's state as a shape only, so what needs pinning is
 * what a screen reader gets instead: an ordered list, `aria-current="step"` on
 * the current step, and a hidden word after done / skipped labels that the app
 * can translate.
 */
const STEPS: StepperStep[] = [
  { label: 'Quoted', state: 'done', meta: '12 Oct' },
  { label: 'Ordered', state: 'current' },
  { label: 'Credit check', state: 'off' },
  { label: 'Delivered', state: 'ahead' },
];

describe('Stepper', () => {
  it('renders an ordered list with the current step marked', () => {
    render(<Stepper aria-label="Order progress" steps={STEPS} />);
    const list = screen.getByRole('list', { name: 'Order progress' });
    expect(list.tagName).toBe('OL');
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(4);
    expect(items[1]).toHaveAttribute('aria-current', 'step');
    expect(items.filter((li) => li.hasAttribute('aria-current'))).toHaveLength(1);
    expect(items[0]).toHaveClass('uxm-stepper__step--done');
    expect(items[0]).toHaveTextContent('12 Oct');
  });

  it('says done and skipped in words, translatable', () => {
    const { rerender } = render(<Stepper steps={STEPS} />);
    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveTextContent('Quoted, Done');
    expect(items[2]).toHaveTextContent('Credit check, Skipped');
    expect(items[1].textContent).toBe('Ordered');
    expect(items[3].textContent).toBe('Delivered');
    rerender(<Stepper steps={STEPS} stateLabels={{ done: 'Fertig', off: 'Übersprungen' }} />);
    // The comma is the default copy's punctuation, not something forced on a
    // translation: a language that doesn't use ", " brings its own or none.
    expect(screen.getAllByRole('listitem')[0].querySelector('.uxm-stepper__status')?.textContent).toBe(' Fertig');
    rerender(<Stepper steps={STEPS} stateLabels={{ done: '完了' }} />);
    expect(screen.getAllByRole('listitem')[0].querySelector('.uxm-stepper__status')?.textContent).toBe(' 完了');
  });

  it('is a Tab stop as a scroller, unless the app opts out', () => {
    const { rerender } = render(<Stepper aria-label="Order progress" steps={STEPS} />);
    expect(screen.getByRole('list')).toHaveAttribute('tabindex', '0');
    rerender(<Stepper aria-label="Order progress" steps={STEPS} tabIndex={-1} />);
    expect(screen.getByRole('list')).toHaveAttribute('tabindex', '-1');
  });

  it('keeps the default word for a state the app did not translate', () => {
    render(<Stepper steps={STEPS} stateLabels={{ done: 'Fertig' }} />);
    expect(screen.getAllByRole('listitem')[2]).toHaveTextContent('Credit check, Skipped');
  });

  it('hides the markers from assistive tech and has no axe violations', async () => {
    const { container } = render(<Stepper aria-label="Order progress" steps={STEPS} />);
    for (const marker of container.querySelectorAll('.uxm-stepper__marker')) {
      expect(marker).toHaveAttribute('aria-hidden', 'true');
    }
    const results = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });
});
