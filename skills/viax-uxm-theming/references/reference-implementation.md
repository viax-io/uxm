# Reference implementation — React + Vite

The shape running in production. Adapt the file layout freely; the four-step contract in
`SKILL.md` is what must hold. `<app-slug>` below is your app's slug — pick one and use it
consistently for storage keys and BEM class prefixes.

Which files you build depends on the mode:

| File | Consume | Embed | Picker |
|---|---|---|---|
| 1. config store | ✅ | ✅ | ✅ |
| 2. config API — read half | ✅ | ✅ | ✅ |
| 2. config API — write half | — | ✅ | — |
| 3. applier | ✅ | ✅ | ✅ |
| 4. boot hook | ✅ | ✅ | replaced by 6c |
| 5. persistence adapter | — | ✅ | — |
| 6. theme catalog / store / picker | — | — | ✅ |

---

## 1. Config store — `src/lib/uxm-studio-config.js`

Single source of truth for the applied `{ overrides, brand }`, cached in `localStorage` with a
pub/sub so the applier and any brand-reading chrome can subscribe.

**The defaults are deliberately empty.** Do not seed brand colours here. The accent ramp, the
logo, the favicon and the typeface are all published from UXM Studio and arrive together at
runtime; a hardcoded copy is a second source that keeps painting after a studio "Reset all"
while the studio's own inputs fall back to library defaults. Until the first fetch resolves the
app simply paints `@viax/uxm`'s built-in tokens — which is the correct neutral state, not a
bug. Returning users skip even that: `localStorage` holds the last applied config.

```javascript
const STORAGE_KEY = '<app-slug>-uxm-studio-config'

// Empty on purpose — the published config owns brand and overrides. Asset paths
// belong in the consuming component's fallback (`brand?.logoUrl || '/logo.svg'`),
// not here, so there is exactly one place a brand value can come from.
export const DEFAULT_UXM_CONFIG = { overrides: {}, brand: {} }

const listeners = new Set()
function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* corrupt/unavailable storage → defaults */ }
  return DEFAULT_UXM_CONFIG
}
let current = read()

export const getUxmConfig = () => current          // ← local store, NOT the GraphQL query
export function setUxmConfig(next) {
  current = next
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch { /* quota */ }
  for (const l of listeners) l(current)
}
export function subscribeUxmConfig(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
```

## 2. Config API — `src/lib/api/config.js`

The write half (`SAVE_UXM_CONFIG`, `saveStudioConfig`) is **embed-only** — a consumer never
writes.

```javascript
import { execute } from '@/lib/graphql-client'

const GET_UXM_CONFIG = /* GraphQL */ `
  query getUxmConfig { getUxmConfig { config } }
`
// EMBED-ONLY — persists the WHOLE config back as a JSON string.
const SAVE_UXM_CONFIG = /* GraphQL */ `
  mutation saveUxmConfig($config: String) { saveUxmConfig(config: $config) }
`
export const STUDIO_CONFIG_KEY = 'uxmStudio'

/** Accept an object OR a JSON string; {} on missing/invalid input. */
export function hydrateConfig(config) {
  if (!config) return {}
  if (typeof config === 'object') return config
  try {
    const parsed = JSON.parse(config)
    if (parsed && typeof parsed === 'object') return parsed
  } catch (err) {
    console.warn('[hydrateConfig] Failed to parse config JSON:', err)
  }
  return {}
}

// Shared promise: boot hydrate, studio load() and the save's RMW issue ONE request.
let configCache = null
export function invalidateUxmConfig() { configCache = null }

export async function fetchUxmConfig() {
  if (configCache) return configCache
  configCache = execute(GET_UXM_CONFIG)
    .then((d) => hydrateConfig(d?.getUxmConfig?.config))
    .catch((err) => { configCache = null; throw err })   // don't cache failures
  return configCache
}

/** The saved { overrides, brand }; null when nothing published yet. */
export async function fetchStudioConfig() {
  const config = await fetchUxmConfig()
  return config?.[STUDIO_CONFIG_KEY] ?? null
}

/** EMBED-ONLY. Read-modify-write so sibling keys survive. Last-write-wins. */
export async function saveStudioConfig(studioConfig) {
  const config = await fetchUxmConfig()
  const next = { ...config, [STUDIO_CONFIG_KEY]: studioConfig }
  await execute(SAVE_UXM_CONFIG, { config: JSON.stringify(next) })
  configCache = Promise.resolve(next)
}
```

