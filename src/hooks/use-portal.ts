import { useEffect, useState } from 'react';

/**
 * SSR-safe "are we mounted on the client yet" gate for portal-rendering
 * components. The portal target (`document.body`) doesn't exist on the
 * first server render — gating on this flag lets the component return
 * `null` during SSR and re-render once on the client to mount the portal.
 *
 * Use:
 *
 *   const mounted = usePortal();
 *   if (!open || !mounted) return null;
 *   return createPortal(<Panel />, document.body);
 */
export function usePortal(): boolean {
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- the entire purpose of this hook is to flip from false (SSR) to true (after first client commit). The state change IS the signal; there is no derived value to compute via useMemo and no external store to subscribe to.
  useEffect(() => setMounted(true), []);
  return mounted;
}
