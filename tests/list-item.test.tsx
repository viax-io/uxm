import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Checkbox, Icon, ListItem, Thumbnail } from '@/ui';

/**
 * The `media` slot's whole point is that it does NOT go through `IconTile`,
 * so what needs pinning is the leading-slot precedence and the absence of the
 * tile — the one thing a future refactor of the slot could silently undo.
 * Visual sizing is verified in the portal, not here.
 */
describe('ListItem leading slot', () => {
  it('renders media as-is, with no IconTile wrapper', () => {
    const { container } = render(
      <ListItem media={<Thumbnail alt="Bolt" />}>Bolt M6</ListItem>,
    );
    expect(container.querySelector('.uxm-list-item__media')).toBeInTheDocument();
    expect(container.querySelector('.uxm-thumbnail')).toBeInTheDocument();
    expect(container.querySelector('.uxm-icon-tile')).not.toBeInTheDocument();
  });

  it('keeps wrapping the icon slot in an IconTile', () => {
    const { container } = render(
      <ListItem icon={<Icon glyph="square" />}>Owner</ListItem>,
    );
    const tile = container.querySelector('.uxm-list-item__icon');
    expect(tile).toBeInTheDocument();
    expect(tile).toHaveClass('uxm-icon-tile');
    expect(container.querySelector('.uxm-list-item__media')).not.toBeInTheDocument();
  });

  it('lets media win when both slots are passed', () => {
    const { container } = render(
      <ListItem media={<Thumbnail alt="Bolt" />} icon={<Icon glyph="square" />}>
        Bolt M6
      </ListItem>,
    );
    expect(container.querySelector('.uxm-list-item__media')).toBeInTheDocument();
    expect(container.querySelector('.uxm-list-item__icon')).not.toBeInTheDocument();
  });

  it('forwards the row media size into the child atom size vars', () => {
    // The stretch rule in list.scss is only the floor for a plain <img>; a
    // Thumbnail / Avatar has to be sized through its OWN var or its border,
    // radius and inner glyph stay scaled to the atom's default (48/40px)
    // — and no CSS-specificity fix is order-independent, since Avatar's size
    // presets deliberately sit at (0,2,0). jsdom does no layout, so the
    // forwarding itself is what gets pinned here.
    const { container } = render(
      <ListItem media={<Thumbnail alt="" />}>Bolt M6</ListItem>,
    );
    const slot = container.querySelector<HTMLElement>('.uxm-list-item__media');
    const size = 'var(--uxm-list-item-media-size, 36px)';
    expect(slot?.style.getPropertyValue('--uxm-thumbnail-size')).toBe(size);
    expect(slot?.style.getPropertyValue('--uxm-avatar-size')).toBe(size);
    expect(slot?.style.getPropertyValue('--uxm-avatar-small-size')).toBe(size);
  });

  it('leaves the row name to the title when the media is decorative', () => {
    // The slot renders inside the <button>, so a described image joins the
    // accessible name — `alt="Bolt M6"` here would announce "Bolt M6Bolt
    // M6SKU-9". Documented in the README; pinned so it cannot regress into
    // the atom (e.g. by someone labelling the demo media).
    render(
      <ListItem interactive media={<Thumbnail src="/p.png" alt="" />} value="SKU-9">
        Bolt M6
      </ListItem>,
    );
    expect(screen.queryByRole('button', { name: /Bolt M6.*Bolt M6/ })).toBeNull();
    expect(screen.getByRole('button', { name: /^Bolt M6/ })).toBeInTheDocument();
  });

  it('keeps the interactive button affordances alongside media', () => {
    render(
      <ListItem interactive active media={<Thumbnail alt="Bolt" />}>
        Bolt M6
      </ListItem>,
    );
    const row = screen.getByRole('button', { name: /Bolt M6/ });
    expect(row).toHaveClass('uxm-list-item', 'uxm-list-item--active');
    expect(row).toHaveAttribute('aria-pressed', 'true');
  });
});

describe('ListItem selectable mode', () => {
  it('renders a label-wrapped checkbox and keeps the row out of button semantics', () => {
    render(
      <ListItem selected onSelectedChange={() => {}} media={<Thumbnail alt="" />}>
        Bolt M6
      </ListItem>,
    );
    const box = screen.getByRole('checkbox');
    expect(box).toBeChecked();
    // A member of a checkable set, not a toggle button.
    expect(screen.queryByRole('button')).toBeNull();
    expect(box.closest('label')).toHaveClass('uxm-list-item--selectable');
  });

  it('toggles from a click anywhere on the row', () => {
    const onSelectedChange = vi.fn();
    render(
      <ListItem selected={false} onSelectedChange={onSelectedChange}>
        Bolt M6
      </ListItem>,
    );
    // The label is the whole row, so clicking the title text activates the
    // input natively — no click handler involved.
    screen.getByText('Bolt M6').click();
    expect(onSelectedChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it('wins over interactive/href and warns in dev', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <ListItem selected onSelectedChange={() => {}} interactive href="/x">
        Both
      </ListItem>,
    );
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(warn).toHaveBeenCalledOnce();
    warn.mockRestore();
  });

  it('disables the input', () => {
    render(
      <ListItem selected={false} onSelectedChange={() => {}} disabled>
        Bolt M6
      </ListItem>,
    );
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('leaves every other mode untouched', () => {
    const { container, rerender } = render(<ListItem>Plain</ListItem>);
    expect(container.querySelector('.uxm-list-item--selectable')).toBeNull();
    expect(container.querySelector('input')).toBeNull();
    rerender(<ListItem interactive>Button</ListItem>);
    expect(screen.getByRole('button')).toBeInTheDocument();
    rerender(<ListItem href="/docs">Link</ListItem>);
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('renders the same checkbox internals the Checkbox atom does', () => {
    // The coupling this mode accepts: ListItem paints Checkbox's classes rather
    // than nesting the component (a <label> inside the row <label> is invalid
    // HTML). If Checkbox's internals move, this fails here instead of shipping
    // an unstyled box.
    const a = render(<Checkbox checked onChange={() => {}} />).container;
    const b = render(
      <ListItem selected onSelectedChange={() => {}}>
        Row
      </ListItem>,
    ).container;
    for (const cls of ['.uxm-checkbox__input', '.uxm-checkbox__box']) {
      expect(a.querySelector(cls), `Checkbox renders ${cls}`).not.toBeNull();
      expect(b.querySelector(cls), `selectable ListItem renders ${cls}`).not.toBeNull();
    }
    expect(b.querySelector('.uxm-checkbox__box svg')).not.toBeNull();
  });
});
