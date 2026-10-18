import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { EditableCell } from '@/ui';

// Behavioural baseline for the EditableCell split: every commit / cancel /
// error path per type. Written against the single-file component first, so
// the per-type views must reproduce it exactly.
describe('EditableCell — text', () => {
  it('shows the value, enters edit on click with the input focused and selected', async () => {
    render(<EditableCell value="Ada" onCommit={vi.fn()} />);
    const button = screen.getByRole('button', { name: 'Edit Ada' });
    expect(button).toHaveTextContent('Ada');
    await userEvent.click(button);
    const input = await screen.findByRole('textbox');
    await waitFor(() => expect(document.activeElement).toBe(input));
    expect((input as HTMLInputElement).selectionStart).toBe(0);
    expect((input as HTMLInputElement).selectionEnd).toBe(3);
  });

  it('commits on Enter and leaves edit mode', async () => {
    const onCommit = vi.fn().mockResolvedValue(undefined);
    render(<EditableCell value="Ada" onCommit={onCommit} />);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.keyboard('Grace{Enter}');
    await waitFor(() => expect(onCommit).toHaveBeenCalledWith('Grace'));
    await waitFor(() => expect(screen.queryByRole('textbox')).not.toBeInTheDocument());
  });

  it('cancels on Escape without committing and restores the draft', async () => {
    const onCommit = vi.fn();
    render(<EditableCell value="Ada" onCommit={onCommit} />);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.keyboard('Nope{Escape}');
    expect(onCommit).not.toHaveBeenCalled();
    expect(screen.getByRole('button')).toHaveTextContent('Ada');
  });

  it('does not commit or cancel on Enter / Escape that belong to an IME composition', async () => {
    const onCommit = vi.fn();
    render(<EditableCell value="Ada" onCommit={onCommit} />);
    await userEvent.click(screen.getByRole('button'));
    const input = await screen.findByRole('textbox');
    fireEvent.keyDown(input, { key: 'Enter', isComposing: true });
    fireEvent.keyDown(input, { key: 'Escape', keyCode: 229 });
    expect(onCommit).not.toHaveBeenCalled();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('treats an unchanged blur as a pure exit (no onCommit)', async () => {
    const onCommit = vi.fn();
    render(<><EditableCell value="Ada" onCommit={onCommit} /><button type="button">Elsewhere</button></>);
    await userEvent.click(screen.getByRole('button', { name: 'Edit Ada' }));
    await screen.findByRole('textbox');
    await userEvent.click(screen.getByRole('button', { name: 'Elsewhere' }));
    await waitFor(() => expect(screen.queryByRole('textbox')).not.toBeInTheDocument());
    expect(onCommit).not.toHaveBeenCalled();
  });

  it('surfaces a rejected onCommit as an error banner and stays in edit mode', async () => {
    const onCommit = vi.fn().mockRejectedValue(new Error('Network down'));
    render(<EditableCell value="Ada" onCommit={onCommit} />);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.keyboard('Grace{Enter}');
    expect(await screen.findByText('Network down')).toBeInTheDocument();
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveValue('Grace');
  });

  it('shows the required warning for an emptied required cell', async () => {
    const onCommit = vi.fn();
    render(<EditableCell value="Ada" onCommit={onCommit} required clearable />);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByRole('button', { name: 'Clear value' }));
    await userEvent.keyboard('{Enter}');
    expect(await screen.findByText('Required')).toBeInTheDocument();
    expect(onCommit).not.toHaveBeenCalled();
  });

  it('renders forceMode="warning" as the editing surface with the sample message', () => {
    render(<EditableCell value="Ada" onCommit={vi.fn()} forceMode="warning" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByText('Enter a valid value')).toBeInTheDocument();
  });
});

describe('EditableCell — number', () => {
  it('masks the draft and commits a number', async () => {
    const onCommit = vi.fn().mockResolvedValue(undefined);
    render(<EditableCell type="number" value={1} onCommit={onCommit} />);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.keyboard('12a.5{Enter}');
    await waitFor(() => expect(onCommit).toHaveBeenCalledWith(12.5));
  });

  it('rejects a half-typed non-number with the invalid-number warning', async () => {
    const onCommit = vi.fn();
    render(<EditableCell type="number" value={1} onCommit={onCommit} />);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.keyboard('-{Enter}');
    expect(await screen.findByText('Enter a number')).toBeInTheDocument();
    expect(onCommit).not.toHaveBeenCalled();
  });
});

const options = [
  { value: 'ua', label: 'Ukraine' },
  { value: 'pl', label: 'Poland' },
];

describe('EditableCell — select / multiselect', () => {
  it('select: opens a listbox and commits the picked option', async () => {
    const onCommit = vi.fn().mockResolvedValue(undefined);
    render(<EditableCell type="select" value="ua" options={options} onCommit={onCommit} searchable={false} />);
    const trigger = screen.getByRole('button', { name: 'Edit ua' });
    expect(trigger).toHaveTextContent('Ukraine');
    await userEvent.click(trigger);
    await screen.findByRole('listbox');
    await userEvent.click(screen.getByRole('option', { name: 'Poland' }));
    await waitFor(() => expect(onCommit).toHaveBeenCalledWith('pl'));
  });

  it('multiselect: shows the joined labels and commits the array on close', async () => {
    const onCommit = vi.fn().mockResolvedValue(undefined);
    render(<EditableCell type="multiselect" value={['ua']} options={options} onCommit={onCommit} searchable={false} />);
    // The clearable ✕ is a sibling button, so pick the trigger by its name.
    const trigger = screen.getByRole('button', { name: 'Edit ua' });
    expect(trigger).toHaveTextContent('Ukraine');
    await userEvent.click(trigger);
    await screen.findByRole('listbox');
    await userEvent.click(screen.getByRole('option', { name: 'Poland' }));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(onCommit).toHaveBeenCalledTimes(1));
    expect(onCommit.mock.calls[0][0]).toEqual(['ua', 'pl']);
  });
});

