# React Style Guide — `@viax.io/uxm`

Quick reference for writing React 19 components in `@viax.io/uxm`, a **standalone,
published** UI library (not a monorepo). Consumers — `modo` and other Viax
apps — are **client-side SPAs** (Vite + React). The rules below match the real
code; where this guide and `.claude/memory/constitution.md` disagree, the
constitution wins.

> **Note on BEM:** this repo uses **canonical BEM** — `uxm-block__element--modifier`
> (double underscore `__`, double dash `--`). Variant classes are often folded into
> the block name (`uxm-button-primary`, not `uxm-button--primary`). Do **not**
> confuse with `legacy/bem-style-guide.md`, which describes the old Viax Vue
> convention (`x-block__element_modifier_value`) and does not apply here.

---

## Project structure

```
src/
  index.ts                     # root barrel: ui + tokens + WCAG helpers
  ui/                          # primitive components — one folder per component
    <name>/                    # e.g. button/, disclosure/, listbox/
      <name>.tsx               # component implementation (named export)
      <name>.scss              # component-scoped styles (nested BEM, .uxm-<name>*)
      <name>-preview.tsx       # studio canvas preview — NEVER re-exported from a ui barrel
      index.ts                 # barrel — value + type re-exports
      README.md                # usage, props, DOM/class contract (required)
    index.ts                   # named exports + type exports for the whole UI lib
    styles.css                 # aggregator — only `@import "./<name>/<name>.css"` lines
  tokens/
    index.ts                   # `themeTokens: ThemeToken[]` catalog (typed)
    index.css                  # `--color-*` / `--shadow-*` / `--font-*` on :root (+ dark)
  previews/                    # shared preview contract (types.ts) + composite previews
  studio/                      # the UXM design workbench (UxmApp) — Tailwind allowed here only
  helpers/                     # cn, merge-refs, merge-described-by (`@/helpers`)
  hooks/                       # shared hooks (use-dismiss, use-focus-trap, …)
  lib/                         # pure logic + data (icons, contrast, calendar-grid, …)
portal/                        # Vite dev shell for the studio (`npm run dev:modo`) — not published
skills/viax-uxm/               # the consumer-facing AI skill — updated in the same MR as a component
```

The only path alias is `@/*` → `src/*` (`tsconfig.json`).

---

## A. Component structure

### A1. One component per folder, kebab-case filename, PascalCase export

```
src/ui/disclosure/disclosure.tsx   → export function Disclosure(...) {}
src/ui/button/button.tsx           → export function ButtonPrimary(...) {}, ButtonGhost(...), …
src/ui/list/list.tsx               → export function List(...), ListItem(...)  // compound
```

Each component lives in its own folder with its `.scss`, `index.ts` barrel,
`-preview.tsx` and `README.md`. Consumers import from the package barrels
(`@viax.io/uxm` or `@viax.io/uxm/ui`) — deep imports into individual files are **not**
a supported contract (constitution III).

### A2. No `"use client"` directives

Consumers are client-side SPAs. There are no Server Components, no `"use client"`,
no `"use server"`. Never add the directive; remove it from any code you touch.

### A3. Named exports only

```tsx
// good
export function Disclosure(props: DisclosureProps) { ... }

// bad
export default function Disclosure(props: DisclosureProps) { ... }
```

`src/ui/index.ts` is an explicit list of named re-exports. Default exports break
this pattern and complicate tree-shaking.

### A4. Compound components live in the same file

Components that are always used together (`List` + `ListItem`, `RadioGroup` +
`RadioOption`, `Modal` + `Modal.Header/Body/Footer`) live in one file and are
exported together.

### A5. Previews never leak into `/ui`

`<name>-preview.tsx` is exported **only** from `src/previews/index.ts`. Neither
`src/ui/index.ts` nor any `src/ui/<name>/index.ts` may re-export it — this is the
tree-shake guarantee for consumers that import only `@viax.io/uxm/ui`. Nothing
enforces it at build time; check by hand when touching a barrel.

