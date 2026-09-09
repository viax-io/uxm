---
name: viax-build-portal
description: >
  Scaffold a new viax customer-facing portal from scratch. Collects client configuration then
  executes the full BEM-based portal build prompt. TRIGGER when: user says "build a portal",
  "generate a portal", "create a portal", "new portal", "scaffold a portal", "set up a portal",
  mentions building for a new client, or asks to start a viax customer portal project.
disable-model-invocation: true
---

# viax Portal Generator

Before starting the build, collect all required client configuration values by asking the user the questions below in two rounds. Once all values are confirmed, substitute them into the full build prompt and execute it.

---

## Step 1 — Collect Configuration (Round 1: Identity & Environment)

Send **one message** asking for all four values together:

> "To scaffold the portal I need a few details. Please provide:
> 1. **Client display name** (title case) — e.g. `DemoPalooza`
> 2. **Keycloak realm name** — e.g. `palooza`
> 3. **viax environment** — e.g. `demo`, `prod`, `qa`
> 4. **OAuth client ID** — usually `viax-ui`"

From the client display name, auto-derive:
- `CLIENT_NAME_LOWER` = display name lowercased
- `CLIENT_SLUG` = display name lowercased, spaces → hyphens, non-alphanumeric chars stripped
- `PORTAL_SUBDIR` = `/{CLIENT_SLUG}-portal/`
- `PORTAL_ID` = `vx-{CLIENT_SLUG}-{8 random hex chars}` — generate the suffix by actually running `openssl rand -hex 4` in Bash (never invent the hex by hand; a made-up suffix defeats the uniqueness guarantee)
- `GENERATED_AT` = today's date, `YYYY-MM-DD`

---

## Step 2 — Collect Configuration (Round 2: URLs & Branding)

Send **one message** asking for the remaining values:

> "Thanks! Now the URLs and branding:
> 5. **Keycloak base URL** — e.g. `https://auth.palooza.demo.viax.io`
> 6. **viax GraphQL endpoint** — e.g. `https://api.palooza.demo.viax.io/graphql`
> 7. **Target GitHub repository** (org/repo) — leave blank if not yet known
> 8. **Embed the UXM Studio editor at `/uxm`?** (yes/no) — press Enter for the default `no`. Either way the portal always loads and applies the env's published UXM Studio config (styles/tokens) via `getUxmConfig`; `yes` additionally mounts the live editor inside this portal.
> 9. **Show a theme picker in the header?** (yes/no) — press Enter for the default `no`. Only say yes if UXM Studio published *multiple* named themes for this client and end users should be able to select among them; read-only (no create/edit/delete), independent of question 8."

Normalize the answers to `yes`/`no` (default `no`) → `EMBED_UXM_STUDIO`, `THEME_PICKER`.

> **Do not ask for brand colours.** The accent ramp — and the logo, favicon and typeface with
> it — is published from UXM Studio for the environment and arrives with every other token at
> runtime. Asking here would bake a second source into the generated app, which then keeps
> painting after a studio "Reset all" while the studio's own inputs show library defaults.

---

## Step 3 — Confirm Values

Display a confirmation table with all resolved values and ask: *"Does everything look correct? Type yes to proceed or correct any values."*

| Variable | Resolved Value |
|---|---|
| `CLIENT_NAME` | _(from user)_ |
| `CLIENT_NAME_LOWER` | _(auto-derived)_ |
| `CLIENT_SLUG` | _(auto-derived)_ |
| `REALM` | _(from user)_ |
| `ENV` | _(from user)_ |
| `CLIENT_ID` | _(from user)_ |
| `AUTH_URL` | _(from user)_ |
| `API_URL` | _(from user)_ |
| `GITHUB_REPO` | _(from user or blank)_ |
| `PORTAL_SUBDIR` | _(auto-derived)_ |
| `PORTAL_ID` | _(auto-generated — `vx-{CLIENT_SLUG}-{openssl rand -hex 4}`)_ |
| `GENERATED_AT` | _(auto-derived — today, `YYYY-MM-DD`)_ |
| `EMBED_UXM_STUDIO` | _(from user or `no`)_ |
| `THEME_PICKER` | _(from user or `no`)_ |

