# tests/

The Vitest smoke suite: **contracts, not coverage.** It runs in jsdom with
Testing Library and axe-core, takes a few seconds, and is a required gate in
CI (`test:ci`, after `build`). `npm test` runs it once, `npm run test:watch`
while iterating, `npm run test:coverage` prints a coverage summary for
orientation only — there are deliberately **no thresholds and no coverage
gate**, and none should be added: thresholds are what makes a suite get in the
way of a library that ships several fixes a day.

## What is pinned here

| Area | Files | Why |
|---|---|---|
| **Public surface** | `public-api.test.ts`, `theming-contract.test.ts` | The export names of every subpath in the `exports` map, every `--uxm-*` variable the `src/ui` stylesheets read, and that each entry loads from `dist/` as both ESM and CJS. The only gate over the `tsc-alias` / `fix-cjs-requires` build steps. |
| **Pure logic** | `contrast`, `tokens`, `calendar-grid`, `phone-countries`, `currencies`, `helpers`, `persistence` | Functions that ship from the root, `/tokens`, `/hooks` and `/studio` and have no DOM to verify them in. |
| **Hooks** | `hooks.test.tsx` | Every hook exported from `/hooks`, through a throwaway component. |
| **Floating layers & pickers** | `dialog`, `popover`, `listbox`, `disclosure`, `radio-group`, `editable-cell`, `toast`, `icon-button`, `icon` | Focus trap, Escape, outside click, ARIA wiring, commit / cancel paths — what only a screen reader would otherwise catch. |
| **Studio persistence** | `css-sanitizers`, `generate-css` | The CSS the studio writes into a consumer's app. |
| **axe** | `a11y.test.tsx` | One axe pass over a form and a dialog. Keep it to a handful of `it`s; axe is slow. |

## The snapshot rule

Snapshots are allowed for exactly one thing: **lists of names** (exports,
variables), in `__snapshots__/`. Never for rendered markup.

When a snapshot test fails, read the diff before refreshing:

- A **minus line** is a removed export or theming knob. That is a **MAJOR**
  for consumers (constitution, Principle III) — unless the old name is kept as
  a fallback alias, the way `var(--uxm-x-new, var(--uxm-x-old, …))` chains do.
- A **plus line** is a new export or knob: a MINOR.

Refresh with `npx vitest run -u` and review the snapshot diff in the PR as the
API changelog. CI never writes snapshots; a mismatch there fails the run.

## Ground rules for a new test

- **Contract, not implementation.** Assert what the README promises: roles,
  ARIA state, what a key does, what a function returns. No class-name
  assertions beyond a BEM modifier the README names, no CSS.
- **jsdom has no layout.** `setup.ts` shims `scrollIntoView`, `ResizeObserver`
  and `offsetParent`. Anything positional — popover placement, keep-in-view,
  resize maths — is out of scope and stays on the portal (`npm run dev:modo`).
- **One file per module**, `tests/<folder-name>.test.ts(x)`; `describe` named
  after the export; `it` sentences readable as a spec (see `dialog.test.tsx`).
- **User events, not fireEvent**, for keyboard and pointer
  (`@testing-library/user-event`).
- **Import through the barrels** (`@/ui`, `@/hooks`, `@/lib/...`) so they stay
  exercised.
- If the README turns out to promise something the code does not do, fix the
  README in the same PR — never write the test to the wrong contract.

## When to add an atom test

Only when a PR **changes an atom's behaviour** — keyboard handling, ARIA
state, commit / cancel paths — or fixes a behavioural bug. The test goes in
that PR, testing only what the README promises. Never a coverage-only PR, and
nothing for presentational atoms: for a visual change "tests pass" proves
nothing, the verification is `typecheck`, `lint`, `build` and the portal in
both themes.

Atoms with the most behaviour of their own, for when they come up: `menu`,
`search-dropdown`, `pill-select`, `code-editor`, `calendar`, `time-input`,
`number-input`, `currency-input`, `phone-input`, `date-input`, `color-input`,
`side-flexpane`, `file-upload`. The cheap ARIA pins (`toggle-switch`
`role="switch"`, `tabs` `aria-selected`, `view-switcher` `aria-pressed`,
tooltip `aria-describedby`) can share one `aria-contracts.test.tsx` when the
first of them is touched.

Skipped on purpose: `data-table` (keyboard is the consumer's job per its
README) and every layout / display atom.
