import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ExpandableText } from '@/ui';

// jsdom has no layout, so overflow is whatever the test says it is: the hook
// measures `scrollHeight > clientHeight + 1`, and these two getters are the
// only inputs. `heights` is reset per test.
const heights = { scroll: 0, client: 0 };
const proto = HTMLElement.prototype;
const original = {
  scroll: Object.getOwnPropertyDescriptor(proto, 'scrollHeight'),
  client: Object.getOwnPropertyDescriptor(proto, 'clientHeight'),
};
function stubLayout(scroll: number, client: number) {
  heights.scroll = scroll;
  heights.client = client;
  Object.defineProperty(proto, 'scrollHeight', { configurable: true, get: () => heights.scroll });
  Object.defineProperty(proto, 'clientHeight', { configurable: true, get: () => heights.client });
}

afterEach(() => {
  for (const [key, prop] of [['scroll', 'scrollHeight'], ['client', 'clientHeight']] as const) {
    if (original[key]) Object.defineProperty(proto, prop, original[key]);
    else delete (proto as unknown as Record<string, unknown>)[prop];
  }
});

const content = (c: HTMLElement) => c.querySelector('.uxm-expandable-text__content') as HTMLElement;

describe('ExpandableText', () => {
  it('renders no toggle when the text fits', () => {
    stubLayout(60, 60);
    render(<ExpandableText>Short.</ExpandableText>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('tolerates sub-pixel rounding between the two heights', () => {
    stubLayout(61, 60);
    render(<ExpandableText>Short.</ExpandableText>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders a collapsed toggle wired to the content when the text overflows', () => {
    stubLayout(200, 80);
    const { container } = render(<ExpandableText lines={4}>Long text.</ExpandableText>);
    const toggle = screen.getByRole('button', { name: 'Show more' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveAttribute('aria-controls', content(container).id);
    expect(content(container).id).not.toBe('');
  });

  it('clamps the content with the line count as an inline number, not a var()', () => {
    stubLayout(200, 80);
    const { container } = render(<ExpandableText lines={3}>Long text.</ExpandableText>);
    expect(content(container)).toHaveClass('uxm-expandable-text__content--clamped');
    expect(content(container).style.webkitLineClamp).toBe('3');
  });

  it('defaults to four lines', () => {
    stubLayout(200, 80);
    const { container } = render(<ExpandableText>Long text.</ExpandableText>);
    expect(content(container).style.webkitLineClamp).toBe('4');
  });

  it('toggles aria-expanded and the clamp on click, and keeps the toggle while expanded', async () => {
    stubLayout(200, 80);
    const { container } = render(<ExpandableText>Long text.</ExpandableText>);
    await userEvent.click(screen.getByRole('button', { name: 'Show more' }));

    const less = screen.getByRole('button', { name: 'Show less' });
    expect(less).toHaveAttribute('aria-expanded', 'true');
    expect(content(container)).not.toHaveClass('uxm-expandable-text__content--clamped');
    expect(content(container).style.webkitLineClamp).toBe('');

    await userEvent.click(less);
    expect(screen.getByRole('button', { name: 'Show more' })).toHaveAttribute('aria-expanded', 'false');
    expect(content(container)).toHaveClass('uxm-expandable-text__content--clamped');
  });

  it('keeps the toggle while expanded even when the text would fit, so it can collapse again', () => {
    stubLayout(60, 60);
    render(<ExpandableText defaultExpanded>Short.</ExpandableText>);
    expect(screen.getByRole('button', { name: 'Show less' })).toBeInTheDocument();
  });

  it('honours defaultExpanded', () => {
    stubLayout(200, 80);
    render(<ExpandableText defaultExpanded>Long text.</ExpandableText>);
    expect(screen.getByRole('button', { name: 'Show less' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('reports every toggle through onExpandedChange', async () => {
    stubLayout(200, 80);
    const onExpandedChange = vi.fn();
    render(<ExpandableText onExpandedChange={onExpandedChange}>Long text.</ExpandableText>);
    await userEvent.click(screen.getByRole('button', { name: 'Show more' }));
    await userEvent.click(screen.getByRole('button', { name: 'Show less' }));
    expect(onExpandedChange.mock.calls).toEqual([[true], [false]]);
  });

  it('respects a controlled `expanded`: the toggle asks, the parent decides', async () => {
    stubLayout(200, 80);
    const onExpandedChange = vi.fn();
    const { rerender } = render(
      <ExpandableText expanded={false} onExpandedChange={onExpandedChange}>Long text.</ExpandableText>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Show more' }));
    expect(onExpandedChange).toHaveBeenCalledWith(true);
    // Still collapsed — the parent has not accepted the change.
    expect(screen.getByRole('button', { name: 'Show more' })).toHaveAttribute('aria-expanded', 'false');

    rerender(<ExpandableText expanded onExpandedChange={onExpandedChange}>Long text.</ExpandableText>);
    expect(screen.getByRole('button', { name: 'Show less' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('takes its labels from props', () => {
    stubLayout(200, 80);
    const { rerender } = render(
      <ExpandableText moreLabel="Mehr anzeigen" lessLabel="Weniger anzeigen">Long text.</ExpandableText>,
    );
    expect(screen.getByRole('button', { name: 'Mehr anzeigen' })).toBeInTheDocument();
    rerender(
      <ExpandableText expanded moreLabel="Mehr anzeigen" lessLabel="Weniger anzeigen">Long text.</ExpandableText>,
    );
    expect(screen.getByRole('button', { name: 'Weniger anzeigen' })).toBeInTheDocument();
  });

  it('merges className and forwards native attributes to the root', () => {
    stubLayout(60, 60);
    render(
      <ExpandableText className="mine" data-testid="root" aria-label="Description">Short.</ExpandableText>,
    );
    const root = screen.getByTestId('root');
    expect(root).toHaveClass('uxm-expandable-text', 'mine');
    expect(root).toHaveAttribute('aria-label', 'Description');
  });
});
