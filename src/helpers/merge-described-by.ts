/**
 * Merge a consumer-supplied `aria-describedby` with a managed id (typically
 * the atom's own FieldError id) instead of letting one wipe the other.
 *
 * Every input-family atom spreads `...rest` and then sets its managed
 * `aria-describedby` after, so a bare `aria-describedby={error ? errorId :
 * undefined}` silently wipes a describedby the consumer passed — which is how
 * `FormField`'s hint ends up unread. Order puts the consumer's ids first,
 * the managed id last, matching reading order (what it is → why it's wrong).
 */
export function mergeDescribedBy(
  consumer: string | undefined,
  managedId: string | undefined,
): string | undefined {
  return [consumer, managedId].filter(Boolean).join(' ') || undefined;
}
