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

**Operations this skill uses** (all exposed by the platform), as the generated portal calls them: on each BI type
`get<BiType>`, `filter<BiType>`, `create<BiType>`, `update<BiType>`, `delete<BiType>` and `get<BiType>StatusValues`;
`filterMaterial`, `getMaterial`, `filterOrganisation`, `filterIndividual`, `filterBusinessInteractionExecutionModel`,
`updateViaxI18NPreferences`. Hand-declared: `getCurrentUserInfo`, `getEntity`, `getSupportedLocales`,
`currentLocale`, `getUxmConfig`, `saveUxmConfig`.

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
> 9. **Show a theme picker in the header?** (yes/no) — press Enter for the default `no`. Only say yes if UXM Studio published *multiple* named themes for this client and end users should be able to select among them; read-only (no create/edit/delete), independent of question 8.
> 10. **Localize the portal?** (yes/no) — press Enter for the default `yes`. `yes` builds the full i18n layer (translated copy, a language switcher, locale-aware dates/numbers/currency); `no` generates an English-only portal. Nothing further is asked either way — the locale list comes from `getSupportedLocales` for the realm, never from you."

Normalize answers 8 and 9 to `yes`/`no` (default `no`) → `EMBED_UXM_STUDIO`, `THEME_PICKER`.
Normalize answer 10 to `yes`/`no` (**default `yes`**) → `LOCALIZATION`.

> **Prefer `yes` on question 10, and say so if the user hesitates.** Retrofitting i18n means
> revisiting every surface already built — the [`viax-localization`](../viax-localization/SKILL.md)
> skill has a retrofit path, but it is strictly more work than doing it at step 3. Only pick `no`
> for a single-locale throwaway or a demo whose lifetime is measured in days.

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
| `LOCALIZATION` | _(from user or `yes`)_ |

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
- **Localization (only when `{{LOCALIZATION}} = yes`) — follow the [`viax-localization`](../viax-localization/SKILL.md) skill.** It owns the whole topic, and it **ships the layer as code** — copy `src/i18n/*`, `lib/api/i18n.js` and the three npm scripts from its `reference-implementation.md` / `scripts.md` rather than writing them, because every viax React app runs the identical layer. It covers: the locale files (generated `src/i18n/locales/*.json`, the single source of UI copy, no i18n runtime dependency), the distinction between that copy and entity data the server localizes from the `X-Viax-User-Locale` header, the file shape, the boot gate that holds the app until the language is settled, locale resolution and server-side persistence via `updateViaxI18NPreferences`, the `X-Viax-User-Locale` header, the `LanguageSwitcher` contract, and all currency / date / number formatting. This MetaPrompt only adds the portal glue — see *"Localization & i18n"* there.
  - **When `yes` it is mandatory and runs BEFORE any page** (step 3 in Implementation Order). Nothing further is collected from the user: the locale list comes from `getSupportedLocales` for the realm and is **never hardcoded**, never guessed, and never a config question.
  - **When `no`, skip steps 3 and 14 entirely** — no `src/i18n/`, no `LanguageSwitcher`, no locale/currency headers, no `gen:locales` / `scan:i18n` / `test:i18n` scripts. Copy is written in English directly in the JSX. Two things still hold: `design.md` records that the portal is **not** localized and that adding it later is a retrofit, and **money, dates and numbers still go through `Intl`** via `lib/utils/format.js` with a fixed `'en-US'` — never `toFixed()` with a hand-written separator, and never a hardcoded currency. See *"Formatting when the app is not localized"* in the skill.
  - **This applies to every LATER change too, not just the first build.** Adding a page (or a column, or a message) adds its keys in the same change: real values in the default locale, the same keys with `null` in every other. Use the generated `npm run gen:locales`; `npm run scan:i18n` is what catches a surface whose copy never reached the files.
  - **Probe `I18NPreferences.i18Language` per realm** — it is `null` on every row in Palooza Demo, so the server preference is an optional input to resolution, never a guaranteed one. State the outcome in `design.md` rather than assuming it.
  - **UI copy lives in the portal, not in viax.** There is no readable catalog of it, so changing a label is a deploy. `design.md` must say so rather than implying a business user can edit copy in the backend.
  - **If `LanguageSwitcher` is not exported by the installed `@viax.io/uxm`, STOP and report** — never hand-roll or copy one into the portal.
  - The Implementation Order ends with the font smoke-check (step 13, **always mandatory**) and — when `{{LOCALIZATION}} = yes` — a **hardcoded-string scan that fails the build** (step 14). A localized surface starts at zero hits.
- All `{{CLIENT_NAME}}`, `{{REALM}}`, `{{ENV}}`, `{{AUTH_URL}}`, `{{API_URL}}`, etc. must be replaced with concrete values before acting on any instruction that references them.
