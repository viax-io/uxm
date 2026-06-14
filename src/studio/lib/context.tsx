import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';

import { createReadOnlyPersistence } from '../persistence/read-only';

import { getComponentDef, registry } from './registry';

import type { BrandConfig, StyleOverrides } from './types';
import type { StudioPersistence } from '../persistence/types';


export type Theme = 'light' | 'dark';

/** A captured runtime event, shown in the Events tab's live log. */
export interface LoggedEvent {
  /** Unique id — used as React key. Wall-clock ms is fine for ordering
   *  and dedupe; a counter suffix handles the rare same-tick burst. */
  id: string;
  /** When the event fired (wall-clock ms). */
  ts: number;
  /** Canonical handler name, e.g. "onClick". */
  name: string;
  /** Short payload preview (already JSON-stringified, truncated). */
  payload: string;
  /** Tag name of the DOM target that fired the event, for context. */
  target: string;
}

/** Cap on the log size — prevents runaway memory if a Slider's onChange
 *  fires hundreds of times during a drag. The oldest entries fall off. */
const EVENT_LOG_LIMIT = 200;

interface UxmContextValue {
  selectedId: string;
  selectComponent: (id: string) => void;
  getOverrides: (id: string) => StyleOverrides;
  getAllOverrides: () => Record<string, StyleOverrides>;
  setOverride: (componentId: string, key: string, value: string | number | boolean) => void;
  resetOverride: (componentId: string, key: string) => void;
  resetOverrides: (componentId: string) => void;
  /** Variant selections are ephemeral UI state for the currently-selected
   * component — they decide which knobs are visible in the panel, but never
   * persist to overrides or get saved to components.css/json. Resets to
   * empty on every `selectComponent`. */
  getCurrentVariants: () => Record<string, string | number | boolean>;
  setVariant: (key: string, value: string | number | boolean) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  brand: BrandConfig;
  setBrand: (partial: Partial<BrandConfig>) => void;
  /** Event log for the currently-selected component. Resets on selection change. */
  eventLog: LoggedEvent[];
  /** Push a captured event into the log. Called by the canvas wrapper. */
  pushEvent: (e: Omit<LoggedEvent, 'id' | 'ts'>) => void;
  /** Clear the log for the current component. */
  clearEvents: () => void;
  /** Injected persistence backend (HTTP for app, read-only for static portal). */
  persistence: StudioPersistence;
  /** Convenience mirror of `persistence.capabilities` for UI gating. */
  capabilities: StudioPersistence['capabilities'];
}

const UxmContext = createContext<UxmContextValue | null>(null);

const THEME_STORAGE_KEY = 'uxm:theme';

/**
 * Strip layoutVariant keys from a loaded overrides bag. Legacy saves
 * (from before variants were ephemeral) wrote variant values into the
 * same `overrides` dict as style edits — historical artifacts now,
 * ignored by everything but the panel's "has overrides" checks. Filter
 * at load time so the invariant holds: `overrides[componentId]` only
 * ever contains styleProperty edits.
 */
function stripVariantKeysFromOverrides(
  raw: Record<string, StyleOverrides>,
): Record<string, StyleOverrides> {
  const cleaned: Record<string, StyleOverrides> = {};
  for (const [compId, compOverrides] of Object.entries(raw)) {
    const def = getComponentDef(compId);
    if (!def) {
      cleaned[compId] = compOverrides;
      continue;
    }
    const variantKeys = new Set(def.layoutVariants.map((v) => v.key));
    const filtered: StyleOverrides = {};
    for (const [k, v] of Object.entries(compOverrides)) {
      if (!variantKeys.has(k)) filtered[k] = v;
    }
    if (Object.keys(filtered).length > 0) cleaned[compId] = filtered;
  }
  return cleaned;
}

