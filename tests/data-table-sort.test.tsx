import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { describe, expect, it, vi } from 'vitest';

import { getIcon } from '@/lib/icons';
import { DataTable } from '@/ui';
import type { DataTableColumn, DataTableSort } from '@/ui';

interface Row {
  id: string;
  name: string;
  amount: number;
}

const ROWS: Row[] = [
  { id: '1', name: 'Alpha', amount: 10 },
  { id: '2', name: 'Beta', amount: 20 },
];

const COLUMNS: DataTableColumn<Row>[] = [
  { key: 'name', header: 'Name', sortKey: 'name' },
  // Plain column — must stay exactly as it was before sorting existed.
  { key: 'note', header: 'Note' },
  { key: 'amount', header: 'Amount', sortKey: 'amount', firstSortDirection: 'desc' },
];

const table = (props: Partial<React.ComponentProps<typeof DataTable<Row>>> = {}) => (
  <DataTable<Row> columns={COLUMNS} rows={ROWS} rowKey={(r) => r.id} {...props} />
);

const th = (name: string) => screen.getByRole('columnheader', { name });

/**
 * Which glyph a header rendered, resolved against the real registry rather
 * than a hard-coded path: the renderer splits `def.path` on each `M`, so
 * concatenating the rendered segments reproduces it exactly. Keeps the test
 * honest if the artwork is ever redrawn.
 */
function glyphIn(name: string): string {
  const svg = screen.getByRole('columnheader', { name }).querySelector('svg');
  if (!svg) return '(no glyph)';
  const d = [...svg.querySelectorAll('path')].map((p) => p.getAttribute('d') ?? '').join('');
  for (const id of ['sort-none', 'sort-asc', 'sort-desc'] as const) {
    if (getIcon(id)?.path === d) return id;
  }
  return '(unrecognised)';
}


describe('DataTable sorting — opt-in', () => {
  it('leaves a table with no sort props exactly as it was', () => {
    render(table());
    // No sort handler means no control, even on a column that declares a
    // sortKey — otherwise a button would appear that does nothing.
    expect(screen.queryByRole('button', { name: 'Name' })).not.toBeInTheDocument();
    expect(th('Name')).not.toHaveAttribute('aria-sort');
    expect(th('Amount')).not.toHaveAttribute('aria-sort');
  });

  it('renders a non-sortable header as bare content — no wrapper, no classes', () => {
    // The headline compatibility claim. Checking only "no aria-sort, no
    // button" let a <span> wrapper or a stray class through, either of which
    // would change every existing consumer's header markup and CSS.
    render(table({ onSortChange: vi.fn(), sort: { key: 'name', direction: 'asc' } }));
    expect(th('Note').innerHTML).toBe('Note');
    expect(th('Note').className).toBe('uxm-data-table__th');
  });

  it('never marks a column without sortKey, even when the table sorts', () => {
    render(table({ onSortChange: vi.fn(), sort: { key: 'name', direction: 'asc' } }));
    expect(th('Note'), 'a plain column must not claim to be sortable').not.toHaveAttribute('aria-sort');
    expect(screen.queryByRole('button', { name: 'Note' })).not.toBeInTheDocument();
  });
});

describe('DataTable sorting — the glyph', () => {
  // The glyph is the ONLY visual cue of sort state. Swapping sort-asc and
  // sort-desc, or pinning everything to sort-none, passed the whole suite
  // before these existed — the Icon is aria-hidden, so nothing else sees it.
  it('shows the neutral glyph on an unsorted column', () => {
    render(table({ onSortChange: vi.fn(), sort: null }));
    expect(glyphIn('Name')).toBe('sort-none');
  });

  it('shows the direction of the sorted column, and only that column', () => {
    render(table({ onSortChange: vi.fn(), sort: { key: 'name', direction: 'asc' } }));
    expect(glyphIn('Name')).toBe('sort-asc');
    expect(glyphIn('Amount')).toBe('sort-none');
  });

  it('shows the descending glyph when sorted descending', () => {
    render(table({ onSortChange: vi.fn(), sort: { key: 'amount', direction: 'desc' } }));
    expect(glyphIn('Amount')).toBe('sort-desc');
  });
});

