# React Style Guide — modo project

Quick reference for writing React 19 components in the **modo** monorepo.
This is a **client-side SPA** project (target stack: Vite + React + React Router).

> **Note on BEM:** This project uses **canonical BEM** — `uxm-block__element--modifier`
> (double underscore `__`, double dash `--`). Do **not** confuse with the legacy
> `bem-style-guide.md` handbook, which describes the old viax convention
> (`x-block__element_modifier_value` with single underscores).

---

## Project structure

```
apps/modo/                       # the product (Vite + React SPA, future state)
  src/
    main.tsx                     # SPA entry point (Vite convention)
    components/                  # app-specific components (kebab-case .tsx files)
    lib/                         # app-specific hooks, utils
packages/uxm/                    # shared UI library
  src/
    ui/                          # primitive components — one folder per component
      <name>/                    # e.g. button/, alert/, disclosure/
        <name>.tsx               # component implementation
        <name>.css               # component-scoped styles (BEM, .uxm-<name>*)
        index.ts                 # barrel — `export * from "./<name>";`
      index.ts                   # named exports + type exports for whole UI lib
      styles.css                 # aggregator — only `@import "./<name>/<name>.css"`
    helpers/                     # cn, etc. (imported as `@/helpers`)
    lib/                         # shared hooks, context, types
packages/tokens/                 # design tokens
  index.ts                       # TypeScript ThemeToken[] array
  index.css                      # CSS variables (--color-*, etc.)
  components.css                 # generated overrides
  components.json                # generated overrides metadata
```

---

## A. Component structure

### A1. One component per file, kebab-case filename, PascalCase export

```
packages/uxm/src/ui/disclosure/disclosure.tsx   → export function Disclosure(...) {}
packages/uxm/src/ui/button/button.tsx           → export function ButtonPrimary(...) {}, ButtonGhost(...), …
packages/uxm/src/ui/list/list.tsx               → export function List(...), ListItem(...)  // compound
```

Each component lives in its own folder. The folder also holds the component's
scoped `.css` file and an `index.ts` barrel (`export * from "./<name>";`) so
consumers can import either `@modo/uxm/ui` (the package barrel) or
`@modo/uxm/ui/<name>` (single component).

### A2. No `"use client"` directives

modo is a **client-side SPA**. There are no Server Components, no `"use client"`,
no `"use server"`. Every component is a client component by default. Never add
`"use client"` to new code, and remove it from any code you touch (after confirming
the file does not still live under a Next.js App Router context).

### A3. Named exports only

```tsx
// good
export function Disclosure(props: DisclosureProps) { ... }

// bad
export default function Disclosure(props: DisclosureProps) { ... }
```

The package exports a single barrel `packages/uxm/src/ui/index.ts` with explicit
named re-exports. Default exports break this pattern and complicate tree-shaking.

### A4. Compound components live in the same file

Components that are always used together (`List` + `ListItem`, `RadioGroup` +
`RadioOption`) live in one file and are exported together.

---

## B. Props API

### B1. Always declare `XxxProps` interface and export it

```tsx
export interface DisclosureProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  icon?: ReactNode;
  label: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Disclosure({ icon, label, open, defaultOpen, onOpenChange, ...rest }: DisclosureProps) { ... }
```

Export the prop type alongside the component from `index.ts`:

```ts
export { Disclosure } from "./disclosure";
export type { DisclosureProps } from "./disclosure";
```

### B2. Extend native HTML element attributes

When a component wraps a single semantic element, extend that element's attribute
interface so consumers can pass `data-*`, `aria-*`, event handlers, `id`, etc.:

```tsx
// button wrapper
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { ... }

// input wrapper
interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> { ... }

// div wrapper
interface CardProps extends HTMLAttributes<HTMLDivElement> { ... }
```

Use `Omit<NativeProps, "conflictingKey">` when you redefine a native prop with a
different signature (e.g. a custom `onChange(checked: boolean)` instead of native
`onChange(e: ChangeEvent)`).