export function UxmProvider({
  children,
  persistence = createReadOnlyPersistence(),
}: {
  children: ReactNode;
  persistence?: StudioPersistence;
}) {
  const [selectedId, setSelectedId] = useState(registry[0].id);
  const [allOverrides, setAllOverrides] = useState<Record<string, StyleOverrides>>({});
  const [currentVariants, setCurrentVariants] = useState<Record<string, string | number | boolean>>({});
  const [theme, setThemeState] = useState<Theme>('light');
  const [brand, setBrandState] = useState<BrandConfig>({});
  // The log lives on a single state array, not keyed by component id —
  // it represents the *current* selected component's recent activity.
  // Switching components clears it (via the effect below). A counter ref
  // breaks id collisions when many events fire in the same millisecond
  // (Slider drag, keyboard repeat).
  const [eventLog, setEventLog] = useState<LoggedEvent[]>([]);
  const eventCounter = useRef(0);

  // Reset log on selection change — the panel always shows fresh activity
  // for the component currently being inspected.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional reset of the event log when the inspected component changes
    setEventLog([]);
    eventCounter.current = 0;
  }, [selectedId]);

  const pushEvent = useCallback((e: Omit<LoggedEvent, 'id' | 'ts'>) => {
    const ts = Date.now();
    eventCounter.current += 1;
    const entry: LoggedEvent = {
      id: `${ts}-${eventCounter.current}`,
      ts,
      ...e,
    };
    setEventLog((prev) => {
      // Prepend so newest sits on top; cap at LIMIT.
      const next = [entry, ...prev];
      return next.length > EVENT_LOG_LIMIT ? next.slice(0, EVENT_LOG_LIMIT) : next;
    });
  }, []);

  const clearEvents = useCallback(() => {
    setEventLog([]);
    eventCounter.current = 0;
  }, []);

  // Load saved overrides + theme on mount, via the injected persistence
  // backend (HTTP in the app, read-only/seed in the static portal).
  useEffect(() => {
    persistence
      .load()
      .then((data) => {
        if (!data) return;
        if (data.overrides && Object.keys(data.overrides).length > 0) {
          setAllOverrides(stripVariantKeysFromOverrides(data.overrides));
        }
        if (data.brand && typeof data.brand === 'object') {
          setBrandState(data.brand);
        }
      })
      .catch(() => {
        /* ignore load failures — fall back to defaults */
      });

    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot read of persisted theme on mount
      if (stored === 'light' || stored === 'dark') setThemeState(stored);
    } catch {
      /* ignore unavailable localStorage */
    }
  }, [persistence]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    try { localStorage.setItem(THEME_STORAGE_KEY, t); } catch { /* ignore */ }
  }, []);

  const setBrand = useCallback((partial: Partial<BrandConfig>) => {
    setBrandState((prev) => ({ ...prev, ...partial }));
  }, []);

  const getOverrides = useCallback(
    (id: string) => allOverrides[id] ?? {},
    [allOverrides],
  );

  const setOverride = useCallback(
    (componentId: string, key: string, value: string | number | boolean) => {
      setAllOverrides((prev) => ({
        ...prev,
        [componentId]: { ...prev[componentId], [key]: value },
      }));
    },
    [],
  );

  const getAllOverrides = useCallback(
    () => allOverrides,
    [allOverrides],
  );

  const resetOverride = useCallback((componentId: string, key: string) => {
    setAllOverrides((prev) => {
      const compOverrides = prev[componentId];
      if (!compOverrides || !(key in compOverrides)) return prev;
      const nextComp = { ...compOverrides };
      delete nextComp[key];
      const next = { ...prev };
      if (Object.keys(nextComp).length === 0) {
        delete next[componentId];
      } else {
        next[componentId] = nextComp;
      }
      return next;
    });
  }, []);

  const resetOverrides = useCallback((componentId: string) => {
    setAllOverrides((prev) => {
      const next = { ...prev };
      delete next[componentId];
      return next;
    });
  }, []);

  /**
   * Select a component and reset its variant selections to defaults.
   *
   * Variants are ephemeral UI state ("which knobs am I currently editing")
   * — they reset on every component switch so designers always land on
   * the canonical default view of an atom. Style edits stay in overrides
   * and persist; variant selections are session-only and per-component.
   */
  const selectComponent = useCallback((id: string) => {
    setSelectedId(id);
    setCurrentVariants({});
  }, []);

  const getCurrentVariants = useCallback(
    () => currentVariants,
    [currentVariants],
  );

  const setVariant = useCallback(
    (key: string, value: string | number | boolean) => {
      setCurrentVariants((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  return (
    <UxmContext.Provider
      value={{
        selectedId,
        selectComponent,
        getOverrides,
        getAllOverrides,
        setOverride,
        resetOverride,
        resetOverrides,
        getCurrentVariants,
        setVariant,
        theme,
        setTheme,
        brand,
        setBrand,
        eventLog,
        pushEvent,
        clearEvents,
        persistence,
        capabilities: persistence.capabilities,
      }}
    >
      {children}
    </UxmContext.Provider>
  );
}

export function useUxm() {
  const ctx = useContext(UxmContext);
  if (!ctx) throw new Error('useUxm must be used within UxmProvider');
  return ctx;
}