## 3. Applier — `src/components/uxm-config-applier.jsx`

**This is the step that actually applies the design tokens.** One `<style>` element, replaced
in place, regenerated on every store change. Mount once at the app root, above the router.

```jsx
import { useEffect } from 'react'
import { generateOverridesCss } from '@viax/uxm/studio/generate-css'
import { getUxmConfig, subscribeUxmConfig } from '@/lib/uxm-studio-config'

const STYLE_ID = 'uxm-overrides'

function apply(config) {
  let el = document.getElementById(STYLE_ID)
  if (!el) {
    el = document.createElement('style')
    el.id = STYLE_ID
    document.head.appendChild(el)
  }
  // Emits the --color-* ramp, per-component/per-state --uxm-* overrides, and the
  // brand font (@import + --brand-font). Same generator the backend uses.
  el.textContent = generateOverridesCss(config.overrides ?? {}, config.brand ?? {})

  const faviconUrl = config.brand?.faviconUrl
  if (faviconUrl) {
    let link = document.querySelector("link[rel='icon']")
    if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link) }
    link.href = faviconUrl
  }
}

export default function UxmConfigApplier() {
  useEffect(() => {
    apply(getUxmConfig())
    return subscribeUxmConfig(apply)
  }, [])
  return null
}
```

`generate-css` is plain JS — a consumer-only app does **not** need `@viax/uxm/studio.css`.

## 4. Boot hook — `src/hooks/use-hydrate-studio-config.js`

The store seeds from `localStorage` synchronously (instant theme for returning users); this
does the one-shot **server → store** reconcile so a fresh device still gets the published
theme. Failures are swallowed — the cached/default theme stays.

```javascript
import { useEffect } from 'react'
import { fetchStudioConfig } from '@/lib/api/config'
import { setUxmConfig } from '@/lib/uxm-studio-config'

export function useHydrateStudioConfig() {
  useEffect(() => {
    let cancelled = false
    fetchStudioConfig()
      .then((remote) => { if (!cancelled && remote) setUxmConfig(remote) })
      .catch(() => { /* keep cached/default */ })
    return () => { cancelled = true }
  }, [])
}
```

**Root wiring:**

```jsx
export default function App() {
  useHydrateStudioConfig()          // server → store, once on mount
  return (
    <>
      <UxmConfigApplier />          {/* above the router — themes every route */}
      <Router>…</Router>
    </>
  )
}
```

---

## 5. Persistence adapter — embed only

`src/lib/uxm-persistence.js`. Backs `UxmApp`. **`load()` returns the LIVE store, not the
server** — the single server→store seed already happened on boot; re-reading here would
clobber whatever is currently applied.

```javascript
import { fetchStudioConfig, invalidateUxmConfig, saveStudioConfig } from '@/lib/api/config'
import { getUxmConfig, setUxmConfig } from '@/lib/uxm-studio-config'

function uploadAsset(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve({ url: String(reader.result) })
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read file'))
    reader.readAsDataURL(file)      // no asset backend — embed as a data: URL
  })
}

export function createConfigRepoPersistence() {
  return {
    load: async () => getUxmConfig(),
    save: async (state) => {        // fired by both Quick Save and Publish
      invalidateUxmConfig()          // fresh base for the read-modify-write
      await saveStudioConfig(state)
      setUxmConfig(state)            // mirror into the live store
    },
    uploadAsset,
    capabilities: { persist: true, upload: true },
  }
}
```

Studio page:

```jsx
import { UxmApp } from '@viax/uxm/studio'
import { createConfigRepoPersistence } from '@/lib/uxm-persistence'

const persistence = createConfigRepoPersistence()

export default function UxmStudioPage() {
  return (
    <div className="<app-slug>-uxm-studio">
      <UxmApp embed persistence={persistence} />
    </div>
  )
}
```

Import `@viax/uxm/studio.css` **once** in your entry file, before your global stylesheet, so
load order is deterministic — not in the page. In `embed` mode the studio drops full-page
chrome and defers `data-theme` to the host. If your shell adds content padding, zero it on the
studio route: the workbench is a full-bleed surface.

