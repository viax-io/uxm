import { render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';

import { Banner, ButtonPrimary, Checkbox, Dialog, FormField, Modal, TextInput, ToggleSwitch } from '@/ui';

async function expectNoViolations(root: Element) {
  const results = await axe.run(root, {
    // Colour contrast needs real styles — this suite runs without CSS.
    rules: { 'color-contrast': { enabled: false } },
  });
  const violations = results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(' ')).join(', ')})`);
  expect(violations).toEqual([]);
}

describe('axe smoke', () => {
  it('a form built from the atoms has no violations', async () => {
    const { container } = render(
      <form>
        <FormField label="Name" hint="As on your passport">
          <TextInput defaultValue="Ada" />
        </FormField>
        <FormField label="Email">
          <TextInput type="email" error="Enter a valid address" />
        </FormField>
        <Checkbox>Subscribe</Checkbox>
        <ToggleSwitch>Dark mode</ToggleSwitch>
        <Banner variant="info">Nothing is sent yet.</Banner>
        <ButtonPrimary>Save</ButtonPrimary>
      </form>,
    );
    await expectNoViolations(container);
  });

  it('an open dialog with a modal has no violations', async () => {
    render(
      <Dialog open onOpenChange={() => {}} aria-labelledby="t">
        <Modal onClose={() => {}}>
          <Modal.Header id="t">Confirm</Modal.Header>
          <Modal.Body>Delete this step?</Modal.Body>
          <Modal.Footer>
            <ButtonPrimary>Delete</ButtonPrimary>
          </Modal.Footer>
        </Modal>
      </Dialog>,
    );
    const dialog = await screen.findByRole('dialog');
    await expectNoViolations(dialog);
  });
});
