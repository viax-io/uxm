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
- **Runtime theming — follow the [`viax-uxm-theming`](../viax-uxm-theming/SKILL.md) skill.** It owns the whole topic: the `getUxmConfig` / `saveUxmConfig` contract, the wire shape, the applier that turns the published config into design tokens, the three modes, the `viax.portalId` identity block, and the theming gotchas (the `--font-sans` bridge, `font: inherit` on native controls, never redeclaring `--color-accent*`). This MetaPrompt only adds the portal-specific glue — mode flags `{{EMBED_UXM_STUDIO}}` / `{{THEME_PICKER}}` (both default `no`), `{{CLIENT_SLUG}}` naming, and the shell wiring — see *"Runtime Theming"* in the MetaPrompt. **Always** build the consume side; **never** hand-build a theme editor.
- **Portal identity stamp (MANDATORY — never skip).** Every generated portal must be uniquely identifiable. Three pieces, all required, spec'd in *"General Notes → Portal identity stamp"* in the MetaPrompt: (1) the `"viax"` metadata block in `package.json` (`portalId` = `{{PORTAL_ID}}`, `generator`, `client`, `realm`, `env`, `generatedAt` = `{{GENERATED_AT}}`); (2) `vite.config.js` reads that block and exposes it to the bundle as `__PORTAL_META__` via `define`; (3) `main.jsx` calls `stampPortalId()` on boot — appends `<meta name="viax-portal-id">` to `<head>` and logs `[viax] portal …` to the console, so a *deployed* portal is identifiable from the DOM/console without source access (`package.json` itself is not deployed). Before declaring the build done, verify the ID landed in the production bundle: `npm run build && grep -o "{{PORTAL_ID}}" dist/assets/*.js`.
- The **BEM Discovery** step (step 7 in Implementation Order) requires asking the user for a BEM UID or code — that interactive question is already embedded in the prompt under *"BEM Discovery & Dynamic Route Generation → Step 1"*.
- All `{{CLIENT_NAME}}`, `{{REALM}}`, `{{ENV}}`, `{{AUTH_URL}}`, `{{API_URL}}`, etc. must be replaced with concrete values before acting on any instruction that references them.
