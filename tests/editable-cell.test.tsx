import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

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
