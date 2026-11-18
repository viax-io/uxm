# viax Customer Portal — Claude Code Build Prompt

---

## ⚙️ Client Configuration Variables

> Every `{{PLACEHOLDER}}` in this document is replaced with the value confirmed in the portal skill's
> Step 3 before any instruction is acted on. Nothing here is pre-filled for a specific environment.

| Variable | Description | Value |
|---|---|---|
| `CLIENT_NAME` | Display name for the portal (title case) | `{{CLIENT_NAME}}` |
| `CLIENT_NAME_LOWER` | Lowercase version for copy/brand voice | `{{CLIENT_NAME_LOWER}}` |
| `CLIENT_SLUG` | URL/folder-safe slug | `{{CLIENT_SLUG}}` |
| `REALM` | Keycloak realm name | `{{REALM}}` |
| `ENV` | viax environment | `{{ENV}}` |
| `CLIENT_ID` | OAuth client ID | `{{CLIENT_ID}}` |
| `AUTH_URL` | Keycloak base URL | `{{AUTH_URL}}` |
| `API_URL` | viax GraphQL endpoint | `{{API_URL}}` |
| `SCHEMA_API` | bcore Schema API version of the environment (`v1`/`v2`), derived in Step 3 | `{{SCHEMA_API}}` |
| `GITHUB_REPO` | Target GitHub repository — blank = scaffold locally | `{{GITHUB_REPO}}` |
| `PORTAL_SUBDIR` | Subdirectory within the repo | `{{PORTAL_SUBDIR}}` |
| `EMBED_UXM_STUDIO` | Embed the UXM Studio editor at `/uxm`? (`yes`/`no`) — `no` = consume the env's published config only | `{{EMBED_UXM_STUDIO}}` |
| `THEME_PICKER` | Read-only theme picker in the header? (`yes`/`no`) | `{{THEME_PICKER}}` |
| `LOCALIZATION` | Build the i18n layer? (`yes`/`no`) — `no` = English-only portal, steps 3 and 14 skipped | `{{LOCALIZATION}}` |
| `PORTAL_ID` | Unique portal identifier, `vx-{CLIENT_SLUG}-{8 hex}` — suffix generated at build time via `openssl rand -hex 4`, never hand-invented | `{{PORTAL_ID}}` |
| `GENERATED_AT` | Generation date, `YYYY-MM-DD` | `{{GENERATED_AT}}` |

---

## Project Overview

Build a **customer-facing portal** for **{{CLIENT_NAME}}** on the viax revenue orchestration platform (realm `{{REALM}}`, environment `{{ENV}}`). This portal is a fully authenticated, multi-tenant B2B application where customers log in and interact with their business transactions, products, and account information — all backed by viax's GraphQL API.