### B3. Controlled / uncontrolled pair

Components with internal state SHOULD support both controlled and uncontrolled
modes using React's standard convention:

| Component kind | Controlled prop | Default prop | Change emitter |
|---|---|---|---|
| Inputs (text, number, select) | `value` | `defaultValue` | `onChange` |
| Checkbox / radio | `checked` | `defaultChecked` | `onChange` |
| Disclosures / modals / sheets | `open` | `defaultOpen` | `onOpenChange` |
| Tabs | `value` | `defaultValue` | `onValueChange` |

Implementation:

```tsx
export function Disclosure({ open: controlledOpen, defaultOpen = false, onOpenChange, ... }: DisclosureProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  function toggle() {
    const next = !open;
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  }
  ...
}
```

### B4. Always accept and forward `className` via `cn()`

```tsx
import { cn } from "./cn";

export function Card({ className, children, ...rest }: CardProps) {
  return <div className={cn("uxm-card", className)} {...rest}>{children}</div>;
}
```

The `cn()` helper lives at `packages/uxm/src/helpers/cn.ts` (imported via
`@/helpers`) and filters falsy values:

```ts
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
```

### B5. Spread `...rest` onto the root element

Whenever practical, spread remaining native props onto the root element so
consumers can attach `onClick`, `data-*`, `aria-*`, `id`, `style`, etc., without
us having to enumerate every passthrough.

```tsx
export function ButtonPrimary({ className, type = "button", ...rest }: ButtonProps) {
  return <button type={type} className={cn("uxm-button-primary", className)} {...rest} />;
}
```

### B6. Default values via destructuring

```tsx
// good
function Disclosure({ defaultOpen = false, type = "button" }: Props) { ... }

// bad — separate defaultProps assignment
Disclosure.defaultProps = { defaultOpen: false };
```

### B7. Children via `ReactNode`

```tsx
// good
interface Props { children: ReactNode }

// avoid
interface Props { children: JSX.Element }     // too restrictive
interface Props { children: ReactElement }    // too restrictive
```

### B8. Boolean props default to `true` when present without value

```tsx
<Disclosure defaultOpen />     // === defaultOpen={true}
<Card hoverable />             // === hoverable={true}
```

---

## C. Hooks & state

### C1. Rules of Hooks

- Call hooks ONLY at the top level of a function component or another custom hook
- Never inside loops, conditions, or nested functions
- Hook names must start with `use` (`useFoo`, `useFormField`, `useDebounce`)

### C2. Hook placement

| Where | What |
|---|---|
| `packages/uxm/src/lib/` | Cross-app reusable hooks (`useGlobalTheme`, `useMediaQuery`) |
| `apps/modo/src/lib/` | App-specific hooks |
| Co-located with component | Tightly coupled to one component, never reused |

### C3. State primitives

- `useState` — for primitives and shallow values
- `useReducer` — when state transitions are complex (login flow, multi-step form)
- `useRef` — for mutable values that should NOT trigger re-render, or for DOM refs

### C4. `useEffect` rules

- **Minimise effects.** Most of what looks like an effect is actually derived state.
- Always declare a complete dependency array — never omit deps "to avoid re-runs"
- Always return cleanup for `setInterval`, `setTimeout`, `addEventListener`, `AbortController`
- Never use `useEffect` to copy a prop into state (anti-pattern):

```tsx
// BAD — derived state via effect
useEffect(() => { setFullName(`${firstName} ${lastName}`); }, [firstName, lastName]);

// GOOD — compute on render
const fullName = `${firstName} ${lastName}`;
```

### C5. `useCallback` / `useMemo` — only when justified

Reach for them only when:
- The value is passed to `React.memo`'d child whose props you want to keep stable
- The value is in another hook's dep array and you need referential stability
- The computation is genuinely expensive (profile first)

Wrapping every callback in `useCallback` adds noise and rarely helps.

### C6. Cleanup pattern

