import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SearchDropdown } from '@/ui';
import type { SearchDropdownOption } from '@/ui';

/**
 * The selected option's `icon` leads the trigger, as it leads the option's row
 * in the list. It is decorative there as in the row (`aria-hidden`), so an icon
 * that renders text, such as an Avatar's initials, stays out of what a screen
 * reader announces; and an option without an icon leaves the trigger as it was.
 */
const options: SearchDropdownOption[] = [
  { value: 'sales', label: 'Sales agent', icon: <span data-testid="mark">SA</span> },
  { value: 'other', label: 'Other role' },
];

const triggerIcon = (container: HTMLElement) =>
  container.querySelector('.uxm-search-dropdown__trigger-icon');

describe('SearchDropdown trigger icon', () => {
  it('leads the trigger with the selected option\'s icon, hidden from assistive tech', () => {
    const { container } = render(
      <SearchDropdown value="sales" onChange={() => {}} options={options} aria-label="Role" />,
    );
    const icon = triggerIcon(container);
    expect(icon).not.toBeNull();
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon).toContainElement(screen.getByTestId('mark'));
    // First in the trigger, before the label.
    const trigger = container.querySelector('.uxm-search-dropdown__trigger')!;
    expect(trigger.firstElementChild).toBe(icon);
    expect(trigger).toHaveTextContent('Sales agent');
  });

  it('renders no icon slot when the selected option has no icon', () => {
    const { container } = render(
      <SearchDropdown value="other" onChange={() => {}} options={options} aria-label="Role" />,
    );
    expect(triggerIcon(container)).toBeNull();
  });

  it('renders no icon slot for the placeholder, before anything is picked', () => {
    const { container } = render(
      <SearchDropdown value="" onChange={() => {}} options={options} aria-label="Role" placeholder="Pick a role" />,
    );
    expect(triggerIcon(container)).toBeNull();
  });
});
