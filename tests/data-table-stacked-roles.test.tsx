import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { dataTableDef } from '@/studio/lib/registry/composite/data-table';
import { DataTable } from '@/ui';
import type { DataTableColumn } from '@/ui';
import { DataTablePreview } from '@/ui/data-table/data-table-preview';

import { compiledCss } from './compiled-css';

/**
 * `column.stackedRole` gives a stacked card a shape — a title, labelled fields
 * and an actions footer — instead of every cell in turn behind its
 * `data-label`.
 *
 * The whole feature is opt-in twice over: a table only enters the card layout
 * when at least one column names a role, and every rule is gated on the
 * `--stacked-roles` class that puts there. The first two tests pin that,
 * because "the default is untouched" is the claim this change rests on.
 */
interface Row {
  id: string;
  name: string;
  status: string;
  notes: string;
}

const ROWS: Row[] = [{ id: 'r1', name: 'Alpha', status: 'Active', notes: 'long prose' }];

const PLAIN: DataTableColumn<Row>[] = [
  { key: 'name', header: 'Name' },
  { key: 'status', header: 'Status' },
  { key: 'notes', header: 'Notes' },
];

const ROLES: DataTableColumn<Row>[] = [
  { key: 'name', header: 'Name', stackedRole: 'title' },
  { key: 'status', header: 'Status', stackedRole: 'field' },
  { key: 'notes', header: 'Notes', stackedRole: 'hidden' },
];

describe('DataTable stackedRole — the default is untouched', () => {
  it('adds no class and no markup when no column names a role', () => {
    const { container } = render(<DataTable<Row> columns={PLAIN} rows={ROWS} rowKey={(r) => r.id} />);
    expect(container.querySelector('.uxm-data-table')?.className).not.toContain('stacked-roles');
    expect(container.querySelectorAll('.uxm-data-table__field')).toHaveLength(0);
    expect(container.querySelectorAll('[class*="--stacked-"]')).toHaveLength(0);
    // The data-label path is what the default card still uses.
    expect(container.querySelector('[data-label="Status"]')).not.toBeNull();
  });

  it('leaves a non-opted-in cell with no role markup at all', () => {
    // A guard against the opt-in leaking: the same columns must produce the
    // same DOM as they did before `stackedRole` existed.
    const { container } = render(<DataTable<Row> columns={PLAIN} rows={ROWS} rowKey={(r) => r.id} />);
    const cells = [...container.querySelectorAll('.uxm-data-table__td')].map((td) => td.outerHTML);
    expect(cells.every((html) => !html.includes('stacked') && !html.includes('__field'))).toBe(true);
  });
});

