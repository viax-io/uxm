# viax Customer Portal — Claude Code Build Prompt

---

## ⚙️ Client Configuration Variables

> **Configured for `viax.lab` environment.** Values below are already applied throughout this document.

| Variable | Description | Value |
|---|---|---|
| `CLIENT_NAME` | Display name for the portal (title case) | `viax Lab` |
| `CLIENT_NAME_LOWER` | Lowercase version for copy/brand voice | `viax lab` |
| `CLIENT_SLUG` | URL/folder-safe slug | `viax-lab` |
| `REALM` | Keycloak realm name | `viax` |
| `ENV` | viax environment | `lab` |
| `CLIENT_ID` | OAuth client ID | `viax-ui` |
| `AUTH_URL` | Keycloak base URL | `https://auth.viax.lab.viax.tech` |
| `API_URL` | viax GraphQL endpoint | `https://api.viax.lab.viax.tech/graphql` |
| `GITHUB_REPO` | Target GitHub repository | _(not set — scaffold locally)_ |
| `PORTAL_SUBDIR` | Subdirectory within the repo | `/viax-lab-portal/` |
| `EMBED_UXM_STUDIO` | Embed the UXM Studio editor at `/uxm`? (`yes`/`no`) — `no` = consume the env's published config only | `no` |
| `PORTAL_ID` | Unique portal identifier, `vx-{CLIENT_SLUG}-{8 hex}` — suffix generated at build time via `openssl rand -hex 4`, never hand-invented | _(generated fresh per build)_ |
| `GENERATED_AT` | Generation date, `YYYY-MM-DD` | _(today at build time)_ |

---

## Project Overview

Build a **customer-facing portal** for **viax Lab** (a demo environment of the viax revenue orchestration platform). This portal is a fully authenticated, multi-tenant B2B application where customers log in and interact with their business transactions, products, and account information — all backed by viax's GraphQL API.