describe('EditableCell — date', () => {
  it('shows the formatted date, opens the calendar on click, commits a typed date as ISO', async () => {
    const onCommit = vi.fn().mockResolvedValue(undefined);
    render(<EditableCell type="date" value="2026-01-15" onCommit={onCommit} />);
    const button = screen.getByRole('button', { name: 'Edit date 2026-01-15' });
    await userEvent.click(button);
    const input = await screen.findByRole('textbox');
    expect(await screen.findByRole('dialog', { name: 'Choose date' })).toBeInTheDocument();
    await waitFor(() => expect(document.activeElement).toBe(input));
    await userEvent.keyboard('2026-02-20{Enter}');
    await waitFor(() => expect(onCommit).toHaveBeenCalledWith('2026-02-20'));
  });

  it('rejects an unparseable date with the format hint and keeps the calendar closed', async () => {
    const onCommit = vi.fn();
    render(<EditableCell type="date" value="2026-01-15" onCommit={onCommit} />);
    await userEvent.click(screen.getByRole('button'));
    const input = await screen.findByRole('textbox');
    await waitFor(() => expect(document.activeElement).toBe(input));
    await userEvent.keyboard('2026-13-{Enter}');
    expect(await screen.findByRole('alert', {}).catch(() => screen.getByText(/YYYY|date/i))).toBeInTheDocument();
    expect(screen.queryByRole('dialog', { name: 'Choose date' })).not.toBeInTheDocument();
    expect(onCommit).not.toHaveBeenCalled();
  });

  it('empty date cell reads "Add date" and shows the mask as placeholder', () => {
    render(<EditableCell type="date" value="" onCommit={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Add date' })).toHaveTextContent('YYYY-MM-DD');
  });
});

const withDisabled = [
  { value: 'ua', label: 'Ukraine' },
  { value: 'pl', label: 'Poland' },
  { value: 'de', label: 'Germany — already mapped', disabled: true },
];

describe('EditableCell — a disabled option', () => {
  it('select: renders it, marks it, and commits nothing when it is clicked', async () => {
    const onCommit = vi.fn().mockResolvedValue(undefined);
    render(
      <EditableCell type="select" value="ua" options={withDisabled} onCommit={onCommit} searchable={false} />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Edit ua' }));
    await screen.findByRole('listbox');

    const row = screen.getByRole('option', { name: 'Germany — already mapped' });
    expect(row, 'a disabled option is SHOWN — hiding it is what the list already does').toBeInTheDocument();
    expect(row).toHaveAttribute('aria-disabled', 'true');

    await userEvent.click(row);
    expect(onCommit, 'clicking a disabled option committed it').not.toHaveBeenCalled();
  });

  it('select: arrow-key navigation never lands on it', async () => {
    // The keyboard path is separate code from the mouse path, so a click-only
    // assertion leaves half the feature untested — and the half that would
    // silently commit a value nobody can click.
    //
    // Asserted as "never active, however far you walk" rather than by counting
    // keypresses: the panel swallows the first arrows while it takes focus, so
    // a fixed count tests the choreography instead of the contract.
    const onCommit = vi.fn().mockResolvedValue(undefined);
    render(
      <EditableCell type="select" value="ua" options={withDisabled} onCommit={onCommit} searchable={false} />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Edit ua' }));
    await screen.findByRole('listbox');

    const disabledRow = () => screen.getByRole('option', { name: 'Germany — already mapped' });
    for (let i = 0; i < 6; i++) {
      await userEvent.keyboard('{ArrowDown}');
      expect(
        disabledRow().className,
        `the disabled option became active after ${i + 1} ArrowDown(s)`,
      ).not.toContain('--active');
    }

    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(onCommit).toHaveBeenCalled());
    expect(onCommit, 'Enter committed the disabled option').not.toHaveBeenCalledWith('de');
  });

  it('multiselect: honours it too', async () => {
    // Same wiring, a different listbox — exactly where a one-line omission hides.
    const onCommit = vi.fn().mockResolvedValue(undefined);
    render(
      <EditableCell
        type="multiselect"
        value={['ua']}
        options={withDisabled}
        onCommit={onCommit}
        searchable={false}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Edit ua' }));
    await screen.findByRole('listbox');
    const row = screen.getByRole('option', { name: 'Germany — already mapped' });
    expect(row).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(row);
    await userEvent.keyboard('{Escape}');
    // Nothing toggled, so the close commits nothing at all.
    expect(onCommit).not.toHaveBeenCalled();
  });

  it('leaves an option without the flag exactly as it was', async () => {
    const onCommit = vi.fn().mockResolvedValue(undefined);
    render(
      <EditableCell type="select" value="ua" options={withDisabled} onCommit={onCommit} searchable={false} />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Edit ua' }));
    await screen.findByRole('listbox');
    const row = screen.getByRole('option', { name: 'Poland' });
    expect(row).not.toHaveAttribute('aria-disabled');
    await userEvent.click(row);
    await waitFor(() => expect(onCommit).toHaveBeenCalledWith('pl'));
  });
});

describe('EditableCell — a value the option list does not contain', () => {
  // The designed-for situation once `editorOptions` is a row function: the
  // function omits whatever another row has claimed, which sooner or later is
  // this row's own value. Dropping it silently is the data-loss shape.
  it('multiselect keeps it through a commit instead of dropping it', async () => {
    const onCommit = vi.fn().mockResolvedValue(undefined);
    render(
      <EditableCell
        type="multiselect"
        value={['p', 'gone']}
        options={[{ value: 'p', label: 'P' }, { value: 'q', label: 'Q' }]}
        onCommit={onCommit}
        searchable={false}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: /Edit/ }));
    await screen.findByRole('listbox');
    await userEvent.click(screen.getByRole('option', { name: 'Q' }));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(onCommit).toHaveBeenCalled());
    expect(onCommit.mock.calls[0][0], 'the absent value was destroyed by an unrelated edit').toEqual([
      'p',
      'gone',
      'q',
    ]);
  });

  it('shows it as a selected, removable row — not a disabled one', async () => {
    // Deliberately not disabled: a disabled row cannot be toggled off, which
    // would leave "Clear all" as the only way out of a value the user can see.
    render(
      <EditableCell
        type="multiselect"
        value={['p', 'gone']}
        options={[{ value: 'p', label: 'P' }]}
        onCommit={vi.fn()}
        searchable={false}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: /Edit/ }));
    await screen.findByRole('listbox');
    const row = screen.getByRole('option', { name: 'gone' });
    expect(row).toHaveAttribute('aria-selected', 'true');
    expect(row).not.toHaveAttribute('aria-disabled');
  });

  it('single select displays it rather than an empty cell', async () => {
    render(
      <EditableCell type="select" value="acct_123" options={[{ value: 'p', label: 'P' }]} onCommit={vi.fn()} searchable={false} />,
    );
    expect(screen.getByRole('button', { name: /Edit/ })).toHaveTextContent('acct_123');
  });
});

