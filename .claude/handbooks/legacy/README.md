# Legacy handbooks — NOT for this repo

These three files document the **Viax Vue component library** (`@viax/ui-components`
+ `@viax/ui-components-default-theme`), not `@viax.io/uxm`:

| File | What it describes | Why it does not apply here |
|---|---|---|
| `bem-style-guide.md` | `x-block__element_modifier_value` + `.is-*` states | uxm uses canonical BEM with the `uxm-` prefix: `uxm-block__element--modifier` |
| `design-tokens.md` | `--background-*`, `--text-primary`, `--radius-*`, `--padding-*` | uxm's live tokens are `--color-*` / `--shadow-*` / `--font-*` in `src/tokens/index.css`; the constitution (Principle I) forbids the legacy names |
| `ui-components.md` | the `X*` / `XForm*` Vue component API | uxm ships React 19 atoms (`src/ui/`); the catalog is `skills/viax-uxm/references/component-catalog.md` |

They are kept only so old references (MR discussions, the `viax-portal` MetaPrompt's
history) still resolve. Agents and commands in this repo must not read them, and no
finding may cite them. The authoritative guide is `../react-style-guide.md`; the
rules are in `.claude/memory/constitution.md`.