describe('DataTable stackedRole — the card shape', () => {
  it('one role switches the whole table on', () => {
    const { container } = render(<DataTable<Row> columns={ROLES} rows={ROWS} rowKey={(r) => r.id} />);
    expect(container.querySelector('.uxm-data-table')?.className).toContain('uxm-data-table--stacked-roles');
  });

  it('marks each cell with its role', () => {
    const { container } = render(<DataTable<Row> columns={ROLES} rows={ROWS} rowKey={(r) => r.id} />);
    expect(container.querySelector('.uxm-data-table__td--stacked-title')?.textContent).toBe('Alpha');
    expect(container.querySelector('.uxm-data-table__td--stacked-hidden')?.textContent).toBe('long prose');
    expect(container.querySelector('.uxm-data-table__td--stacked-field')).not.toBeNull();
  });

  it('treats an unnamed column as a field once any column has a role', () => {
    // Otherwise adding one role would mean annotating every column.
    const mixed: DataTableColumn<Row>[] = [
      { key: 'name', header: 'Name', stackedRole: 'title' },
      { key: 'status', header: 'Status' },
    ];
    const { container } = render(<DataTable<Row> columns={mixed} rows={ROWS} rowKey={(r) => r.id} />);
    const status = container.querySelector('[data-label="Status"]');
    expect(status?.className).toContain('uxm-data-table__td--stacked-field');
  });

  it('puts a field label in the DOM, not only in a pseudo-element', () => {
    // The point of the dl: the stacked card hides the `<thead>`, so with only
    // `content: attr(data-label)` a screen reader meets a column of bare
    // values — pseudo-element text is not reliably exposed.
    const { container } = render(<DataTable<Row> columns={ROLES} rows={ROWS} rowKey={(r) => r.id} />);
    const dl = container.querySelector('.uxm-data-table__field');
    expect(dl?.tagName).toBe('DL');
    expect(dl?.querySelector('dt')?.textContent).toBe('Status');
    expect(dl?.querySelector('dd')?.textContent).toBe('Active');
  });

  it('gives a title, a hidden column and the actions cell no dl', () => {
    const { container } = render(
      <DataTable<Row>
        columns={ROLES}
        rows={ROWS}
        rowKey={(r) => r.id}
        rowActions={() => [{ key: 'a', label: 'Edit', onSelect: () => {} }]}
      />,
    );
    expect(container.querySelector('.uxm-data-table__td--stacked-title .uxm-data-table__field')).toBeNull();
    expect(container.querySelector('.uxm-data-table__td--stacked-hidden .uxm-data-table__field')).toBeNull();
    expect(container.querySelector('.uxm-data-table__td--actions .uxm-data-table__field')).toBeNull();
    // Only the one field column has one.
    expect(container.querySelectorAll('.uxm-data-table__field')).toHaveLength(1);
  });

  it('leaves a field with a non-string header unlabelled rather than throwing', () => {
    // `columnLabel()` returns undefined for a ReactNode header, so there is no
    // dl — and the pseudo is suppressed too, so the value shows bare. Same gap
    // the default card has through an empty `attr()`; `column.label` is the
    // fix, and the README says so.
    const iconHeader: DataTableColumn<Row>[] = [
      { key: 'name', header: 'Name', stackedRole: 'title' },
      { key: 'status', header: <span>icon</span>, stackedRole: 'field' },
    ];
    const { container } = render(<DataTable<Row> columns={iconHeader} rows={ROWS} rowKey={(r) => r.id} />);
    expect(container.querySelectorAll('.uxm-data-table__field')).toHaveLength(0);
    expect(container.querySelector('.uxm-data-table__td--stacked-field')?.textContent).toBe('Active');

    const labelled: DataTableColumn<Row>[] = [
      { key: 'name', header: 'Name', stackedRole: 'title' },
      { key: 'status', header: <span>icon</span>, label: 'Status', stackedRole: 'field' },
    ];
    const second = render(<DataTable<Row> columns={labelled} rows={ROWS} rowKey={(r) => r.id} />);
    expect(second.container.querySelector('.uxm-data-table__field dt')?.textContent).toBe('Status');
  });

  it('puts the rowActions cell in the footer without being told', () => {
    const { container } = render(
      <DataTable<Row>
        columns={ROLES}
        rows={ROWS}
        rowKey={(r) => r.id}
        rowActions={() => [{ key: 'a', label: 'Edit', onSelect: () => {} }]}
      />,
    );
    const actions = container.querySelector('.uxm-data-table__td--actions');
    expect(actions?.className).toContain('uxm-data-table__td--stacked-actions');
  });

  it('leaves the rowActions cell alone when no column has a role', () => {
    const { container } = render(
      <DataTable<Row>
        columns={PLAIN}
        rows={ROWS}
        rowKey={(r) => r.id}
        rowActions={() => [{ key: 'a', label: 'Edit', onSelect: () => {} }]}
      />,
    );
    expect(container.querySelector('.uxm-data-table__td--actions')?.className).not.toContain('stacked-actions');
  });
});

describe('DataTable stackedRole — the footer', () => {
  const withActionsColumn: DataTableColumn<Row>[] = [
    { key: 'name', header: 'Name', stackedRole: 'title' },
    { key: 'status', header: 'Status', stackedRole: 'actions' },
  ];

  it('marks a column declared as actions', () => {
    const { container } = render(
      <DataTable<Row> columns={withActionsColumn} rows={ROWS} rowKey={(r) => r.id} />,
    );
    expect(container.querySelectorAll('.uxm-data-table__td--stacked-actions')).toHaveLength(1);
  });

  it('puts an actions column and a rowActions kebab in one footer', () => {
    const { container } = render(
      <DataTable<Row>
        columns={withActionsColumn}
        rows={ROWS}
        rowKey={(r) => r.id}
        rowActions={() => [{ key: 'a', label: 'Edit', onSelect: () => {} }]}
      />,
    );
    // Two cells land in the footer; only the first may draw a divider.
    expect(container.querySelectorAll('.uxm-data-table__td--stacked-actions')).toHaveLength(2);
    const css = compiledCss('src/ui/data-table/data-table.scss');
    expect(css, 'a second footer cell must not draw its own divider').toMatch(
      /--stacked-roles \.uxm-data-table__td--stacked-actions ~ \.uxm-data-table__td--stacked-actions\s*\{[^}]*border-top:\s*none/,
    );
  });

  it('hides the footer when a row has no actions', () => {
    const { container } = render(
      <DataTable<Row> columns={ROLES} rows={ROWS} rowKey={(r) => r.id} rowActions={() => []} />,
    );
    // `rowActions` renders its cell regardless, so the cell exists and is
    // empty — the stylesheet is what must drop it, or the card shows a
    // divider over an empty padded strip.
    const cell = container.querySelector('.uxm-data-table__td--stacked-actions');
    expect(cell).not.toBeNull();
    expect(cell?.childElementCount).toBe(0);
    const css = compiledCss('src/ui/data-table/data-table.scss');
    expect(css, 'an empty footer cell must be dropped').toMatch(
      /--stacked-roles \.uxm-data-table__td--stacked-actions:empty\s*\{[^}]*display:\s*none/,
    );
  });
});

