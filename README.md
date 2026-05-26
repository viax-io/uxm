# @viax/uxm

Viax UXM — React 19 UI primitives and design tokens.

This package ships:

- **UI primitives** (`@viax/uxm/ui`) — ~65 BEM-classed React components built for Next.js App Router (React 19).
- **Icon registry** (`@viax/uxm/ui`) — `ICONS`, `ICON_OPTIONS`, `getIcon`, `IconDef` for tooling that needs to enumerate / look up the bundled icon set.
- **Design tokens** (`@viax/uxm/tokens`) — the canonical `themeTokens` array plus helpers (`findToken`, `resolveHex`, `isTokenValue`) and the `ThemeToken` type.
- **WCAG / contrast helpers** (`@viax/uxm`) — `contrastRatio`, `parseColor`, `rgbToHex`, `suggestAccessibleColor`, `suggestAccessibleToken`, `wcagLevel`, plus `RGB` and `TokenCandidate` types.
- **Default stylesheet** (`@viax/uxm/ui.css`) — component primitive defaults keyed off the design tokens.
- **Token stylesheet** (`@viax/uxm/tokens.css`) — CSS custom property declarations for the token system.

## Install

```bash
npm install @viax/uxm
```

Peer deps: `react@^19`, `react-dom@^19`.

The package is published to the Viax GitLab Packages npm registry; see [Configure the GitLab registry](#configure-the-gitlab-registry) below.

## Quick start (Next.js App Router)

```ts
// app/layout.tsx
import "@viax/uxm/tokens.css";
import "@viax/uxm/ui.css";
```

```tsx
// app/page.tsx
"use client";
import { Button, Icon } from "@viax/uxm/ui";

export default function Page() {
  return (
    <Button variant="primary">
      <Icon glyph="sparkles" /> Hello UXM
    </Button>
  );
}
```

If you want to consume tokens programmatically:

```ts
import { themeTokens, findToken, resolveHex } from "@viax/uxm/tokens";

const accent = findToken("color.brand.accent");
const hex = resolveHex(accent?.value ?? "#000");
```

Both primary entry points are also available from the root:

```ts
import { Button, themeTokens } from "@viax/uxm";
```

## Configure the GitLab registry

This package is private. Configure your local npm to authenticate against the
Viax GitLab Packages registry. Copy `.npmrc.example` to either your project root
or `~/.npmrc` and replace `<PERSONAL_ACCESS_TOKEN>` with a GitLab personal
access token that has `read_api` (and `write_api` if you intend to publish):

```ini
@viax:registry=https://gitlab.viax.tech/api/v4/projects/services-viax%2Fuxm/packages/npm/
//gitlab.viax.tech/api/v4/projects/services-viax%2Fuxm/packages/npm/:_authToken=<PERSONAL_ACCESS_TOKEN>
```

## Build

```bash
npm install
npm run build      # tsup → dist/ (ESM + CJS + .d.ts + CSS)
npm run typecheck  # tsc --noEmit
npm run dev        # tsup --watch (useful for local linked dev)
```

Output layout under `dist/`:

```
dist/
├── index.{js,cjs,d.ts}
├── ui/
│   ├── index.{js,cjs,d.ts}
│   ├── styles.css
│   └── …per-component files…
└── tokens/
    ├── index.{js,cjs,d.ts}
    └── index.css
```

## Local linked development (e.g. modo)

From the consumer project (`apps/modo`):

```bash
npm install file:../../uxm          # adjust path
```

Run `npm run dev` here to keep `dist/` fresh; Next.js dev server will pick up
changes after recompiling.

## Publish

```bash
npm version <patch|minor|major>
npm publish
```

`prepublishOnly` runs `npm run build` automatically. Ensure your `.npmrc`
contains a token with `write_api` scope.

## License

UNLICENSED — internal Viax use.