describe('DataTable sorting — aria-sort', () => {
  it('marks the sorted column and leaves the others "none"', () => {
    render(table({ onSortChange: vi.fn(), sort: { key: 'name', direction: 'asc' } }));
    expect(th('Name')).toHaveAttribute('aria-sort', 'ascending');
    // "none" on the other sortable column is what says the table is sorted by
    // exactly one of them, rather than leaving it ambiguous.
    expect(th('Amount')).toHaveAttribute('aria-sort', 'none');
  });

  it('reports descending', () => {
    render(table({ onSortChange: vi.fn(), sort: { key: 'amount', direction: 'desc' } }));
    expect(th('Amount')).toHaveAttribute('aria-sort', 'descending');
    expect(th('Name')).toHaveAttribute('aria-sort', 'none');
  });

  it('marks every sortable column "none" when nothing is sorted', () => {
    render(table({ onSortChange: vi.fn(), sort: null }));
    expect(th('Name')).toHaveAttribute('aria-sort', 'none');
    expect(th('Amount')).toHaveAttribute('aria-sort', 'none');
  });

  it('matches the active column on sortKey, not on the column key', () => {
    // The two differ on purpose. Matching `key` instead passed every other
    // test, because the rest use columns where key === sortKey.
    render(
      <DataTable<Row>
        columns={[{ key: 'customer', header: 'Customer', sortKey: 'customer.lastName' }]}
        rows={ROWS}
        rowKey={(r) => r.id}
        onSortChange={vi.fn()}
        sort={{ key: 'customer.lastName', direction: 'asc' }}
      />,
    );
    expect(th('Customer')).toHaveAttribute('aria-sort', 'ascending');
  });

  it('ignores a direction it does not recognise rather than half-applying it', () => {
    // `sort` is routinely built from a URL (`?dir=`), so this arrives in
    // practice. The glyph, the next click and aria-sort must agree.
    render(
      table({
        onSortChange: vi.fn(),
        sort: { key: 'name', direction: 'sideways' as unknown as 'asc' },
      }),
    );
    expect(th('Name')).toHaveAttribute('aria-sort', 'none');
    expect(glyphIn('Name')).toBe('sort-none');
  });
});

describe('DataTable sorting — callback mode', () => {
  it('reports the column\'s first direction on a first click', async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    render(table({ onSortChange, sort: null }));

    await user.click(screen.getByRole('button', { name: 'Name' }));
    expect(onSortChange).toHaveBeenLastCalledWith({ key: 'name', direction: 'asc' });

    // `firstSortDirection: 'desc'` — a first click on an amount or a date
    // should open on the largest/newest, not the smallest/oldest.
    await user.click(screen.getByRole('button', { name: 'Amount' }));
    expect(onSortChange).toHaveBeenLastCalledWith({ key: 'amount', direction: 'desc' });
  });

  it('flips the direction of the already-sorted column', async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    render(table({ onSortChange, sort: { key: 'name', direction: 'asc' } }));

    await user.click(screen.getByRole('button', { name: 'Name' }));
    expect(onSortChange).toHaveBeenLastCalledWith({ key: 'name', direction: 'desc' });
  });

  it('never emits null — a sorted column flips rather than clearing', async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    const { rerender } = render(table({ onSortChange, sort: { key: 'name', direction: 'asc' } }));
    await user.click(screen.getByRole('button', { name: 'Name' }));
    rerender(table({ onSortChange, sort: { key: 'name', direction: 'desc' } }));
    await user.click(screen.getByRole('button', { name: 'Name' }));

    for (const call of onSortChange.mock.calls) {
      expect(call[0], 'a three-state header gives no hint which state a click lands on').not.toBeNull();
    }
    expect(onSortChange).toHaveBeenLastCalledWith({ key: 'name', direction: 'asc' });
  });

  it('reports sortKey, not the column key', async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    render(
      <DataTable<Row>
        columns={[{ key: 'customer', header: 'Customer', sortKey: 'customer.lastName' }]}
        rows={ROWS}
        rowKey={(r) => r.id}
        onSortChange={onSortChange}
        sort={null}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Customer' }));
    expect(onSortChange).toHaveBeenLastCalledWith({ key: 'customer.lastName', direction: 'asc' });
  });
});