describe('EditableCell — a panel with nothing pickable', () => {
  it('still shows its disabled options', async () => {
    // "Shown but refused" has to hold in the case it exists for: a mapping row
    // where every source is claimed or incompatible. Keyed on SELECTABLE rows,
    // the empty state swallowed the whole list.
    render(
      <EditableCell
        type="select"
        value=""
        options={[
          { value: 'a', label: 'Acct — already mapped', disabled: true },
          { value: 'b', label: 'Amt — already mapped', disabled: true },
        ]}
        onCommit={vi.fn()}
        searchable={false}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: /Edit/ }));
    await screen.findByRole('listbox');
    expect(screen.getAllByRole('option')).toHaveLength(2);
    expect(screen.queryByText('No matches'), 'the options were hidden behind the empty state').toBeNull();
  });

  it('keeps the empty state for a list that really is empty', async () => {
    // An empty committed value synthesizes nothing, so the panel is genuinely
    // empty — which is the one case the empty state should still claim.
    render(<EditableCell type="select" value="" options={[]} onCommit={vi.fn()} searchable={false} />);
    await userEvent.click(screen.getByRole('button', { name: /Edit/ }));
    await screen.findByRole('listbox');
    expect(screen.getByText('No matches')).toBeInTheDocument();
  });

  it('survives arrow keys with no active row', async () => {
    const onCommit = vi.fn();
    render(
      <EditableCell type="select" value="" options={[{ value: 'a', label: 'A', disabled: true }]} onCommit={onCommit} searchable={false} />,
    );
    await userEvent.click(screen.getByRole('button', { name: /Edit/ }));
    await screen.findByRole('listbox');
    await userEvent.keyboard('{ArrowDown}{ArrowUp}{Home}{End}');
    expect(screen.getAllByRole('option')).toHaveLength(1);
    expect(onCommit).not.toHaveBeenCalled();
  });

  it('a search narrowed to only disabled matches still shows them', async () => {
    // The filtered list rebuilds the selectable index, so this hit the same
    // empty-state condition from the other direction: type a query that only a
    // claimed field matches, and the panel claimed there were no matches at all.
    const user = userEvent.setup();
    render(
      <EditableCell
        type="select"
        value=""
        options={[
          { value: 'x', label: 'Xray' },
          { value: 'a', label: 'Acct — already mapped', disabled: true },
        ]}
        onCommit={vi.fn()}
        searchable
      />,
    );
    await user.click(screen.getByRole('button', { name: /Edit/ }));
    await screen.findByRole('listbox');
    await user.type(screen.getByPlaceholderText('Search…'), 'acc');
    expect(screen.getByRole('option', { name: 'Acct — already mapped' })).toBeInTheDocument();
    expect(screen.queryByText('No matches')).toBeNull();
  });

  it('a search matching nothing at all still says so', async () => {
    const user = userEvent.setup();
    render(
      <EditableCell
        type="select"
        value=""
        options={[{ value: 'x', label: 'Xray' }]}
        onCommit={vi.fn()}
        searchable
      />,
    );
    await user.click(screen.getByRole('button', { name: /Edit/ }));
    await screen.findByRole('listbox');
    await user.type(screen.getByPlaceholderText('Search…'), 'zzzz');
    expect(screen.getByText('No matches')).toBeInTheDocument();
  });

  it('a selected option the consumer disabled stays put — Clear is the way out', async () => {
    // Documented semantics rather than a bug: Listbox's disabled row is inert
    // to the pointer, so an individually-disabled pick cannot be toggled off.
    const onCommit = vi.fn().mockResolvedValue(undefined);
    render(
      <EditableCell
        type="multiselect"
        value={['p']}
        options={[{ value: 'p', label: 'P — now incompatible', disabled: true }, { value: 'q', label: 'Q' }]}
        onCommit={onCommit}
        searchable={false}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: /Edit/ }));
    await screen.findByRole('listbox');
    const row = screen.getByRole('option', { name: 'P — now incompatible' });
    await userEvent.click(row);
    expect(row).toHaveAttribute('aria-selected', 'true');
  });
});

