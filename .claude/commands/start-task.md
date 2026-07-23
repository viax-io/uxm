# /start-task Command

Start a new development task with automatic agent selection and structured workflow.

## Usage
```
/start-task [name] "detailed description"
```

## Examples
```
/start-task tag-input "Create TagInput component in src/ui/tag-input/tag-input.tsx for
entering and removing string tags. Must support controlled (value/onChange) and uncontrolled
(defaultValue) modes, disabled state, max-tags limit, and keyboard interaction
(Enter to add, Backspace to remove last)."

/start-task disclosure-fix "Disclosure throws 'Rendered more hooks than during the previous
render' when the open prop changes from undefined to true. Root cause likely a conditional
hook call in the controlled/uncontrolled bridge."
```

## Workflow

This command implements a mandatory 14-step workflow:

1. **THINK**: Analyze the task description — what is being built/fixed, which
   layer is affected (`src/ui`, `src/tokens`, `src/previews`, `src/studio`,
   `portal/`), and what Constitution principles apply
2. **READ DOCS**: Read `.claude/memory/constitution.md` (the source of truth —
   it wins over any handbook) and the relevant handbooks:
   - `.claude/handbooks/react-style-guide.md` — component conventions
   - `.claude/handbooks/design-tokens.md` — **legacy token names** (`--background-*`,
     `--radius-*`) — the live system is `--color-*` in `src/tokens/index.css`
   - `.claude/handbooks/bem-style-guide.md` — **legacy viax** convention (NOT this repo;
     see note in `react-style-guide.md`)
3. **READ CODE**: Search the relevant layer for related components and
   patterns. For new components: look at the closest existing analogue
   (e.g. building `TagInput` → read `src/ui/input/` and `src/ui/chip/`)
4. **READ LINT CONFIG**: Read the root `eslint.config.mjs` and
   `commitlint.config.*` (if present) to confirm linting and commit rules
5. **CLARIFY** *(conditional)*: Ask targeted questions if requirements are ambiguous
   - **Triggers when**: ambiguous prop API design, multiple valid approaches
     with different trade-offs, missing info that would change the implementation plan
   - **Skips when**: task is self-explanatory and a single obvious approach exists
6. **PLAN**: Create a detailed implementation plan covering:
   - Component folder `src/ui/<name>/` with `<name>.tsx`, `<name>.scss`,
     `index.ts` barrel, `<name>-preview.tsx`, `README.md`
   - Props interface (`export interface ${Name}Props`) and which native HTML
     interface it extends
   - Controlled / uncontrolled pair (if stateful)
   - Barrel re-exports: folder `index.ts` AND `src/ui/index.ts` (value + type);
     no `*-preview` export may leak into either barrel
   - Styles in the colocated `<name>.scss` (BEM `uxm-` + two-layer theming
     `var(--uxm-<comp>-<prop>, var(--color-<token>))`) + the compiled CSS
     `@import` added to `src/ui/styles.css` in cascade order
   - AI skill update in the same change (`skills/viax-uxm/` — catalog/cheatsheet
     row "(unreleased)", bullet under `### Unreleased`; never touch version/count markers)
   - Accessibility considerations (semantic HTML, ARIA, keyboard, WCAG AA in both themes)
   - Constitution Check (gates from `.claude/memory/constitution.md`)
7. **SAVE**: Save the plan to `./todo/DD-MM-YYYY-HH-MM-[name].md` (Ukrainian
   timezone, UTC+2 / UTC+3). Update this file if the plan changes during execution
8. **VERIFY**: BLOCK for user approval — cannot proceed without explicit confirmation
9. **EXECUTE**: Implement following the plan, using TodoWrite to track each step
10. **UPDATE**: Provide a high-level explanation at each significant step
11. **SIMPLICITY**: Every change touches the minimal amount of code — no scope creep
12. **DOCUMENT**: JSDoc on non-obvious custom hooks and utilities; add a brief
    block comment above non-obvious components
13. **LINT**: Run `npm run lint` and `npm run typecheck` — must pass with zero errors
14. **BUILD CHECK**: Run `npm run build` to confirm the full pipeline (tsup →
    studio CSS → DTS → tsc-alias → CJS fix) is happy; smoke-test visual changes
    in the portal (`npm run dev:modo`), including dark theme (no test framework
    is configured at present)

## Agent Selection

The command automatically selects the appropriate agent based on task keywords:

### React component library agent (`react-component-library`)
Triggered by keywords: `component`, `props`, `interface`, `hook`, `tsx`, `react`,
`uxm`, `style`, `css`, `theme`, `token`, `accessibility`, `a11y`, `refactor`,
`vite`, `spa`, `router`

### Runtime debugger agent (`runtime-debugger`)
Triggered by keywords: `error`, `crash`, `console`, `broken`, `regression`,
`runtime`, `axe`, `a11y violation`

### Code review agent (`code-review`)
Triggered by keywords: `review`, `lint`, `audit`, `quality`

### Multiple agents
For tasks that involve implementing a new component AND reviewing related code,
both agents collaborate: `react-component-library` for implementation,
`code-review` for post-implementation review.

## Implementation

When this command is invoked:

1. Parse the task name and description
2. Analyze keywords to determine which agent(s) to use
3. Launch the selected agent with the task

4. The agent will:
   - Read the constitution and handbooks
   - Analyze existing components in `src/ui/` (library) or `src/studio/` (workbench)
   - Run Constitution Check (if applicable)
   - Create a detailed plan
   - Save the plan to `./todo/` with a timestamp (create the folder if missing)
   - Wait for user verification before any code changes
   - Execute implementation step by step, tracking with TodoWrite
   - Run `npm run lint`, `npm run typecheck` and `npm run build`

5. All changes must follow:
   - TypeScript everywhere (`.tsx` for JSX, `.ts` for logic)
   - Function components + hooks; **no `"use client"` directives**
   - Named exports only, kebab-case filenames, PascalCase symbols
   - `export interface ${Name}Props` for every component
   - Extend native HTML attribute interfaces; accept `className` (merged via
     `cn("uxm-block", className)`); spread `...rest` on the root element
   - Controlled / uncontrolled pair for stateful components
   - Canonical BEM with the `uxm-` prefix: `uxm-block__element--modifier`
     (variant classes are often folded into the block name, e.g. `uxm-button-primary`)
   - Two-layer theming — every themable declaration reads
     `var(--uxm-<comp>-<prop>, var(--color-<token>))`; no hardcoded colours,
     spacing, radii, font sizes
   - No `<style>` blocks in `.tsx`; styles in the colocated `<name>.scss`
     (`src/ui/styles.css` is a pure `@import` aggregator); Tailwind only in `src/studio`
   - Conventional Commits for commit messages — the type drives the semver bump
     (`type(scope): description`, e.g. `feat(tag-input): add tag-input component`)
   - Must pass `npm run lint`, `npm run typecheck` and `npm run build`
     before marking complete

## Notes

- Task name should be short and kebab-case (e.g. `tag-input`, `disclosure-fix`)
- Description must be detailed enough to determine the props API and behaviour
- Plans are saved with Ukrainian timezone timestamps (UTC+2 winter / UTC+3 summer)
- User approval is REQUIRED before execution begins (step 8)
- All code changes must be minimal and focused — no unrelated refactoring
- New library component = complete folder (`.tsx` + `.scss` + `index.ts` +
  preview + README) + both barrel re-exports + `styles.css` `@import` + AI-skill
  update — all mandatory in the same change
- No test framework is configured at present — do NOT invent test files

ARGUMENTS: $ARGUMENTS