---

## 6. Theme picker — picker only

Read-only selection among published themes. Never writes.

**6a. Catalog** — `src/lib/theme-catalog.js`. Normalises v1 or v2 into one shape.

```javascript
import { DEFAULT_UXM_CONFIG } from '@/lib/uxm-studio-config'

export const DEFAULT_THEME_ID = 'default'

export function normalizeStudioConfig(raw) {
  const base = raw && typeof raw === 'object' ? raw : DEFAULT_UXM_CONFIG
  return {
    ...base,
    overrides: base.overrides ?? {},
    brand: base.brand ?? DEFAULT_UXM_CONFIG.brand,
    themesVersion: 2,
    defaultTheme: {
      name: String(base.defaultTheme?.name ?? '') || 'Default',
      description: String(base.defaultTheme?.description ?? ''),
    },
    // drop malformed entries rather than trusting env data
    themes: Array.isArray(base.themes)
      ? base.themes.filter((t) => t && typeof t.id === 'string' && typeof t.name === 'string')
      : [],
  }
}

export function resolveThemeConfig(structure, id) {
  if (!structure) return null
  if (id === DEFAULT_THEME_ID) return { overrides: structure.overrides, brand: structure.brand }
  const t = structure.themes.find((x) => x.id === id)
  return t ? { overrides: t.config?.overrides ?? {}, brand: t.config?.brand ?? {} } : null
}

export function themeRows(structure) {
  if (!structure) return []
  return [
    { id: DEFAULT_THEME_ID, ...structure.defaultTheme },
    ...structure.themes.map((t) => ({ id: t.id, name: t.name, description: t.description ?? '' })),
  ]
}
```

**6b. Store** — the only persisted value is *which* theme is applied. Selecting a theme **is**
setting this browser's default; do not invent a separate "set as default" action.

```javascript
import { create } from 'zustand'
import { fetchStudioConfig } from '@/lib/api/config'
import { setUxmConfig } from '@/lib/uxm-studio-config'
import { DEFAULT_THEME_ID, normalizeStudioConfig, resolveThemeConfig } from '@/lib/theme-catalog'

const STORAGE_KEY = '<app-slug>-selected-theme'
const readId = () => { try { return localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME_ID } catch { return DEFAULT_THEME_ID } }

const useThemeStore = create((set, get) => ({
  structure: null, loading: false, error: null, selectedThemeId: readId(),

  async loadThemes() {
    if (get().loading || get().structure) return
    set({ loading: true, error: null })
    let structure
    try { structure = normalizeStudioConfig(await fetchStudioConfig()) }
    catch (err) { structure = normalizeStudioConfig(null); set({ error: err }) }
    // re-validate the remembered id against the FRESH config — a theme deleted
    // server-side must fall back, not crash or apply nothing
    const stored = get().selectedThemeId
    const resolved = resolveThemeConfig(structure, stored) ? stored : DEFAULT_THEME_ID
    set({ structure, loading: false, selectedThemeId: resolved })
    const config = resolveThemeConfig(structure, resolved)
    if (config) setUxmConfig(config)
  },

  selectTheme(id) {
    const config = resolveThemeConfig(get().structure, id)
    if (!config) return
    try { localStorage.setItem(STORAGE_KEY, id) } catch { /* quota */ }
    set({ selectedThemeId: id })
    setUxmConfig(config)
  },
}))

export default useThemeStore
```

**6c. Boot hook becomes a delegate** — one hydration path, not two competing ones:

```javascript
import { useEffect } from 'react'
import useThemeStore from '@/stores/theme-store'

export function useHydrateStudioConfig() {
  useEffect(() => { useThemeStore.getState().loadThemes() }, [])
}
```

**6d. UI.** A `Tag` pill opening a `Listbox` of `themeRows(structure)` — not a `Dialog`; the
list is small. `searchable={false}` and `showCheckmark={false}`; mark the active row with a
`Tag type="success"` "Active" pill and make the whole row the click target. No "Use" badge on
inactive rows (redundant — the row is already clickable), no "Default" badge, no
confirm-before-switch (there is no editor state a switch could discard).

Render it as a **sibling to** the light/dark toggle, after it — light/dark and brand theme are
orthogonal axes, and every theme ships both token sets.