---

## B. Props API

### B1. Always declare and export `${Name}Props`

```tsx
export interface DisclosureProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  icon?: ReactNode;
  label: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Disclosure({ icon, label, open, defaultOpen, onOpenChange, ...rest }: DisclosureProps) { ... }
```

Export the prop type alongside the component from both barrels:

```ts
export { Disclosure } from './disclosure';
export type { DisclosureProps } from './disclosure';
```

### B2. Extend native HTML element attributes

When a component wraps a single semantic element, extend that element's attribute
interface so consumers can pass `data-*`, `aria-*`, event handlers, `id`, etc.:

```tsx
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { ... }
interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> { ... }
interface CardProps extends HTMLAttributes<HTMLDivElement> { ... }
```

Use `Omit<NativeProps, 'conflictingKey'>` when you redefine a native prop with a
different signature (e.g. `onChange(checked: boolean)` instead of the native
`onChange(e: ChangeEvent)`).

### B3. Controlled / uncontrolled pair

Components with internal state SHOULD support both modes using React's standard
convention:

| Component kind | Controlled prop | Default prop | Change emitter |
|---|---|---|---|
| Inputs (text, number, select) | `value` | `defaultValue` | `onChange` |
| Checkbox / radio / toggle | `checked` | `defaultChecked` | `onChange` |
| Disclosures / dialogs / popovers | `open` | `defaultOpen` | `onOpenChange` |
| Tabs | `value` | `defaultValue` | `onValueChange` |

```tsx
export function Disclosure({ open: controlledOpen, defaultOpen = false, onOpenChange, ... }: DisclosureProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const toggle = () => {
    const next = !open;
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };
  ...
}
```

### B4. Always accept and forward `className` via `cn()`

```tsx
import { cn } from '@/helpers';

export function Card({ className, children, ...rest }: CardProps) {
  return <div className={cn('uxm-card', className)} {...rest}>{children}</div>;
}
```

`cn()` lives in `src/helpers/cn.ts` and filters falsy values:

```ts
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
```

### B5. Spread `...rest` onto the root element

Whenever practical, spread the remaining native props onto the root so consumers
can attach `onClick`, `data-*`, `aria-*`, `id`, `style`, etc.:

```tsx
export function ButtonPrimary({ className, type = 'button', ...rest }: ButtonProps) {
  return <button type={type} className={cn('uxm-button-primary', className)} {...rest} />;
}
```

Behaviour shells (`Dialog`, `Popover`, `HoverTooltip`, `Toaster`) are the
documented exception — they own no visible root of their own.

### B6. Default values via destructuring

```tsx
// good
function Disclosure({ defaultOpen = false, type = 'button' }: Props) { ... }

// bad
Disclosure.defaultProps = { defaultOpen: false };
```

### B7. Children via `ReactNode`

```tsx
interface Props { children: ReactNode }          // good
interface Props { children: JSX.Element }        // too restrictive
```

### B8. Boolean props default to `true` when present without a value

```tsx
<Disclosure defaultOpen />     // === defaultOpen={true}
```

### B9. `id` / `aria-describedby` on form atoms

Form atoms must forward `id` to the real control and **merge** (not replace) an
incoming `aria-describedby` with their own hint/error ids — use
`mergeDescribedBy` from `@/helpers`.

---

## C. Hooks & state

### C1. Rules of Hooks

- Call hooks ONLY at the top level of a function component or another custom hook
- Never inside loops, conditions, or nested functions
- Hook names start with `use` (`useDismiss`, `useFocusTrap`)

### C2. Hook placement

| Where | What |
|---|---|
| `src/hooks/` | Reusable behaviour hooks (`useDismiss`, `useFocusTrap`, `useRovingTabIndex`, `useScrollLock`, `usePortal`) |
| `src/lib/` | Pure logic and data with no React (`contrast`, `calendar-grid`, `icons`) |
| `src/studio/lib/` | Studio-only hooks and context (`useUxm`, `useGlobalTheme`) |
| Co-located with the component | Tightly coupled to one atom, never reused |

