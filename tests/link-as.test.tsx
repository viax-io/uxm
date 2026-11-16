import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { BackLink, Breadcrumb, Link } from '@/ui';

import type { AnchorHTMLAttributes } from 'react';

/**
 * `linkAs` is what keeps an in-app link from reloading the document, so what
 * needs pinning is that the router's component really is the element rendered,
 * that it gets the `href` and the classes the atom's styling keys on, and that
 * `external` never goes through it. A stand-in router link is enough: it
 * renders an `<a>` and navigates on click without a document load.
 */
function makeRouterLink() {
  const navigate = vi.fn();
  function RouterLink({ href, onClick, children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
    return (
      <a
        data-router-link=""
        href={href}
        onClick={(event) => {
          onClick?.(event);
          event.preventDefault();
          navigate(href);
        }}
        {...rest}
      >
        {children}
      </a>
    );
  }
  return { RouterLink, navigate };
}

describe('Link linkAs', () => {
  it('renders a native anchor by default', () => {
    render(<Link href="/orders">Orders</Link>);
    const link = screen.getByRole('link', { name: 'Orders' });
    expect(link.tagName).toBe('A');
    expect(link).not.toHaveAttribute('data-router-link');
  });

  it('renders through the router link with href, classes and children', () => {
    const { RouterLink, navigate } = makeRouterLink();
    render(
      <Link href="/orders/42" linkAs={RouterLink} underline="always" className="extra">
        Order 42
      </Link>,
    );
    const link = screen.getByRole('link', { name: 'Order 42' });
    expect(link).toHaveAttribute('data-router-link');
    expect(link).toHaveAttribute('href', '/orders/42');
    expect(link).toHaveClass('uxm-link', 'uxm-link--underline-always', 'extra');
    fireEvent.click(link);
    expect(navigate).toHaveBeenCalledWith('/orders/42');
  });

  it('passes the disabled state to the router link', () => {
    const { RouterLink } = makeRouterLink();
    render(
      <Link href="/orders" linkAs={RouterLink} disabled>
        Orders
      </Link>,
    );
    expect(screen.getByRole('link', { name: 'Orders' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('ignores linkAs for an external link', () => {
    const { RouterLink } = makeRouterLink();
    render(
      <Link href="https://example.com" linkAs={RouterLink} external>
        Docs
      </Link>,
    );
    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).not.toHaveAttribute('data-router-link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});

describe('BackLink linkAs', () => {
  it('renders a native anchor by default', () => {
    render(<BackLink href="/orders">Back to orders</BackLink>);
    expect(screen.getByRole('link', { name: 'Back to orders' })).not.toHaveAttribute(
      'data-router-link',
    );
  });

  it('renders through the router link, arrow included', () => {
    const { RouterLink, navigate } = makeRouterLink();
    const { container } = render(
      <BackLink href="/orders" linkAs={RouterLink}>
        Back to orders
      </BackLink>,
    );
    const link = screen.getByRole('link', { name: 'Back to orders' });
    expect(link).toHaveAttribute('data-router-link');
    expect(link).toHaveClass('uxm-back-link');
    expect(container.querySelector('.uxm-back-link .uxm-back-link__arrow')).toBeInTheDocument();
    fireEvent.click(link);
    expect(navigate).toHaveBeenCalledWith('/orders');
  });
});

describe('Breadcrumb linkAs', () => {
  it('passes the router link to every linked crumb, not the current page', () => {
    const { RouterLink, navigate } = makeRouterLink();
    render(
      <Breadcrumb
        linkAs={RouterLink}
        items={[{ label: 'Home', href: '/' }, { label: 'Orders', href: '/orders' }, { label: 'Order 42' }]}
      />,
    );
    const orders = screen.getByRole('link', { name: 'Orders' });
    expect(orders).toHaveAttribute('data-router-link');
    expect(orders).toHaveClass('uxm-breadcrumb__link');
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('data-router-link');
    expect(screen.queryByRole('link', { name: 'Order 42' })).toBeNull();
    fireEvent.click(orders);
    expect(navigate).toHaveBeenCalledWith('/orders');
  });
});
