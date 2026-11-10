import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SearchDropdown } from '@/ui';
import type { SearchDropdownOption } from '@/ui';

/**
 * An option's `description` is a second line under its label — the code or id
 * behind a readable name. The search matches it as well as the label, and the
 * selected option shows it in the trigger too.
 */
const options: SearchDropdownOption[] = [
  { value: 'autoship', label: 'Autoship quote', description: 'AutoshipQuote' },
  { value: 'renewal', label: 'Renewal', description: 'RenewalOrder' },
];

function open() {
  fireEvent.click(screen.getByRole('combobox'));
  return screen.getByPlaceholderText('Search…');
}

const optionLabels = () => screen.getAllByRole('option').map((o) => o.querySelector('.uxm-search-dropdown__option-label')?.textContent);

describe('SearchDropdown option description', () => {
  it('is matched by the search', () => {
    render(<SearchDropdown value="" onChange={() => {}} options={options} aria-label="Flow" />);
    fireEvent.change(open(), { target: { value: 'renewalord' } });
    expect(optionLabels()).toEqual(['Renewal']);
  });

  it('does not let a query that matches neither label nor description through', () => {
    render(<SearchDropdown value="" onChange={() => {}} options={options} aria-label="Flow" />);
    fireEvent.change(open(), { target: { value: 'invoice' } });
    expect(screen.queryAllByRole('option')).toHaveLength(0);
  });

  it('shows under the label in the trigger for the selected option', () => {
    const { container } = render(
      <SearchDropdown value="autoship" onChange={() => {}} options={options} aria-label="Flow" />,
    );
    const text = container.querySelector('.uxm-search-dropdown__trigger-text');
    expect(text).not.toBeNull();
    expect(text).toHaveTextContent('Autoship quote');
    expect(text!.querySelector('.uxm-search-dropdown__description')).toHaveTextContent('AutoshipQuote');
  });
});