describe('EditableCell — the stand-in does not duplicate', () => {
  it('adds nothing when the committed value is already an option', async () => {
    // The synthesis has to be a gap-filler, not a second copy of every value.
    render(
      <EditableCell
        type="select"
        value="a"
        options={[{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]}
        onCommit={vi.fn()}
        searchable={false}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: /Edit/ }));
    await screen.findByRole('listbox');
    expect(screen.getAllByRole('option')).toHaveLength(2);
  });

  it('adds nothing for an empty committed value', async () => {
    render(
      <EditableCell type="select" value="" options={[{ value: 'a', label: 'A' }]} onCommit={vi.fn()} searchable={false} />,
    );
    await userEvent.click(screen.getByRole('button', { name: /Edit/ }));
    await screen.findByRole('listbox');
    expect(screen.getAllByRole('option')).toHaveLength(1);
  });
});

// jsdom has no layout, so whether the clamped display overflows is whatever the
// test says: the Show more toggle is driven by `scrollHeight > clientHeight + 1`.
const layoutProto = HTMLElement.prototype;
const layoutOriginal = {
  scrollHeight: Object.getOwnPropertyDescriptor(layoutProto, 'scrollHeight'),
  clientHeight: Object.getOwnPropertyDescriptor(layoutProto, 'clientHeight'),
};
function stubOverflow(scroll: number, client: number) {
  Object.defineProperty(layoutProto, 'scrollHeight', { configurable: true, get: () => scroll });
  Object.defineProperty(layoutProto, 'clientHeight', { configurable: true, get: () => client });
}

