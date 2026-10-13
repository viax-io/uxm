import type { ReactNode } from 'react';

/**
 * Does this node actually render anything?
 *
 * `node != null` is not enough, and the gap is not theoretical: `cond && <X/>`
 * — how a conditional slot is written — evaluates to `false`, and
 * `false != null`. A slot gated on `!= null` alone therefore paints an EMPTY
 * wrapper that still carries its own margin, padding or divider. React itself
 * renders nothing for `null`, `undefined`, booleans and the empty string, so a
 * gate has to agree with React about what "nothing" means.
 *
 * `0` is deliberately NOT treated as nothing. `badge={0}` is an action count,
 * and a zero is exactly the value a numeric slot exists to show — excluding
 * everything falsy is the trap on the other side of this one.
 *
 * Shared rather than re-derived per component: the `!= null` version shipped in
 * `LifecycleNodeCard` (4.62.0) and had to be fixed in 4.62.1.
 */
export function rendersSomething(node: ReactNode): boolean {
  return node != null && typeof node !== 'boolean' && node !== '';
}
