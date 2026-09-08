import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Icon } from '@/ui';

// The accessible-name pollution this guards ("Kebab (More) Publish") was
// reported from a consumer, not caught here — hence the test.
describe('Icon', () => {
  it('is decorative by default', () => {
    const { container } = render(<Icon glyph="close" />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).not.toHaveAttribute('role');
  });

  it('becomes an informative image when labelled', () => {
    const { getByRole } = render(<Icon glyph="close" aria-label="Close" />);
    expect(getByRole('img', { name: 'Close' })).toBeInTheDocument();
  });

  it('treats an empty label as decorative, not as an unnamed image', () => {
    const { container } = render(<Icon glyph="close" aria-label="" />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders nothing for an unknown glyph', () => {
    const { container } = render(<Icon glyph="no-such-glyph" />);
    expect(container.firstChild).toBeNull();
  });
});
