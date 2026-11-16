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

Before starting the build, collect all required client configuration values by asking the user the questions below. Once all values are confirmed, substitute them into the full build prompt and execute it.

**How to ask.** Every question before the build — the ten below, a value asked again at step 3, and the
BEM and roles questions later in the build — is asked **one at a time**, each in its own dialog
(`AskUserQuestion` where the client has it), never as a numbered batch in one message. Offer answer
options wherever they exist: the example or default value (marked as recommended), `yes`/`no`, the BEMs
or roles discovered through the MCP. Free text stays available through the dialog's "Other".

**Operations this skill uses** (all exposed by the platform), as the generated portal calls them: on each BI type
`get<BiType>`, `filter<BiType>`, `create<BiType>`, `update<BiType>`, `delete<BiType>` and `get<BiType>StatusValues`;
`filterMaterial`, `getMaterial`, `filterOrganisation`, `filterIndividual`, `filterBusinessInteractionExecutionModel`,
`updateViaxI18NPreferences`. Hand-declared: `getCurrentUserInfo`, `getEntity`, `getSupportedLocales`,
`currentLocale`, `getUxmConfig`, `saveUxmConfig`. At build time only (via the realm's MCP, never from the portal):
`filterGqlSchemaAuthzPolicy`, `filterStateWorkflowAuthzPolicy` (viax-access discovery).

---

## Step 1 — Collect Configuration (Round 1: Identity & Environment)

Ask these four questions one by one, offering the example as an option:

> "To scaffold the portal I need a few details:
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

Ask these one by one too — offer the URLs derived from realm and env (`https://auth.{REALM}.{ENV}.viax.io`,
`https://api.{REALM}.{ENV}.viax.io/graphql`) as options for 5 and 6, and `yes` / `no` for 8–10 with the default first:

> "Now the URLs and branding:
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

## Step 3 — Validate, then Confirm Values

Nothing later in the build checks these values: a blank or wrong one is generated into the portal
as is, `npm run build` passes, and the failure shows up only in the browser — a blank page before
React mounts, a Keycloak error page, or "Unknown type" on every BI page. So run every check below
**before** the confirmation table. A failed check is reported in plain words and only the affected
value is asked for again; never fill a value in silently and never continue past a failure.

**3a. Required values.** `CLIENT_NAME`, `REALM`, `ENV`, `CLIENT_ID`, `AUTH_URL` and `API_URL` must be
non-empty, and the derived `CLIENT_SLUG` must be non-empty too (a name made only of symbols derives an
empty slug). A blank `CLIENT_ID` is asked again with `viax-ui` offered as the usual answer — not
filled in. `GITHUB_REPO` is the only value that may stay blank.

**3b. Format.**

| Value | Must be | Typical mistake |
|---|---|---|
| `AUTH_URL` | `https://<host>` with no path; drop a trailing `/` | `…/realms/<realm>` or `…/auth` pasted in — keycloak-js appends `/realms/{REALM}` itself |
| `API_URL` | `https://<host>/graphql` | the bare host, or the auth host |
| `REALM` | a single token — no `/`, no spaces | a URL or display name |
| `GITHUB_REPO` | blank or `org/repo` | a full clone URL |

Answers 8–10: blank (Enter) → the default; `yes`/`y`/`no`/`n` in any case → that value; **anything
else → ask again**, never fall back to the default.

**3c. Live checks** (Bash, no credentials needed):

```bash
# Keycloak host + realm — expect 200, and an "issuer" equal to {AUTH_URL}/realms/{REALM}
curl -s --max-time 15 "{AUTH_URL}/realms/{REALM}/.well-known/openid-configuration"

# GraphQL endpoint — expect exactly {"data":{"__typename":"Query"}}
curl -s --max-time 15 -X POST -H 'content-type: application/json' \
  -d '{"query":"{__typename}"}' "{API_URL}"

# Client + the portal's dev origin — expect 200 (Keycloak's login form)
curl -s --max-time 15 -o /dev/null -w '%{http_code}\n' \
  "{AUTH_URL}/realms/{REALM}/protocol/openid-connect/auth?client_id={CLIENT_ID}&response_type=code&scope=openid&redirect_uri=http%3A%2F%2Flocalhost%3A9000%2F"
```

- `{"error":"Realm does not exist"}` → `REALM` is wrong for that host; any other 404 or a connection
  error → `AUTH_URL` is wrong.
- Anything but the `__typename` answer → `API_URL` is not the GraphQL endpoint.
- The client check → **400**: `CLIENT_ID` does not exist in the realm, or it does not allow
  `http://localhost:9000/` as a redirect URI (the two look the same from outside). Ask for the
  client ID again; if it is right, tell the user the realm owner must add the origin to the client's
  *Valid redirect URIs* — the portal still builds, but the first login fails until then. See
  [`viax-keycloak-auth`](../viax-keycloak-auth/SKILL.md) → *Realm checks*.
- No network from this machine → mark the checks *not checked* and require an explicit "yes,
  continue unchecked" from the user.

**3d. The MCP serves the same environment as `API_URL`.** Everything the build learns about the realm —
the BEM, BI types, status values, supported locales, access policies — comes through the connected
MCP, **not** through `API_URL`. If the two point at different environments, the portal is generated
against one schema and runs against another. Check it:

1. Through the MCP: `filterBusinessInteractionExecutionModel(_first: 20) { edges { node { code sourceBIType } } }`.
   `sourceBIType` is `null` or `""` on some BEMs — skip those.
2. A BEM can name a type that no longer exists (Palooza Demo has BEMs on `NonExistentBIType` and on
   deleted types), so first run `filter<Type>(_first: 1) { edges { node { biId } } }` through the MCP
   and keep only the types it can query. Take up to three of them.
3. Ask `API_URL` the same query without a token:
   ```bash
   curl -s --max-time 15 -X POST -H 'content-type: application/json' \
     -d '{"query":"{ filter<Type>(_first: 1) { edges { node { biId } } } }"}' "{API_URL}"
   ```
   `ACCESS_DENIED` (or data) → the type exists there. `Cannot query field "filter<Type>"` for a type
   the MCP *can* query → **STOP** and tell the user the connected MCP serves a different environment
   than `API_URL`; they connect the right MCP or correct `API_URL`.
4. No type the MCP can query, or no MCP for the realm is connected → say so; the build cannot run
   without one (BEM discovery needs it). Show the MCP server's name in the table either way.

5. **Schema API version** (derived, not asked): through the same MCP,
   `{ v2: __type(name: "NullableStringValueWrapperInput") { name } }` — a type → `SCHEMA_API = v2`,
   `null` → `v1`. The generated writes run on either; the value goes into `.env.local` as
   `VITE_SCHEMA_API` ([`viax-graphql-data-layer`](../viax-graphql-data-layer/SKILL.md) → *Schema API
   version*). Palooza Demo is `v1`, viax lab `v2`.

This check sees schema differences only: two environments of one realm with identical BI types
(e.g. `demo` and `qa`) pass it. The MCP server's name in the table is what lets the user catch that.

**3e. Confirm.** Display the table with every value and its check result, then ask: *"Does everything
look correct? Type yes to proceed or correct any values."* A corrected value goes through its checks
again.

| Variable | Resolved Value | Check |
|---|---|---|
| `CLIENT_NAME` | _(from user)_ | non-empty |
| `CLIENT_NAME_LOWER` | _(auto-derived)_ | — |
| `CLIENT_SLUG` | _(auto-derived)_ | non-empty |
| `REALM` | _(from user)_ | realm exists on `AUTH_URL` |
| `ENV` | _(from user)_ | non-empty |
| `CLIENT_ID` | _(from user)_ | client exists + allows `localhost:9000` |
| `AUTH_URL` | _(from user)_ | format + OIDC discovery 200 |
| `API_URL` | _(from user)_ | format + `__typename` |
| MCP server | _(name of the connected MCP)_ | serves the BI types of `API_URL` |
| `SCHEMA_API` | _(auto-derived — `v1` / `v2`)_ | `__type` check through the MCP (3d.5) |
| `GITHUB_REPO` | _(from user or blank)_ | blank or `org/repo` |
| `PORTAL_SUBDIR` | _(auto-derived)_ | see the wipe guard in Step 4 |
| `PORTAL_ID` | _(auto-generated — `vx-{CLIENT_SLUG}-{openssl rand -hex 4}`)_ | — |
| `GENERATED_AT` | _(auto-derived — today, `YYYY-MM-DD`)_ | — |
| `EMBED_UXM_STUDIO` | _(from user or `no`)_ | yes / no |
| `THEME_PICKER` | _(from user or `no`)_ | yes / no |
| `LOCALIZATION` | _(from user or `yes`)_ | yes / no |

---

## Step 4 — Execute the Build Prompt

Once the user confirms, use the **Read** tool to load the full build prompt:

```
File: references/BEM-based-app-generator-MetaPrompt.md
```

Replace every `{{PLACEHOLDER}}` in that document with the confirmed values collected above, then carry out **all instructions exactly as written** in the prompt.

Key reminders:
- **Wipe guard — before deleting anything in `{{PORTAL_SUBDIR}}`.** The MetaPrompt says to wipe that
  directory and start fresh. Resolve it to an absolute path first and refuse if it is empty, `/`,
  the home directory, the repository root or the current working directory itself. If it exists and
  is not empty, wipe it without asking only when its `package.json` has
  `"portal": { "generator": "viax-build-portal" }` (an earlier generated portal); otherwise list
  what is there and ask before deleting.
- **No placeholder left behind (MANDATORY — the last check of the build).** After the last
  Implementation Order step, `grep -rnE '\{\{[A-Z_]+\}\}' src index.html package.json vite.config.js .env.local .env.example`
  in the portal directory must return nothing (the pattern is the placeholder shape, so JSX's
  `style={{ … }}` does not match). A hit means a value was never substituted: fix it from
  the confirmed table, never by guessing.
- Follow the **Implementation Order** section top-to-bottom — do not reorder or skip steps.
- **Authentication — follow the [`viax-keycloak-auth`](../viax-keycloak-auth/SKILL.md) skill.** It owns the `keycloak-js` singleton, `onLoad: 'login-required'` (no login page, no `/login` route), the mandatory `checkLoginIframe: false` + refresh interval, the in-memory auth store without roles, `ProtectedRoute`, the Bearer interceptor and 401 handler, sign-out, mock auth as a Vite mode, and the realm checks. **Copy** its `reference-implementation.md`; this MetaPrompt adds only the portal glue (values, port 9000, the sign-out position, `main.jsx` with the identity stamp) — see *"Authentication"* in the MetaPrompt.
- **UI — follow the [`viax-uxm-conventions`](../viax-uxm-conventions/SKILL.md) skill.** It is the source of truth for how every page is built on `@viax.io/uxm`: the one rule (shipped atoms + tokens only, no hand-rolled replicas, no invented tokens or hard-coded colours), the reusable patterns, the composition gotchas (no `Card` around a `DataTable` / `DetailSection`, columns mean `DataTable`, …), spacing, responsive, and the host stylesheet (no `.uxm-*` selectors, no `--color-*` declarations). Prop facts come from [`viax-uxm`](../viax-uxm/SKILL.md). The MetaPrompt adds only the portal's realization — the `globals.css` knob values (*"Portal stylesheet and fonts"*), the shell and the page specs.
- **Data layer — follow the [`viax-graphql-data-layer`](../viax-graphql-data-layer/SKILL.md) skill.** It owns the one GraphQL client and `execute()`, the `lib/api/*` modules with their normalization (prices by `mapsOn.code`, no invented currency, `bpStatus { code name }`, `parParty`), the hooks, mock data as a Vite mode, the API gotchas, and writes that run on Schema API v1 and v2 (`_actions` as a variable built with `setTo()`, `VITE_SCHEMA_API={{SCHEMA_API}}`). The MetaPrompt adds only the portal's domain modules — the BI sections, products, the current user — see *"Data layer"*.
- **Runtime theming — follow the [`viax-uxm-theming`](../viax-uxm-theming/SKILL.md) skill.** It owns the whole topic: the `getUxmConfig` / `saveUxmConfig` contract, the wire shape, the applier that turns the published config into design tokens, the three modes, the `portal.id` identity block, the per-portal theme assignment (`portals[portal.id].themeId`), and the theming gotchas (the `--font-sans` bridge, `font: inherit` on native controls, never redeclaring `--color-accent*`). This MetaPrompt only adds the portal-specific glue — mode flags `{{EMBED_UXM_STUDIO}}` / `{{THEME_PICKER}}` (both default `no`), `{{CLIENT_SLUG}}` naming, and the shell wiring — see *"Runtime Theming"* in the MetaPrompt. **Always** build the consume side; **never** hand-build a theme editor.
- **Portal identity stamp (MANDATORY — never skip) — follow [`viax-uxm-theming`](../viax-uxm-theming/SKILL.md) → *App identity*.** The portal's values (`id` = `{{PORTAL_ID}}`, `generator: "viax-build-portal"`, …) are in *"General Notes → Portal identity stamp"* in the MetaPrompt. Before declaring the build done: `npm run build && grep -o "{{PORTAL_ID}}" dist/assets/*.js`.
- **BI types — follow the [`viax-bem-discovery`](../viax-bem-discovery/SKILL.md) skill** (step 8 in Implementation Order). It asks the user for the BEM (uid or code — a code has several versions, it takes the right one), walks the whole tree, drops and reports types that do not exist, and writes `src/lib/bi-types.config.js` with each type's interface flags, `partyFields` and status values. The MetaPrompt adds only what the portal builds from the registry — see *"BI Types & Dynamic Route Generation"*.
- **Access & permissions — follow the [`viax-access`](../viax-access/SKILL.md) skill.** The API decides what each user sees and may change; the portal never decides it from role names, `paMappedRolesList` or `partyFields`. At step 8, after BEM discovery, run its build-time steps (discover the realm's policies via MCP, ask the user which Keycloak roles the portal serves, write the **Access model** and **Access audit** into `design.md`, report the audit findings — never change policies). In the code, implement its runtime contract in `src/access/*`: `ACCESS_DENIED` classified in `lib/graphql-client.js` and never retried, navigation items and BI routes gated by probes, one query per guarded section on the detail page, read-only by default, edit controls only where the access model says `write`. The portal-specific bindings are in *"Access & permissions"* in the MetaPrompt.
- **Localization (only when `{{LOCALIZATION}} = yes`) — follow the [`viax-localization`](../viax-localization/SKILL.md) skill.** It owns the whole topic, and it **ships the layer as code** — copy `src/i18n/*`, `lib/api/i18n.js` and the three npm scripts from its `reference-implementation.md` / `scripts.md` rather than writing them, because every viax React app runs the identical layer. It covers: the locale files (generated `src/i18n/locales/*.json`, the single source of UI copy, no i18n runtime dependency), the distinction between that copy and entity data the server localizes from the `X-Viax-User-Locale` header, the file shape, the boot gate that holds the app until the language is settled, locale resolution and server-side persistence via `updateViaxI18NPreferences`, the `X-Viax-User-Locale` header, the `LanguageSwitcher` contract, and all currency / date / number formatting. This MetaPrompt only adds the portal glue — see *"Localization & i18n"* there.
  - **When `yes` it is mandatory and runs BEFORE any page** (step 3 in Implementation Order). Nothing further is collected from the user: the locale list comes from `getSupportedLocales` for the realm and is **never hardcoded**, never guessed, and never a config question.
  - **When `no`, skip steps 3 and 14 entirely** — no `src/i18n/`, no `LanguageSwitcher`, no locale/currency headers, no `gen:locales` / `scan:i18n` / `test:i18n` scripts. Copy is written in English directly in the JSX. Two things still hold: `design.md` records that the portal is **not** localized and that adding it later is a retrofit, and **money, dates and numbers still go through `Intl`** via `lib/utils/format.js` with a fixed `'en-US'` — never `toFixed()` with a hand-written separator, and never a hardcoded currency. See *"Formatting when the app is not localized"* in the skill.
  - **This applies to every LATER change too, not just the first build.** Adding a page (or a column, or a message) adds its keys in the same change: real values in the default locale, the same keys with `null` in every other. Use the generated `npm run gen:locales`; `npm run scan:i18n` is what catches a surface whose copy never reached the files.
  - **Probe `I18NPreferences.i18Language` per realm** — it is `null` on every row in Palooza Demo, so the server preference is an optional input to resolution, never a guaranteed one. State the outcome in `design.md` rather than assuming it.
  - **UI copy lives in the portal, not in viax.** There is no readable catalog of it, so changing a label is a deploy. `design.md` must say so rather than implying a business user can edit copy in the backend.
  - **If `LanguageSwitcher` is not exported by the installed `@viax.io/uxm`, STOP and report** — never hand-roll or copy one into the portal.
  - The Implementation Order ends with the font smoke-check (step 13, **always mandatory**) and — when `{{LOCALIZATION}} = yes` — a **hardcoded-string scan that fails the build** (step 14), and always with the placeholder check (step 15). A localized surface starts at zero hits.
- All `{{CLIENT_NAME}}`, `{{REALM}}`, `{{ENV}}`, `{{AUTH_URL}}`, `{{API_URL}}`, etc. must be replaced with concrete values before acting on any instruction that references them.

## Related skills

The portal is assembled from these; each owns its topic, and the MetaPrompt adds only the portal's
values and glue.

| Skill | Owns | MetaPrompt section |
|---|---|---|
| [`viax-keycloak-auth`](../viax-keycloak-auth/SKILL.md) | login, session, Bearer header, mock auth | *Authentication* |
| [`viax-graphql-data-layer`](../viax-graphql-data-layer/SKILL.md) | the GraphQL client, `lib/api/*`, normalization, mock data, v1/v2 writes | *Data layer* |
| [`viax-bem-discovery`](../viax-bem-discovery/SKILL.md) | the BEM → `bi-types.config.js` | *BI Types & Dynamic Route Generation* |
| [`viax-access`](../viax-access/SKILL.md) | what each user sees and may change | *Access & permissions* |
| [`viax-uxm-conventions`](../viax-uxm-conventions/SKILL.md) | how pages are built on uxm; the host stylesheet rules | *Design System*, *Page Specifications* |
| [`viax-uxm`](../viax-uxm/SKILL.md) | uxm components, props, glyphs, tokens | (referenced throughout) |
| [`viax-uxm-theming`](../viax-uxm-theming/SKILL.md) | runtime theming, the studio, the `portal` identity block | *Runtime Theming*, *General Notes #4* |
| [`viax-localization`](../viax-localization/SKILL.md) | copy, language switch, formatting | *Localization & i18n* |
| [`graphql`](../graphql/SKILL.md) | the platform API; Schema API v1/v2 | (via the data layer) |

Not this skill: a brand-led portal on the shared Next.js portal kit (motion layer, brand brief) is
[`viax-portal-generator`](../viax-portal-generator/SKILL.md).