### C3. State primitives

- `useState` — primitives and shallow values
- `useReducer` — complex transitions (multi-step editors)
- `useRef` — mutable values that should NOT trigger re-render, or DOM refs

### C4. `useEffect` rules

- **Minimise effects.** Most of what looks like an effect is derived state.
- Always declare a complete dependency array; if you deliberately narrow it,
  disable `react-hooks/exhaustive-deps` on that line **with a `-- reason`**.
- Always return cleanup for `setInterval`, `setTimeout`, `addEventListener`,
  `AbortController`, `ResizeObserver`.
- Never use `useEffect` to copy a prop into state:

```tsx
// BAD — derived state via effect
useEffect(() => { setFullName(`${firstName} ${lastName}`); }, [firstName, lastName]);

// GOOD — compute on render
const fullName = `${firstName} ${lastName}`;
```

The rare legitimate "sync external value into a draft" effect (EditableCell,
TimeInput) is gated and carries a justified
`eslint-disable-next-line react-hooks/set-state-in-effect -- …`.

### C5. `useCallback` / `useMemo` — only when justified

- the value feeds a `React.memo`'d child whose props must stay stable
- the value sits in another hook's dep array
- the computation is genuinely expensive (profile first)

### C6. Refs on consumer-rendered elements

Trigger-render props (`Listbox`, `Menu`, `HoverTooltip`) hand the consumer a
`triggerProps` object containing a ref-setter callback. `react-hooks/refs` flags
the pattern; it is the React-blessed way — keep the disable comment and its
reason.

---

## D. TypeScript conventions

### D1. `.tsx` for JSX, `.ts` for logic-only files

### D2. No `any`

Use `unknown` and narrow with `typeof` / `instanceof` / type guards. A new `any`
or `@ts-expect-error` needs an inline comment justifying it (constitution V).

### D3. Import types separately

```ts
import { useState } from 'react';

import type { ChangeEvent, ReactNode } from 'react';
```

ESLint (`consistent-type-imports`, `fixStyle: separate-type-imports`) enforces
this; `import { useId, type ReactNode } from 'react'` is also accepted.

### D4. Generic components

```tsx
interface DataTableProps<T extends Record<string, unknown>> {
  rows: T[];
  columns: Array<DataTableColumn<T>>;
}

export function DataTable<T extends Record<string, unknown>>({ rows, columns }: DataTableProps<T>) { ... }
```

### D5. `ReactNode` for slots, not `ReactElement`

Only narrow to `ReactElement` when you genuinely need `cloneElement` or to inspect
props (`HoverTooltip` does).

---

## E. Styles — SCSS, BEM, two-layer theming

### E1. BEM with `--` modifiers

```
uxm-block__element--modifier
```

| Part | Example |
|---|---|
| Block (root) | `uxm-disclosure` |
| Variant folded into the block | `uxm-button-primary`, `uxm-button-ghost` |
| Element | `uxm-disclosure__chevron` |
| Modifier on block | `uxm-disclosure--open` |
| Modifier on element | `uxm-disclosure__chevron--rotated` |
| Boolean state | a modifier: `uxm-checkbox--disabled` (never `is-disabled`) |
| Studio forced state | `uxm-button-primary--state-hover` — shares the selector with the real `:hover` rule |

### E2. Where styles live

- `src/ui/<name>/<name>.scss` — **the** stylesheet for that atom, authored as
  nested BEM (`&__element`, `&--modifier`), compiled by the build to a sibling
  `<name>.css` in `dist/`. Every `.css` under `src/ui/` except `styles.css` is
  build output — never edit or commit one.
- `src/ui/styles.css` — aggregator only; a pure `@import "./<name>/<name>.css"`
  list in cascade order. Add one line per new atom.