describe('DataTable stackedRole — the studio reaches it', () => {
  // A knob the studio offers and the preview never reads has bitten this
  // preview three times. The sibling `stackAt` variant has the same pairing
  // test for the same reason.
  const variant = dataTableDef.layoutVariants.find((v) => v.key === 'stackedRoles');

  it('is offered as a layout variant', () => {
    expect(variant, 'the registry must offer the stackedRoles variant').toBeDefined();
    expect((variant?.options ?? []).map((o) => (typeof o === 'string' ? o : o.value)).sort()).toEqual([
      'off',
      'on',
    ]);
    expect(variant?.defaultValue).toBe('off');
  });

  it('is read by the preview — rendered, not grepped', () => {
    // Asserting on the source would pass on a dead branch; render it.
    const { container } = render(<DataTablePreview componentId="data-table" styles={{}} variants={{ stackedRoles: 'on' }} />);
    const root = container.querySelector('.uxm-data-table');
    expect(root?.className).toContain('uxm-data-table--stacked-roles');
    expect(container.querySelectorAll('.uxm-data-table__td--stacked-title').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('.uxm-data-table__td--stacked-field').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('.uxm-data-table__td--stacked-hidden').length).toBeGreaterThan(0);
  });

  it('leaves the preview alone for every value that is not "on"', () => {
    const cases: Record<string, string>[] = [{}, { stackedRoles: 'off' }];
    for (const variants of cases) {
      const { container, unmount } = render(
        <DataTablePreview componentId="data-table" styles={{}} variants={variants} />,
      );
      expect(container.querySelector('.uxm-data-table')?.className).not.toContain('stacked-roles');
      expect(container.querySelectorAll('[class*="--stacked-"]')).toHaveLength(0);
      unmount();
    }
  });
});