The portal ships with four **fixed pages**: Dashboard, Products, Account, and Admin — plus a fifth, **UXM Studio** (`/uxm`), only when `{{EMBED_UXM_STUDIO}} = yes` (off by default). All additional transactional pages (orders, invoices, subscriptions, etc.) are **dynamically scaffolded** at generation time by introspecting the active Business Interaction Execution Model (BEM) of the `{{REALM}}` realm via the MCP server — see [BI Types & Dynamic Route Generation](#bi-types--dynamic-route-generation) and the [`viax-bem-discovery`](../../viax-bem-discovery/SKILL.md) skill.

The design language features a **greyscale/neutral palette**, clean typography, generous whitespace, rounded cards, and subtle shadows. The portal supports **runtime theming** by always loading the published **UXM Studio** config (the UXM config's `uxmStudio` key) on boot via `getUxmConfig` and applying it portal-wide through a generated global stylesheet — styles are authored in the standalone, env-bound UXM Studio app. **Embedding that editor inside the portal at `/uxm` is optional and off by default** (`{{EMBED_UXM_STUDIO}}`); there is no custom theme panel to build either way — see [Runtime Theming](#runtime-theming--consume-the-uxm-studio-config-optionally-embed-the-editor-at-uxm).

**Repository:** `{{GITHUB_REPO}}` (blank = scaffold locally)
**Subdirectory:** All portal code lives in `{{PORTAL_SUBDIR}}` — wipe existing contents and start fresh, under the
**wipe guard** in the portal skill's Step 4 (never the repository root, the home directory or a
non-portal directory without asking).

---

## General Notes

> These rules apply globally across the entire portal implementation.

1. **Authorization header on every GraphQL request** — Every request to the viax GraphQL API must include the Keycloak access token as a Bearer token in the `Authorization` header:
   ```
   Authorization: Bearer <session.accessToken>
   ```
   This is enforced by the Axios request interceptor in `lib/graphql-client.js` ([`viax-keycloak-auth`](../../../ui-layers/viax-keycloak-auth/SKILL.md), rule 5). No GraphQL call should bypass this interceptor.

2. **Dev server port** — The development server must be configured to start on **port 9000**. Set in `vite.config.js` under `server.port`:
   ```javascript
   // vite.config.js
   export default defineConfig({ server: { port: 9000 } })
   ```

3. **Products listing layout** — The `/products` listing page must display products as **horizontal line items** (not a grid). Each item is a full-width row containing: product image on the left, then name, ID, description, and category. Use a consistent image placeholder when no image URL is available.

4. **Portal identity stamp (MANDATORY)** — the three pieces (the `portal` block in `package.json`,
   `__PORTAL_META__` through Vite's `define`, the boot stamp), how to read the ID back and the build
   check are owned by [`viax-uxm-theming`](../../viax-uxm-theming/SKILL.md) → *App identity — the
   `portal` block*. The portal's values:

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

   `vite.config.js` adds `define: { __PORTAL_META__: JSON.stringify(pkg.portal ?? null) }` next to
   `server: { port: 9000 }`; `stampPortalId()` is in the portal's `main.jsx` under *Authentication*.
   `generator: "viax-build-portal"` is what the wipe guard (portal skill, Step 4) looks for. Before
   calling the build done: `npm run build && grep -o "{{PORTAL_ID}}" dist/assets/*.js` must match.

---

## Tech Stack

| Concern | Tool |
|---|---|
| Framework | Vite + React 19 (CSR SPA) |
| Routing | React Router v6 |
| UI Components | **`@viax.io/uxm`** — Viax UXM React primitive library (76 BEM-classed components). **Do NOT** use shadcn/ui, Tailwind, or any other UI library. |
| Styling | Plain CSS — design tokens from `uxm/tokens.css` (`--color-*`). Layout via `<Stack>`, `<Cluster>`, `<ResponsiveGrid>` primitives. No Tailwind. Inline `style` for one-off tweaks. |
| HTTP Client | Axios — one client and `execute()`, the [`viax-graphql-data-layer`](../../../ui-layers/viax-graphql-data-layer/SKILL.md) layer |
| Server State | TanStack Query v5 |
| URL State | React Router `useSearchParams` |
| Client State | Zustand |
| Auth | keycloak-js (OAuth 2.0 OIDC, browser-only) — the [`viax-keycloak-auth`](../../../ui-layers/viax-keycloak-auth/SKILL.md) layer |
| Language | JavaScript (ES2024+, JSX) |
| Localization | **Only when `{{LOCALIZATION}} = yes`.** Portal-owned locale files — generated `src/i18n/locales/*.json` are the single source of UI copy, wrapped in `UxmLocaleProvider` from `uxm/ui` for formatting. Entity data (`maName`, `bpStatus.name`, …) is localized by the server from the `X-Viax-User-Locale` header and needs nothing else. **Do NOT** add i18next, react-intl, LinguiJS or any other i18n runtime — the whole topic is the [`viax-localization`](../../../ui-layers/viax-localization/SKILL.md) skill. |

### `@viax.io/uxm` — required UI library

Every UI primitive comes from `@viax.io/uxm`. Two skills govern it, and this MetaPrompt restates
neither:

- **[`viax-uxm-conventions`](../../viax-uxm-conventions/SKILL.md) — the source of truth for how the
  UI is built.** The one rule (shipped atoms + tokens only: no hand-rolled replica of an atom, no
  invented token, no hard-coded colour, sentence-case labels, real glyphs), the reusable patterns
  (listing shell, flexpanes, status maps), the composition gotchas (no `Card` around a
  `DataTable` / `DetailSection`, columns mean `DataTable`, …), spacing, responsive, and the host
  stylesheet. Read it before writing the first component.
- **[`viax-uxm`](../../viax-uxm/SKILL.md) — the library facts.** Component catalog and props,
  tokens, quick-recipes, and its *Hard rules* (prop shapes, imports through the `uxm` alias, no
  `uxm/previews` in app code).

The portal is the app that conventions pairs with: this MetaPrompt supplies only the
realization — the stylesheet values (*Portal stylesheet and fonts* below), the shell and the page
specs.

### Installing `@viax.io/uxm` — as the `uxm` alias

`@viax.io/uxm` is published on public npm — no registry configuration required. It is installed under the **`uxm` alias** (`"uxm": "npm:@viax.io/uxm@^4.40.1"` in `package.json`), and every import in the generated portal reads `uxm/…` — the real package name appears in that one dependency line only, so a version bump or a rename never touches app code.

Install via `npm i uxm@npm:@viax.io/uxm@latest`. **Always install `@latest`** so the portal picks up the newest Studio/SCSS build; npm pins the resolved version (a caret range like `^4.15.0`) into `package.json` for you — the version shown in the dependency list below is only an illustrative floor, not a number to hardcode.

---

## Environment Variables

Create `.env.local` with exactly these variables (Vite exposes only `VITE_`-prefixed vars to the browser):

```properties
VITE_REALM={{REALM}}
VITE_ENV={{ENV}}
VITE_CLIENT_ID={{CLIENT_ID}}
VITE_AUTH_URL={{AUTH_URL}}
VITE_API_URL={{API_URL}}
VITE_SCHEMA_API={{SCHEMA_API}}
VITE_USE_MOCK_AUTH=false
VITE_USE_MOCK_DATA=false
```

Access them in code via `import.meta.env.VITE_*`.

Also create `.env.example` as a copy for reference.

---

## Authentication

**This whole topic lives in its own skill: [`viax-keycloak-auth`](../../../ui-layers/viax-keycloak-auth/SKILL.md).**
Read it and follow it — the `keycloak-js` singleton, `onLoad: 'login-required'` (Keycloak's form
*is* the login screen, so the portal ships no login page and no `/login` route), the mandatory
`checkLoginIframe: false` + refresh interval, the in-memory auth store without roles,
`ProtectedRoute`, the Bearer interceptor and the 401 handler, sign-out, mock auth as a Vite mode,
and the realm checks (OIDC discovery, the client's redirect URIs). Copy its
[`reference-implementation.md`](../../../ui-layers/viax-keycloak-auth/references/reference-implementation.md);
do not re-derive any of it here.

The portal-specific decisions this MetaPrompt adds on top:

- **Values.** `VITE_AUTH_URL={{AUTH_URL}}`, `VITE_REALM={{REALM}}`, `VITE_CLIENT_ID={{CLIENT_ID}}`
  (see *Environment Variables*); the mock user's e-mail is `mock@{{CLIENT_SLUG}}.example`.
- **Mock mode.** Ship `.env.mock.local` / `.env.mock.example` and the `dev:mock` script
  (`vite --mode mock`) from the skill.
- **Dev port.** The portal runs on port 9000 (General Note #2). Before the first login, run the
  skill's redirect-URI check for `http://localhost:9000/` against `{{CLIENT_ID}}`; a 400 is a
  realm setting to report, not something to work around.
- **Sign-out** sits in `<AppTopBar actions>` (order under *Localization & i18n → Header order*),
  and drops the viax-access probe cache before `keycloak.logout()`.
- **`main.jsx`** is the skill's entry point plus the portal's stylesheets and the identity stamp
  (General Note #4) — this is the full file. When `{{EMBED_UXM_STUDIO}} = yes`, also import
  `uxm/studio.css` right before `globals.css` (so the studio's `:root` brand defaults sit under the
  portal's base); when `no`, the file is exactly as below.

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import 'uxm/tokens.css'
import 'uxm/ui.css'
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
    await keycloak.init({
      onLoad: 'login-required',
      pkceMethod: 'S256',
      checkLoginIframe: false,      // MANDATORY — see viax-keycloak-auth, rule 2
    })
    useAuthStore.getState().syncFromKeycloak(keycloak)
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

The auth store holds **no roles**; what a user may see is answered by the API at runtime — see
*"Access & permissions"*.

---

## Design System

Use **`@viax.io/uxm`'s canonical `--color-*` design tokens** as the source of truth. They're declared on `:root` by `uxm/tokens.css` and themed centrally — every component re-tints automatically when a token changes.

See [`viax-uxm/references/design-tokens.md`](../../viax-uxm/references/design-tokens.md) for the full catalogue. Quick summary:

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

### Reference Aesthetic

Inherits directly from `@viax.io/uxm`:
- **Surfaces** — `--color-surface` page bg, `--color-card` rows/cards with `<Card shadow>`.
- **Accent** used sparingly for primary CTAs (`<ButtonPrimary>`), active sidebar/nav items, indicators.
- **Typography** — Inter by default (Google-Fonts `<link>` in `index.html` + the `html, body, #root` font chain and the `button, input, select, textarea { font: inherit }` rule in `globals.css` — see the baseline below); the portal-wide typeface is **brand-controlled**: UXM Studio → Brand Settings → **Typography** sets `brand.fontFamily`, and the published config re-fonts the whole portal via `--brand-font` (the applier's generated CSS auto-imports the chosen Google Font). Sizing/weight handled by `@viax.io/uxm` per component.
- **Sidebar** — `<AppSidebar>` (sections + items, polymorphic `linkAs` so react-router does client nav — it must be a `forwardRef` `href` → `to` adapter, never react-router's `Link` itself; see step 5 of [Implementation Order](#implementation-order)).
- **Top bar** — `<AppTopBar search={…} actions={…}>` with `<InputWithIcon>` and `<Avatar>` + `<InlineAction>` sign-out.
- **Dashboard widgets** — `<StatCard>` for counts (no trend), recharts wrapped in `<Card>` for charts, `<DataTable>` for the recent-records feed, `<EmptyState>` / `<Loader>` for empty/loading — every value from the API (see *Page Specifications → Dashboard*).

### Portal stylesheet and fonts

The rules are [`viax-uxm-conventions`](../../viax-uxm-conventions/SKILL.md) → *The host
stylesheet*: `viax-uxm`'s baseline, then only `--uxm-*` knobs on `:root` — **no `.uxm-*`
selector and no `--color-*` declaration** in portal CSS. Below are the portal's values; ship them
on the first pass.

**1. `src/styles/globals.css`** — the full file:

```css
/* src/styles/globals.css — loaded AFTER uxm/tokens.css and uxm/ui.css.
   Baseline: viax-uxm quick-recipes § 0. Knob values: this portal's.
   No .uxm-* selectors, no --color-* declarations (viax-uxm-conventions). */

/* The library ships no global reset; several atoms size themselves assuming one. */
*, *::before, *::after { box-sizing: border-box; }

/* PageShell bounds itself to the viewport and scrolls its content area —
   only if the document has a definite height. */
html, body, #root { height: 100%; }

/* MANDATORY --font-sans bridge. tokens.css declares --font-sans only inside a
   Tailwind-only `@theme inline` block that browsers drop; without this alias the
   whole portal renders in Times New Roman. --font-inter IS in the real :root. */
:root {
  --font-sans: var(--font-inter, 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif);
}

/* Inter by default; a brand font published from UXM Studio wins via --brand-font
   (the applier injects it). Never hardcode another family. */
body { margin: 0; }

/* Page colours from tokens — plain host text (the user name in AppTopBar actions)
   inherits from <body>, which the library never styles: without this it stays
   black in the dark theme. */
body { color: var(--color-text); background-color: var(--color-surface); }
html, body, #root { font-family: var(--brand-font, var(--font-sans)); }

/* Native controls do not inherit the document font (UA default → Arial). */
button, input, select, textarea { font: inherit; }

/* There is no --font-mono token: write var(--font-mono, monospace). */

:root {
  /* Inputs on the card colour, not the grey surface. */
  --uxm-input-with-icon-bg: var(--color-card);

  /* Shell. */
  --uxm-page-shell-content-padding: 24px 32px;
  --uxm-app-top-bar-height: 72px;
  --uxm-app-top-bar-padding-x: 24px;

  /* One panel radius: Card and DetailSection default to 4px, DataTable is 8px. */
  --uxm-card-radius: 8px;
  --uxm-detail-section-radius: 8px;

  /* DetailSection: hide the 3px accent rail and the gap after it, and bump inner
     padding — left padding then matches the other sides, no class override needed.
     IMPORTANT: both MUST carry a unit (0px, not 0) — the library's padding-left is
     calc(padding + accent-width + accent-gap), which silently fails on a unitless 0. */
  --uxm-detail-section-accent-width: 0px;
  --uxm-detail-section-accent-gap: 0px;
  --uxm-detail-section-padding: 28px;
}
```

When `{{EMBED_UXM_STUDIO}} = yes`, append the studio page's own class (it gives the studio's
`h-full` root a definite height, so its component list and canvas scroll independently instead
of stretching the page); the class is the one on `UxmStudioPage`'s root `<div>`:

```css
.{{CLIENT_SLUG}}-uxm-studio { height: 100%; }
```

**2. Load Inter in `index.html`.**

`uxm/tokens.css` only *references* the Inter family (`--font-inter`) — it bundles no font
file. Without a loader the stack degrades to the system-UI fallbacks inside `--font-inter`
(`system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`) — still sans-serif, just not Inter.

> **Do not confuse that with the Times New Roman failure.** A serif page is a *different* bug: it
> means `--font-sans` itself never resolved, because tokens.css only declares it inside the
> Tailwind-only `@theme inline` block. Loading Inter does **not** fix that — the `:root
> { --font-sans: … }` bridge in the `globals.css` baseline (item 1 above) does. Symptom triage:
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


## Localization & i18n — `{{LOCALIZATION}} = yes`

**This whole topic lives in its own skill: [`viax-localization`](../../../ui-layers/viax-localization/SKILL.md).**
Read it and follow it — the locale files as the single source of UI copy, their shape,
the boot gate, locale resolution and server-side persistence, header propagation, the
`LanguageSwitcher` contract, the library caveats and all currency / date / number formatting
are there, and none of it is portal-specific. Do not re-derive any of it here.

**The user was asked (question 10) and the answer is `{{LOCALIZATION}}`. Honour it.**

### When `{{LOCALIZATION}} = yes`

The portal is localized on first build, and there is no "add i18n later" path inside this
build: a surface generated without the skill has hardcoded English in it, and the
hardcoded-string scan (step 14 of Implementation Order) fails the build.

The portal-specific decisions this MetaPrompt adds on top:

- **Nothing is collected from the user.** The locale list comes from `getSupportedLocales` for
  `{{REALM}}` and is **never hardcoded**, never guessed, and never a config question. Probe it
  at scaffold time with your own credentials — the runtime query is authenticated.
- **Order in the build.** The i18n foundation is **step 3 of Implementation Order — before ANY
  page**. Building a page first guarantees hardcoded strings that step 14 rejects.
- **UI copy vs entity data.** The locale files cover the portal's own chrome only. Product
  names, status labels and category names come back already localized because
  `lib/graphql-client.js` sends `X-Viax-User-Locale` — render them as they arrive, and never
  run the value chain over them or ask for `<field>_Locale_<tag>` variants.
- **File locations.** `src/i18n/{index.jsx,bundled.js,resolve.js,locale-state.js}`
  + `src/i18n/locales/*.json`; headers go in `lib/graphql-client.js`; formatters in
  `lib/utils/format.js` — see [Application Structure](#application-structure).
- **npm scripts to ship.** `gen:locales` (`scripts/gen-locale-files.mjs`), `scan:i18n`
  (`scripts/scan-hardcoded-strings.mjs`), `test:i18n`
  (`node --test scripts/test-locale-resolution.mjs`). No new dependency for any of them.
- **Header order (`<AppTopBar actions>`).** user name → light/dark toggle → `<ThemePicker />`
  (only when `{{THEME_PICKER}} = yes`) → **`<LanguageSwitcher />`** → Sign out. One call site,
  rendered unconditionally — the portal has no pre-login surface, and the atom returns `null`
  by itself at one locale. Lay the actions out in a `<Cluster wrap={false}>` — a wrapping row
  stacks them vertically and spills them out of the 64px bar.
- **`design.md`.** Emit the six localization items the skill lists under *"What `design.md`
  must state"*, alongside the rest of the design notes.

**Every later change to this portal obeys the skill too** — adding a page, a column or a
message adds its keys in the same change (real values in the default locale, the same keys with
`null` elsewhere), and `npm run scan:i18n` is what proves the keys are actually being used.

### When `{{LOCALIZATION}} = no`

The user opted out. **Skip steps 3 and 14 of Implementation Order entirely** and generate none
of it: no `src/i18n/` directory, no `UxmLocaleProvider`, no
`LanguageSwitcher` in `<AppTopBar actions>`, no `X-Viax-User-Locale` / `X-Viax-User-Currency`
headers, and no `gen:locales` / `scan:i18n` / `test:i18n` scripts. Copy is written in English
directly in the JSX.

Three things still hold, and they are what keeps a later retrofit cheap:

- **Money, dates and numbers still go through `Intl`** — `lib/utils/format.js` with a fixed
  `'en-US'`, exactly as specified in the skill's formatting reference. Never `toFixed()` with a
  hand-written separator, never a hardcoded currency, never an amount divorced from its
  `units.code`. This is a correctness rule, not a localization one: it is what stops a JPY total
  growing two decimals it does not have. See *"Formatting when the app is not localized"* in the
  skill.
- **Copy stays out of shared config objects where it is cheap not to.** A `DataTable` column's
  `header` written inline is fine; the point is not to invent a second string layer.
- **`design.md` records the decision** — that the portal is deliberately **not** localized, that
  `getSupportedLocales` for `{{REALM}}` was not consulted, and that adding i18n later is a
  retrofit (the skill's retrofit path), not a config flip.

**If the user later asks to localize this portal**, that is the retrofit path in the
[`viax-localization`](../../../ui-layers/viax-localization/SKILL.md) skill — not a regeneration.

---

## Data layer

**This whole topic lives in its own skill: [`viax-graphql-data-layer`](../../../ui-layers/viax-graphql-data-layer/SKILL.md).**
Read it and follow it — the one client and `execute()` in `lib/graphql-client.js`, `schema-api.js`
(`setTo()`), `normalize.js`, `lib/api/user.js` + `use-user.js`, the mock mode, the query keys, and
the API gotchas (read [`api-gotchas.md`](../../../ui-layers/viax-graphql-data-layer/references/api-gotchas.md)
before writing a query). Copy its
[`reference-implementation.md`](../../../ui-layers/viax-graphql-data-layer/references/reference-implementation.md);
do not re-derive any of it here.

The portal-specific decisions this MetaPrompt adds on top:

- **Values.** `VITE_API_URL={{API_URL}}`, `VITE_SCHEMA_API={{SCHEMA_API}}` (see *Environment
  Variables*); `.env.mock.local` carries the same two.
- **`lib/api/bi.js` — generic over `BI_TYPES`.** Every query is built from a `bi-types.config.js`
  entry (`filter${typeName}`, `get${typeName}`), never written per type. The list:
  `fetchBiList(config, { status, search, first })` → `{ rows, totalCount }` with the status from
  `config.statusField`. The detail page: **one function per section** (viax-access rule 1) —
  `fetchBiHeader`, `fetchBiParties` (one selection per `config.partyFields` entry, a single
  object or a connection as discovered), `fetchBiLineItems` (`hiConsistsOf`), `fetchBiPrice`.
  The rename, emitted only where the access model says `write`: `update${typeName}` with
  `$actions: [Update${typeName}ActionInput!]!` and `[setTo('biName', name)]`.
- **`lib/api/products.js`** — `filterMaterial` / `getMaterial` as in the skill's gotchas;
  category filtering client-side over the loaded page.
- **Hooks.** `use-bi-list.js`, `use-bi-detail.js` (one hook per section, each `enabled` by its
  feature flag), `use-products.js`, `use-user.js`.
- **Mock data** in `lib/mock-data/` for every discovered BI type, products, the user and the
  published UXM config (`uxm-config.js`, viax-uxm-theming) — raw API shapes with the realm's real
  field names, including at least one localized label that is `null` (viax-localization). The portal is fully functional under `npm run dev:mock`
  (access probes answer `allowed` without calling the API).

The business roles from `useUser()` (`parParty.paMappedRolesList`) are **displayed** on the Account
page and decide nothing (viax-access, rule 6).

---

## BI Types & Dynamic Route Generation

> **This step runs during scaffolding** — before generating any transactional page files.

### Step 1 — Discover the BI types from the BEM

**This whole topic lives in its own skill: [`viax-bem-discovery`](../../viax-bem-discovery/SKILL.md).**
Run it through the MCP of the `{{REALM}}` realm (the one Step 3d of the portal skill checked):
ask the user for the BEM (uid or code — never pick one), resolve the code to the right version,
walk the whole tree, drop and report the types that do not exist, read each type's interfaces,
`prParty*` fields and status values, and write `src/lib/bi-types.config.js` and the BEM section of
`design.md` exactly as it says. Do not re-derive any of it here.

What the portal does with the registry:

- `isPriceable` → a Total column on the list, the Price Summary on the detail page;
  `hasLineItems` → the Line Items table; `hasParties` → one `<PartyCard>` per `partyFields` entry;
  `hasStatus` → the Status column, the status filter (from `statusValues`) and the badge;
  `handOffs` → the read-only "Becomes" section of the detail page.
- The page title of each type is `bi.<slug>.title` in the locale files (English literal with
  `{{LOCALIZATION}} = no`) — never a label in the config. Its English text is the copy the discovery
  reports for the type (the BEM spec's `label`, else the type's own label); the same holds for
  `bi.<slug>.description` and the party card titles `bi.party.<role>`.
- Mock data in `lib/mock-data/bi.js` covers every registry entry, with its real field names.

### Step 2 — Scaffold Route Files

**One shared page pair serves every `BI_TYPES` entry** — no per-type page files. The routes are
generated from `BI_TYPES`, and the wrappers delegate to the shared templates.

`src/pages/bi/BiListPage.jsx` and `src/pages/bi/BiDetailPage.jsx`:

```jsx
// src/pages/bi/BiListPage.jsx
import { getBiType } from '@/lib/bi-types.config'
import BiListTemplate from '@/components/bi/bi-list-page'

export default function BiListPage({ slug }) {
  return <BiListTemplate key={slug} config={getBiType(slug)} />
}
```

```jsx
// src/pages/bi/BiDetailPage.jsx
import { useParams } from 'react-router-dom'
import { getBiType } from '@/lib/bi-types.config'
import BiDetailTemplate from '@/components/bi/bi-detail-page'

export default function BiDetailPage({ slug }) {
  const { biId } = useParams()
  return <BiDetailTemplate key={`${slug}-${biId}`} config={getBiType(slug)} biId={biId} />
}
```

`key` resets the template's state when the user moves between two types or two records.

**Register routes** in `src/routes/index.jsx`, inside the protected route group — one pair per
`BI_TYPES` entry, generated:

```jsx
{BI_TYPES.map((type) => [
  <Route key={type.slug} path={`/${type.slug}`} element={<BiListPage slug={type.slug} />} />,
  <Route key={`${type.slug}-detail`} path={`/${type.slug}/:biId`} element={<BiDetailPage slug={type.slug} />} />,
])}
```

### Step 3 — Sidebar Navigation

Build the nav items array from fixed pages + `BI_TYPES`. **Which BI items appear is answered by
the API**, through one access probe per BI type (`filter<Type>(_first: 1) { edges { node { biId } } }`,
cached per session and identity) — see [`viax-access`](../../../ui-layers/viax-access/SKILL.md) rule 3 and its
[`react-uxm.md`](../../../ui-layers/viax-access/references/react-uxm.md) §2–3. Never filter by role names, by
`paMappedRolesList`, or by matching roles against `partyFields`.

```javascript
// src/components/layout/sidebar.jsx (relevant excerpt)
import { Icon } from 'uxm/ui'
import { BI_TYPES } from '@/lib/bi-types.config'
import { useBiTypesAccess } from '@/access/use-access'
import { useT } from '@/i18n'

// Icons are uxm <Icon> glyphs (AppSidebar items take a node) — no lucide or other icon set.
// Use ids from the viax-uxm glyph registry: there is no `dashboard`, `package` or `home`.
export function useNavItems() {
  const t = useT('nav')   // labels are UI copy (with {{LOCALIZATION}} = no, English literals)
  const tb = useT('bi')
  const access = useBiTypesAccess(BI_TYPES) // { [typeName]: 'loading' | 'allowed' | 'denied' | 'error' }

  const NAV_TOP = [
    { href: '/dashboard', label: t('dashboard'), icon: <Icon glyph="grid" /> },
    { href: '/products',  label: t('products'),  icon: <Icon glyph="product" /> },
  ]
  const NAV_BI = BI_TYPES
    .filter((type) => access[type.typeName] === 'allowed') // loading / denied / error → not shown
    .map((type) => ({ href: `/${type.slug}`, label: tb(`${type.slug}.title`), icon: <Icon glyph="business-interaction" /> }))
  const NAV_BOTTOM = [
    { href: '/account', label: t('account'), icon: <Icon glyph="user" /> },
    { href: '/admin',   label: t('admin'),   icon: <Icon glyph="settings" /> },
  ]

  return [...NAV_TOP, ...NAV_BI, ...NAV_BOTTOM]
}
```

> Each BI item appears when its probe answers — never show-then-hide. Under
> `VITE_USE_MOCK_DATA=true` every probe answers `allowed` without calling the API.
> A typed URL is gated the same way: the BI list and detail templates call
> `useBiTypeAccess(config)` and render `<NoAccessPage />` (403) on `denied`
> (see *"Access & permissions"*).

---

## Application Structure

```
{{CLIENT_SLUG}}-portal/
├── index.html                               # Vite entry HTML
├── .env.local
├── .env.example
├── .npmrc                                   # engine-strict=true + @viax.io npm registry override
├── vite.config.js                           # port 9000; define __PORTAL_META__ from package.json "portal" block
├── jsconfig.json
├── package.json                             # incl. "portal" identity block (id, realm, env, generatedAt)
├── src/
│   ├── main.jsx                             # Entry: import uxm/tokens.css + ui.css + globals.css; stampPortalId(); init Keycloak; render React
│   ├── App.jsx                              # Root: QueryProvider + <UxmConfigApplier/> + React Router + Toaster
│   ├── access/                              # viax-access runtime contract — see "Access & permissions"
│   │   ├── errors.js                        # AccessDeniedError + isAccessDenied()
│   │   ├── probe.js                         # filter<Type>(_first: 1) probe — the one place that asks "may I?"
│   │   ├── use-access.js                    # useBiTypeAccess(), useBiTypesAccess() — cached per identity
│   │   ├── write-denials.js                 # session memory of refused mutations / transitions
│   │   └── no-access.jsx                    # NoAccessSection (EmptyState) + NoAccessPage (ErrorPage 403)
│   ├── routes/
│   │   ├── index.jsx                        # Route definitions (React Router v6)
│   │   └── ProtectedRoute.jsx               # Auth guard: token-less → keycloak.login() (no portal sign-in page)
│   ├── pages/
│   │   ├── dashboard/
│   │   │   └── DashboardPage.jsx            # PageHeader + StatCard per BI type + charts + recent headline-type DataTable + quick links
│   │   ├── bi/                              # Shared BI page wrappers (one BiListPage + BiDetailPage handle every slug — BI Types Step 2)
│   │   │   ├── BiListPage.jsx
│   │   │   └── BiDetailPage.jsx
│   │   ├── products/
│   │   │   ├── ProductsPage.jsx             # PageHeader + InlineFilter + DataTable (no Card wrapper, columns mean DataTable — viax-uxm-conventions)
│   │   │   └── ProductDetailPage.jsx        # PageHeader + DetailSection + PropertyGrid
│   │   ├── account/
│   │   │   └── AccountPage.jsx              # PageHeader + <Card> (Avatar row only) + bare <DetailSection> × N (no Card around DetailSection — viax-uxm-conventions)
│   │   ├── admin/
│   │   │   └── AdminPage.jsx                # PageHeader + DataTable of sections (viax-uxm-conventions)
│   │   └── uxm/
│   │       └── UxmStudioPage.jsx            # <UxmApp embed persistence={localStorage}/> — the MODO style editor
│   ├── components/
│   │   ├── layout/
│   │   │   ├── uxm-config-applier.jsx       # generateOverridesCss(config) → global <style id="uxm-overrides"> + favicon
│   │   │   ├── theme-picker.jsx             # OPTIONAL ({{THEME_PICKER}}=yes): header trigger + Listbox dropdown, select-only
│   │   │   └── shell.jsx                    # PageShell + AppSidebar (linkAs = forwardRef href→to adapter, NOT bare RouterLink) + AppTopBar + light/dark toggle
│   │   ├── dashboard/
│   │   │   ├── activity-chart.jsx           # recharts LineChart in <Card>: records created per month (a count)
│   │   │   ├── status-donut.jsx             # recharts PieChart in <Card>: root type by status
│   │   │   └── value-by-currency.jsx        # <Card> + <PropertyGrid>: headline type's TOTAL, one line per currency
│   │   ├── detail/
│   │   │   ├── line-items.jsx               # heading + <DataTable> (no Card wrapper — viax-uxm-conventions)
│   │   │   ├── party-card.jsx               # <Card> + <Cluster> (NOT Stack+flexDirection:row — viax-uxm rule 9) of <Avatar> rows
│   │   │   └── price-summary.jsx            # <Card> + <PropertyGrid> (PropertyField children, not value= — viax-uxm rule 6) + <Divider>
│   │   ├── bi/
│   │   │   ├── bi-list-page.jsx             # PageHeader + InlineFilter + DataTable + Loader/EmptyState (feature-flagged)
│   │   │   └── bi-detail-page.jsx           # BackLink (needs href — viax-uxm rule 10) + PageHeader (inline meta only — viax-uxm rule 7) + LineItems + Timeline + PartyCard + PriceSummary (feature-flagged)
│   │   └── shared/
│   │       ├── status-badge.jsx             # Maps status → <Tag type="…">
│   │       ├── money-display.jsx
│   │       └── date-display.jsx
│   ├── i18n/                                  # ONLY when {{LOCALIZATION}} = yes
│   │   ├── index.jsx                        # I18nProvider + useT(page) + useLocale(); wraps <UxmLocaleProvider>
│   │   ├── bundled.js                       # the bundled locale files + BUNDLED_LOCALES (copy source + fallback list)
│   │   ├── resolve.js                       # locale resolution (server prefs → browser → default) → { locale, source }; no stored link
│   │   ├── locale-state.js                  # module-level locale/currency the graphql client reads
│   │   └── locales/
│   │       ├── en-US.json                   # GENERATED, fully populated (configured default locale)
│   │       └── {each getSupportedLocales entry}.json   # GENERATED, same key set, null values
│   ├── lib/
│   │   ├── keycloak.js                      # Keycloak singleton instance
│   │   ├── graphql-client.js                # + X-Viax-User-Locale / -Currency headers when {{LOCALIZATION}} = yes (headers only — no `_locale` arg)
│   │   ├── uxm-studio-config.js             # live { overrides, brand } store: localStorage cache + pub/sub + brand seed
│   │   ├── theme-catalog.js                 # OPTIONAL ({{THEME_PICKER}}=yes): pure read-only helpers over uxmStudio's themes[]
│   │   ├── uxm-persistence.js               # StudioPersistence adapter: load→live store, save→server (saveUxmConfig)+mirror
│   │   ├── bi-types.config.js               # AUTO-GENERATED: BI type registry from BEM
│   │   ├── api/
│   │   │   ├── schema-api.js                # viax-graphql-data-layer: SCHEMA_API + setTo() (v1/v2 writes)
│   │   │   ├── normalize.js                 # viax-graphql-data-layer: rows, prices by mapsOn.code, totalOf, regexLiteral
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
│   │   ├── use-bi-detail.js                 # BI detail: one hook per guarded section (header, parties, items, price)
│   │   ├── use-products.js
│   │   ├── use-parties.js
│   │   ├── use-user.js
│   │   └── use-hydrate-studio-config.js     # boot: server uxmStudio config → live store (one-shot)
│   ├── stores/
│   │   ├── auth-store.js                    # accessToken + user { id, name, email } from Keycloak (in-memory; no roles)
│   │   └── theme-store.js                   # OPTIONAL ({{THEME_PICKER}}=yes): selectedThemeId (1 localStorage key) + loadThemes/selectTheme
│   ├── types/
│   │   ├── api.js                           # JSDoc typedefs for GraphQL responses
│   │   └── entities.js                      # JSDoc typedefs for domain entities
│   └── styles/
│       └── globals.css                      # "Portal stylesheet and fonts" §1, verbatim — plain CSS, no SCSS / CSS modules
```

---

## Page Specifications

### Dashboard (`/dashboard`)

No business KPIs were specified for the portal, so the dashboard shows **what the API can state
about the user's records — and nothing else**. Every number on it is read from the API at runtime
(or from the mock files in `dev:mock`, through the same code path). It is built from the registry,
like the BI pages: a BEM with other types gets a different dashboard with no code change.

**Never on the dashboard:** a trend arrow or percentage (the API returns no history to compare
against — `StatCard`'s `trend` / `trendDirection` stay unset), a card for a type the BEM does not
have ("Active subscriptions" on a BEM without subscriptions), a sum across currencies, a hard-coded
route (`/orders/{id}`), a placeholder number, or a to-do list the portal invents. If something here
cannot be filled from the data, leave it out rather than fill it.

**Data.** One `fetchBiList(config, { first: 200 })` per BI type whose access probe answered
`allowed` — each its own query (`useQueries`), so a denial empties only its own widget (viax-access
rule 1); a denied type is simply absent. All widgets below compute from these rows.

**The headline type** is the type the root becomes: `BI_TYPES[1]` — the registry is in tree order,
so that is the root's first relation (OBI_PRO: the order after the quote) — or `BI_TYPES[0]` when the
BEM has one type. Pick it in code from the registry, never by a slug literal, and record it in
`design.md`.

**Header:** `<PageHeader>` with "Hi, {firstName}!" from `useAuthStore(s => s.user.name)`
(`dashboard.title` when there is no name) and a one-line subtitle.

**Counts row:** one `<StatCard>` per readable BI type, in registry order, in a
`<ResponsiveGrid min="200px">` — label `bi.<slug>.title`, value the list's `totalCount` through
`Intl.NumberFormat`. No trend.

**Charts row** — each in a `<Card shadow>`, recharts colours from tokens
(`var(--color-accent)`, `var(--color-success-text)`, …), never a hex:

- **Records created per month** — the last 6 calendar months (UTC), a line of the count of loaded
  rows by `biCreatedAt`, month labels through `Intl.DateTimeFormat(locale, { month: 'short' })`. A
  count, not money. When a type's `totalCount` exceeds the rows loaded, the caption says the chart
  covers the loaded records (`dashboard.activity.partial`).
- **`<root type>` by status** — a donut of the root type's loaded rows grouped by `bpStatus.code`,
  labelled with the server's `bpStatus.name` (entity data — never translated in the locale files).
  Only when the root type `hasStatus`.
- **`<headline type>` value by currency** — only when the headline type `isPriceable`: the sum of
  each row's `TOTAL` price, **one line per currency** (`units.code`), each formatted in its own
  currency, as a `<PropertyGrid>` of `<PropertyField label="EUR">`… Never one grand total across
  currencies (viax-localization → formatting); rows without a TOTAL are left out and the caption
  says how many were counted.

**Recent `<headline type>`** — a heading and a `<DataTable>` (no `<Card>` wrapper) of its 5 newest
loaded rows, sorted by `biCreatedAt` client-side (`filter*` has no `_sort`). Columns: `ID`
(monospace, muted), `Name`, `Status` (`<StatusBadge>`, when `hasStatus`), `Total` (right-aligned,
when `isPriceable`). `onRowClick` → `/${slug}/${biId}`. `<NoAccessSection />` on denial,
`<EmptyState>` when there are none.

**Quick links** — a `<Card shadow>` of buttons to real routes only: one per readable BI type
(`<ButtonPrimary>` for the headline type, `<ButtonSecondary>` for the rest), then Products.

### BI List Pages (BEM-Generated)

One list page per `BI_TYPES` entry in `bi-types.config.js`. All share the `<BiListPage config={config} />` template — behavior is driven by feature flags on the config object:

- Page title `bi.<slug>.title` (UI copy — the registry has no labels); a "Create New" button **only** where the access model (design.md) says `write` for `create{TypeName}` — otherwise none. A refused create shows `toast.error` and records the denial (viax-access rule 4)
- Route gate: `useBiTypeAccess(config)` — `loading` → `<Loader>`, `denied` → `<NoAccessPage />`
- Filters bar (`<InlineFilter>`): search (`<InputWithIcon>`), status filter (`<FormField>` + `<Select>` if `config.hasStatus`) — all synced to URL via React Router `useSearchParams`
- `<DataTable>` with typed columns; clicking a row (`onRowClick`) navigates to `/{slug}/{biId}`
- **Base columns** (always): ID (`biId`), Name (`biName`), Created date (`biCreatedAt`)
- **`config.hasStatus`** (false only for a type with no status values): add Status column displaying `bpStatus` with `<StatusBadge>`; status filter dropdown is populated from `config.statusValues` (from `get{TypeName}StatusValues` — [`viax-bem-discovery`](../../viax-bem-discovery/SKILL.md) Step 5). Query as `bpStatus { code }` and normalize to `biStatus: node.bpStatus.code` in the data layer. Filter string uses the raw field name: `_filter: "bpStatus = 'Active'"`.
- **`config.isPriceable`**: add Total Amount column — query via `pricPrice { edges { node { amount units { code } } } }` and normalize to `[{ amount, currency }]` in the data layer (where `currency = units.code`)

Data is fetched via `useBiList(config)` hook → `lib/api/bi.js` → `filter{config.typeName}` GraphQL query.

### BI Detail Pages (BEM-Generated)

One detail page per `BI_TYPES` entry. All share the `<BiDetailPage config={config} biId={biId} />` template — sections are conditionally rendered by feature flags:

- Back button — `<BackLink href="/{config.slug}" onClick={(e) => { e.preventDefault(); navigate(-1) }}>` (always pass a real `href`, not just `onClick` — viax-uxm rule 10), `biId`, `biName`, Created / Completed dates (always). Render `biId`/dates via `<PageHeader meta={<>…</>}>` — **inline content only**, never a `Stack`/block element (viax-uxm rule 7).
- **`config.hasStatus`**: Status badge
- **`config.hasParties`**: Party cards — one `<Card>` per `config.partyFields` entry, each an avatar+name row laid out with `<Cluster>` (not `<Stack style={{flexDirection:'row'}}>` — viax-uxm rule 9); a `required` entry without a party shows an empty card, not an error. The card's title is UI copy, `bi.party.<role>` (`role` from the registry; the field name where the entry has no `role`)
- **`config.handOffs`** (non-empty): a read-only "Becomes" section — one row per hand-off: the target type(s) by their `bi.<slug>.title`, linked to their list pages, what they are (`kind`: made from it, made from its lines, linked to it) and how (`ONE` one record, `LINE` one per line, `GROUP` by `splitField`). The hand-off itself runs in the lifecycle ([`viax-bem-discovery`](../../viax-bem-discovery/SKILL.md) Step 6), never from the portal
- **`config.hasLineItems`**: Line items table — quantity, product, unit price
- **`config.isPriceable`**: Price summary card — subtotal, discount, tax, freight, **total**, each rendered via `<PropertyField label="…">{value}</PropertyField>` (value as children, never a `value` prop — viax-uxm rule 6)
- Status / event timeline (always)

Route gate as on the list page (`useBiTypeAccess(config)` → `<NoAccessPage />` on `denied`).

**One query per guarded section** (viax-access rule 1 — a denied connection returns `data: null` for the whole operation, so one combined query would blank the page). `lib/api/bi.js` exposes one `get{config.typeName}` query per section, each selecting only that section's fields, and `hooks/use-bi-detail.js` one hook per section:

| Hook | Fields | On `AccessDeniedError` |
|---|---|---|
| `useBiHeader(config, biId)` | `biId biName biCreatedAt biCompletedAt bpStatus { code }` (+ timeline) | `<NoAccessPage />` — without the header there is no page |
| `useBiParties(config, biId)` | the `partyFields` | `<NoAccessSection />` in place of the party cards |
| `useBiLineItems(config, biId)` | `hiConsistsOf …` | `<NoAccessSection />` in place of the table |
| `useBiPrice(config, biId)` | `pricPrice …` | `<NoAccessSection />` in place of the price summary |

Every value is read-only (`<PropertyField>`) by default; an inline editor or workflow action is emitted only where the access model says `write`, with denial handling (viax-access rule 4–5).

### Products (`/products`)

- `<DataTable>` (not `<List>` — products have columns; see viax-uxm-conventions). No `<Card>` wrapper (viax-uxm-conventions).
- **Columns:** Image (`<Thumbnail>` with `style={{ '--uxm-thumbnail-size': '36px', '--uxm-thumbnail-border-radius': '6px' }}`, fallback `<Icon glyph="image" />`), Name (medium weight), ID (monospace, muted), Description (muted), Categories (right-aligned `<Cluster>` of `<Tag type="neutral" size="small">`).
- `onRowClick` navigates to `/products/{maId}`.
- Above the table: `<PageHeader>` + `<InlineFilter>` (search via `<InputWithIcon>` + category `<Select>` in a `<FormField labelPosition="side">`).
- Detail page with full product info (`<DetailSection>` + `<PropertyGrid>` of `<PropertyField label="…">{value}</PropertyField>` — children, not a `value` prop; viax-uxm rule 6 — no `<Card>` wrapper).

### Account (`/account`)

- Top profile block: `<Card shadow>` with a `<Cluster>` (not `<Stack style={{flexDirection:'row'}}>` — viax-uxm rule 9) of `<Avatar>` + name/email (no `DetailSection` here — it's a single-row identity card). Next to them, the user's business roles from `useUser()` (`parParty.paMappedRolesList`) as `<Tag>`s — **display only**, never compared in code (viax-access rule 6).
- **Below that, render each section as a `<DetailSection>` directly** — Addresses, Notifications, Security — **with no `<Card>` wrapper** (viax-uxm-conventions). DetailSection is already a card.
- Addresses: `<EmptyState>` until backend wired.
- Notifications: `<Stack>` of `<ToggleSwitch>`-es.
- Security: `<Link external>` to the Keycloak account console (`{VITE_AUTH_URL}/realms/{VITE_REALM}/account`).

### Admin (`/admin`)

- `<DataTable>` (viax-uxm-conventions) of sections — Users (coming soon), Integrations (coming soon).
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

## Access & permissions

**This whole topic lives in its own skill: [`viax-access`](../../../ui-layers/viax-access/SKILL.md).** Who may
read a field, run a query, call a mutation or fire a workflow transition is decided by the
backend's authorization policies; the portal **reads what the API allows** and renders
accordingly. The portal adds only this glue:

- **Build time (step 8, after BEM discovery)** — run viax-access steps 1, 2 and 5 with the realm's
  MCP ([`discovery.md`](../../../ui-layers/viax-access/references/discovery.md)). Ask the user which Keycloak
  roles the portal serves; never guess them. If policies are not readable (`ACCESS_DENIED`, types
  missing), say so and continue with the runtime contract only. Write the **Access model** and
  **Access audit** sections into `design.md`, and report the audit findings to the user — never
  change policies from the build.
- **Runtime** — implement [`runtime-contract.md`](../../../ui-layers/viax-access/references/runtime-contract.md)
  with [`react-uxm.md`](../../../ui-layers/viax-access/references/react-uxm.md) in `src/access/*`. Portal
  bindings for its placeholders: `<graphql-client>` = `lib/graphql-client.js` (classify
  `res.data.errors` inside `execute()`; Axios resolves HTTP 200 with GraphQL errors in the body),
  `useIdentity()` = `useAuthStore((s) => s.user?.id ?? null)`, `isMockMode` =
  `import.meta.env.VITE_USE_MOCK_DATA === 'true'`, `useTranslate()` = the portal's `useT()`
  when `{{LOCALIZATION}} = yes`, English literals otherwise.
- **Surfaces** — nav items (BI Types Step 3), BI list/detail route gates, per-section queries on the
  detail page, the dashboard's widgets (one query per readable BI type; `<NoAccessSection />` on
  denial). Products, Account and Admin are not BI types and get no probe; their
  queries still go through the same error classification.
- **Copy** — `access.noAccessTitle`, `access.noAccessSection`, `access.noAccessPage`,
  `access.noAccessWrite` go through the locale files like every other string.
- **Done when** the *Checks* in `runtime-contract.md` pass — including the role-literal grep
  (`grep -rnE "has\('(Admin|Partner|admin)'\)|roles\.(has|includes)\(" src` → no hits).

---

## State Management

| State type | Tool |
|---|---|
| Server / API data | TanStack Query |
| URL filters, pagination, search, tabs | React Router `useSearchParams` |
| Auth tokens + user info | Zustand `auth-store` — in-memory only, synced from keycloak-js on init |
| What the user may see (BI types in nav / routes) | TanStack Query — access probes keyed `['access', 'bi-type', typeName, user.id]`, `staleTime: Infinity`, dropped on sign-out (viax-access). **No role state anywhere** |
| Writes the API refused this session | Zustand `access/write-denials.js` |
| Theme / brand configuration | UXM Studio config — `{ overrides, brand }` in the live `lib/uxm-studio-config.js` store (localStorage cache + pub/sub), **persisted to the server** under the UXM config's `uxmStudio` key via `saveUxmConfig` (read back on boot by `useHydrateStudioConfig`); the app-level `UxmConfigApplier` turns the live store into a global stylesheet. **No Zustand `theme-store` for the admin/editor path.** |
| Which published theme is selected (only when `{{THEME_PICKER}} = yes`) | Zustand `theme-store.js` — `selectedThemeId` in ONE `localStorage` key, no server write; boot default is the theme assigned via the config's `portals[{{PORTAL_ID}}].themeId` when the user never picked; see *"Optional: read-only theme picker"* under Runtime Theming |
| Light/dark mode | Host-owned `data-theme` on `:root` — session-only `useState` in `shell.jsx` (the embedded studio defers it to the host) |
| Ephemeral UI (modals, form inputs) | React `useState` |

> **Critical:** Tokens are stored in Zustand **in-memory only** — never in localStorage or cookies. On page refresh, `keycloak.init()` re-establishes the session from Keycloak's own session cookie via silent refresh ([`viax-keycloak-auth`](../../../ui-layers/viax-keycloak-auth/SKILL.md), rule 4).

---

## Development Guidelines

### Naming & Brand

- **viax** is always lowercase "v" — never `Viax` or `VIAX` in any UI copy
- The portal display name is **{{CLIENT_NAME}}** — use `{{CLIENT_NAME_LOWER}}` in lowercase contexts

### Code Quality

- All GraphQL API calls go through the Axios `graphqlClient` — no direct `fetch()` calls
- The portal must be fully functional with `VITE_USE_MOCK_DATA=true`
- Theme changes apply instantly via the UXM Studio — a Save regenerates the global `#uxm-overrides` stylesheet (no page reload, no custom theme code)
- Every list page filter/search/sort state must live in the URL via React Router `useSearchParams` (shareable links)
- **Use `@viax.io/uxm` for every UI primitive, the [`viax-uxm-conventions`](../../viax-uxm-conventions/SKILL.md) way** — its one rule, patterns and composition gotchas; props from [`viax-uxm`](../../viax-uxm/SKILL.md). Never hand-roll a div with the same intent as a shipped atom (Card, FormField, DataTable, List, StatCard, PageShell, EmptyState, Loader, Tag, Banner, …).
- Layout via `<Stack>`, `<Cluster>`, `<ResponsiveGrid>` — not ad-hoc flex/grid divs.
- Inline `style` only for one-off overrides via `--uxm-{component}-*` vars or layout sizing the library doesn't expose.
- JSDoc comments on all function signatures and complex types
- Functions under 50 lines; no premature abstractions (wait for 3+ use sites)

### Error Handling

- TanStack Query error boundaries for API failures — **except access denials**: an `AccessDeniedError` is rendered by the section or route that owns the query (`<NoAccessSection />` / `<NoAccessPage />`), never thrown to an error boundary, and never retried (`retry: (n, err) => !isAccessDenied(err) && n < 2` on the `QueryClient`)
- Toast notifications via the library's own toast API — `import { Toaster, toast } from 'uxm/ui'`, mount `<Toaster position="top-right" max={5} />` ONCE at the app root, then call `toast.error(...)` / `toast.success(...)`. Do **NOT** add `sonner`: `@viax.io/uxm` already ships its own `Toast`/`Toaster`/`toast`, and a second toast system violates the "never duplicate a primitive" rule
- `<Loader>` for in-flight queries, `<EmptyState>` for zero-result lists — not spinners or hand-rolled skeletons
- 401 response: call `keycloak.logout()` from `lib/keycloak.js` — Keycloak redirects to its login page and clears the session

---

## Implementation Order

Build in this exact sequence:

1. **Project scaffold** — Vite + React 19; install `uxm` (the `@viax.io/uxm` alias) + deps; import `uxm/tokens.css` and `uxm/ui.css` once in `main.jsx`; add the Inter Google-Fonts `<link>` to `index.html` (*Portal stylesheet and fonts* §2); jsconfig paths. **Portal identity stamp (General Note #4, mandatory):** generate `{{PORTAL_ID}}` via `openssl rand -hex 4`, write the `"portal"` block into `package.json`, add the `__PORTAL_META__` `define` to `vite.config.js`, and the `stampPortalId()` boot call in `main.jsx`.
2. **Theme system** — `globals.css` **verbatim from *Portal stylesheet and fonts* §1** (the box-sizing reset, panel-radius and shell knobs, the **mandatory `:root { --font-sans: var(--font-inter, …) }` bridge**, the `html, body, #root` font chain `var(--brand-font, var(--font-sans))` that depends on it, and the **mandatory `button, input, select, textarea { font: inherit }` rule** — ship the bridge or the entire portal renders in Times New Roman; ship the form-control rule or every raw native control renders in Arial). **Do NOT redeclare `--color-accent*` in `globals.css`** — the UXM Studio config is the single source of truth for the accent ramp (see the SSOT note under Runtime Theming). **No hand-built admin theme editor / `ThemeProvider`** — runtime theming is the published UXM Studio config (consumed always; editor optional, step 11). Create the **consume-side** studio-plumbing files now (`lib/uxm-studio-config.js`, the **read** `lib/api/config.js` helpers `fetchUxmConfig`/`fetchStudioConfig`/`fetchPortalAssignment`/`fetchAppliedStudioConfig`, `components/layout/uxm-config-applier.jsx`, `hooks/use-hydrate-studio-config.js`), mount `<UxmConfigApplier/>` at the App root, and call `useHydrateStudioConfig()` in `App`. **Only when `{{EMBED_UXM_STUDIO}} = yes`** also create `lib/uxm-persistence.js` and add the `saveUxmConfig`/`saveStudioConfig` write helpers (deferred to step 11). **Only when `{{THEME_PICKER}} = yes`** also create `lib/theme-catalog.js` + `stores/theme-store.js` and repoint `use-hydrate-studio-config.js` to call `useThemeStore.getState().loadThemes()` (see *"Optional: read-only theme picker"* under Runtime Theming) — the header trigger itself is wired in step 5.
3. **i18n foundation (before ANY page) — ONLY when `{{LOCALIZATION}} = yes`; when `no`, skip this step entirely and go to step 4.** Follow the [`viax-localization`](../../../ui-layers/viax-localization/SKILL.md) skill end to end: probe `getSupportedLocales` + `currentLocale` **at scaffold time** (as the generator, with your own credentials); generate `src/i18n/locales/{locale}.json` for every supported locale; **copy** `src/i18n/{index.jsx,bundled.js,resolve.js,locale-state.js}` and `lib/api/i18n.js` from the skill's [`reference-implementation.md`](../../../ui-layers/viax-localization/references/reference-implementation.md) and the three npm scripts from its [`scripts.md`](../../../ui-layers/viax-localization/references/scripts.md) — do NOT write this layer from scratch, it is identical in every viax React app and only `POPULATED_DEFAULT`, the bundled locale imports and the locale JSON contents are per-portal; mount `<I18nProvider>` in `App.jsx` **above the router and above the auth guard**; add the locale **header** to `lib/graphql-client.js`. Verify `LanguageSwitcher` is exported by the installed `@viax.io/uxm` — **if it is not, STOP and report; never hand-roll one.** Building any page before this step guarantees hardcoded strings that step 14 will reject.
4. **Auth system** — copy the [`viax-keycloak-auth`](../../../ui-layers/viax-keycloak-auth/SKILL.md) layer (run its redirect-URI check for port 9000 first): `lib/keycloak.js` singleton, `main.jsx` init flow with `onLoad: 'login-required'`, `auth-store`, `ProtectedRoute` (token-less → `keycloak.login()`). **Generate NO login page and no `/login` route** — Keycloak's own form is the login screen; a portal page whose only job is a button that redirects there is pure friction. Mock auth mints its session at boot, so it needs no form either, and renders no sign-out control. The portal passes Keycloak **no locale**: that screen is the realm's.
5. **Shell layout** — `<PageShell>` + `<AppSidebar>` + `<AppTopBar>`; use `useAuthStore()` for user/avatar; BI navigation items are gated by access probes (BI Types Step 3 — Sidebar Navigation), never by roles. **Only when `{{THEME_PICKER}} = yes`:** add `<ThemePicker />` inside `<AppTopBar actions>`, **after** the light/dark toggle. **Only when `{{LOCALIZATION}} = yes`:** add `<LanguageSwitcher />` after that and before Sign out (full order under *"Localization & i18n → Header order"*).

   🔴 **`linkAs` needs an `href` → `to` adapter — never pass react-router's `Link` directly.**
   `AppSidebar` renders each item as `<linkAs href={item.href}>`. `next/link` accepts `href`, but
   react-router's `Link` requires `to` and **overwrites** the `href` it was handed with
   `useHref(undefined)` — i.e. the current path. `linkAs={Link}` therefore renders *every* nav item
   pointing at the page you are already on, and clicking one navigates nowhere. Verified in a jsdom
   render: `linkAs={Link}` → `["/dashboard","/dashboard"]`, location unchanged after a click;
   with the adapter → `["/dashboard","/subscription-orders"]` and the click navigates.

   ```jsx
   import { forwardRef } from 'react'
   import { Link as RouterLink } from 'react-router-dom'

   const RouterNavLink = forwardRef(function RouterNavLink({ href, ...rest }, ref) {
     return <RouterLink ref={ref} to={href ?? '#'} {...rest} />
   })

   <AppSidebar brand={brand} sections={sections} linkAs={RouterNavLink} />
   ```

   The same adapter is required for any other UXM component with a polymorphic link prop. See
   [`viax-uxm/references/quick-recipes.md`](../../viax-uxm/references/quick-recipes.md) §1.

6. **Data layer + mock data** — copy the [`viax-graphql-data-layer`](../../../ui-layers/viax-graphql-data-layer/SKILL.md) files (`graphql-client.js` with the blocks of the skills in use, `schema-api.js`, `normalize.js`, `user.js` + `use-user.js`) and write the portal's modules and realistic raw-shape mock data (*Data layer*)
7. **Dashboard** — the page and its route now; its widgets read the registry and the access probes that step 8 writes, so wire them as soon as step 8 is done (*Page Specifications → Dashboard*): `<PageHeader>` + one `<StatCard>` per readable BI type (no trend) + charts in `<Card>` + the headline type's value by currency + a `<DataTable>` of its recent records (no Card wrapper — viax-uxm-conventions) + Quick links. Live data in `dev`, mock data in `dev:mock` — the same code path; no number the API does not return
8. **BI types from the BEM** — run [`viax-bem-discovery`](../../viax-bem-discovery/SKILL.md) (asks the user for the BEM, writes `bi-types.config.js` and the BEM section of `design.md`); build `<BiListPage>` and `<BiDetailPage>` shared templates using `<DataTable>`, `<PageHeader>`, `<InlineFilter>`, `<TimelineEntry>`, `<PropertyGrid>`; scaffold one thin page pair per `BI_TYPES` entry; populate sidebar `navItems` from `BI_TYPES`. **Then access (viax-access steps 1–5)** — see *"Access & permissions"*: discover the realm's policies, write the access model + audit into `design.md`, add `src/access/*`, the error classification in `lib/graphql-client.js`, the probes, the route gates and the no-access surfaces, and emit edit controls only where the model says `write`
9. **Products** — `<DataTable>` with 5 columns (image `<Thumbnail>`, name, ID, description, categories `<Tag>`s); **no `<Card>` wrapper** (viax-uxm-conventions). Detail page via `<DetailSection>` + `<PropertyGrid>` rendered directly.
10. **Account** — top `<Card>` for the Avatar identity row; each section (Addresses, Notifications, Security) as a bare `<DetailSection>` — **no `<Card>` around DetailSection** (viax-uxm-conventions). Wire to `useAuthStore(s => s.user)`; the role `<Tag>`s come from `useUser()` (display only).
11. **Admin index (+ UXM Studio editor only if `{{EMBED_UXM_STUDIO}} = yes`)** — Admin index uses `<DataTable>` for the section list (columns mean `DataTable` — viax-uxm-conventions; Users / Integrations "coming soon", **no Theme row**). **Always** wire the host light/dark toggle in `<AppTopBar>` and the brand-driven sidebar logo (subscribe to `uxm-studio-config`). **Only when `{{EMBED_UXM_STUDIO}} = yes`:** create `lib/uxm-persistence.js` + the `saveUxmConfig`/`saveStudioConfig` write helpers, import `uxm/studio.css` in `main.jsx`, build the UXM Studio page (`src/pages/uxm/UxmStudioPage.jsx`) mounting `<UxmApp embed persistence={createConfigRepoPersistence()} />`, register `/uxm` in the router, and add the "UXM Studio" item under the **Settings** sidebar group. See [Runtime Theming](#runtime-theming--consume-the-uxm-studio-config-optionally-embed-the-editor-at-uxm).
12. **Polish** — `<Loader>` / `<EmptyState>` for all data-fetching pages, error boundaries (access denials excluded — see Error Handling), `<Toaster/>` + `toast.*()` from `uxm/ui` (no sonner), responsive (`<ResponsiveGrid>` does most of the work)
13. **Font smoke-check (MANDATORY — do not skip).** Before declaring the build done, verify the typography wiring survived generation. In the running app (DevTools → Computed → `font-family`), or by inspecting the built files, confirm ALL of:
    - `globals.css` contains the `:root { --font-sans: var(--font-inter, …) }` bridge, the `html, body, #root { font-family: var(--brand-font, var(--font-sans)) }` chain, and `button, input, select, textarea { font: inherit }`.
    - `index.html` contains the Inter Google-Fonts `<link>` (*Portal stylesheet and fonts* §2).
    - Computed `font-family` on `<body>` is Inter (or the published brand font) — **never a serif**. Serif body text → the bridge is missing.
    - Computed `font-family` on a native `<button>`/`<input>` matches the body — **never Arial/Helvetica**. Arial controls → the `font: inherit` rule is missing.
    - Sans-serif but not Inter → the `index.html` `<link>` is missing.
    If any check fails, fix `globals.css`/`index.html` from *Portal stylesheet and fonts* verbatim — do not improvise alternative font declarations.
    **Then the data layer's checks** — [`viax-graphql-data-layer`](../../../ui-layers/viax-graphql-data-layer/SKILL.md) → *Checks before calling it done* (no `fetch(`, one `axios.create`, no `ID!` / `_sort` / `LIKE`, no inline `setTo` values, no invented currency, `VITE_SCHEMA_API` set).
    **Then the stylesheet rules of `viax-uxm-conventions`** — each of these returns nothing:
    ```bash
    grep -rnE '\.uxm-[a-z]' src --include='*.css'                          # no .uxm-* selector
    grep -rnE '^[[:space:]]*--color-' src --include='*.css'                 # no --color-* declaration
    grep -rnE '#[0-9a-fA-F]{3,8}\b' src --include='*.css' --include='*.jsx' # no hard-coded colour
    ```
    A hit is fixed the conventions' way — a `--uxm-*` knob, a token, or a proposal for a library
    gap — never by keeping the override.
14. **Hardcoded-string scan — ONLY when `{{LOCALIZATION}} = yes`** (when `no`, go from step 13
    to step 15). **MANDATORY in that case — do not skip.** Generate
    `scripts/scan-hardcoded-strings.mjs`, wire it as `"scan:i18n"` in
    `package.json`, and run it. **It must exit non-zero on any literal UI text**,
    and the build is not done while it fails. A generated surface starts at
    **zero** hits. The full spec — what it must flag, what it must not flag, and
    the object-literal case that is easy to omit — is in
    [`viax-localization/references/catalog-and-files.md`](../../../ui-layers/viax-localization/references/catalog-and-files.md).
15. **No placeholder left behind (MANDATORY — always the last step).** In the portal directory,
    `grep -rnE '\{\{[A-Z_]+\}\}' src index.html package.json vite.config.js .env.local .env.example`
    must return nothing. A hit is a value that was never substituted — a literal `{{AUTH_URL}}` in
    `.env.local` builds fine and sends the login to a non-existent address. Fix it from the confirmed
    values, never by guessing.

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
    "uxm": "npm:@viax.io/uxm@^4.40.1",
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

**`.npmrc` (at portal root):**

```
engine-strict=true
@viax.io:registry=https://registry.npmjs.org/
```

The `@viax.io:registry` line is **required**, not optional, whenever the portal's (or the
environment's) default registry points at Nexus (`registry=https://nexus.viax.tech/repository/viax-npm/`)
instead of public npm — see `uxm-studio/.npmrc` for a working example with both lines. Nexus
mirrors `registry.npmjs.org` with a delay, so installing or bumping `@viax.io/uxm` right after a
fresh release can 404 or silently resolve a stale version through Nexus without this override.

Then `npm install`, followed by `npm i uxm@npm:@viax.io/uxm@latest` to pull the newest build (the `^4.15.0` above is an illustrative floor — `@latest` overwrites it with whatever is current). Do **not** run `npx shadcn@latest init` — `@viax.io/uxm` replaces shadcn entirely.