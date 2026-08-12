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
  block; or theming looks wrong (Times New Roman body text, accent colour ghosting after a
  studio reset, a stale theme after publish).
keywords: viax, uxm, uxm-studio, getUxmConfig, saveUxmConfig, design-tokens, runtime-theming, generateOverridesCss, brand, themes, portal-id, UxmApp
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

### 1. Fetch — the operations

```graphql
query getUxmConfig { getUxmConfig { config } }          # always
mutation saveUxmConfig($config: String) {               # only if you embed the editor
  saveUxmConfig(config: $config)
}
```

`config` is a JSON string. Be defensive and accept an already-parsed object too — see
`hydrateConfig` in the reference implementation.

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
  "uxmStudio": {                 // may be ABSENT or null → fall back to your defaults
    "overrides": {               // Record<componentId, Record<knobKey, string|number|boolean>>
      "button-primary": { "backgroundColor": "#0F6A4F", "borderRadius": 8 }
    },
    "brand": {                   // every field optional
      "logoUrl": "…", "iconUrl": "…", "faviconUrl": "…",
      "logoUrlDark": "…", "iconUrlDark": "…", "faviconUrlDark": "…",
      "fontFamily": "Manrope",   // drives --brand-font via generateOverridesCss
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

> **Today the config is environment-wide — `portal.id` does not scope it.** `getUxmConfig`
> takes no arguments, so every app in an env reads the same published config. Scoping *per
> app* is planned. Keep the identity reachable and the config calls in one module, so adding
> the argument later is a one-file change rather than a hunt.

## Gotchas that actually bite

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