```tsx
useEffect(() => {
  const controller = new AbortController();
  fetch("/api/things", { signal: controller.signal })
    .then((r) => r.json())
    .then(setThings)
    .catch((err) => { if (err.name !== "AbortError") setError(err); });
  return () => controller.abort();
}, []);
```

---

## D. TypeScript conventions

### D1. `.tsx` for JSX, `.ts` for logic-only files

### D2. No `any`

Use `unknown` and narrow with `typeof` / `instanceof` / type guards:

```ts
function isHttpError(e: unknown): e is { status: number } {
  return typeof e === "object" && e !== null && "status" in e;
}
```

### D3. Import types separately

```ts
import { useState } from "react";
import type { ReactNode, ChangeEvent } from "react";
```

This keeps the runtime bundle clean and lets the compiler elide type-only imports.

### D4. Generic components

```tsx
interface DataTableProps<T extends Record<string, unknown>> {
  rows: T[];
  columns: Array<DataTableColumn<T>>;
}

export function DataTable<T extends Record<string, unknown>>({ rows, columns }: DataTableProps<T>) { ... }
```

### D5. Use `ReactNode` for slots, not `ReactElement`

`ReactNode` is the widest reasonable type for children (string, number, element,
fragment, array, null). Only narrow to `ReactElement` if you genuinely need
`React.cloneElement` or to inspect props.

---

## E. Styles & CSS classes

### E1. BEM with `--` modifiers

```
uxm-block__element--modifier
```

| Part | Example |
|---|---|
| Block (root) | `uxm-disclosure` |
| Element | `uxm-disclosure__chevron` |
| Modifier on block | `uxm-disclosure--open` |
| Modifier on element | `uxm-disclosure__chevron--rotated` |
| Boolean state | use a modifier: `uxm-checkbox--disabled` (not `is-disabled`) |

### E2. Prefix convention

| Prefix | Where |
|---|---|
| `uxm-` | Shared UI library (`packages/uxm/src/ui/<name>/<name>.tsx`) |
| `modo-` | App-specific components (`apps/modo/src/components/*.tsx`) |

### E3. Where styles live

- `packages/uxm/src/ui/<name>/<name>.css` — **component-scoped** CSS for each UI primitive
- `packages/uxm/src/ui/styles.css` — aggregator only; pure `@import` list of every component CSS in cascade order
- `apps/modo/src/index.css` (or equivalent root stylesheet) — app-level styles, resets, global utilities
- `packages/tokens/index.css` — CSS variable definitions (light + dark themes)
- `packages/tokens/components.css` — generated component-level token overrides

Consumers pull the full UI library CSS via `import "@modo/uxm/ui/styles.css"`
or cherry-pick a single component via `import "@modo/uxm/ui/<name>/<name>.css"`.
Any rule that touches `.uxm-<block>*` MUST live in `<block>/<block>.css`. Rules
that visually span two components (e.g. `.uxm-breadcrumb .uxm-link`) live with
the **context** component (here: breadcrumb).

### E4. Always use design tokens — never hardcoded CSS values

```css
/* bad */
.uxm-button-primary { background: #3ECC87; color: #FFFFFF; }

/* good */
.uxm-button-primary { background: var(--color-accent); color: var(--color-text-inverse); }
```

The full token list lives in `packages/tokens/index.ts` (typed) and resolves to
CSS variables defined in `packages/tokens/index.css`.

### E5. Theming

The active theme is set via `data-theme="light"` or `data-theme="dark"` on
`<html>`. Tokens flip automatically via:

```css
:root { --color-surface: #F8F7F6; }
[data-theme="dark"] { --color-surface: #141414; }
```

Components MUST NOT branch on `data-theme` themselves — they consume the tokens
and let CSS do the swap.

### E6. No inline `style={}` for design values

Only acceptable for dynamic values that can't be expressed as a class (e.g.
`transform: translateX(${dragX}px)`). Anything static must be in CSS.

### E7. Avoid Tailwind utilities in shared `@modo/uxm`