describe('DataTable sorting — accessible name', () => {
  it('names the control by its header text', () => {
    render(table({ onSortChange: vi.fn(), sort: null }));
    expect(screen.getByRole('button', { name: 'Name' })).toBeInTheDocument();
  });

  it('takes sortLabel when the header is not text', async () => {
    // `header` is a ReactNode. An icon-only header leaves the control with no
    // accessible name at all — an axe button-name violation the LIBRARY would
    // be emitting, so there has to be a way out.
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    render(
      <DataTable<Row>
        columns={[
          { key: 'flag', header: <svg aria-hidden />, sortKey: 'flag', sortLabel: 'Flagged' },
        ]}
        rows={ROWS}
        rowKey={(r) => r.id}
        onSortChange={onSortChange}
        sort={null}
      />,
    );
    const button = screen.getByRole('button', { name: 'Flagged' });
    await user.click(button);
    expect(onSortChange).toHaveBeenCalledWith({ key: 'flag', direction: 'asc' });
  });
});

describe('DataTable sorting — link mode', () => {
  // The reason this mode exists: sort in the URL means the list is linkable,
  // the back button works, and a server-paged table can render on the server.
  // A <button> can do none of that.
  const sortHref = (next: DataTableSort) => `/orders?sort=${next.key}&dir=${next.direction}`;

  it('renders an anchor carrying the sort a click would produce', () => {
    render(table({ sortHref, sort: { key: 'name', direction: 'asc' } }));
    const link = screen.getByRole('link', { name: 'Name' });
    expect(link).toHaveAttribute('href', '/orders?sort=name&dir=desc');
    expect(screen.queryByRole('button', { name: 'Name' })).not.toBeInTheDocument();
  });

  it('still sets aria-sort on the th', () => {
    render(table({ sortHref, sort: { key: 'amount', direction: 'desc' } }));
    expect(th('Amount')).toHaveAttribute('aria-sort', 'descending');
  });

  it('honours firstSortDirection in the href', () => {
    render(table({ sortHref, sort: null }));
    expect(screen.getByRole('link', { name: 'Amount' })).toHaveAttribute(
      'href',
      '/orders?sort=amount&dir=desc',
    );
    expect(screen.getByRole('link', { name: 'Name' })).toHaveAttribute(
      'href',
      '/orders?sort=name&dir=asc',
    );
  });

  it('flips an already-sorted desc-first column back to asc', () => {
    render(table({ sortHref, sort: { key: 'amount', direction: 'desc' } }));
    expect(screen.getByRole('link', { name: 'Amount' })).toHaveAttribute(
      'href',
      '/orders?sort=amount&dir=asc',
    );
  });

  it('hands the anchor to renderSortLink so a router can own it', async () => {
    // Without this, link mode is a plain <a> — a full document load on every
    // sort click in a Next or React Router app, which is why the consumer
    // this feature exists for could not have used it.
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(
      table({
        sortHref,
        sort: null,
        renderSortLink: ({ href, className, children }) => (
          <a
            className={className}
            href={href}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(href);
            }}
          >
            {children}
          </a>
        ),
      }),
    );
    await user.click(screen.getByRole('link', { name: 'Name' }));
    expect(onNavigate).toHaveBeenCalledWith('/orders?sort=name&dir=asc');
  });

  it('wins over onSortChange when both are given', async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    render(table({ sortHref, onSortChange, sort: null }));

    const link = screen.getByRole('link', { name: 'Name' });
    expect(link).toBeInTheDocument();
    // jsdom logs "Not implemented: navigation" on a real anchor click.
    link.addEventListener('click', (e) => e.preventDefault());
    await user.click(link);
    // An href is a stronger statement of intent than a handler; silently
    // preferring the button would strand a URL-driven consumer.
    expect(onSortChange).not.toHaveBeenCalled();
  });
});

describe('DataTable sorting — accessibility', () => {
  // aria-sort is the whole point of the feature, and it is exactly the kind of
  // attribute that is easy to emit in a shape axe rejects (a bare `true`, or
  // on a cell that is not a columnheader).
  async function expectNoViolations(root: Element) {
    const results = await axe.run(root, {
      // Colour contrast needs real styles — this suite runs without CSS.
      rules: { 'color-contrast': { enabled: false } },
    });
    expect(
      results.violations.map((v) => `${v.id}: ${v.help}`),
    ).toEqual([]);
  }

  it('passes axe in callback mode', async () => {
    const { container } = render(
      table({ onSortChange: vi.fn(), sort: { key: 'name', direction: 'asc' } }),
    );
    await expectNoViolations(container);
  });

  it('passes axe in link mode', async () => {
    const { container } = render(
      table({ sortHref: (n) => `/x?s=${n.key}`, sort: { key: 'amount', direction: 'desc' } }),
    );
    await expectNoViolations(container);
  });
});