- `src/tokens/index.css` — the global tokens (light on `:root`, dark under
  `[data-theme="dark"]`).
- `src/studio/studio.css` — Tailwind entry for the workbench (studio only).

Consumers import `@viax.io/uxm/tokens.css` + `@viax.io/uxm/ui.css` (or
`@viax.io/uxm/studio.css`, which bundles both plus the studio utilities). Studio
overrides are **not** a file in this repo — `generateOverridesCss()` emits them at
runtime into a `<style id="uxm-overrides">` tag.

Any rule that touches `.uxm-<block>*` MUST live in `<block>/<block>.scss`. Rules
that visually span two components (e.g. `.uxm-breadcrumb .uxm-link`) live with the
**context** component (breadcrumb).

### E3. Two-layer theming — the core contract

Every themable declaration reads a **component-scoped override with a global
token fallback**:

```scss
.uxm-button-primary {
  background-color: var(--uxm-button-primary-background-color, var(--color-accent-bold));
  color: var(--uxm-button-primary-color, var(--color-text-inverse));
  border-radius: var(--uxm-button-primary-border-radius, 8px);

  &:hover {
    background-color: var(--uxm-button-primary-hover-background-color, …);
  }
}
```

- `--uxm-<component>-[<state>-]<prop>` — per-instance override the studio writes;
  unset by default so the fallback paints.
- `--color-*` / `--shadow-*` / `--font-*` — the global brand layer from
  `src/tokens/index.css`.
- The fallback of a **per-state** var is that state's default, and the studio
  registry's `defaultValue` for the matching knob is the source of truth —
  `npm run check:drift` diffs the two and fails CI on drift.
