---
name: viax-build-portal
description: Scaffold a new viax customer-facing portal from scratch. Collects client configuration then executes the full BEM-based portal build prompt. TRIGGER when: user says "build a portal", "generate a portal", "create a portal", "new portal", "scaffold a portal", "set up a portal", mentions building for a new client, or asks to start a viax customer portal project.
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

---

## Step 2 — Collect Configuration (Round 2: URLs & Branding)

Send **one message** asking for the remaining values:

> "Thanks! Now the URLs and branding:
> 5. **Keycloak base URL** — e.g. `https://auth.palooza.demo.viax.io`
> 6. **viax GraphQL endpoint** — e.g. `https://api.palooza.demo.viax.io/graphql`
> 7. **Target GitHub repository** (org/repo) — leave blank if not yet known
> 8. **Primary accent color** (hex) — press Enter to use default `#4FD0A5`
> 9. **Accent hover color** (hex) — press Enter to use default `#43B18C`
> 10. **Embed the UXM Studio editor at `/uxm`?** (yes/no) — press Enter for the default `no`. Either way the portal always loads and applies the env's published UXM Studio config (styles/tokens) via `getConfig`; `yes` additionally mounts the live editor inside this portal.
> 11. **Show a theme picker in the header?** (yes/no) — press Enter for the default `no`. Only says yes if UXM Studio published *multiple* named themes for this client and end users should be able to select among them; read-only (no create/edit/delete), independent of question 10."

Normalize the answers to `yes`/`no` (default `no`) → `EMBED_UXM_STUDIO`, `THEME_PICKER`.

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
| `ACCENT_COLOR` | _(from user or #4FD0A5)_ |
| `ACCENT_HOVER_COLOR` | _(from user or #43B18C)_ |
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
- **Runtime theming consumes the env's published UXM Studio config; embedding the editor is OPTIONAL (`{{EMBED_UXM_STUDIO}}`, default `no`)** — see *"Runtime Theming — consume the UXM Studio config (optionally embed the editor at `/uxm`)"*. **Always** build the consume side: config store + the **read** `lib/api/config.js` helpers (`fetchMfaConfig`/`fetchStudioConfig`) + app-level applier + the `useHydrateStudioConfig` boot hook (the config is **loaded back on app boot** from the MFA config's `uxmStudio` key). **Only when `EMBED_UXM_STUDIO = yes`** also build the editor: `lib/uxm-persistence.js` + the `saveMfaConfig`/`saveStudioConfig` write helpers + the `<UxmApp embed>` page + the `/uxm` route + the "UXM Studio" Settings item + the `@viax/uxm/studio.css` import. Do **NOT** hand-build a custom admin theme EDITOR (color pickers, brand-token forms, a second save path) in either mode — that duplicates UXM Studio's own editing UI. A separate, OPTIONAL, read-only theme **picker** (`{{THEME_PICKER}}`, default `no`) letting end users select among themes already published in UXM Studio's `themes[]` is supported — see *"Optional: read-only theme picker"* in the MetaPrompt; it never writes to the server so it doesn't conflict with the no-editor rule. Requires `@viax/uxm@^3.1.2` or newer — always `npm i @viax/uxm@latest`. Seed the studio brand with the collected accent colors; **do NOT redeclare `--color-accent*` in `globals.css`** — the studio config is the single source of truth for the accent ramp. The same applies to the typeface: Brand Settings → **Typography** (`brand.fontFamily`) in the published config re-fonts the portal via `--brand-font`; the portal's only base-font declaration is the `html, body, #root { font-family: var(--brand-font, var(--font-sans)) }` chain from the `globals.css` baseline (Inter loaded in `index.html`). That chain **requires** the `:root { --font-sans: var(--font-inter, …) }` bridge that the baseline also ships — `@viax/uxm/tokens.css` declares `--font-sans` only inside a Tailwind-only `@theme inline` block that browsers drop, so without the bridge the declaration is invalid at computed-value time and the whole portal falls back to Times New Roman. The baseline also ships `button, input, select, textarea { font: inherit }` — native form controls do NOT inherit the document font, so without it every raw (non-uxm) control renders in Arial. The MetaPrompt's Implementation Order ends with a **mandatory font smoke-check (step 12)** — run it; do not declare the build done while any of its checks fail.
- The **BEM Discovery** step (step 7 in Implementation Order) requires asking the user for a BEM UID or code — that interactive question is already embedded in the prompt under *"BEM Discovery & Dynamic Route Generation → Step 1"*.
- All `{{CLIENT_NAME}}`, `{{REALM}}`, `{{ENV}}`, `{{AUTH_URL}}`, `{{API_URL}}`, etc. must be replaced with concrete values before acting on any instruction that references them.