---

## Step 4 — Execute the Build Prompt

Once the user confirms, use the **Read** tool to load the full build prompt:

```
File: references/BEM-based-app-generator-MetaPrompt.md
```

Replace every `{{PLACEHOLDER}}` in that document with the confirmed values collected above, then carry out **all instructions exactly as written** in the prompt.

Key reminders:
- Follow the **Implementation Order** section top-to-bottom — do not reorder or skip steps.
- **Runtime theming — follow the [`viax-uxm-theming`](../viax-uxm-theming/SKILL.md) skill.** It owns the whole topic: the `getUxmConfig` / `saveUxmConfig` contract, the wire shape, the applier that turns the published config into design tokens, the three modes, the `portal.id` identity block, the per-portal theme assignment (`portals[portal.id].themeId`), and the theming gotchas (the `--font-sans` bridge, `font: inherit` on native controls, never redeclaring `--color-accent*`). This MetaPrompt only adds the portal-specific glue — mode flags `{{EMBED_UXM_STUDIO}}` / `{{THEME_PICKER}}` (both default `no`), `{{CLIENT_SLUG}}` naming, and the shell wiring — see *"Runtime Theming"* in the MetaPrompt. **Always** build the consume side; **never** hand-build a theme editor.
- **Portal identity stamp (MANDATORY — never skip).** Every generated portal must be uniquely identifiable. Three pieces, all required, spec'd in *"General Notes → Portal identity stamp"* in the MetaPrompt: (1) the `"portal"` metadata block in `package.json` (`id` = `{{PORTAL_ID}}`, `generator`, `client`, `realm`, `env`, `generatedAt` = `{{GENERATED_AT}}`); (2) `vite.config.js` reads that block and exposes it to the bundle as `__PORTAL_META__` via `define`; (3) `main.jsx` calls `stampPortalId()` on boot — appends `<meta name="viax-portal-id">` to `<head>` and logs `[viax] portal …` to the console, so a *deployed* portal is identifiable from the DOM/console without source access (`package.json` itself is not deployed). Before declaring the build done, verify the ID landed in the production bundle: `npm run build && grep -o "{{PORTAL_ID}}" dist/assets/*.js`.
- The **BEM Discovery** step (step 8 in Implementation Order) requires asking the user for a BEM UID or code — that interactive question is already embedded in the prompt under *"BEM Discovery & Dynamic Route Generation → Step 1"*.
- **Localization is mandatory and runs BEFORE any page** (step 3 in Implementation Order) — see *"Localization & i18n"* in the MetaPrompt. Nothing about it is collected from the user: the locale list comes from `getSupportedLocales` for the realm and is **never hardcoded**, never guessed, and never a config question. Key points the generator must not improvise:
  - **No i18n runtime dependency.** Two layers only — generated `src/i18n/locales/{locale}.json` files plus a runtime overlay from the backend `Translation` catalog, wrapped in `UxmLocaleProvider` from `@viax.io/uxm/ui`. Adding i18next / react-intl is a defect.
  - **File shape is fixed:** level 1 = page key (or the reserved `common`), level 2 = label key. Maps mechanically to the catalog code `page.<page>.<label>` / `common.<label>`.
  - **This applies to every LATER change too, not just the first build.** Adding a page (or a column, or a message) adds its keys in the same change: real values in the default locale file, the same keys with `null` in every other. Use the generated `npm run gen:locales` — it preserves existing translations, fills in missing keys, and drops locales the realm withdrew. Never machine-translate the new keys; removing a page removes its keys. `npm run scan:i18n` is what catches a surface whose copy never reached the files.
  - **Two realm-dependent probes** decide what is achievable: whether a `Translation` **read** query exists (it does not in Palooza Demo — only the `upsertTranslation` mutation), and whether `I18NPreferences.i18Language` is populated (it is `null` throughout Palooza Demo). Both outcomes must be stated in `design.md` rather than assumed.
  - **Locale reaches the API as a HEADER, never as a `_locale` argument.** `_locale` is a mutation argument; of 3661 query fields exactly one accepts it. Adding it to a `filter*` query is a hard validation error.
  - **Persisting the language server-side has a verified chain, and shortcuts are dangerous.** Traverse the profile — `getCurrentUserInfo { parProfile { prpI18NPreferences { uid … } } }` (`User.parProfile: UserProfile` → `UserProfile.prpI18NPreferences: I18NPreferences`, confirmed by introspection) — then `upsertViaxI18NPreferences(input: { uid, i18Language })` with **that row's own `uid`**; an upsert without one mints a fresh row on every switch. That traversal is the only way to the row's `uid`; a null at either hop means the user has no row, and the portal persists locally. There is no mutation for `currentLocale` and never was.
  - **The fallback chain ends at the POPULATED default, not the configured one** — otherwise a realm naming an untranslated locale as its default renders the entire UI as bare codes.
  - **Four library caveats** the portal must code around: no date atom takes a `timeZone`; `DateInput`/`EditableCell` forward nothing to their inner `Calendar`; `parseDate`/`FORMAT_SPEC` are not exported; a Listbox-backed atom shares its root with `.uxm-listbox` (`width: 100%`). Plus `keycloak-js` is instantiated at module scope and cannot be imported outside a browser.
  - **🔴 The BACKEND is the ONLY store for a signed-in user's language — persist nothing client-side.** No `localStorage` key for the locale, no per-user "fallback" entry; a generated portal with a locale storage module is a defect. Resolution runs *server `i18Language` → browser → configured default → first supported*, with the realm's own inputs only, and `resolve.js` returns which link resolved. A user whose `parProfile` / `prpI18NPreferences` row does not exist **cannot set a language**: the upsert is keyed on that row's `uid`, so the switch applies to the session only and a `toast.error` says it was not saved — creating the first row is a separate iteration, and no client-side substitute may be built for it. Key the preferences query by `userId`; pin the chain with `npm run test:i18n` (`node:test`, no new dependency).
  - **Nothing renders until the language is settled.** The `I18nProvider` starts with **no locale**, holds a **full-screen spinner** (bare `<Loader />` — there is no locale to render copy in) until `getSupportedLocales`, `currentLocale` and the user's preference have landed, and only then renders the tree. No initial guess from the browser, no `LocaleGate` component, and no `X-Viax-User-Locale` header before a locale exists — seeding and correcting is exactly what produces the visible English→German flip.
  - **No pre-login surface at all.** `onLoad: 'login-required'` — Keycloak's own form is the login screen, so the portal generates **no login page and no `/login` route**, passes Keycloak **no locale** (that screen is the realm's, localized by its own internationalization), and the language switcher has exactly one call site (`<AppTopBar actions>`). Mock auth mints its session at boot, so it needs no form and renders no sign-out control.
  - **Fetch locale inputs with TanStack Query, not `useEffect`.** StrictMode double-invokes effects, which ships duplicated `LocaleConfig` / `MyIdentity` / `MyI18nPreferences` calls; a `cancelled` flag guards state, not the network.
  - **`LanguageSwitcher` must come from `@viax.io/uxm`.** If the installed version does not export it, STOP and report — never hand-roll or copy a switcher into the portal. It is data-free (`locales` / `value` / `onChange` come from the portal's i18n layer), it returns `null` by itself at one locale — so the call site must **not** add its own `length > 1` guard — and it derives endonyms internally, so never pass `getLabel` or compute language names in portal code. Always pass a translated `label`: it is the control's only accessible name.
  - The Implementation Order now ends with two **mandatory** gates: the font smoke-check (step 13) and a **hardcoded-string scan that fails the build** (step 14). A generated surface starts at zero hits.
- All `{{CLIENT_NAME}}`, `{{REALM}}`, `{{ENV}}`, `{{AUTH_URL}}`, `{{API_URL}}`, etc. must be replaced with concrete values before acting on any instruction that references them.