- Never hardcode colours, spacing, radii. The allowed literals (`0`, `1px`
  hairlines, `inherit`, `currentColor`, intrinsic geometry such as a colour
  picker's gradients) MUST carry a justifying comment.

### E4. Type scale

Every `font-size` is wrapped so the global `--type-scale` knob reaches it:

```scss
font-size: calc(var(--uxm-button-primary-font-size, 14px) * var(--type-scale, 1));
```

The multiplication goes **outside** the `var()`; `npm run check:type-scale`
(part of `check:drift`) fails on an unwrapped declaration.

### E5. Theming

The active theme is `data-theme="light"` / `data-theme="dark"` on `<html>`. Tokens
flip automatically:

```css
:root { --color-surface: #F8F7F6; }
[data-theme="dark"] { --color-surface: #232220; }
```

Components MUST NOT branch on `data-theme` — they consume tokens and let CSS swap.

### E6. No inline `style={}` for design values

Only for genuinely dynamic values that cannot be a class (drag positions, a
picker's current hue) — and those SHOULD flow through a CSS custom property
(`style={{ '--uxm-color-input-hue': hue }}`), not a raw property. Forwarding the
consumer's `style` prop is fine.

### E7. No Tailwind in `src/ui`

Tailwind is allowed only in `src/studio` (and the portal). Atoms stick to tokens +
BEM so consumers never inherit utility-class dependencies.

### E8. A styled class must be rendered

A selector is only real if a component renders it — before trusting a class that
isn't built by `&`-nesting inside its block, grep it in `src/ui/**/*.tsx`
(`gotchas.md` → "A styled class nobody renders").

---

## F. Accessibility

### F1. Start with semantic HTML

| Use | Not |
|---|---|
| `<button>` | `<div onClick>` |
| `<a href>` | `<span onClick>` |
| `<input>` + `<label>` | `<div contenteditable>` |
| `<nav>`, `<main>`, `<aside>` | `<div className="nav">` |

### F2. ARIA only when semantics aren't enough

- `aria-expanded` on disclosure / accordion / menu triggers
- `aria-controls` pointing at the disclosed region's id
- `aria-label` when there's no visible text (icon-only buttons)
- `aria-describedby` for hint / error association (merge, don't replace — B9)
- `aria-current="page"` on the active nav item
- `role="dialog"` + `aria-modal="true"` + a label on dialogs

### F3. Icons

`Icon` is **decorative by default** (`aria-hidden` unless you pass `aria-label`,
which switches it to `role="img"`):

```tsx
<Icon glyph="chevron-right" />                       // decorative — hidden from AT
<Icon glyph="warning" aria-label="Warning" />        // informative — named
```

### F4. Labels

```tsx
<label htmlFor="email">Email</label>
<input id="email" type="email" />
```

### F5. Keyboard

- Every interactive element MUST be focusable (Tab) and operable from the keyboard
- Buttons: Enter and Space; links: Enter
- Disclosures / menus / dialogs: Escape closes (`useDismiss`)
- Lists, listboxes, tabs: Arrow keys (`useRovingTabIndex`)
- Dialogs trap focus (`useFocusTrap`) and restore it on close
- Custom widgets follow the matching ARIA Authoring Practices pattern

### F6. Focus visibility and contrast

Every focusable element MUST have a visible `:focus-visible` style at ≥ 3:1
against its background. Text/UI pairings meet WCAG 2.1 AA in **both** themes —
verify with the package's own `contrastRatio` / `wcagLevel` helpers when you add
or change a colour pairing. Never convey state by colour alone.

---

## G. Naming conventions

| Thing | Convention | Example |
|---|---|---|
| File | kebab-case `.tsx` / `.ts` / `.scss` | `disclosure.tsx`, `use-dismiss.ts` |
| Component export | PascalCase | `Disclosure`, `ButtonPrimary` |
| Props interface | `${ComponentName}Props` | `DisclosureProps` |
| Variant string-union type | PascalCase + noun | `BadgeMode`, `TooltipPlacement` |
| Hook | camelCase starting with `use` | `useDismiss`, `useFocusTrap` |
| Boolean prop | positive phrasing, no `is`/`has` prefix | `disabled`, `open`, `loading` |
| Event handler prop | `on` + PascalCase verb | `onOpenChange`, `onSelect` |
| Event handler internal | `handle` + PascalCase verb | `handleClick`, `handleKeyDown` |
| Constant | UPPER_SNAKE_CASE | `SEARCHABLE_AUTO_THRESHOLD` |
| CSS override var | `--uxm-<component>-[<state>-]<prop>` | `--uxm-checkbox-hover-border-color` |

---

## H. Performance

- `React.memo` only when a component renders often with referentially-equal
  props and rendering is non-trivial.
- `useMemo` for genuinely expensive computations — profile first.
- Large lists (200+ items): virtualise or paginate in the consumer; atoms stay
  dumb.
- Avoid new object/array/function literals as props only when the child is
  memoised — premature stabilisation is noise.

---

## I. Imports

### I1. Path alias

| Alias | Resolves to |
|---|---|
| `@/` | `src/` (`tsconfig.json` `paths`; `tsc-alias` rewrites it in `dist/`) |

Cross-folder imports inside `src/ui` use the alias for shared code (`@/helpers`,
`@/hooks/use-dismiss`, `@/lib/icons`) and a relative path for a sibling atom
(`../icon`).

### I2. Import order (enforced by `import/order`)

1. Node builtins
2. External packages (`react`, `sass`)
3. Internal alias (`@/…`)
4. Parent (`../icon`), sibling (`./cn`), index
5. `import type …` — as the last group

Groups are separated by one blank line and alphabetised within a group.

### I3. Quotes

Single quotes in TS/JS, double quotes in JSX attributes (`quotes` + `jsx-quotes`
rules). Template literals are always fine.

### I4. Consumer-facing subpaths (for README / skill examples)

| Import | Contents |
|---|---|
| `@viax.io/uxm` | ui + tokens + WCAG helpers |
| `@viax.io/uxm/ui`, `@viax.io/uxm/ui.css` | atoms + their CSS |
| `@viax.io/uxm/tokens`, `@viax.io/uxm/tokens.css` | `themeTokens` + `--color-*` vars |
| `@viax.io/uxm/previews` | canvas previews |
| `@viax.io/uxm/studio`, `@viax.io/uxm/studio.css` | `UxmApp` + persistence adapters |
| `@viax.io/uxm/studio/generate-css` | `generateOverridesCss` (server-safe) |

---

## J. Library boundaries

- Atoms never fetch, never read env, never touch `window.location`. Data comes in
  through props; state goes out through callbacks.
- Studio code talks to a backend only through the `StudioPersistence` contract
  (`src/studio/persistence/`) — no ad-hoc `fetch` in components; handle
  `loading` / `error` / `data` explicitly.
- The portal reads `import.meta.env.VITE_*` only; `process.env` is never
  polyfilled by Vite.
- No new runtime dependencies (peer deps are `react` / `react-dom` ^19 by design).

---

## K. Gates

- `npm run lint` — flat-config ESLint 9 (`@typescript-eslint`, `react`,
  `react-hooks`, `jsx-a11y`, `import`); 0 errors. Disabling a rule requires
  `// eslint-disable-next-line <rule> -- <reason>`.
- `npm run typecheck` — `tsc --noEmit` for `src` and `portal`.
- `npm run check:drift` — registry-vs-SCSS state vars + type-scale wrap.
- `npm run build` — tsup → studio CSS → DTS → `tsc-alias` → CJS fix; every
  `exports` entry must produce ESM + CJS + `.d.ts` (+ CSS).
- Portal smoke test (`npm run dev:modo`) in light **and** dark theme for any
  visual change, with no saved overrides.
- No test framework is configured — do not invent test files.

---

## L. Commits

Conventional Commits with the component folder or area as scope; the type drives
the semver bump via semantic-release:

```
feat(disclosure): add controlled open prop
fix(checkbox): forward className to root element
refactor(listbox): extract roving tabindex into a hook
docs(skill): post-4.36.0 cleanup
```

A `BREAKING CHANGE:` footer forces a major of the whole package — reserve it for
a real external-consumer break (`gotchas.md` → semver).

---

## Quick checklist for new components

- [ ] Folder `src/ui/<name>/` with `<name>.tsx`, `<name>.scss`, `<name>-preview.tsx`, `index.ts`, `README.md`
- [ ] PascalCase named export — no default export
- [ ] `${Name}Props` interface declared and exported alongside the component
- [ ] Extends the native HTML attribute interface where applicable
- [ ] `className` accepted and forwarded via `cn('uxm-block', className)`
- [ ] `...rest` spread on the root element where practical
- [ ] Controlled/uncontrolled pair when stateful
- [ ] No `"use client"`, no `any`, no inline design values, no Tailwind
- [ ] Every themable declaration is `var(--uxm-<name>-<prop>, var(--color-*))`; literals commented
- [ ] `font-size` wrapped in `calc(… * var(--type-scale, 1))`
- [ ] BEM class names `uxm-block__element--modifier`; state via modifiers
- [ ] Semantic HTML root; ARIA where needed; icons decorative unless labelled
- [ ] Keyboard operable; visible focus ring; AA contrast in both themes
- [ ] Re-exported (value + `export type`) from `src/ui/<name>/index.ts` and `src/ui/index.ts`; preview only from `src/previews/index.ts`
- [ ] `@import "./<name>/<name>.css"` added to `src/ui/styles.css` in cascade order
- [ ] Studio registry entry + `generate-css.ts` mapping for the new knobs
- [ ] AI skill updated in the same MR (`skills/viax-uxm/`): catalog + cheatsheet row "(unreleased)", bullet under the bare `### Unreleased` — markers untouched
- [ ] `npm run lint`, `npm run typecheck`, `npm run check:drift`, `npm run build` pass; portal smoke-tested light + dark