The portal ships with four **fixed pages**: Dashboard, Products, Account, and Admin — plus a fifth, **UXM Studio** (`/uxm`), only when `{{EMBED_UXM_STUDIO}} = yes` (off by default). All additional transactional pages (orders, invoices, subscriptions, etc.) are **dynamically scaffolded** at generation time by introspecting the active Business Interaction Execution Model (BEM) of the `viax` realm via the MCP server — see [BEM Discovery & Dynamic Route Generation](#bem-discovery--dynamic-route-generation).

The design language features a **greyscale/neutral palette**, clean typography, generous whitespace, rounded cards, and subtle shadows. The portal supports **runtime theming** by always loading the published **UXM Studio** config (the UXM config's `uxmStudio` key) on boot via `getUxmConfig` and applying it portal-wide through a generated global stylesheet — styles are authored in the standalone, env-bound UXM Studio app. **Embedding that editor inside the portal at `/uxm` is optional and off by default** (`{{EMBED_UXM_STUDIO}}`); there is no custom theme panel to build either way — see [Runtime Theming](#runtime-theming--consume-the-uxm-studio-config-optionally-embed-the-editor-at-uxm).

**Repository:** `_(not set — scaffold locally)_`
**Subdirectory:** All portal code lives in `/viax-lab-portal/` — wipe existing contents and start fresh.

---

## General Notes

> These rules apply globally across the entire portal implementation.

1. **Authorization header on every GraphQL request** — Every request to the viax GraphQL API must include the Keycloak access token as a Bearer token in the `Authorization` header:
   ```
   Authorization: Bearer <session.accessToken>
   ```
   This is enforced by the Axios request interceptor in `lib/graphql-client.js`. No GraphQL call should bypass this interceptor.

2. **Dev server port** — The development server must be configured to start on **port 9000**. Set in `vite.config.js` under `server.port`:
   ```javascript
   // vite.config.js
   export default defineConfig({ server: { port: 9000 } })
   ```

3. **Products listing layout** — The `/products` listing page must display products as **horizontal line items** (not a grid). Each item is a full-width row containing: product image on the left, then name, ID, description, and category. Use a consistent image placeholder when no image URL is available.

4. **Portal identity stamp (MANDATORY)** — Every generated portal carries a unique identity so deployed portals can be told apart. Three pieces, all required:

   **a. `package.json` — the `"portal"` metadata block** (top-level custom field; npm ignores it, nothing breaks). This is the source of truth:

   ```json
   {
     "name": "{{CLIENT_SLUG}}-portal",
     "portal": {
       "id": "{{PORTAL_ID}}",
       "generator": "viax-build-portal",
       "client": "{{CLIENT_NAME}}",
       "realm": "{{REALM}}",
       "env": "{{ENV}}",
       "generatedAt": "{{GENERATED_AT}}"
     }
   }
   ```

   `id` = `vx-{{CLIENT_SLUG}}-{8 hex}` where the hex suffix comes from actually running `openssl rand -hex 4` — never invent it by hand; a made-up suffix defeats the uniqueness guarantee across regenerations of the same client.

   **b. `vite.config.js` — expose the block to the bundle.** `package.json` is not deployed with the built app, so the metadata must be compiled in via `define`:

   ```javascript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'
   import path from 'path'
   import { readFileSync } from 'fs'

   const pkg = JSON.parse(readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'))

   export default defineConfig({
     plugins: [react()],
     define: {
       __PORTAL_META__: JSON.stringify(pkg.portal ?? null),
     },
     server: { port: 9000 },
     // …aliases etc.
   })
   ```

   **c. `main.jsx` — stamp the running app.** On boot, before auth init, append a `<meta name="viax-portal-id">` tag to `<head>` and log the identity to the console, so any deployed portal is identifiable straight from the DOM/DevTools without source access (the full `stampPortalId()` code is in the App Entry Point block under Authentication).

   Extraction: from source/CI — `jq -r .portal.id package.json`; from a deployed portal — read the meta tag or the `[viax] portal …` console line. **Verification is part of the build:** after `npm run build`, `grep -o "{{PORTAL_ID}}" dist/assets/*.js` must match.

---

## Tech Stack

| Concern | Tool |
|---|---|
| Framework | Vite + React 19 (CSR SPA) |
| Routing | React Router v6 |
| UI Components | **`@viax.io/uxm`** — Viax UXM React primitive library (76 BEM-classed components). **Do NOT** use shadcn/ui, Tailwind, or any other UI library. |
| Styling | Plain CSS — design tokens from `@viax.io/uxm/tokens.css` (`--color-*`). Layout via `<Stack>`, `<Cluster>`, `<ResponsiveGrid>` primitives. No Tailwind. Inline `style` for one-off tweaks. |
| HTTP Client | Axios (configured as a singleton with interceptors) |
| Server State | TanStack Query v5 |
| URL State | React Router `useSearchParams` |
| Client State | Zustand |
| Auth | keycloak-js (OAuth 2.0 OIDC, browser-only) |
| Language | JavaScript (ES2024+, JSX) |

### `@viax.io/uxm` — required UI library

The portal **must** use `@viax.io/uxm` for every interactive UI primitive. See the dedicated [`viax-uxm` skill](viax-uxm/SKILL.md) for the authoritative component catalog, design-token reference, and quick-recipes (or browse the library source at [github.com/viax-io/uxm](https://github.com/viax-io/uxm)).

**Hard rules from that skill (apply here too):**

1. **Never handroll a div** with the same intent as an existing `@viax.io/uxm` primitive. The library covers ~76 patterns — pick the right one (Button*, Card, FormField, DataTable, List, StatCard, PageShell, AppSidebar, AppTopBar, PageHeader, DetailSection, PropertyField, EmptyState, Loader, Tag, Banner, Avatar, Thumbnail, ToggleSwitch, TimelineEntry, BackLink, …).
2. **Never inline literal hex** when a `--color-*` design token covers the intent. Use `var(--color-accent-bold)`, `var(--color-surface)`, etc.
3. **Import from `@viax.io/uxm/ui`**, not the root `@viax.io/uxm`. Tokens from `@viax.io/uxm/tokens`.
4. **FormField owns labels** — `<TextInput>`, `<Select>`, `<Textarea>`, etc. render bare; always wrap them in `<FormField label="…">`.
5. **Never import `@viax.io/uxm/previews`** into application code — those are for MODO host shells only.
6. **Never wrap `<DataTable>` or `<DetailSection>` in `<Card>`** — both already render their own border + radius, so the wrapper produces a visible double-border. See "UXM Layout & Styling Gotchas" under the Design System section for the full set of gotchas + the canonical `globals.css` baseline that must be in place from day one.

### Installing `@viax.io/uxm`

`@viax.io/uxm` is published on public npm — no registry configuration required.

Install via `npm i @viax.io/uxm@latest`. **Always install `@latest`** so the portal picks up the newest Studio/SCSS build; npm pins the resolved version (a caret range like `^4.15.0`) into `package.json` for you — the version shown in the dependency list below is only an illustrative floor, not a number to hardcode.

---

## Environment Variables

Create `.env.local` with exactly these variables (Vite exposes only `VITE_`-prefixed vars to the browser):

```properties
VITE_REALM=viax
VITE_ENV=lab
VITE_CLIENT_ID=viax-ui
VITE_AUTH_URL=https://auth.viax.lab.viax.tech
VITE_API_URL=https://api.viax.lab.viax.tech/graphql
VITE_USE_MOCK_AUTH=false
VITE_USE_MOCK_DATA=false
```

Access them in code via `import.meta.env.VITE_*`.

Also create `.env.example` as a copy for reference.

---

## Authentication

The portal uses **keycloak-js** for direct Keycloak OIDC integration. All auth logic runs in the browser — no server-side session handling. When `VITE_USE_MOCK_AUTH=true`, a mock auth path is used instead that bypasses Keycloak entirely.

### Keycloak Singleton

Create `src/lib/keycloak.js`:

```javascript
import Keycloak from 'keycloak-js'

const keycloak = new Keycloak({
  url: import.meta.env.VITE_AUTH_URL,
  realm: import.meta.env.VITE_REALM,
  clientId: import.meta.env.VITE_CLIENT_ID,
})

export default keycloak
```

### App Entry Point

Initialize Keycloak before mounting React. Create `src/main.jsx`:

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import '@viax.io/uxm/tokens.css'
import '@viax.io/uxm/ui.css'
// MODO UXM Studio styles (Tailwind v4). Import BEFORE globals.css so the studio's
// unlayered `:root` brand defaults sit UNDER the portal brand base — globals.css
// wins app-wide, while the studio's own runtime <style> still wins live on /uxm.
import '@viax.io/uxm/studio.css'
import '@/styles/globals.css'
import App from './App'
import keycloak from './lib/keycloak'
import useAuthStore from './stores/auth-store'

const isMockAuth = import.meta.env.VITE_USE_MOCK_AUTH === 'true'

// Portal identity stamp (General Note #4) — __PORTAL_META__ is compiled in
// from package.json's "portal" block by the `define` entry in vite.config.js.
function stampPortalId() {
  if (!__PORTAL_META__) return
  const meta = document.createElement('meta')
  meta.name = 'viax-portal-id'
  meta.content = __PORTAL_META__.id
  document.head.appendChild(meta)
  console.log(`[viax] portal ${__PORTAL_META__.id} (${__PORTAL_META__.realm}.${__PORTAL_META__.env}, generated ${__PORTAL_META__.generatedAt})`)
}

async function init() {
  stampPortalId()
  if (isMockAuth) {
    useAuthStore.getState().setMockSession()
  } else {
    await keycloak.init({ onLoad: 'login-required', checkLoginIframe: false })
    useAuthStore.getState().syncFromKeycloak(keycloak)
    // Proactive token refresh — update when < 60s remaining
    setInterval(() => keycloak.updateToken(60), 30_000)
  }

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}

init()
```

### Auth Store

The `auth-store` holds all session state derived from Keycloak. **Raw tokens are stored in memory only — never in localStorage or cookies.**

```javascript
// src/stores/auth-store.js
import { create } from 'zustand'

const useAuthStore = create((set) => ({
  accessToken: null,
  user: null,
  userRoles: new Set(),

  syncFromKeycloak(keycloak) {
    const parsed = keycloak.tokenParsed ?? {}
    set({
      accessToken: keycloak.token,
      user: {
        name: parsed.name ?? parsed.preferred_username ?? 'User',
        email: parsed.email ?? '',
      },
    })
    // Keep accessToken fresh after each silent refresh
    keycloak.onTokenRefreshed = () => set({ accessToken: keycloak.token })
  },

  setMockSession() {
    set({
      accessToken: 'mock-access-token-' + Date.now(),
      user: { name: 'Mock User', email: 'mock@viax-lab.io' },
      userRoles: new Set(['Admin', 'Partner']),
    })
  },

  setUserRoles(roles) {
    set({ userRoles: roles })
  },
}))

export default useAuthStore
```

### Auth Guard (Protected Route)

Create `src/routes/ProtectedRoute.jsx` to guard authenticated routes in the React Router tree:

```jsx
import { Navigate } from 'react-router-dom'
import useAuthStore from '@/stores/auth-store'

export default function ProtectedRoute({ children }) {
  const accessToken = useAuthStore((s) => s.accessToken)
  if (!accessToken) return <Navigate to="/login" replace />
  return children
}
```

Wrap all authenticated routes in `<ProtectedRoute>` in the router definition (`src/routes/index.jsx`).

### Auth Architecture

**Session flow:**
1. `main.jsx` calls `keycloak.init({ onLoad: 'login-required' })`
2. If no active session → Keycloak redirects to its login page automatically
3. After login → Keycloak redirects back to the app with tokens
4. `syncFromKeycloak` stores `accessToken` and parsed user info into Zustand
5. Proactive token refresh runs every 30s (silently refreshes when < 60s remaining)
6. Sign-out calls `keycloak.logout()` — Keycloak handles session termination

**User info shape** (available via `useAuthStore()`):
```javascript
{
  accessToken: string,           // Bearer token for API calls
  user: { name, email },         // parsed from Keycloak token
  userRoles: Set<string>,        // populated by use-user.js after fetching getCurrentUserInfo
}
```

### Mock Auth (when `VITE_USE_MOCK_AUTH=true`)

When mock auth is enabled, `main.jsx` calls `setMockSession()` instead of initializing Keycloak. The mock session populates the same Zustand store shape with fake data so all downstream code works identically.

### Token Usage in Axios

The Axios request interceptor reads `accessToken` directly from the auth store's in-memory state:

```javascript
// lib/graphql-client.js
import useAuthStore from '@/stores/auth-store'

axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      const { default: keycloak } = await import('@/lib/keycloak')
      keycloak.logout()
    }
    return Promise.reject(error)
  }
)
```

### Sign-Out

Call `keycloak.logout()` (imported from `src/lib/keycloak.js`) to end the session and redirect back to Keycloak. For mock auth, clear the store and navigate to `/login`.

---

## Design System

Use **`@viax.io/uxm`'s canonical `--color-*` design tokens** as the source of truth. They're declared on `:root` by `@viax.io/uxm/tokens.css` and themed centrally — every component re-tints automatically when a token changes.

See [`viax-uxm/references/design-tokens.md`](viax-uxm/references/design-tokens.md) for the full catalogue. Quick summary:

| Group | Token examples | Use for |
|---|---|---|
| **Surfaces** | `--color-surface`, `--color-surface-alt`, `--color-card` | Page bg, panel bg, card bg |
| **Text** | `--color-text-strong`, `--color-text`, `--color-text-muted`, `--color-text-subtle`, `--color-text-inverse` | Headings → muted → placeholder |
| **Border** | `--color-border` | All borders/dividers |
| **Accent (brand)** | `--color-accent-bold`, `--color-accent`, `--color-accent-light`, `--color-accent-subtle` | Primary button bg, link, hover backdrop, soft backdrop |
| **Semantic** | `--color-success-{bg,text,border}`, `--color-warning-*`, `--color-danger-*`, `--color-info-*` | `<Banner>`, `<Tag>`, the input atoms' own `error` prop |

> **Do NOT declare `--color-accent*` (or any other `--color-*`) in `globals.css`.** The accent
> ramp is published from UXM Studio and injected at runtime by the applier — see
> [`viax-uxm-theming`](../../viax-uxm-theming/SKILL.md). A copy in `globals.css` loads after
> `tokens.css` and wins, so it becomes a second source that keeps painting after a studio
> "Reset all" while the studio's own inputs fall back to library defaults — inputs and
> rendering then disagree, and nothing in the app explains why.

### Per-instance overrides

Use `--uxm-{component}-*` CSS vars via inline `style` for one-off tweaks. The component's CSS reads its own `--uxm-*` var with a `--color-*` fallback, so theming still flows.

```jsx
<Card style={{ '--uxm-card-padding': '24px' }}>…</Card>
```

### Legacy `--primary-*` / `--neutral-*` token table (deprecated — for reference only)

> The viax customer-facing palette below is the OLD viax design system, kept here as reference for visual style. **Do NOT declare these in app code.** They are superseded by `@viax.io/uxm`'s canonical `--color-*` tokens (table above). Map any old reference (e.g. `--primary-default`) to its `--color-*` equivalent (e.g. `--color-accent-bold` for the primary brand colour). Map the old `--font-family` (Roboto) to `var(--brand-font, var(--font-sans))` — never re-declare a hardcoded family (see the Typography note under Runtime Theming). This assumes the mandatory `:root { --font-sans: … }` bridge from the `globals.css` baseline is present; without it that chain resolves to nothing and the page renders in Times New Roman.

```css
--primary-default: #5F859C;
    --secondary-default: #212121;
    --tertiary-light: #6B7476;
    --tertiary-dark: #393F41;
    --light-default: #ffffff;
    --neutral-1: #f5f6f7;
    --neutral-2: #dfdfe2;
    --neutral-3: #bfbfc5;
    --neutral-4: #757680;
    --neutral-5: #585660;
    --dark-default: #39373e;
    --light-default-rgb: 255, 255, 255;
    --primary-default-rgb: 95, 133, 156;
    --dark-default-rgb: 57, 63, 65;
    --primary-light-1: #D4DFE6;
    --primary-light-2: #D4DFE6;
    --primary-light-3: #B5CCD9;
    --primary-dark-1: #3D5569;
    --primary-dark-2: #3D5569;
    --primary-dark-3: #1F2D39;
    --secondary-light-1: #F5F5F5;
    --secondary-light-2: #B8B8B8;
    --secondary-light-3: #858585;
    --secondary-dark-1: #F5F5F5;
    --secondary-dark-2: #B8B8B8;
    --secondary-dark-3: #858585;
    --feedback-neutral-light: #f2f8ff;
    --feedback-neutral: #4c8fd9;
    --feedback-success-light: #f2fff2;
    --feedback-success-default: #458246;
    --feedback-success-dark-1: #366637;
    --feedback-danger-light: #fff2f4;
    --feedback-danger-default: #c23e55;
    --feedback-danger-dark-1: #a63549;
    --feedback-warning-light: #fffdf2;
    --feedback-warning: #ffde59;
    --shadow-1: 0 1px 2px 0 rgba(0, 0, 0, 0.1), 0 0 1px 0 rgba(52, 47, 47, 0.1);
    --shadow-2: 0 2px 4px 0 rgba(52, 47, 47, 0.2), 0 0 1px 0 rgba(52, 47, 47, 0.1);
    --shadow-3: 0 4px 8px 0 rgba(52, 47, 47, 0.2), 0 0 2px 0 rgba(52, 47, 47, 0.1);
    --shadow-4: 0 8px 16px 0 rgba(52, 47, 47, 0.2), 0 2px 4px 0 rgba(52, 47, 47, 0.1);
    --shadow-5: 0 16px 24px 0 rgba(52, 47, 47, 0.2), 0 2px 8px 0 rgba(52, 47, 47, 0.1);
    --shadow-6: 0 20px 32px 0 rgba(0, 0, 0, 0.3), 0 2px 8px 0 rgba(52, 47, 47, 0.1);
    --shadow-input: 0 0 1px 4px var(--secondary-light-1);
    --shadow-around-default: 0px 0px 1px 0px rgba(52, 47, 47, 0.10), 0px 1px 2px 0px rgba(0, 0, 0, 0.10);
    --shadow-around-primary: 0px 0px 0px 4px var(--primary-light-2);
    --background-1: rgba(88, 86, 96, 0.5);
    --background-light-1: #fafafa;
    --background: url(data:image/svg+xml;utf8, <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><circle r="2" fill="black" fill-opacity="0.1" /></svg>) repeat var(--neutral-1);
    --padding-xs: 2px;
    --padding-s: 4px;
    --padding-m: 8px;
    --padding-ms: 12px;
    --padding-l: 16px;
    --padding-ls: 20px;
    --padding-xl: 24px;
    --padding-xls: 28px;
    --padding-xxl: 32px;
    --gutter: 16px;
    --padding--xs: -2px;
    --padding--s: -4px;
    --padding--m: -8px;
    --padding--ms: -12px;
    --padding--l: -16px;
    --padding--ls: -20px;
    --padding--xl: -24px;
    --padding--xls: -28px;
    --padding--xxl: -32px;
    --radius: 4px;
    --radius-xs: 2px;
    --radius-s: 4px;
    --radius-m: 8px;
    --radius-ms: 12px;
    --radius-l: 16px;
    --font-family: Roboto, sans-serif;
    --font-size-xs: 12px;
    --font-size-sm: 12px;
    --font-size-md: 13px;
    --font-size-lg: 13px;
    --font-size-xl: 16px;
    --font-size-xxl: 16px;
    --font-size-xxxl: 20px;
    --font-weight-regular: 400;
    --font-weight-medium: 500;
    --font-weight-bold: 700;
    --text-primary: var(--primary-default);
    --text-secondary: var(--secondary-default);
    --text-light: var(--light-default);
    --text-neutral: var(--neutral-4);
    --text-dark: var(--dark-default);
    --text-disable: var(--neutral-2);
    --font-size-huge: 24px;
    --font-weight-bolt: 700;
    --icon-size-xs: 12px;
    --icon-size-sm: 14px;
    --icon-size-md: 16px;
    --icon-size-lg: 18px;
    --icon-size-xl: 20px;
    --icon-size-xxl: 22px;
    --icon-size-xxxl: 24px;
    --icon-size-huge: 32px;
    --icon-color-primary: var(--primary-default);
    --icon-color-secondary: var(--secondary-default);
    --icon-color-light: var(--light-default);
    --icon-color-neutral: var(--neutral-4);
    --icon-color-dark: var(--dark-default);
    --icon-size: var(--icon-size-md);
    --icon-color: var(--icon-color-neutral);
    --icon-color-hover: var(--neutral-4);
    --icon-size-small: var(--icon-size-xs);
    --header-height: 72px;
    --main-column-width: 1200px;
```

### Reference Aesthetic

Inherits directly from `@viax.io/uxm`:
- **Surfaces** — `--color-surface` page bg, `--color-card` rows/cards with `<Card shadow>`.
- **Accent** used sparingly for primary CTAs (`<ButtonPrimary>`), active sidebar/nav items, indicators.
- **Typography** — Inter by default (Google-Fonts `<link>` in `index.html` + the `html, body, #root` font chain and the `button, input, select, textarea { font: inherit }` rule in `globals.css` — see the baseline below); the portal-wide typeface is **brand-controlled**: UXM Studio → Brand Settings → **Typography** sets `brand.fontFamily`, and the published config re-fonts the whole portal via `--brand-font` (the applier's generated CSS auto-imports the chosen Google Font). Sizing/weight handled by `@viax.io/uxm` per component.
- **Sidebar** — `<AppSidebar>` (sections + items, polymorphic `linkAs` so react-router does client nav).
- **Top bar** — `<AppTopBar search={…} actions={…}>` with `<InputWithIcon>` and `<Avatar>` + `<InlineAction>` sign-out.
- **Dashboard widgets** — `<StatCard>` for KPIs, recharts wrapped in `<Card>` for charts, `<DataTable>` for tabular activity feeds (Recent orders etc.), `<Checkbox>` for to-do lists, `<EmptyState>` / `<Loader>` for empty/loading.

### UXM Layout & Styling Gotchas (mandatory)

These rules eliminate the most common visual defects the generator otherwise produces. **Apply on the first pass — do not wait for review.**

**1. Never wrap `DataTable` or `DetailSection` in `<Card>`.**

Both components are *already* card-like containers (own border, own `border-radius: 8px`, own padding). Wrapping them in `<Card>` produces a visible double border and double-rounded corners.

```jsx
// ❌ Wrong — double border, double radius
<Card shadow>
  <DataTable columns={cols} rows={rows} rowKey={(r) => r.id} />
</Card>
<Card shadow style={{ padding: 24 }}>
  <DetailSection icon={<Icon glyph="bell" />} title="Notifications">…</DetailSection>
</Card>

// ✅ Right — render directly
<DataTable columns={cols} rows={rows} rowKey={(r) => r.id} />
<DetailSection icon={<Icon glyph="bell" />} title="Notifications">…</DetailSection>
```

If you need a heading above a `DataTable`, use a `<Stack>` with a plain `<div>` for the title — not a `Card`.

**2. Tabular data = `DataTable`, not `List` + `ListItem`.**

Use `<List>` / `<ListItem>` only for *vertical lists of items where each row is a free-form card-like entry* (e.g. a notification feed). For anything that has *columns* — IDs, names, statuses, amounts, categories — use `<DataTable>` with typed `columns`. This applies to Products, Recent orders, Admin sections, and any BI list.

**3. To-do lists / checkable items = `Checkbox`, not `<Icon glyph="check-circle">` in a List.**

```jsx
const [tasks, setTasks] = useState(TASKS)
const toggleTask = (id) =>
  setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))

<Stack gap={10}>
  {tasks.map((t) => (
    <Checkbox key={t.id} checked={t.done} onChange={() => toggleTask(t.id)}>
      <span style={t.done ? { textDecoration: 'line-through', color: 'var(--color-text-muted)' } : undefined}>
        {t.label}
      </span>
    </Checkbox>
  ))}
</Stack>
```

**4. `<Icon>` inside `<InputWithIcon>` must be 16px.**

`<Icon>` defaults to `size={24}`, but `InputWithIcon` reserves padding for a 16px icon (`--uxm-input-with-icon-icon-size: 16px`). The mismatch makes the leading icon look giant and crowd the placeholder text. Fix it globally in `globals.css` (rule below) — no per-call `size={16}` needed.

**5. Required `globals.css` baseline.**

The library defaults leave a few visible inconsistencies (mixed radii, asymmetric padding, broken `calc` when accent-width is unitless). Ship this baseline so the first render already looks right:

```css
/* src/styles/globals.css — loaded AFTER @viax.io/uxm/tokens.css and ui.css */

/* Give the document a definite height. <PageShell> is `height:100%` and its
   __content area is `overflow:auto` — it is DESIGNED to bound itself to the
   viewport and scroll the content internally (sidebar + top bar stay fixed).
   That only works if html/body/#root have a height; otherwise height:100%
   collapses to content height, the whole page grows with tall content (e.g. the
   UXM Studio's long component list), and you must scroll the entire page —
   centered content like the studio canvas ends up far below the fold. */
html, body, #root { height: 100%; }

/* MANDATORY --font-sans bridge — without it the ENTIRE portal renders in Times
   New Roman. @viax.io/uxm/tokens.css declares `--font-sans: var(--font-inter)` ONLY
   inside its `@theme inline { … }` block, which is a Tailwind v4 at-rule. This
   portal is not a Tailwind host, so the browser does not understand `@theme`,
   DROPS the whole block, and --font-sans never exists. With no brand font
   published --brand-font is unset too, so the `body` rule below would collapse to
   the guaranteed-invalid value → the declaration becomes INVALID AT
   COMPUTED-VALUE TIME → <body> falls back to `inherit`, i.e. the browser's
   default serif. Every uxm atom is `font-family: inherit`, so that serif then
   spreads through every component (mixed with the monospace PropertyField values,
   which is why it looks like "several different fonts").
   --font-inter IS declared in the real `:root`, so alias it — literal stack last. */
:root {
  --font-sans: var(--font-inter, 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif);
}

/* Base typeface chain: Inter by default; when the published studio config carries
   a brand font (Brand Settings → Typography), the applier's injected stylesheet
   defines --brand-font and its own
   `body { font-family: var(--brand-font) !important }` rule. Declaring the SAME
   chain here keeps pre-applier paint on Inter (never the browser serif default)
   and leaves a single source of truth — do NOT hardcode any other family.
   Safe ONLY because of the --font-sans bridge above. Applied to html/#root too
   so NOTHING in the tree can resolve to the browser serif via the html element. */
body { margin: 0; }
html, body, #root { font-family: var(--brand-font, var(--font-sans)); }

/* MANDATORY form-control inheritance — native <button>/<input>/<select>/<textarea>
   do NOT inherit the document font; browsers give them their own UA default
   (Arial / system UI). Every @viax.io/uxm atom already sets `font-family: inherit`,
   but any RAW native control in portal code (a custom Menu/Listbox trigger, a
   bare <button>, a plain <select>) silently renders in Arial next to Inter text.
   Force inheritance once — element-level specificity, so uxm class rules and the
   studio's injected overrides still win: */
button, input, select, textarea { font: inherit; }

/* There is no --font-mono token in tokens.css at all — anywhere a monospace
   treatment is wanted (IDs in tables, PropertyField values), always pass the
   literal fallback: font-family: var(--font-mono, monospace). */

:root {
  /* NOTE: do NOT declare the brand accent ramp (--color-accent*) here. The UXM
     Studio config is the single source of truth for it — DEFAULT_UXM_CONFIG seeds
     it, UxmConfigApplier injects it on mount, and BrandTokenStyles drives it live
     on /uxm. Re-declaring it here creates a SECOND source that ghosts through after
     a studio "Reset all" (the studio's inputs fall back to the library default
     while these hardcoded values keep painting the buttons). The fallback when no
     brand is set is the library default from @viax.io/uxm/tokens.css — exactly what
     the studio shows. (Minor trade-off: a brief library-default flash before React
     mounts and the applier runs; the localStorage cache covers returning users.) */

  /* Inputs — make the bg match Card (white), not Surface (gray) */
  --uxm-input-with-icon-bg: var(--color-card);

  /* PageShell breathing room */
  --uxm-page-shell-content-padding: 24px 32px;

  /* Unify all panel radii. Library defaults: Card 4px, DetailSection 4px,
     StatCard 8px, DataTable 8px → bump everything to 8px. */
  --uxm-card-radius: 8px;
  --uxm-detail-section-radius: 8px;

  /* DetailSection: hide the 3px accent rail and bump inner padding.
     IMPORTANT: accent-width MUST carry a unit (0px, not 0) — the library's
     padding-left uses calc(…+var(…)+4px) which silently fails on unitless 0. */
  --uxm-detail-section-accent-width: 0px;
  --uxm-detail-section-padding: 28px;
}

/* DetailSection: the library hardcodes an asymmetric padding-left to reserve
   space for the (now-hidden) accent rail. Make padding-left match the other sides. */
.uxm-detail-section__inner {
  padding-left: var(--uxm-detail-section-padding, 20px);
}

/* InputWithIcon: clamp nested <Icon> SVGs to the 16px slot the input expects.
   <Icon> defaults to size=24, which overflows the padding-left reservation. */
.uxm-input-with-icon__icon svg {
  width: var(--uxm-input-with-icon-icon-size, 16px);
  height: var(--uxm-input-with-icon-icon-size, 16px);
}

/* Interactive ListItems render as <button>/<a> and shrink-wrap by default,
   making vertical lists look staggered. Force them full width. */
.uxm-list { display: flex; flex-direction: column; }
.uxm-list > .uxm-list-item { width: 100%; text-align: left; }

/* AppTopBar — widen padding so trailing actions don't hug the right edge. */
.uxm-app-top-bar { padding: 0 24px; height: 72px; }

/* Embedded UXM Studio (/uxm) — EMBED ONLY (include only when {{EMBED_UXM_STUDIO}} = yes).
   Fill the now-viewport-bounded content area so the
   studio's own `h-full` root resolves to a definite height and its panes
   (component list + canvas) scroll independently. Without this the long component
   list stretches the page and the demoed component centers in the middle of a very
   tall column, requiring a full-page scroll to see it. The wrapper class must match
   the one on UxmStudioPage's root <div> (`{{CLIENT_SLUG}}-uxm-studio`). */
.{{CLIENT_SLUG}}-uxm-studio { height: 100%; }
```

**6. Load Inter in `index.html`.**

`@viax.io/uxm/tokens.css` only *references* the Inter family (`--font-inter`) — it bundles no font
file. Without a loader the stack degrades to the system-UI fallbacks inside `--font-inter`
(`system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`) — still sans-serif, just not Inter.

> **Do not confuse that with the Times New Roman failure.** A serif page is a *different* bug: it
> means `--font-sans` itself never resolved, because tokens.css only declares it inside the
> Tailwind-only `@theme inline` block. Loading Inter does **not** fix that — the `:root
> { --font-sans: … }` bridge in the `globals.css` baseline (item 5 above) does. Symptom triage:
> serif body text → missing bridge; sans-but-not-Inter → missing `<link>` below.

Add the Google-Fonts link to `index.html` `<head>` (weights match the studio's brand-font emission):

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" />
```

Only Inter is preloaded here — it's the default. A brand font chosen in Brand Settings →
Typography is loaded at runtime by the applier's generated CSS (`@import` emitted by
`generateOverridesCss`); do NOT preload other families.

**7. `PropertyField`'s value is `children`, never a `value` prop.**

```jsx
// ❌ Wrong — silently renders an empty value cell
<PropertyField label="Total" value={formatMoney(total)} />

// ✅ Right
<PropertyField label="Total">{formatMoney(total)}</PropertyField>
```

`ResponsiveGrid`'s `min` is a CSS length **string** (`"280px"`), not a bare number — a bare number
emits an invalid, browser-dropped `minmax()`. `PropertyGrid` has no equivalent prop at all — its
grid template (`auto-fill, minmax(120px, 1fr)`) is fixed; only its gaps are themable.

**8. `PageHeader`'s `meta` renders inside a `<p>` — inline content only.**

```jsx
// ❌ Wrong — <div>-in-<p> nesting, hydration warning
<PageHeader title={order.biName} meta={<Stack gap={4}>{order.biId}<span>{order.biCreatedAt}</span></Stack>} />

// ✅ Right — string, <span>, or fragment only
<PageHeader title={order.biName} meta={<>{order.biId} &middot; Created {order.biCreatedAt}</>} />
```

**9. Horizontal rows (party cards, avatar+name rows, button groups) = `Cluster`, not
`Stack` with a `flexDirection: 'row'` override.**

```jsx
// ❌ Wrong — fights Stack's flex-column design
<Stack gap={12} style={{ flexDirection: 'row' }}><Avatar .../><span>{party.paName}</span></Stack>

// ✅ Right
<Cluster gap={12} align="center"><Avatar .../><span>{party.paName}</span></Cluster>
```

**10. `BackLink` needs a real `href`, not just an `onClick`.**

It renders as an `<a>` — an `onClick`-only usage breaks keyboard focus and right-click/open-in-new-tab.

```jsx
// ❌ Wrong
<BackLink onClick={() => navigate('/orders')}>Back to orders</BackLink>

// ✅ Right
<BackLink href="/orders" onClick={(e) => { e.preventDefault(); navigate('/orders') }}>Back to orders</BackLink>
```

### Runtime Theming — consume the UXM Studio config (optionally embed the editor at `/uxm`)

**This whole topic lives in its own skill: [`viax-uxm-theming`](../../viax-uxm-theming/SKILL.md).**
Read it and follow it — the fetch/apply contract, the wire shape, the three modes, the
reference React implementation and the theming gotchas are all there, and they are not
portal-specific. Do not re-derive any of it here.

The portal-specific decisions this MetaPrompt adds on top:

- **Mode selection.** `{{EMBED_UXM_STUDIO}}` (default `no`) picks *consume* vs *consume + embed*;
  `{{THEME_PICKER}}` (default `no`) adds the read-only picker. They are independent. Consume is
  always built.
- **Naming.** Use `{{CLIENT_SLUG}}` wherever the skill writes `<app-slug>` — the `localStorage`
  keys (`{{CLIENT_SLUG}}-uxm-studio-config`, `{{CLIENT_SLUG}}-selected-theme`) and the BEM
  prefixes (`.{{CLIENT_SLUG}}-uxm-studio`, `.{{CLIENT_SLUG}}-theme-picker__*`).
- **Shell wiring (embed only).** `/uxm` route inside the protected route group; a **"UXM Studio"**
  item (`glyph="paint-brush"`) under the **Settings** sidebar group — this *replaces* the old
  Admin → Theme entry; and zero the content padding on that route
  (`style={location.pathname.startsWith('/uxm') ? { '--uxm-page-shell-content-padding': '0px' } : undefined}`)
  so the workbench sits edge-to-edge.
- **Header (`<AppTopBar actions>`).** The light/dark toggle always; `<ThemePicker />` after it as a
  sibling when `{{THEME_PICKER}} = yes`. The sidebar logo swaps to `logoUrlDark` in dark mode.
- **Per-portal theme assignment (all modes).** The published config's `portals` map is keyed by
  `{{PORTAL_ID}}`; its `themeId` picks this portal's boot theme out of `uxmStudio.themes[]` —
  see *"Per-portal theme assignment"* in the theming skill. Consume-only portals get it via
  `fetchAppliedStudioConfig` in the boot hydrate; `{{THEME_PICKER}} = yes` portals fold it into
  the theme store's candidate chain (an explicit user pick still wins).
- **Do NOT build a custom admin theme EDITOR** in either mode — there is no Theme row in the Admin
  index. The read-only picker is the only selection UI allowed.

The identity block (`portal.id` in `package.json`, the Vite `define`, the boot stamp) is also
specified in the theming skill — see *"App identity"* there; `{{PORTAL_ID}}` and
`{{GENERATED_AT}}` are the values to substitute.


## viax GraphQL API Gotchas

> Critical corrections — these mistakes cause runtime errors. Apply them exactly.

| # | Wrong | Correct | Why |
|---|---|---|---|
| 1 | `filter<Type>(..., _sort: [...])` | `filter<Type>(_first: N, _filter: "...")` | `_sort` is **not** a valid argument on `filter*` queries |
| 2 | `pricPrice_TOTAL { amount currency }` | `pricPrice { edges { node { amount units { code } } } }` | Breakdown fields (`_TOTAL`, `_SUBTOTAL`, etc.) are not queryable; `pricPrice` is a connection |
| 3 | `bpStatus` (scalar) | `bpStatus { code }` | `bpStatus` is a DynamicEnum object — must select subfields |
| 4 | `Money { amount currency }` | `Money { amount units { code } }` | `currency` is not a field on `Money`; currency code is at `units.code` |
| 5 | Calling `keycloak.init()` more than once | Create keycloak instance as a module singleton in `lib/keycloak.js` and import it everywhere | Re-initializing Keycloak causes state conflicts and unexpected redirects |
| 6 | `@radix-ui/react-badge` in `package.json` | Remove or implement badge using `class-variance-authority` | This package does not exist on npm |
| 7 | `biConfigurationStateResult` (scalar in query) | Omit from queries entirely | It's `[StateConfigurationResult!]` — a complex nested type, not a scalar. It is also typically empty (`[]`). Do not query it; the component guard (`data.biConfigurationStateResult &&`) handles undefined gracefully. |
| 8 | Using `get_type` field listing to detect if a type has `bpStatus` | Every BEM-discovered type has `bpStatus` — always set `hasStatus: true` | `get_type` only returns **directly defined** fields. Inherited fields (like `bpStatus` from `BusinessProcessable`) are **not shown**, even though they are fully queryable. Every type in the BEM tree extends `BusinessInteraction → BusinessProcessable`, so `bpStatus { code }` is always available. Never infer `hasStatus` from the `get_type` field list. |
| 9 | `query Filter($filter: ${TypeName}Filter)` | `query Filter($filter: String)` | The `_filter` argument on all `filter*` queries is a **plain string expression** (e.g. `"bpStatus = 'Active'"`), not a typed input object. Using `${TypeName}Filter` as the variable type causes "Unknown type" errors at runtime. Always declare `$filter: String` and pass a string like `"bpStatus = 'Placed' AND biName regexp 'foo'"`. |
| 10 | `prPartyX { edges { node { paId paName } } }` | `prPartyX { edges { node { parId parParty { paId paName } } } }` | `prParty*` connection nodes are `PartyRole` objects, **not** `Party` objects. `PartyRole` has no `paId`/`paName` — those fields live on the nested `Party` via `parParty`. Always traverse: `node.parId` (role ID) and `node.parParty.paId` / `node.parParty.paName` (the actual party). |
| 11 | `getCurrentUserInfo { uid name email party { paPartyRoles { typeName } } }` | `getCurrentUserInfo { uid party { paId paName paMappedRolesList paPartyRoles { typeName } } }` | `name` and `email` are **not fields on the `User` type** — querying them causes a validation error. Use `party.paName` for display name. For sidebar role matching use `party.paMappedRolesList` (returns `["Partner", "Admin", ...]` — already normalized role name strings) rather than `paPartyRoles[].typeName` (returns `["PaloozaPartner", ...]` with realm prefix that won't match `prParty*` field names). |
| 12 | `filterMaterialArticle` / `getMaterialArticle` / `filterViaxProduct` / `getViaxProduct` | `filterMaterial` / `getMaterial` | The correct queries for products are `filterMaterial(_first: N)` and `getMaterial(maId: "...")`. `MaterialArticle` and `ViaxProduct` are not valid query root fields. |
| 13 | `maCategories` (scalar) | `maCategories { catId catName }` | `maCategories` is `[MaterialCategory]` — an object list, not a scalar. Must select subfields. `catId` and `catName` are the standard display fields from the `Category` interface. |
| 14 | `maStatus` on products / `pricPrice` connection on `Material` | Omit both | `maStatus` does not exist on `Material`. `pricPrice` is not a queryable connection on material types (only on `BusinessInteraction` types). Product queries should use: `maId`, `maName`, `maDescription`, `maCategories { catId catName }`, `attAttachments { atId atName atMimeType atUrl }`. |
| 15 | `query Get($id: ID!)` | `query Get($id: String!)` | viax `get*` and `filter*` query arguments (`biId`, `maId`, `uid`, etc.) are typed as `String` in the schema, **not** `ID`. Using `ID!` causes "used in position expecting type String" errors. Always declare lookup variable types as `String!` or `String`. |

---

## GraphQL Integration Layer

### Axios + GraphQL Client

```javascript
// lib/graphql-client.js
// - Singleton Axios instance pointed at VITE_API_URL
// - Request interceptor: attach Bearer token from useAuthStore.getState().accessToken
// - Response interceptor: 401 → keycloak.logout() → Keycloak redirects to login
// - Generic execute function: (query, variables?) => Promise
// - No direct fetch() calls anywhere — all GraphQL goes through this client

// lib/api/bi.js — data normalization after fetching:
// 1. pricPrice connection → normalize to [{amount, currency}]:
//    edges.map(e => e.node).filter(Boolean).map(n => ({ amount: n.amount, currency: n.units?.code ?? 'USD' }))
// 2. bpStatus DynamicEnum → normalize to flat string:
//    record.biStatus = record[config.statusField]?.code
//    (components reference biStatus; API returns bpStatus { code })
```

### TanStack Query Hooks

One file per domain entity in `hooks/`:

```javascript
// Example: hooks/use-orders.js
// useOrders(filters)  → useQuery wrapping graphqlClient
// useOrder(biId)      → useQuery for single order detail
// useCreateOrder()    → useMutation
```

**`use-user.js` — special pattern:** This hook does more than fetch; it also syncs roles into `auth-store` via `useEffect`:

```javascript
// hooks/use-user.js
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchCurrentUser } from '@/lib/api/user'
import useAuthStore from '@/stores/auth-store'

export function useUser() {
  const setUserRoles = useAuthStore((s) => s.setUserRoles)

  const query = useQuery({
    queryKey: ['current-user'],
    queryFn: fetchCurrentUser,
    staleTime: 300_000,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (!query.data) return
    const roles = query.data.party?.paMappedRolesList || []
    setUserRoles(new Set(roles))
  }, [query.data, setUserRoles])

  return query
}
```

Call `useUser()` inside `shell.jsx` (the portal layout wrapper) so roles are populated on every authenticated page before the sidebar renders.

### Mock Data Layer

- `lib/mock-data/` — realistic mock data for every entity type using actual viax field names
- `lib/api/` — each module exports a real and mock implementation, toggled via `NEXT_PUBLIC_USE_MOCK_DATA=true`
- The portal must be fully functional with `NEXT_PUBLIC_USE_MOCK_DATA=true` — no real API calls required

---

## viax GraphQL Schema Reference

### Querying Patterns

```graphql
# Single entity — ID arguments are String, NOT ID type (see Gotcha #15)
get<TypeName>(biId: "...")
get<TypeName>(uid: "...")

# List with filters — supported args: _first, _last, _filter, _after, _before
# NOTE: _sort is NOT a valid argument on filter<TypeName> queries — omit it entirely
# NOTE: _filter is a plain String expression, NOT a typed input object (see Gotcha #9)
filter<TypeName>(
  _first: 10,
  _filter: "bpStatus = 'Active'"
)

# Connections
edges { node { ... } }
```

> **GraphQL variable types for IDs:** All `biId`, `maId`, `uid` etc. arguments accept `String`, not `ID`. Always declare variables as `$biId: String!` — using `ID!` causes a type mismatch error at runtime (see Gotcha #15).

### Key Entity Types

> The entity type names below use the `Palooza` prefix which matches the `viax` realm. If the realm changes, update the type name prefixes accordingly (e.g. `AcmeSalesOrder` for realm `acme`).

**Business Interactions (transactions):**

All implement `BusinessInteraction` with: `biId`, `biName`, `biDescription`, `biCreatedAt`, `biCompletedAt`

> **Do NOT query `biConfigurationStateResult`** — it is `[StateConfigurationResult!]`, a complex nested type that is almost always empty. Omit it from all queries.

**Status field — `bpStatus` is a DynamicEnum object, NOT a scalar.** Always query it as `bpStatus { code }`. The `code` field contains the status string value (e.g. `"Placed"`, `"Unpaid"`). Filter by the code directly: `_filter: "bpStatus = 'Placed'"`.

Most implement `Priceable` via a **`pricPrice` connection** (NOT individual `pricPrice_TOTAL`, `pricPrice_SUBTOTAL` etc. fields — those do not exist as directly queryable fields). Always query pricing as:
```graphql
pricPrice { edges { node { amount units { code } } } }
```
The `Money` type has `amount` (BigDecimal) and `units { code }` (ISO 4217 currency code). There is no `currency` field directly on `Money`. After fetching, normalize the connection to `[{ amount, currency }]` by mapping `units.code` → `currency` for use in formatting utilities.

**Party roles on BIs:** Every BI type has one **primary party** field (`prPartyPrimary`) and zero or more **additional party** fields following the pattern `prParty{partyRoleName}` (e.g. `prPartyCustomer`, `prPartySoldTo`, `prPartyBillTo`, `prPartyShipTo`, `prPartySales`, `prPartySeller`, `prPartySupplier`).

The exact set of party fields available on a given BI type is **not fixed** — it depends on the BEM definition. Always discover the actual `prParty*` fields for each type at scaffolding time using `get_type` or `getEntity` (see [BEM Discovery & Dynamic Route Generation](#bem-discovery--dynamic-route-generation)). Store the discovered fields in `bi-types.config.js` so the detail page knows which party cards to render.

**Materials (Products):** `filterMaterial` / `getMaterial` — fields: `maId`, `maName`, `maDescription`, `maCategories { catId catName }`, `attAttachments { atId atName atMimeType atUrl }` (images come from `attAttachments`; filter by `atMimeType.startsWith('image/')` or use the first entry with an `atUrl`; `maStatus` and `pricPrice` do not exist on this type)

**Parties (Customers/Orgs):** `filterOrganisation`, `filterIndividual` — fields: `paId`, `paName`, `paDescription`

**User Info:** Fetch on every app load using the full query below. The `paPartyRoles` array drives role-based menu visibility (see [Step 7 — Sidebar Navigation](#step-7--sidebar-navigation)):

```graphql
query getCurrentUserInfo {
  getCurrentUserInfo {
    uid
    party {
      paId
      paName
      paMappedRolesList
      paPartyRoles {
        typeName
      }
    }
  }
}
```

> **`name` and `email` are not fields on `User`** — do not include them in the query (causes a GraphQL validation error). Use `party.paName` as the display name.

The result is **not** stored directly in `auth-store` via `syncFromKeycloak` — the Keycloak token carries no viax role data. Instead, the `use-user.js` hook fetches this query, then calls `authStore.setUserRoles(new Set(data.party.paMappedRolesList))` via a `useEffect`. The `auth-store` must expose a `setUserRoles(roles)` action for this.

Use `party.paMappedRolesList` (a `[String]` like `["Admin", "Partner"]`) — **not** `paPartyRoles[].typeName`. `paMappedRolesList` already strips the realm prefix, so it matches the `prParty*` field naming convention directly (e.g. `prPartyPartner` → strip `prParty` → `Partner` → matches `paMappedRolesList` entry `"Partner"`). Using `paPartyRoles[].typeName` (e.g. `"PaloozaPartner"`) would never match.

**Critical:** `useUser()` must be called from the portal shell component (`shell.jsx`) so it runs on every authenticated page and roles are always populated before the sidebar renders. If it is only defined but never called, `userRoles` stays as `new Set()` and all role-gated BEM menu items are hidden.

**Mock user shape** must mirror the real API response:
```javascript
// lib/mock-data/user.js
export const MOCK_USER = {
  uid: 'mock-user-001',
  party: {
    paId: 'mock-party-001',
    paName: 'Alex Johnson',
    paMappedRolesList: ['Admin', 'Partner'],   // normalized — matches prParty* field names
    paPartyRoles: [
      { typeName: 'ViaxAdmin' },
      { typeName: 'PaloozaPartner' },
    ],
  },
}
```

### Hierarchical Structure (Line Items)

```graphql
{
  getPaloozaShopifyOrder(biId: "123") {
    biId
    biName
    hiConsistsOf {
      edges {
        node {
          ... on BusinessInteractionItem {
            biiId
            biiName
            biiQuantity { quQuantity }
          }
        }
      }
    }
  }
}
```

---

## BEM Discovery & Dynamic Route Generation

> **This step runs during scaffolding** — before generating any transactional page files. Use the MCP `get_type` and `execute_query` tools to introspect the live viax API for the `viax` realm.

### Step 1 — Ask the User for the BEM Identifier

**Do not auto-detect the BEM.** Before proceeding, ask the user to supply the BEM they want to use. They can provide either:

- A **UID** — e.g. `019a92b2-52a7-7726-8299-e3d38a5bab0f`
- A **code** — e.g. `2UBusinessExecutionModel`

Once the user provides the identifier, fetch the BEM using the appropriate filter:

```graphql
# If the user provided a UID:
query GetBEMByUid {
  filterBusinessInteractionExecutionModel(
    _first: 1,
    _filter: "uid = '019a92b2-52a7-7726-8299-e3d38a5bab0f'"
  ) {
    edges { node { code name uid } }
  }
}

# If the user provided a code:
query GetBEMByCode {
  filterBusinessInteractionExecutionModel(
    _first: 1,
    _filter: "code = '2UBusinessExecutionModel'"
  ) {
    edges { node { code name uid } }
  }
}
```

- If **zero** results: inform the user the identifier did not match any BEM and ask them to verify it.
- If a result is returned: confirm the BEM name back to the user before proceeding.

### Step 2 — Fetch the Full BEM Relation Tree

The BEM structure is a **tree**, not a flat list. The root type has `groups`, each group has `relations`, and each relation can itself have nested `groups` and `relations`. You must traverse the **entire tree recursively** to collect every unique BI type — otherwise you will miss types that are nested deeper than one level.

First, call `get_type('BusinessInteractionExecutionModel')` and `get_type('BITypeRelation')` to confirm the available fields, then execute a single deep query that fetches all levels at once:

```graphql
query GetBEMFullTree {
  filterBusinessInteractionExecutionModel(
    _first: 1,
    _filter: "uid = '<BEM_UID>'"
  ) {
    edges {
      node {
        code
        name
        uid
        sourceBIType
        groups {
          groupNameId
          relations {
            sourceBIType
            groups {
              groupNameId
              relations {
                sourceBIType
                groups {
                  groupNameId
                  relations {
                    sourceBIType
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

> **Depth note:** Nest `groups → relations` as many levels as needed until no further nesting appears in the data. The query above covers 4 levels which is sufficient for most BEMs, but add more if the model is deeper.

### Step 3 — Collect All Unique BI Types

From the query result, **walk the entire tree** and collect every unique `sourceBIType` value encountered at every level — root, groups, nested relations, and sub-groups. Build a deduplicated flat list.

**Example** for BEM `2UBusinessExecutionModel` (`019a92b2-52a7-7726-8299-e3d38a5bab0f`):

```
Root:                    Palooza2USubscriptionOrder
└── Subscription Definition (group)
    ├── Palooza2UInvoice
    └── Palooza2USubscriptionContract
        └── Recurring Charges (group)
            ├── PaloozaEducationPartnerCommissions   ← nested level 2
            ├── Palooza2UInvoice                     ← duplicate, skip
            └── Palooza2ULicense                     ← nested level 2
```

Unique types found: `Palooza2USubscriptionOrder`, `Palooza2UInvoice`, `Palooza2USubscriptionContract`, `PaloozaEducationPartnerCommissions`, `Palooza2ULicense`

**Do not stop at the first level of relations.** The most common mistake is collecting only direct children of the root — this causes deeper BI types (e.g. `PaloozaEducationPartnerCommissions`, `Palooza2ULicense`) to be silently omitted from the generated app.

For each unique type in the collected list, call `get_type(typeName)` in parallel to discover which interfaces it implements.

### Step 4 — Interface Feature Flags

Map implemented interfaces to feature flags stored in `bi-types.config.js`:

| Interface | Flag | Effect on generated pages |
|---|---|---|
| **ALL BEM types** (implicit — see note below) | `hasStatus: true`, `statusField: 'bpStatus'` | Status badge column; status filter on list. Field is `bpStatus { code }` (DynamicEnum). Normalize `record.bpStatus.code` → `biStatus` in the data layer. |
| `Priceable` | `isPriceable: true` | Price column in list table; Price Summary card on detail. Query via `pricPrice { edges { node { amount units { code } } } }`. Normalize to `[{ amount, currency }]` in the data layer. |
| `Hierarchical` | `hasLineItems: true` | Line Items table on detail page |
| `PartyRoleHolder` | `hasParties: true`, `partyFields: [...]` | Party Cards on detail page — one card per discovered `prParty*` field. `partyFields` is populated during BEM parsing (see note below). |

> **`hasParties` — discover actual party fields via `get_type` / `getEntity`:**
> When a type implements `PartyRoleHolder`, call `get_type(typeName)` (or `getEntity`) to list its fields and collect every field whose name starts with `prParty`. Store them as `partyFields` in the config entry, e.g.:
> ```javascript
> partyFields: [
>   { field: 'prPartyPrimary', label: 'Primary' },       // always present on PartyRoleHolder types
>   { field: 'prPartySoldTo',  label: 'Sold-To' },
>   { field: 'prPartyBillTo',  label: 'Bill-To' },
>   { field: 'prPartyShipTo',  label: 'Ship-To' },
> ]
> ```
> The detail page iterates `partyFields` to render one `<PartyCard>` per entry. Do **not** hard-code a fixed list of party roles — use whatever was discovered.

> **`hasStatus` rule — always `true` for every BEM type:**
> Every type in the BEM tree extends `BusinessInteraction`, which extends `BusinessProcessable`, which defines `bpStatus`. **Do NOT use `get_type` field listing to decide this.** `get_type` only shows directly-defined fields — inherited fields like `bpStatus` will not appear, making it look like the type has no status. The correct approach: always set `hasStatus: true` and `statusField: 'bpStatus'` for every BEM-discovered type, then verify by querying live data (see Step 5).
>
> Only set `hasStatus: false` if a live query of `bpStatus { code }` returns `null` for all sampled records of that type.

### Step 5 — Collect Status Values for Every BI Type

For every BEM-discovered type, **always set `hasStatus: true`** and collect the actual status values by sampling live data:

```graphql
# Run for each type — replace {TypeName} with the concrete type name
query Get{TypeName}StatusValues {
  filter{TypeName}(_first: 200, _filter: "biId IS NOT NULL") {
    edges {
      node {
        bpStatus { code }
      }
    }
  }
}
```

From the result, collect all unique non-null `bpStatus.code` values and store them as `statusValues` on the config entry.

> **Why not `get{TypeName}StatusValues`?** That query does not exist in the viax API. Sampling live records is the only reliable method.
>
> **If all sampled records return `bpStatus: null`** (e.g. the type has no business process defined yet), set `hasStatus: false` and `statusValues: []` as an exception — and leave a comment in the config noting the manual override.

```javascript
// src/lib/bi-types.config.js
// AUTO-GENERATED from BEM — do not edit manually
// Regenerate by re-running the scaffolding prompt

export const BI_TYPES = [
  // One entry per BEM relation, e.g.:
  {
    slug: 'shopify-orders',           // URL-safe label slug
    label: 'Shopify Orders',          // Display name (from BEM relation label)
    typeName: 'PaloozaShopifyOrder',  // GraphQL type name
    description: 'eCommerce orders synced from Shopify',
    isPriceable: true,
    hasStatus: true,
    statusField: 'bpStatus',          // Actual GraphQL field name for status (always 'bpStatus' for BIs)
    statusValues: ['Draft', 'Active', 'Completed', 'Cancelled'], // from getPaloozaShopifyOrderStatusValues
    hasLineItems: true,
    hasParties: true,
  },
  // ... one entry per BEM relation
]

export function getBiType(slug) {
  return BI_TYPES.find(t => t.slug === slug) ?? null
}
```

### Step 6 — Scaffold Route Files

For **each entry** in `BI_TYPES`, generate two thin wrapper pages that delegate to shared templates. Register each pair as a React Router route in `src/routes/index.jsx`.

**List page** — `src/pages/{slug}/BiListPage.jsx`:

```jsx
import { getBiType } from '@/lib/bi-types.config'
import BiListTemplate from '@/components/bi/bi-list-page'

export default function BiListPage() {
  const config = getBiType('{slug}')
  return <BiListTemplate config={config} />
}
```

**Detail page** — `src/pages/{slug}/BiDetailPage.jsx`:

```jsx
import { useParams } from 'react-router-dom'
import { getBiType } from '@/lib/bi-types.config'
import BiDetailTemplate from '@/components/bi/bi-detail-page'

export default function BiDetailPage() {
  const { biId } = useParams()
  const config = getBiType('{slug}')
  return <BiDetailTemplate config={config} biId={biId} />
}
```

**Register routes** in `src/routes/index.jsx` — add one route pair per `BI_TYPES` entry:

```jsx
<Route path="/{slug}" element={<BiListPage />} />
<Route path="/{slug}/:biId" element={<BiDetailPage />} />
```

### Step 7 — Sidebar Navigation

Build the nav items array from fixed pages + `BI_TYPES`, filtered by the current user's party roles.

**Rule:** A BI menu item is visible to a user if **at least one** of the user's role type names matches any `prParty*` field defined on that BI type (i.e. the field name ends with the role type name). Users with the `Admin` role bypass the filter and see all items.

```javascript
// src/components/layout/sidebar.jsx (relevant excerpt)
import { BI_TYPES } from '@/lib/bi-types.config'
import { useAuthStore } from '@/lib/stores/auth-store'

const NAV_TOP = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/products',  label: 'Products',  icon: Package },
]

const NAV_BOTTOM = [
  { href: '/account', label: 'Account', icon: User },
  { href: '/admin',   label: 'Admin',   icon: Settings },
]

// Returns true if the user's roles grant access to a given BI type config entry.
// userRoles — Set<string> from party.paMappedRolesList (e.g. 'Partner', 'Admin')
//             NOT paPartyRoles[].typeName (which has realm prefix, e.g. 'PaloozaPartner')
// biConfig  — one entry from BI_TYPES, must include partyFields: [{ field, label }]
function userCanSeeBiType(userRoles, biConfig) {
  if (userRoles.has('Admin')) return true
  if (!biConfig.partyFields?.length) return true // no party constraint = visible to all
  return biConfig.partyFields.some(({ field }) =>
    // field is e.g. 'prPartyPartner' — strip 'prParty' prefix → 'Partner'
    // matches paMappedRolesList entry 'Partner' directly
    userRoles.has(field.replace(/^prParty/, ''))
  )
}

export function useNavItems() {
  const userRoles = useAuthStore(s => s.userRoles) // Set<string>

  const NAV_BI = BI_TYPES
    .filter(t => userCanSeeBiType(userRoles, t))
    .map(t => ({
      href: `/${t.slug}`,
      label: t.label,
      icon: FileText,
    }))

  return [...NAV_TOP, ...NAV_BI, ...NAV_BOTTOM]
}
```

> **`partyFields` visibility rule:** `partyFields: []` (empty — no party constraint) means the BI type is **visible to all authenticated users**. Only entries with a non-empty `partyFields` array are role-gated. The `userCanSeeBiType` guard short-circuits with `return true` when `partyFields` is empty. This is intentional: if a BI type has no party role constraint, it should always appear in the sidebar.

---

## Application Structure

```
viax-lab-portal/
├── index.html                               # Vite entry HTML
├── .env.local
├── .env.example
├── .npmrc                                   # engine-strict=true (optional)
├── vite.config.js                           # port 9000; define __PORTAL_META__ from package.json "portal" block
├── jsconfig.json
├── package.json                             # incl. "portal" identity block (id, realm, env, generatedAt)
├── src/
│   ├── main.jsx                             # Entry: import @viax.io/uxm/tokens.css + ui.css + globals.css; stampPortalId(); init Keycloak; render React
│   ├── App.jsx                              # Root: QueryProvider + <UxmConfigApplier/> + React Router + Toaster
│   ├── routes/
│   │   ├── index.jsx                        # Route definitions (React Router v6)
│   │   └── ProtectedRoute.jsx               # Auth guard: redirect to /login if no accessToken
│   ├── pages/
│   │   ├── LoginPage.jsx                    # Card + FormField + TextInput + PasswordInput + ButtonPrimary (mock) or ButtonPrimary → keycloak.login()
│   │   ├── dashboard/
│   │   │   └── DashboardPage.jsx            # PageHeader + StatCard × 4 + recharts in Card + List recent
│   │   ├── bi/                              # Shared BI page wrappers (one BiListPage + BiDetailPage handle every slug)
│   │   │   ├── BiListPage.jsx
│   │   │   └── BiDetailPage.jsx
│   │   ├── products/
│   │   │   ├── ProductsPage.jsx             # PageHeader + InlineFilter + DataTable (Gotchas #1, #2)
│   │   │   └── ProductDetailPage.jsx        # PageHeader + DetailSection + PropertyGrid
│   │   ├── account/
│   │   │   └── AccountPage.jsx              # PageHeader + <Card> (Avatar row only) + bare <DetailSection> × N (no Card around DetailSection — Gotcha #1)
│   │   ├── admin/
│   │   │   └── AdminPage.jsx                # PageHeader + DataTable of sections (Gotcha #2)
│   │   └── uxm/
│   │       └── UxmStudioPage.jsx            # <UxmApp embed persistence={localStorage}/> — the MODO style editor
│   ├── components/
│   │   ├── layout/
│   │   │   ├── uxm-config-applier.jsx       # generateOverridesCss(config) → global <style id="uxm-overrides"> + favicon
│   │   │   ├── theme-picker.jsx             # OPTIONAL ({{THEME_PICKER}}=yes): header trigger + Listbox dropdown, select-only
│   │   │   └── shell.jsx                    # PageShell + AppSidebar (linkAs router) + AppTopBar + light/dark toggle
│   │   ├── dashboard/
│   │   │   ├── revenue-chart.jsx            # recharts LineChart in <Card>
│   │   │   ├── status-donut.jsx             # recharts PieChart in <Card>
│   │   │   └── progress-ring.jsx            # SVG ring in <Card>
│   │   ├── detail/
│   │   │   ├── line-items.jsx               # heading + <DataTable> (no Card wrapper — Gotcha #1)
│   │   │   ├── party-card.jsx               # <Card> + <Cluster> (NOT Stack+flexDirection:row — Gotcha #9) of <Avatar> rows
│   │   │   └── price-summary.jsx            # <Card> + <PropertyGrid> (PropertyField children, not value= — Gotcha #7) + <Divider>
│   │   ├── bi/
│   │   │   ├── bi-list-page.jsx             # PageHeader + InlineFilter + DataTable + Loader/EmptyState (feature-flagged)
│   │   │   └── bi-detail-page.jsx           # BackLink (needs href — Gotcha #10) + PageHeader (inline meta only — Gotcha #8) + LineItems + Timeline + PartyCard + PriceSummary (feature-flagged)
│   │   └── shared/
│   │       ├── status-badge.jsx             # Maps status → <Tag type="…">
│   │       ├── money-display.jsx
│   │       └── date-display.jsx
│   ├── lib/
│   │   ├── keycloak.js                      # Keycloak singleton instance
│   │   ├── graphql-client.js
│   │   ├── uxm-studio-config.js             # live { overrides, brand } store: localStorage cache + pub/sub + brand seed
│   │   ├── theme-catalog.js                 # OPTIONAL ({{THEME_PICKER}}=yes): pure read-only helpers over uxmStudio's themes[]
│   │   ├── uxm-persistence.js               # StudioPersistence adapter: load→live store, save→server (saveUxmConfig)+mirror
│   │   ├── bi-types.config.js               # AUTO-GENERATED: BI type registry from BEM
│   │   ├── api/
│   │   │   ├── bi.js                        # Generic BI list/detail queries (parameterized by BiTypeConfig)
│   │   │   ├── products.js
│   │   │   ├── parties.js
│   │   │   └── user.js
│   │   ├── mock-data/
│   │   │   ├── bi.js                        # Mock data for all BEM-discovered BI types
│   │   │   ├── products.js
│   │   │   ├── parties.js
│   │   │   └── user.js
│   │   └── utils/
│   │       └── format.js                    # Currency, date, number formatting
│   ├── hooks/
│   │   ├── use-bi-list.js                   # Generic BI list query (parameterized by BiTypeConfig)
│   │   ├── use-bi-detail.js                 # Generic BI detail query (parameterized by BiTypeConfig)
│   │   ├── use-products.js
│   │   ├── use-parties.js
│   │   ├── use-user.js
│   │   └── use-hydrate-studio-config.js     # boot: server uxmStudio config → live store (one-shot)
│   ├── stores/
│   │   ├── auth-store.js                    # accessToken + user info synced from Keycloak (in-memory)
│   │   └── theme-store.js                   # OPTIONAL ({{THEME_PICKER}}=yes): selectedThemeId (1 localStorage key) + loadThemes/selectTheme
│   ├── types/
│   │   ├── api.js                           # JSDoc typedefs for GraphQL responses
│   │   └── entities.js                      # JSDoc typedefs for domain entities
│   └── styles/
│       ├── globals.scss                     # CSS custom properties + global styles
│       └── components/
│           ├── sidebar.module.scss
│           └── dashboard.module.scss
```

---

## Page Specifications

### Login (`/login`)

- Centered card on subtle gradient background
- Portal logo above form — read `brand.logoUrl` from `lib/uxm-studio-config` (the same brand source the sidebar uses), falling back to `/logo.svg`
- **`VITE_USE_MOCK_AUTH=false`:** "Login" button → `keycloak.login()` — Keycloak handles the full OIDC redirect flow; this page is typically bypassed since `keycloak.init({ onLoad: 'login-required' })` redirects automatically
- **`VITE_USE_MOCK_AUTH=true`:** Username + password fields → call `useAuthStore.getState().setMockSession()` then navigate to `/dashboard`
- Error display: read `?error=` from URL search params (`useSearchParams`)
- Loading state on submit; redirect to `/dashboard` on success

### Dashboard (`/dashboard`)

**Top row:** "Hi, {firstName}!" from `useAuthStore(s => s.user.name)` + 4 `<StatCard>`s:
- Total Orders, Revenue (MTD), Open Quotes, Active Subscriptions
- Each: large number, label, trend arrow with percentage

**Middle row:** Revenue line chart (6 months), Order status donut chart, Monthly progress ring — each in a `<Card shadow>`.

**Bottom row:**
- **Recent orders** — `<DataTable>` (no `<Card>` wrapper; see Gotcha #1) with a heading above it. Columns: `ID` (monospace, muted), `Name` (medium weight), `Status` (`<Tag>`), `Amount` (right-aligned, tabular-nums). `onRowClick` navigates to `/orders/{id}`.
- **Tasks** — `<Card shadow>` containing a `<Stack>` of `<Checkbox>`-es with `useState`-driven toggle (see Gotcha #3). Strike-through + muted color for done items.
- **Quick links** — `<Card shadow>` with `<ButtonPrimary>` / `<ButtonSecondary>` / `<ButtonTertiary>` stacked.

### BI List Pages (BEM-Generated)

One list page per `BI_TYPES` entry in `bi-types.config.js`. All share the `<BiListPage config={config} />` template — behavior is driven by feature flags on the config object:

- Page title from `config.label` + "Create New" button
- Filters bar (`<InlineFilter>`): search (`<InputWithIcon>`), status filter (`<FormField>` + `<Select>` if `config.hasStatus`) — all synced to URL via React Router `useSearchParams`
- `<DataTable>` with typed columns; clicking a row (`onRowClick`) navigates to `/{slug}/{biId}`
- **Base columns** (always): ID (`biId`), Name (`biName`), Created date (`biCreatedAt`)
- **`config.hasStatus`** (true for all BEM types by default): add Status column displaying `bpStatus` with `<StatusBadge>`; status filter dropdown is populated from `config.statusValues` (collected via live data sampling during BEM discovery — see Step 5). Query as `bpStatus { code }` and normalize to `biStatus: node.bpStatus.code` in the data layer. Filter string uses the raw field name: `_filter: "bpStatus = 'Active'"`.
- **`config.isPriceable`**: add Total Amount column — query via `pricPrice { edges { node { amount units { code } } } }` and normalize to `[{ amount, currency }]` in the data layer (where `currency = units.code`)

Data is fetched via `useBiList(config)` hook → `lib/api/bi.js` → `filter{config.typeName}` GraphQL query.

### BI Detail Pages (BEM-Generated)

One detail page per `BI_TYPES` entry. All share the `<BiDetailPage config={config} biId={biId} />` template — sections are conditionally rendered by feature flags:

- Back button — `<BackLink href="/{config.slug}" onClick={(e) => { e.preventDefault(); navigate(-1) }}>` (always pass a real `href`, not just `onClick` — Gotcha #10), `biId`, `biName`, Created / Completed dates (always). Render `biId`/dates via `<PageHeader meta={<>…</>}>` — **inline content only**, never a `Stack`/block element (Gotcha #8).
- **`config.hasStatus`**: Status badge
- **`config.hasParties`**: Party cards — one `<Card>` per `config.partyFields` entry, each an avatar+name row laid out with `<Cluster>` (not `<Stack style={{flexDirection:'row'}}>` — Gotcha #9)
- **`config.hasLineItems`**: Line items table — quantity, product, unit price
- **`config.isPriceable`**: Price summary card — subtotal, discount, tax, freight, **total**, each rendered via `<PropertyField label="…">{value}</PropertyField>` (value as children, never a `value` prop — Gotcha #7)
- Status / event timeline (always)

Data is fetched via `useBiDetail(config, biId)` hook → `lib/api/bi.js` → `get{config.typeName}` GraphQL query.

### Products (`/products`)

- `<DataTable>` (not `<List>` — products have columns; see Gotcha #2). No `<Card>` wrapper (Gotcha #1).
- **Columns:** Image (`<Thumbnail>` with `style={{ '--uxm-thumbnail-size': '36px', '--uxm-thumbnail-border-radius': '6px' }}`, fallback `<Icon glyph="image" />`), Name (medium weight), ID (monospace, muted), Description (muted), Categories (right-aligned `<Cluster>` of `<Tag type="neutral" size="small">`).
- `onRowClick` navigates to `/products/{maId}`.
- Above the table: `<PageHeader>` + `<InlineFilter>` (search via `<InputWithIcon>` + category `<Select>` in a `<FormField labelPosition="side">`).
- Detail page with full product info (`<DetailSection>` + `<PropertyGrid>` of `<PropertyField label="…">{value}</PropertyField>` — children, not a `value` prop; Gotcha #7 — no `<Card>` wrapper).

### Account (`/account`)

- Top profile block: `<Card shadow>` with a `<Cluster>` (not `<Stack style={{flexDirection:'row'}}>` — Gotcha #9) of `<Avatar>` + name/email (no `DetailSection` here — it's a single-row identity card).
- **Below that, render each section as a `<DetailSection>` directly** — Addresses, Notifications, Security — **with no `<Card>` wrapper** (Gotcha #1). DetailSection is already a card.
- Addresses: `<EmptyState>` until backend wired.
- Notifications: `<Stack>` of `<ToggleSwitch>`-es.
- Security: `<Link external>` to the Keycloak account console (`{VITE_AUTH_URL}/realms/{VITE_REALM}/account`).

### Admin (`/admin`)

- `<DataTable>` (Gotcha #2) of sections — Users (coming soon), Integrations (coming soon).
- **Columns:** icon, `Section` title, `Description`, right-aligned chevron (`<Icon glyph="chevron-right" />`, omitted on disabled rows).
- `onRowClick` navigates to the section, with an inline guard so disabled rows are no-ops.
- **No Theme row** — runtime theming is the published UXM Studio config (always consumed); when `{{EMBED_UXM_STUDIO}} = yes` the editor is a separate **UXM Studio** Settings sidebar item, not an Admin row.

### UXM Studio (`/uxm`) — **embed only (`{{EMBED_UXM_STUDIO}} = yes`)**

> Skip this page, route and sidebar item entirely when `{{EMBED_UXM_STUDIO}} = no` (the default). The portal still consumes + applies the published config — it just ships no editor.

The embedded MODO style editor — **not a hand-built theme panel**. Renders `<UxmApp embed persistence={createConfigRepoPersistence()} />` (see [Runtime Theming](#runtime-theming--consume-the-uxm-studio-config-optionally-embed-the-editor-at-uxm) for the full integration).

- Mounted in `embed` mode so it lives inside the portal shell (no full-page chrome of its own).
- Save / Quick Save / Publish (surfaced by `capabilities.persist: true`) **persist `{ overrides, brand }` to the server** under the UXM config's `uxmStudio` key (via `saveUxmConfig`) and mirror it into the live `lib/uxm-studio-config.js` store; the app-level `UxmConfigApplier` regenerates the global `#uxm-overrides` stylesheet so edits re-theme **every** route. On next app boot `useHydrateStudioConfig()` reloads the saved config from the server.
- Studio handles colors, per-component & per-state overrides, brand logo/icon/favicon uploads (client-side `data:` URLs), and light/dark accents — nothing to build by hand.
- The portal shell owns the light/dark toggle (`data-theme`) and the brand-driven sidebar logo, both reacting to studio saves.

---

## State Management

| State type | Tool |
|---|---|
| Server / API data | TanStack Query |
| URL filters, pagination, search, tabs | React Router `useSearchParams` |
| Auth tokens + user info | Zustand `auth-store` — in-memory only, synced from keycloak-js on init |
| User party roles for sidebar visibility | Zustand `auth-store.userRoles` — populated by `use-user.js` hook calling `setUserRoles(new Set(paMappedRolesList))` after fetching `getCurrentUserInfo`; **NOT** from the Keycloak token (which carries no viax role data) |
| Theme / brand configuration | UXM Studio config — `{ overrides, brand }` in the live `lib/uxm-studio-config.js` store (localStorage cache + pub/sub), **persisted to the server** under the UXM config's `uxmStudio` key via `saveUxmConfig` (read back on boot by `useHydrateStudioConfig`); the app-level `UxmConfigApplier` turns the live store into a global stylesheet. **No Zustand `theme-store` for the admin/editor path.** |
| Which published theme is selected (only when `{{THEME_PICKER}} = yes`) | Zustand `theme-store.js` — `selectedThemeId` in ONE `localStorage` key, no server write; boot default is the theme assigned via the config's `portals[{{PORTAL_ID}}].themeId` when the user never picked; see *"Optional: read-only theme picker"* under Runtime Theming |
| Light/dark mode | Host-owned `data-theme` on `:root` — session-only `useState` in `shell.jsx` (the embedded studio defers it to the host) |
| Ephemeral UI (modals, form inputs) | React `useState` |

> **Critical:** Tokens are stored in Zustand **in-memory only** — never in localStorage or cookies. On page refresh, `keycloak.init()` re-establishes the session from Keycloak's own session cookie via silent refresh.

---

## Development Guidelines

### Naming & Brand

- **viax** is always lowercase "v" — never `Viax` or `VIAX` in any UI copy
- The portal display name is **viax Lab** — use `viax lab` in lowercase contexts

### Code Quality

- All GraphQL API calls go through the Axios `graphqlClient` — no direct `fetch()` calls
- The portal must be fully functional with `VITE_USE_MOCK_DATA=true`
- Theme changes apply instantly via the UXM Studio — a Save regenerates the global `#uxm-overrides` stylesheet (no page reload, no custom theme code)
- Every list page filter/search/sort state must live in the URL via React Router `useSearchParams` (shareable links)
- **Use `@viax.io/uxm` for every UI primitive** — see [`viax-uxm/SKILL.md`](viax-uxm/SKILL.md). Never handroll a div with the same intent as an existing primitive (Card, FormField, DataTable, List, StatCard, PageShell, EmptyState, Loader, Tag, Banner, …).
- Layout via `<Stack>`, `<Cluster>`, `<ResponsiveGrid>` — not ad-hoc flex/grid divs.
- Inline `style` only for one-off overrides via `--uxm-{component}-*` vars or layout sizing the library doesn't expose.
- JSDoc comments on all function signatures and complex types
- Functions under 50 lines; no premature abstractions (wait for 3+ use sites)

### Error Handling

- TanStack Query error boundaries for API failures
- Toast notifications via the library's own toast API — `import { Toaster, toast } from '@viax.io/uxm/ui'`, mount `<Toaster position="top-right" max={5} />` ONCE at the app root, then call `toast.error(...)` / `toast.success(...)`. Do **NOT** add `sonner`: `@viax.io/uxm` already ships its own `Toast`/`Toaster`/`toast`, and a second toast system violates the "never duplicate a primitive" rule
- `<Loader>` for in-flight queries, `<EmptyState>` for zero-result lists — not spinners or hand-rolled skeletons
- 401 response: call `keycloak.logout()` from `lib/keycloak.js` — Keycloak redirects to its login page and clears the session

---

## Implementation Order

Build in this exact sequence:

1. **Project scaffold** — Vite + React 19; install `@viax.io/uxm` + deps; import `@viax.io/uxm/tokens.css` and `@viax.io/uxm/ui.css` once in `main.jsx`; add the Inter Google-Fonts `<link>` to `index.html` (Gotcha #6); jsconfig paths. **Portal identity stamp (General Note #4, mandatory):** generate `{{PORTAL_ID}}` via `openssl rand -hex 4`, write the `"portal"` block into `package.json`, add the `__PORTAL_META__` `define` to `vite.config.js`, and the `stampPortalId()` boot call in `main.jsx`.
2. **Theme system** — `globals.css` with the **full baseline from "UXM Layout & Styling Gotchas → Required `globals.css`"** (panel-radius unification, DetailSection padding override, InputWithIcon icon clamp, the **mandatory `:root { --font-sans: var(--font-inter, …) }` bridge**, the `html, body, #root` font chain `var(--brand-font, var(--font-sans))` that depends on it, and the **mandatory `button, input, select, textarea { font: inherit }` rule** — ship the bridge or the entire portal renders in Times New Roman; ship the form-control rule or every raw native control renders in Arial). **Do NOT redeclare `--color-accent*` in `globals.css`** — the UXM Studio config is the single source of truth for the accent ramp (see the SSOT note under Runtime Theming). **No hand-built admin theme editor / `ThemeProvider`** — runtime theming is the published UXM Studio config (consumed always; editor optional, step 10). Create the **consume-side** studio-plumbing files now (`lib/uxm-studio-config.js`, the **read** `lib/api/config.js` helpers `fetchUxmConfig`/`fetchStudioConfig`/`fetchPortalAssignment`/`fetchAppliedStudioConfig`, `components/layout/uxm-config-applier.jsx`, `hooks/use-hydrate-studio-config.js`), mount `<UxmConfigApplier/>` at the App root, and call `useHydrateStudioConfig()` in `App`. **Only when `{{EMBED_UXM_STUDIO}} = yes`** also create `lib/uxm-persistence.js` and add the `saveUxmConfig`/`saveStudioConfig` write helpers (deferred to step 10). **Only when `{{THEME_PICKER}} = yes`** also create `lib/theme-catalog.js` + `stores/theme-store.js` and repoint `use-hydrate-studio-config.js` to call `useThemeStore.getState().loadThemes()` (see *"Optional: read-only theme picker"* under Runtime Theming) — the header trigger itself is wired in step 4.
3. **Auth system** — `lib/keycloak.js` singleton, `main.jsx` init flow, `auth-store`, `ProtectedRoute`, login page (mock + real Keycloak — built with `Card` + `FormField` + `TextInput`/`PasswordInput` + `ButtonPrimary` + `Banner` (NOT `Alert` — it was removed in @viax.io/uxm 2.0.0))
4. **Shell layout** — `<PageShell>` + `<AppSidebar linkAs={RouterLink}>` + `<AppTopBar>`; use `useAuthStore()` for user/avatar; `useUser()` populates roles for sidebar visibility. **Only when `{{THEME_PICKER}} = yes`:** add `<ThemePicker />` inside `<AppTopBar actions>`, **after** the light/dark toggle.
5. **Mock data** — Realistic data for all entity types using real viax field names
6. **Dashboard** — `<PageHeader>` + `<StatCard>` × 4 + recharts charts in `<Card>` + `<DataTable>` for Recent orders (no Card wrapper — Gotcha #1) + `<Checkbox>`-driven Tasks (Gotcha #3) + Quick links Card (mock data)
7. **BEM discovery** — Query active BEM via MCP (`get_type` + `execute_query`); call `get_type` on each discovered BI type to resolve interfaces; populate `bi-types.config.js`; build `<BiListPage>` and `<BiDetailPage>` shared templates using `<DataTable>`, `<PageHeader>`, `<InlineFilter>`, `<TimelineEntry>`, `<PropertyGrid>`; scaffold one thin page pair per `BI_TYPES` entry; populate sidebar `navItems` from `BI_TYPES`
8. **Products** — `<DataTable>` with 5 columns (image `<Thumbnail>`, name, ID, description, categories `<Tag>`s); **no `<Card>` wrapper** (Gotcha #1). Detail page via `<DetailSection>` + `<PropertyGrid>` rendered directly.
9. **Account** — top `<Card>` for the Avatar identity row; each section (Addresses, Notifications, Security) as a bare `<DetailSection>` — **no `<Card>` around DetailSection** (Gotcha #1). Wire to `useAuthStore(s => s.user)`.
10. **Admin index (+ UXM Studio editor only if `{{EMBED_UXM_STUDIO}} = yes`)** — Admin index uses `<DataTable>` for the section list (Gotcha #2: Users / Integrations "coming soon", **no Theme row**). **Always** wire the host light/dark toggle in `<AppTopBar>` and the brand-driven sidebar logo (subscribe to `uxm-studio-config`). **Only when `{{EMBED_UXM_STUDIO}} = yes`:** create `lib/uxm-persistence.js` + the `saveUxmConfig`/`saveStudioConfig` write helpers, import `@viax.io/uxm/studio.css` in `main.jsx`, build the UXM Studio page (`src/pages/uxm/UxmStudioPage.jsx`) mounting `<UxmApp embed persistence={createConfigRepoPersistence()} />`, register `/uxm` in the router, and add the "UXM Studio" item under the **Settings** sidebar group. See [Runtime Theming](#runtime-theming--consume-the-uxm-studio-config-optionally-embed-the-editor-at-uxm).
11. **Polish** — `<Loader>` / `<EmptyState>` for all data-fetching pages, error boundaries, `<Toaster/>` + `toast.*()` from `@viax.io/uxm/ui` (no sonner), responsive (`<ResponsiveGrid>` does most of the work)
12. **Font smoke-check (MANDATORY — do not skip).** Before declaring the build done, verify the typography wiring survived generation. In the running app (DevTools → Computed → `font-family`), or by inspecting the built files, confirm ALL of:
    - `globals.css` contains the `:root { --font-sans: var(--font-inter, …) }` bridge, the `html, body, #root { font-family: var(--brand-font, var(--font-sans)) }` chain, and `button, input, select, textarea { font: inherit }`.
    - `index.html` contains the Inter Google-Fonts `<link>` (Gotcha #6).
    - Computed `font-family` on `<body>` is Inter (or the published brand font) — **never a serif**. Serif body text → the bridge is missing.
    - Computed `font-family` on a native `<button>`/`<input>` matches the body — **never Arial/Helvetica**. Arial controls → the `font: inherit` rule is missing.
    - Sans-serif but not Inter → the `index.html` `<link>` is missing.
    If any check fails, fix `globals.css`/`index.html` from the Gotcha #5/#6 baselines verbatim — do not improvise alternative font declarations.

---

## Package Dependencies

Ensure these are installed (no shadcn/Tailwind):

```json
{
  "engines": { "node": ">=20" },
  "portal": {
    "id": "{{PORTAL_ID}}",
    "generator": "viax-build-portal",
    "client": "{{CLIENT_NAME}}",
    "realm": "{{REALM}}",
    "env": "{{ENV}}",
    "generatedAt": "{{GENERATED_AT}}"
  },
  "dependencies": {
    "react": "^19.x",
    "react-dom": "^19.x",
    "react-router-dom": "^6.x",
    "keycloak-js": "^24.x",
    "@tanstack/react-query": "^5.x",
    "@viax.io/uxm": "^4.15.0",
    "axios": "^1.x",
    "zustand": "^4.x",
    "recharts": "^2.x"
  },
  "devDependencies": {
    "vite": "^5.x",
    "@vitejs/plugin-react": "^4.x"
  }
}
```

**`.npmrc` (optional — at portal root):**

```
engine-strict=true
```

Then `npm install`, followed by `npm i @viax.io/uxm@latest` to pull the newest build (the `^4.15.0` above is an illustrative floor — `@latest` overwrites it with whatever is current). Do **not** run `npx shadcn@latest init` — `@viax.io/uxm` replaces shadcn entirely.