App-level prototyping with Tailwind is fine, but the shared UI library MUST stick
to design tokens + BEM classes so downstream consumers don't inherit utility
class dependencies.

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
- `aria-describedby` for help / error text association
- `aria-current="page"` on the active nav item

### F3. Icons

```tsx
// decorative — hide from AT
<Icon glyph="chevron-right" aria-hidden="true" />

// informative — give it a name
<Icon glyph="warning" role="img" aria-label="Warning" />
```

### F4. Labels

```tsx
// option 1 — explicit
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// option 2 — wrapping
<label>
  Email
  <input type="email" />
</label>
```

### F5. Keyboard

- Every interactive element MUST be focusable (Tab) and operable from keyboard
- Buttons: Enter and Space activate
- Links: Enter activates
- Disclosures / menus / dialogs: Escape closes
- Lists, listboxes, tabs: Arrow keys move
- Custom widgets: implement the matching ARIA Authoring Practices pattern

### F6. Focus visibility

Every focusable element MUST have a visible `:focus-visible` style. Do not remove
the focus ring without providing a replacement.

---

## G. Naming conventions

| Thing | Convention | Example |
|---|---|---|
| File | kebab-case `.tsx` / `.ts` | `disclosure.tsx`, `use-window-size.ts` |
| Component export | PascalCase | `Disclosure`, `ButtonPrimary` |
| Props interface | `${ComponentName}Props` | `DisclosureProps` |
| Variant string-union type | PascalCase + descriptive noun | `BadgeMode`, `TooltipPlacement` |
| Hook | camelCase starting with `use` | `useGlobalTheme`, `useMediaQuery` |
| Boolean prop | positive phrasing, no `is`/`has` prefix | `disabled`, `open`, `loading` |
| Event handler prop | `on` + PascalCase verb | `onOpenChange`, `onSelect`, `onClick` |
| Event handler internal | `handle` + PascalCase verb | `handleClick`, `handleKeyDown` |
| Constant | UPPER_SNAKE_CASE | `THEME_STORAGE_KEY` |

---

## H. Performance

### H1. `React.memo` — only when justified

Wrap in `React.memo` only if:
- The component renders frequently AND
- Its props are usually referentially equal AND
- Rendering is non-trivial

For most components, default re-rendering is fine and `memo` adds bookkeeping cost.

### H2. `useMemo` for expensive computations

```tsx
const sortedRows = useMemo(() => rows.slice().sort(comparator), [rows, comparator]);
```

Don't `useMemo` cheap operations — the memo overhead outweighs the saving.

### H3. Large lists → virtualise or paginate

For lists over ~200 items, use TanStack Virtual or paginate.

### H4. Route-level code splitting

```tsx
import { lazy, Suspense } from "react";

const SettingsPage = lazy(() => import("./pages/settings"));

<Suspense fallback={<Loader />}>
  <SettingsPage />
</Suspense>
```

Vite tree-shakes and splits per dynamic-import automatically.

### H5. Avoid creating new object/array/function literals as props when it matters

```tsx
// re-creates object each render — only matters if child is memoised
<List style={{ marginTop: 8 }} />

// stable reference
const listStyle = useMemo(() => ({ marginTop: 8 }), []);
<List style={listStyle} />
```

Apply selectively — premature stabilisation adds noise.

---

## I. Imports

### I1. Path aliases

| Alias | Resolves to |
|---|---|
| `@/` | `apps/modo/src/` (configured in `tsconfig.json` + Vite `resolve.alias`) |
| `@modo/uxm` | `packages/uxm` workspace |
| `@modo/uxm/ui` | `packages/uxm/src/ui/index.ts` |
| `@modo/tokens` | `packages/tokens/index.ts` |
| `@modo/tokens/css` | `packages/tokens/index.css` |

### I2. Import order

1. Side-effect imports (`import "./styles.css"`)
2. React
3. Third-party libraries
4. Workspace packages (`@modo/*`)
5. Path-aliased internal modules (`@/*`)
6. Relative imports (`./foo`)