describe('DataTable stackedRole — the stylesheet', () => {
  const css = compiledCss('src/ui/data-table/data-table.scss');

  it('gates every role rule on the opt-in class', () => {
    // The claim the whole change rests on. A single ungated rule reaches
    // tables that never asked for this.
    //
    // Two things this has to do that the obvious version does not. It splits
    // comma lists, because `.a, .gated {…}` passes a whole-string check while
    // `.a` is loose. And it keys off the DECLARATIONS the role layout owns,
    // not off role names in the selector: `#{$root} .uxm-data-table__row
    // {display:flex}` carries no role name, so a name-filtered check let
    // dropping its gate through — every table went flex-column in card mode
    // with the suite green.
    // The eight `--uxm-data-table-stacked-*` knobs are read by role rules and
    // nothing else, so a rule that references one IS a role rule however its
    // selector is spelled. Keying off `display: flex` instead would sweep in
    // the stylesheet's many pre-existing flex rules.
    const ROLE_DECLS = ['--uxm-data-table-stacked-'];
    const ROLE_NAMES = ['stacked-title', 'stacked-field', 'stacked-actions', 'stacked-hidden', '__field'];
    // Comments first: this file's are long, contain commas and name the very
    // knobs below, so left in they parse as selectors and the check drowns.
    const bare = css.replace(/\/\*[\s\S]*?\*\//g, '');
    const rules = [...bare.matchAll(/([^{}@]+)\{([^{}]*)\}/g)].map((m) => ({
      selectors: m[1].split(',').map((x) => x.trim()).filter(Boolean),
      body: m[2],
    }));
    const roleRules = rules.filter(
      (r) =>
        r.selectors.some((sel) => ROLE_NAMES.some((n) => sel.includes(n))) ||
        ROLE_DECLS.some((d) => r.body.includes(d)),
    );
    expect(roleRules.length, 'no role rules found — the check would pass vacuously').toBeGreaterThan(8);
    const ungated = roleRules.flatMap((r) => r.selectors).filter((sel) => !sel.includes('--stacked-roles'));
    expect(ungated, 'a role rule that any table resolves').toEqual([]);
  });

  it('keys the roles gate COMPOUND on the stackAt presets, never as a descendant', () => {
    // `.stack-640 .uxm-data-table--stacked-roles` can never match: both classes
    // sit on the SAME root element. Written that way the role cards simply
    // never appear at 640/768/960, and a test that only greps for the class
    // name sees nothing wrong.
    for (const bp of [640, 768, 960]) {
      expect(css, `${bp} must compound the two root classes`).toContain(
        `.uxm-data-table--stack-${bp}.uxm-data-table--stacked-roles`,
      );
    }
    expect(css, 'the roles gate must never be a descendant of a stack class').not.toMatch(
      /\.uxm-data-table--stack-\d+ \.uxm-data-table--stacked-roles/,
    );
  });

  it('hides the field term outside the stacked query and shows it inside', () => {
    // The dl exists in BOTH layouts, because one DOM serves both. Left visible
    // in table mode it repeats the column header inside every cell.
    // Top level vs nested is the distinction, and indentation is how the
    // compiler marks it — slicing at the first `@container` would not, because
    // the first one in this file is the unrelated `min-width: 481px` clip.
    const topLevel = css.match(/^\.uxm-data-table--stacked-roles \.uxm-data-table__field-term \{[^}]*\}/m);
    expect(topLevel?.[0], 'term must be hidden in table mode').toMatch(/display:\s*none/);
    const nested = css.match(/^ +\.uxm-data-table--stacked-roles \.uxm-data-table__field-term \{[^}]*\}/m);
    expect(nested?.[0], 'term must come back in card mode').toMatch(/display:\s*block/);
  });

  it('zeroes the browser margins the dl and dd bring', () => {
    // `dd` is indented 40px by default — untouched it would stagger every value.
    expect(css).toMatch(/--stacked-roles \.uxm-data-table__field[^{]*\{[^}]*margin:\s*0/);
  });

  it('suppresses the data-label pseudo wherever a role replaces it', () => {
    for (const role of ['title', 'field', 'actions']) {
      expect(css, `${role} must not also render its data-label`).toMatch(
        new RegExp(`--stacked-roles \\.uxm-data-table__td--stacked-${role}::before\\s*\\{[^}]*content:\\s*none`),
      );
    }
  });

  it('ships the role rules for every stackAt preset, not just the default', () => {
    // The opt-in thresholds are separate @container blocks; a role table that
    // also raises its threshold must still get a card shape.
    // A threshold can compile to SEVERAL @container blocks (480 has three),
    // and only one of them carries the role rules — so ask whether any block
    // for that width does, not whether the first one does.
    for (const bp of [480, 640, 768, 960]) {
      const blocks = [...css.matchAll(new RegExp(`@container \\(max-width: ${bp}px\\) \\{[\\s\\S]*?\\n\\}`, 'g'))].map((m) => m[0]);
      expect(blocks.length, `no block for ${bp}`).toBeGreaterThan(0);
      expect(
        blocks.some((b) => b.includes('--stacked-roles')),
        `no ${bp} block carries the role rules`,
      ).toBe(true);
    }
  });
});

/**
 * A `field` whose header is JSX and that has no `label` renders its value with
 * no `<dt>` — and the stacked card hides the `<thead>` — so a screen reader
 * reads it bare. Nothing on screen says so, so development says it in the
 * console, once per change of the offending columns rather than per render.
 */
describe('DataTable unnamed stacked field warning', () => {
  afterEach(() => vi.restoreAllMocks());

  const UNNAMED: DataTableColumn<Row>[] = [
    { key: 'name', header: 'Name', stackedRole: 'title' },
    { key: 'status', header: <span>Status</span> },
  ];

  it('warns once, naming the column, and not again on a re-render with fresh columns', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { rerender } = render(<DataTable rows={ROWS} rowKey={(r) => r.id} columns={[...UNNAMED]} />);
    rerender(<DataTable rows={ROWS} rowKey={(r) => r.id} columns={[...UNNAMED]} />);
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0][0]).toContain('status');
  });

  it('stays quiet when the field has a label, or when no column names a role', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<DataTable rows={ROWS} rowKey={(r) => r.id} columns={[UNNAMED[0], { ...UNNAMED[1], label: 'Status' }]} />);
    render(<DataTable rows={ROWS} rowKey={(r) => r.id} columns={[{ key: 'status', header: <span>Status</span> }]} />);
    expect(warn).not.toHaveBeenCalled();
  });
});