describe('EditableCell — textarea', () => {
  afterEach(() => {
    for (const prop of ['scrollHeight', 'clientHeight'] as const) {
      const original = layoutOriginal[prop];
      if (original) Object.defineProperty(layoutProto, prop, original);
      else delete (layoutProto as unknown as Record<string, unknown>)[prop];
    }
  });

  it('opens a textarea on click, with the caret at the end rather than the text selected', async () => {
    render(<EditableCell type="textarea" value="Ada" onCommit={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: 'Edit Ada' }));
    const box = (await screen.findByRole('textbox')) as HTMLTextAreaElement;
    expect(box.tagName).toBe('TEXTAREA');
    await waitFor(() => expect(document.activeElement).toBe(box));
    // A paragraph is not select-all'd: one stray keystroke would wipe it.
    expect(box.selectionStart).toBe(3);
    expect(box.selectionEnd).toBe(3);
  });

  it('inserts a newline on plain Enter and does NOT commit', async () => {
    const onCommit = vi.fn();
    render(<EditableCell type="textarea" value="Ada" onCommit={onCommit} />);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.keyboard('{Enter}Lovelace');
    expect(onCommit).not.toHaveBeenCalled();
    expect(screen.getByRole('textbox')).toHaveValue('Ada\nLovelace');
  });

  it.each([
    ['Control', '{Control>}{Enter}{/Control}'],
    ['Meta', '{Meta>}{Enter}{/Meta}'],
  ])('commits on %s+Enter, newlines intact', async (_name, chord) => {
    const onCommit = vi.fn().mockResolvedValue(undefined);
    render(<EditableCell type="textarea" value="Ada" onCommit={onCommit} />);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.keyboard(`{Enter}Lovelace${chord}`);
    await waitFor(() => expect(onCommit).toHaveBeenCalledWith('Ada\nLovelace'));
    await waitFor(() => expect(screen.queryByRole('textbox')).not.toBeInTheDocument());
  });

  it('cancels on Escape without committing and restores the value', async () => {
    const onCommit = vi.fn();
    render(<EditableCell type="textarea" value="Ada" onCommit={onCommit} />);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.keyboard('Nope{Escape}');
    expect(onCommit).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Edit Ada' })).toHaveTextContent('Ada');
  });

  it.each([
    ['isComposing', { isComposing: true }],
    ['keyCode 229', { keyCode: 229 }],
  ])('leaves Escape and Ctrl+Enter to the IME while composing (%s)', async (_name, composing) => {
    const onCommit = vi.fn();
    render(<EditableCell type="textarea" value="Ada" onCommit={onCommit} />);
    await userEvent.click(screen.getByRole('button'));
    const box = await screen.findByRole('textbox');
    fireEvent.keyDown(box, { key: 'Escape', ...composing });
    fireEvent.keyDown(box, { key: 'Enter', ctrlKey: true, ...composing });
    expect(onCommit).not.toHaveBeenCalled();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('keeps Escape to itself so it cannot also dismiss a surrounding pane', async () => {
    const outer = vi.fn();
    render(
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- test host standing in for a pane's Escape listener
      <div onKeyDown={outer}>
        <EditableCell type="textarea" value="Ada" onCommit={vi.fn()} />
      </div>,
    );
    await userEvent.click(screen.getByRole('button'));
    await userEvent.keyboard('{Escape}');
    expect(outer).not.toHaveBeenCalled();
  });

  it('commits on blur, like every other type', async () => {
    const onCommit = vi.fn().mockResolvedValue(undefined);
    render(
      <>
        <EditableCell type="textarea" value="Ada" onCommit={onCommit} />
        <button type="button">Elsewhere</button>
      </>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Edit Ada' }));
    await userEvent.keyboard('x');
    await userEvent.click(screen.getByRole('button', { name: 'Elsewhere' }));
    await waitFor(() => expect(onCommit).toHaveBeenCalledWith('Adax'));
  });

  it('runs the same async-failure flow as text: error banner, stays editing', async () => {
    const onCommit = vi.fn().mockRejectedValue(new Error('Network down'));
    render(<EditableCell type="textarea" value="Ada" onCommit={onCommit} />);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.keyboard('{Enter}x{Control>}{Enter}{/Control}');
    expect(await screen.findByText('Network down')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('runs validate before committing', async () => {
    const onCommit = vi.fn();
    render(
      <EditableCell type="textarea" value="Ada" onCommit={onCommit} validate={(v) => (String(v).length > 5 ? 'Too long' : null)} />,
    );
    await userEvent.click(screen.getByRole('button'));
    await userEvent.keyboard('{Enter}Lovelace{Control>}{Enter}{/Control}');
    expect(await screen.findByText('Too long')).toBeInTheDocument();
    expect(onCommit).not.toHaveBeenCalled();
  });

  it('shows the placeholder for an empty value and ignores clicks when disabled', async () => {
    const { rerender } = render(
      <EditableCell type="textarea" value="" placeholder="Add a description" onCommit={vi.fn()} />,
    );
    expect(screen.getByRole('button')).toHaveTextContent('Add a description');
    rerender(<EditableCell type="textarea" value="Ada" disabled onCommit={vi.fn()} />);
    expect(screen.getByRole('button')).toBeDisabled();
    await userEvent.click(screen.getByRole('button'));
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('takes its accessible name from aria-label when given', () => {
    render(<EditableCell type="textarea" value="Ada" aria-label="Edit description" onCommit={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Edit description' })).toBeInTheDocument();
  });

  describe('the Show more toggle', () => {
    it('is rendered only when the clamped display overflows', () => {
      stubOverflow(60, 60);
      const { unmount } = render(<EditableCell type="textarea" value="Short." onCommit={vi.fn()} />);
      expect(screen.queryByRole('button', { name: 'Show more' })).not.toBeInTheDocument();
      unmount();

      stubOverflow(200, 80);
      render(<EditableCell type="textarea" value="Long." onCommit={vi.fn()} />);
      expect(screen.getByRole('button', { name: 'Show more' })).toBeInTheDocument();
    });

    it('is a sibling of the edit button, never a descendant — a button cannot nest in a button', () => {
      stubOverflow(200, 80);
      render(<EditableCell type="textarea" value="Long." onCommit={vi.fn()} />);
      const edit = screen.getByRole('button', { name: 'Edit Long.' });
      const toggle = screen.getByRole('button', { name: 'Show more' });
      expect(edit.contains(toggle)).toBe(false);
      expect(edit.querySelector('button')).toBeNull();
      expect(edit.parentElement).toBe(toggle.parentElement);
    });

    it('expands without entering edit mode, and collapses again', async () => {
      stubOverflow(200, 80);
      render(<EditableCell type="textarea" value="Long." onCommit={vi.fn()} />);
      await userEvent.click(screen.getByRole('button', { name: 'Show more' }));
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
      const less = screen.getByRole('button', { name: 'Show less' });
      expect(less).toHaveAttribute('aria-expanded', 'true');
      await userEvent.click(less);
      expect(screen.getByRole('button', { name: 'Show more' })).toHaveAttribute('aria-expanded', 'false');
    });

    it('controls the text it clamps, which is inside the edit button', () => {
      stubOverflow(200, 80);
      render(<EditableCell type="textarea" value="Long." onCommit={vi.fn()} />);
      const toggle = screen.getByRole('button', { name: 'Show more' });
      const target = document.getElementById(toggle.getAttribute('aria-controls') ?? '');
      expect(target).not.toBeNull();
      expect(screen.getByRole('button', { name: 'Edit Long.' }).contains(target)).toBe(true);
    });

    it('clamps to `lines` as an inline number (default 4) while collapsed', () => {
      stubOverflow(200, 80);
      const { rerender } = render(<EditableCell type="textarea" value="Long." onCommit={vi.fn()} />);
      const text = () => screen.getByRole('button', { name: 'Edit Long.' }).firstElementChild as HTMLElement;
      expect(text().style.webkitLineClamp).toBe('4');
      rerender(<EditableCell type="textarea" value="Long." lines={2} onCommit={vi.fn()} />);
      expect(text().style.webkitLineClamp).toBe('2');
    });

    it('takes its labels from props', async () => {
      stubOverflow(200, 80);
      render(
        <EditableCell type="textarea" value="Long." moreLabel="Mehr anzeigen" lessLabel="Weniger anzeigen" onCommit={vi.fn()} />,
      );
      await userEvent.click(screen.getByRole('button', { name: 'Mehr anzeigen' }));
      expect(screen.getByRole('button', { name: 'Weniger anzeigen' })).toBeInTheDocument();
    });

    it('is gone while editing and back on return to display', async () => {
      stubOverflow(200, 80);
      render(<EditableCell type="textarea" value="Long." onCommit={vi.fn()} />);
      await userEvent.click(screen.getByRole('button', { name: 'Edit Long.' }));
      expect(screen.queryByRole('button', { name: 'Show more' })).not.toBeInTheDocument();
      await userEvent.keyboard('{Escape}');
      expect(screen.getByRole('button', { name: 'Show more' })).toBeInTheDocument();
    });
  });
});