### I3. Type-only imports

```ts
import type { ReactNode, ChangeEvent } from "react";
import type { DisclosureProps } from "@modo/uxm/ui";
```

---

## J. Data & routing (SPA-specific)

### J1. Data fetching

- No SSR / SSG / RSC. All data is fetched client-side.
- Simple cases: `useEffect` + `fetch` with `AbortController` cleanup
- Complex cases: TanStack Query or SWR for cache, dedup, refetch-on-focus, etc.
- Always handle `loading` / `error` / `data` states explicitly

### J2. Routing

- React Router (`react-router-dom`) is the assumed routing library
- Hooks: `useNavigate`, `useParams`, `useSearchParams`, `useLocation`
- Lazy-load route components via `React.lazy` + `Suspense`

### J3. Entry point

- `apps/modo/src/main.tsx` mounts the root via `createRoot(document.getElementById("root")!).render(<App />)`
- `apps/modo/index.html` is the Vite entry HTML (Vite reads it directly)
- No `app/layout.tsx`, no `_app.tsx`, no Next.js conventions

### J4. Env variables

- Vite exposes `import.meta.env.*` (must be prefixed `VITE_` to reach client code)
- Never read `process.env` in client code — Vite does not polyfill it

---

## K. ESLint

- Flat config (`eslint.config.mjs` or `eslint.config.ts`)
- Base rules: `@typescript-eslint`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`
- Run: `npm run lint --workspace=@modo/app` (or root-level script once migrated)
- Must pass with zero errors before commit
- Disabling a rule requires an inline `// eslint-disable-next-line <rule> -- <reason>` comment

---

## L. Commits

Use Conventional Commits with the component or area as scope:

```
feat(disclosure): add controlled open prop
fix(checkbox): forward className to root element
refactor(uxm): unify cn helper signature
docs(react-style-guide): clarify controlled/uncontrolled pair
```

No `X` or `XForm` prefix (that was the viax convention). Scope uses the file or
package name directly.

---

## Quick checklist for new components

Before opening a PR with a new component, verify:

- [ ] Component folder is kebab-case under `packages/uxm/src/ui/<name>/` containing `<name>.tsx`, `<name>.css`, and `index.ts` barrel (or `apps/modo/src/components/<name>.tsx` for app components)
- [ ] PascalCase named export — no default export
- [ ] `XxxProps` interface declared and exported alongside the component
- [ ] Extends native HTML attribute interface where applicable (`ButtonHTMLAttributes`, etc.)
- [ ] `className` accepted and forwarded via `cn("uxm-block", className)`
- [ ] `...rest` spread on root element where practical
- [ ] Controlled/uncontrolled pair when stateful (`value`+`defaultValue`+`onChange` etc.)
- [ ] No `"use client"` directive
- [ ] No hardcoded colours / spacing — design tokens only (`var(--color-*)`)
- [ ] BEM class names: `uxm-block__element--modifier`
- [ ] Semantic HTML root (`<button>`, `<input>`, `<a>`, …)
- [ ] ARIA attributes where semantics aren't enough; icons marked `aria-hidden` or `role="img"+aria-label`
- [ ] Keyboard operable (Tab + Enter/Space/Escape/Arrows as appropriate)
- [ ] Re-exported from `packages/uxm/src/ui/index.ts` (named + `export type`) AND from the folder barrel `packages/uxm/src/ui/<name>/index.ts`
- [ ] `<name>.css` only contains `.uxm-<name>*` rules; imported by `packages/uxm/src/ui/styles.css` via `@import "./<name>/<name>.css"`
- [ ] AI skill updated in the same MR (`skills/viax-uxm/`): catalog row + cheatsheet row marked "(unreleased)", bullet under `### Unreleased` in SKILL.md — do NOT touch the version/count markers (CI stamps them at release; see `/update-ai-skill`)
- [ ] `npm run lint --workspace=@modo/app` passes