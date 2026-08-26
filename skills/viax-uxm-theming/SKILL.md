---
name: viax-uxm-theming
description: >
  Wire any viax app to UXM Studio — fetch the published design config, apply its tokens and
  per-component overrides at runtime, and stamp the app's identity. Covers all three modes:
  consume-only (the default), embedding the editor, and a read-only theme picker. TRIGGER
  when: an app should pick up brand colours / fonts / logos / component overrides published
  from UXM Studio; the user mentions `getUxmConfig`, `saveUxmConfig`, `uxmStudio`,
  `generateOverridesCss`, "design tokens from the studio", "why isn't my app re-theming",
  runtime theming, or embedding `UxmApp`; a generated app needs the `portal.id` identity
  block; a portal must pick up the theme centrally assigned to it via the config's `portals`
  map; or theming looks wrong (Times New Roman body text, accent colour ghosting after a
  studio reset, a stale theme after publish).
keywords: viax, uxm, uxm-studio, getUxmConfig, saveUxmConfig, design-tokens, runtime-theming, generateOverridesCss, brand, themes, portal-id, portals, theme-assignment, UxmApp
---

# Wiring an app to UXM Studio

Styles — the accent ramp, brand tokens, per-component/per-state overrides, logos, the
typeface — are authored in the standalone **UXM Studio** app bound to an environment, and
published to the server. **Any app can consume that**: this is not portal-specific. A CRM
screen, an internal tool and a customer portal all re-theme the same way.

The app never invents a theme UI. It **reads** the published config and **applies** it.

## The contract (framework-neutral)

Four steps, in this order. Everything else in this skill is an implementation of them.

| # | Step | What it means |
|---|---|---|
| 1 | **Fetch** | `getUxmConfig { config }` → a JSON **string** → parse → read the `uxmStudio` key |
| 2 | **Seed** | Put `{ overrides, brand }` into a store the UI can subscribe to (cache in `localStorage` so returning users skip the flash) |
| 3 | **Apply** | `generateOverridesCss(overrides, brand)` from `@viax/uxm/studio/generate-css` → inject as ONE `<style id="uxm-overrides">` in `<head>` |
| 4 | **React** | Re-run step 3 whenever the store changes, so a publish (or an embedded save) re-themes live |

Requires `@viax/uxm@^4.15.0` — that is the floor for the dedicated config operations. Always
`npm i @viax/uxm@latest`.

