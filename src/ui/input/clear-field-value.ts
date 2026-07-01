/**
 * Imperatively clear a controlled-or-uncontrolled `<input>` / `<textarea>`.
 *
 * Sets the element's value to "" via the prototype's native setter, then
 * dispatches a real `input` event. React's delegated listener picks the event
 * up and fires the element's own `onChange` with the empty value — so a
 * controlled consumer's `onChange={(e) => setX(e.target.value)}` resets its
 * state automatically, with NO separate `onClear` wiring. For an uncontrolled
 * field the DOM value is simply reset. Focus returns to the field so the user
 * can keep typing after clearing.
 *
 * This is why the free-text atoms (TextInput / Textarea / InputWithIcon) can
 * default `clearable` to true: the ✕ works for any usage that already passes
 * `value` + `onChange`, which is every controlled field — no per-usage opt-in.
 */
export function clearFieldValue(el: HTMLInputElement | HTMLTextAreaElement | null): void {
  if (!el) return;
  const proto =
    el instanceof HTMLTextAreaElement
      ? window.HTMLTextAreaElement.prototype
      : window.HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
  setter?.call(el, '');
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.focus();
}