**How the store learns of a publish (step 4's trigger):** there is no push channel today. An
embedded studio's save updates the store directly (reference implementation, file 5). A
consume-only app re-syncs by re-running the boot reconcile — cheapest is
`invalidateUxmConfig()` + refetch on `visibilitychange`/window focus, or on an interval if the
app is long-lived and rarely refocused. Failures keep the applied theme (the boot hook swallows
them), so aggressive re-sync is safe.

### 1. Fetch — the operations

```graphql
query getUxmConfig { getUxmConfig { config } }          # always
mutation saveUxmConfig($config: String) {               # only if you embed the editor
  saveUxmConfig(config: $config)
}
```

`config` is a JSON string. Be defensive and accept an already-parsed object too — see
`hydrateConfig` in the reference implementation. `saveUxmConfig`'s result is an implementation
detail — do not depend on it; after a save, re-read through the memoised fetch (the reference
implementation re-primes its cache itself).

**The transport is yours to supply.** This skill assumes one function and nothing else:

```ts
execute(query: string, variables?: Record<string, unknown>): Promise<TData>
```

It POSTs `{ query, variables }` to the environment's GraphQL endpoint, attaches whatever auth
that environment needs, throws on a non-empty `errors` array, and resolves with `data`. The
reference implementation imports it as `@/lib/graphql-client`; that path is a convention, not a
package — **nothing ships it, so build it before wiring any of this up.** A minimal version:

```javascript
export async function execute(query, variables = {}) {
  const res = await fetch(import.meta.env.VITE_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ query, variables }),
  })
  const { data, errors } = await res.json()
  if (errors?.length) throw new Error(errors.map((e) => e.message).join('; '))
  return data
}
```

Throwing on `errors` matters: GraphQL answers `200 OK` with an `errors` array, so a client that
only checks the HTTP status treats a failed config read as an empty config and silently themes
the app with library defaults.

> **These replaced `getMfaConfig` / `saveMfaConfig`.** Older apps read `uxmStudio` out of the
> ~5 MB MFA config, which meant fetching everything to touch one key and preserving
> `routes`/`rootStyles`/`dbsSettings`/`importMap` verbatim on every write. The UXM config is
> its own small document. **Do not generate the MFA pair for theming.**

**Memoise the fetch.** Not for size — the config is small — but so the boot hydrate, an
embedded studio's `load()`, and a save's read-modify-write share **one** request instead of
three. It also collapses React StrictMode's double-invoked effects.

**Still read-modify-write on save.** The `uxmStudio` key namespaces the style state so future
theme entities can land as sibling keys; a blind overwrite would drop them.

⚠️ **Name collision.** The GraphQL query is `getUxmConfig` — and so is the local store getter
in most implementations. Keep the query inside the API module only; every other file imports
the store getter. Importing the wrong one fails silently.

### The wire shape

```jsonc
// hydrateConfig(data.getUxmConfig.config)
{
  // future sibling keys may appear — preserve them on write
  "portals": {                   // OPTIONAL per-app theme assignment, keyed by portal.id —
    "vx-demopalooza-fbc4d2a1": { //   see "Per-portal theme assignment" below
      "name": "demopalooza-portal",
      "themeId": "b78c1445-580f-4971-bba6-cf949ea027c9"   // an id from uxmStudio.themes[]
    }
  },
  "uxmStudio": {                 // may be ABSENT or null → fall back to your defaults
    "overrides": {               // Record<componentId, Record<knobKey, string|number|boolean>>
      "button-primary": { "backgroundColor": "#0F6A4F", "borderRadius": 8 }
    },
    "brand": {                   // every field optional
      "logoUrl": "…", "iconUrl": "…", "faviconUrl": "…",
      "logoUrlDark": "…", "iconUrlDark": "…", "faviconUrlDark": "…",
      "fontFamily": "Manrope",   // drives --brand-font via generateOverridesCss
      "headingFontFamily": "Space Grotesk",  // → --brand-heading-font; optional, additive
      "headingFontWeight": "600",            // → --brand-heading-weight ('500'|'600'|'700')
      // Per-role refinements, layered UNDER the umbrella above. Roles: display
      // (StatCard value, ErrorPage code), h1 (page titles), h2 (section titles).
      "pageTitleFontFamily": "Figtree", "pageTitleFontWeight": "700", "pageTitleScale": "1.25",
      "displayScale": "1.5", "sectionTitleFontWeight": "500",
      "typeScale": "1.125",                  // → --type-scale, multiplies every size
      "bodyLineHeight": "1.7",               // → --type-body-line-height + a body rule
      "tokens": { "light": { "--color-accent": "#15895F" }, "dark": { … } }
    },
    // v2 multi-theme. The top-level overrides/brand REMAIN the default theme —
    // that is what keeps v1 consumers wire-compatible with a v2 publish.
    "themesVersion": 2,
    "defaultTheme": { "name": "Default", "description": "…" },
    "themes": [ { "id": "…", "name": "…", "config": { "overrides": {}, "brand": {} } } ]
  }
}
```

**This is environment data, not a schema you control.** It can be absent, v1, v2, carry any
number of arbitrarily named themes, or hold keys you have never seen. Never hardcode a theme
name, never assume `themes[]` exists, always normalise defensively and ignore unknown keys.

## The three modes

| Mode | What the app does | Build |
|---|---|---|
| **Consume** (default) | Reads + applies the published config. No editor, no save path. | Store, API read half, applier, boot hook |
| **Embed** | Also mounts `UxmApp` from `@viax/uxm/studio` with server-backed save | + API write half, persistence adapter, studio page, `@viax/uxm/studio.css` |
| **Picker** | Also lets end users *select* among themes the designer published | + theme catalog, theme store, picker UI |

Consume is always built. The other two are independent of each other — an app can have a
picker without embedding, or embedding without a picker.

**Never hand-build a theme editor** — colour pickers, brand-token forms, a second save path.
That duplicates UXM Studio's own UI and creates a second place saves diverge. A **read-only
picker** is different and allowed: it only selects among already-published themes and never
writes.

## App identity — the `portal` block

Every generated app carries an identity so deployed instances can be told apart.

```json
{
  "portal": {
    "id": "vx-<app-slug>-<8 hex>",
    "generator": "<what generated it>",
    "client": "…", "realm": "…", "env": "…",
    "generatedAt": "<ISO timestamp>"
  }
}
```

Three pieces, all required:

1. **`package.json` → the `portal` block.** Top-level custom field; npm ignores it. Source of
   truth. The hex suffix must come from actually running `openssl rand -hex 4` — inventing it
   by hand defeats uniqueness across regenerations.
2. **Build-time exposure.** `package.json` is not deployed, so compile the block in. With
   Vite: read it in `vite.config.js` and `define: { __PORTAL_META__: JSON.stringify(pkg.portal) }`.
3. **Boot stamp.** Append `<meta name="viax-portal-id">` to `<head>` and log
   `[viax] portal <id>` — so a deployed app is identifiable from the DOM/console without
   source access.

Extraction: `jq -r .portal.id package.json` from source; the meta tag or console line from
a deployed app. **Verify it survived the build:** `npm run build && grep -o "$(jq -r .portal.id package.json)" dist/assets/*.js`.

> **The config document is environment-wide — `portal.id` does not scope the *fetch*.**
> `getUxmConfig` takes no arguments, so every app in an env reads the same published document.
> What IS per-app is the **theme**: the document's `portals` map (next section) assigns one of
> its themes to each app by `portal.id`. Keep the identity reachable and the config calls in
> one module, so any future per-app scoping of the fetch itself is a one-file change.

## Per-portal theme assignment — the `portals` map

The published config can carry a `portals` map — a **sibling of `uxmStudio`**, keyed by each
app's `portal.id` from the identity block above:

```jsonc
"portals": {
  "vx-demopalooza-fbc4d2a1": {
    "name": "demopalooza-portal",
    "themeId": "b78c1445-580f-4971-bba6-cf949ea027c9"   // an id from uxmStudio.themes[]
  }
}
```

On boot the app matches its **own** `portal.id` (`__PORTAL_META__.id`, compiled in from
`package.json`) against this map, takes the entry's `themeId`, finds that theme in
`uxmStudio.themes[]` by `id`, and applies the theme's `{ overrides, brand }` instead of the
top-level default.

**Resolution order** — first candidate that resolves against the FRESH config wins:

1. The user's explicit picker choice (`localStorage`) — picker mode only. A user who picked a
   theme keeps it; the assignment is the *boot default*, not an override.
2. `portals[<portal.id>].themeId` — the theme centrally assigned to this app.
3. The default theme (the top-level `overrides`/`brand`).

**Defensive rules** — this is environment data, same as everything else in the document:

- `portals` absent, no entry for this app's id, entry without `themeId` **or with
  `themeId: ""`** (the studio's Portals manager stores an empty string for "explicitly
  unassigned — use Default", and deleting a theme resets its assignees to `""`), or a `themeId`
  that matches nothing in `uxmStudio.themes[]` → fall through to the next candidate. Never
  crash, never apply nothing. (Map ids are not format-checked either — legacy, hand-rolled ids
  appear alongside `vx-*` ones.)
- Works in **all three modes**. Consume-only resolves it inside the boot hydrate
  (`fetchAppliedStudioConfig` in the reference implementation, file 2 + file 4); picker mode
  folds it into the theme store's candidate chain (file 6b) — one resolution path per mode,
  never two competing ones.
- The save path already preserves it: `portals` is exactly the kind of sibling key the
  read-modify-write on `saveUxmConfig` exists for. An embedded studio save must never drop it.

## Gotchas that actually bite

- **A bad type scale collapses the whole app, it does not just get ignored.** `typeScale` /
  `pageTitleScale` / `displayScale` / `sectionTitleScale` multiply a length inside `calc()`. A non-numeric or
  dimensioned value (`abc`, `1.2px`) makes the declaration invalid at computed-value time, so
  `font-size` resolves to `unset` and **inherits** — one poisoned value on `:root` renders every
  atom at the parent's size. `generateOverridesCss` drops anything outside a plain number in
  0.5–2, but only for values that flow through `brand.*`; a scale smuggled in via
  `brand.tokens.light` bypasses that check (`safeTokenValue` allows `abc` and unbalanced parens).
  Never route typography through the token bag.
- **Heading typography is opt-in, and a stale `@viax/uxm` silently swallows it.** `brand.headingFontFamily`
  / `headingFontWeight` publish as `--brand-heading-font` / `--brand-heading-weight`, which only the
  heading surfaces read (`PageHeader` / `DetailSection` / `SegmentRow` titles, `ErrorPage` code + title,
  `StatCard` value). Unset is *not* a bug — every surface keeps its own literal fallback, so nothing
  changes until a heading font is chosen. Two consequences: a host whose server regenerates the CSS with
  an older `@viax/uxm` persists the JSON but emits no heading vars (bump the package, not the config),
  and an old published sheet predates the vars entirely — the studio's live mirror re-declares them as
  `initial` when unset precisely so reverting repaints immediately instead of waiting for the next Publish.
- **Never hardcode brand values — anywhere.** Not in global CSS (`--color-accent*` and friends),
  not as a build-time answer to a "what's your accent colour?" prompt, not as defaults in the
  config store. The published config owns the accent ramp, the logo, the favicon and the
  typeface; they all arrive together at runtime. A hardcoded copy is a second source that keeps
  painting after a studio "Reset all" while the studio's own inputs fall back to library
  defaults — inputs and rendering then disagree, and nothing in the app explains why. Before the
  first fetch resolves the app paints `@viax/uxm`'s built-in tokens, which is the correct
  neutral state; `localStorage` covers returning users. Keep asset fallbacks at the point of
  use (`brand?.logoUrl || '/logo.svg'`), not in the defaults.
- **Times New Roman everywhere** means the `--font-sans` bridge is missing. `tokens.css`
  declares `--font-sans` only inside a Tailwind-only `@theme inline` block that browsers drop,
  so `font-family: var(--brand-font, var(--font-sans))` is invalid at computed-value time and
  `<body>` falls back to serif — which every atom then inherits. Ship
  `:root { --font-sans: var(--font-inter, system-ui, sans-serif) }` once.
- **Native controls in Arial** means `button, input, select, textarea { font: inherit }` is
  missing. Form controls do not inherit the document font.
- **Don't build a font picker.** `brand.fontFamily` from Brand Settings → Typography is turned
  into a Google-Fonts `@import` + `--brand-font` by `generateOverridesCss`. Declare no
  `font-family` beyond the baseline chain, or it will fight the injected rule.
- **Don't expose border-radius knobs.** Shape belongs to `@viax/uxm` tokens, not per-app brand.
- **One `<style>` element, replaced in place.** Appending a new one per apply leaks nodes and
  makes the last-wins order unpredictable.
- **In `embed` mode the host owns `data-theme`.** The studio defers light/dark to you.

## Reference implementation

React + Vite, the shape used in production today:
[`references/reference-implementation.md`](references/reference-implementation.md).

Adapt freely — the contract above is what matters, not the file layout. For component APIs,
tokens and recipes see the [`viax-uxm`](../viax-uxm/SKILL.md) skill.
