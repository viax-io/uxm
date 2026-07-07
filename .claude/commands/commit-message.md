# /commit-message Command

Generate a standardized git commit message based on current repository changes.

## Usage
```
/commit-message
```

## Format

The generated commit message follows the **Conventional Commits** specification
enforced by `commitlint` and consumed by `semantic-release` for CHANGELOG generation:

```
type(scope): short description

Optional longer body explaining what and why (max 100 chars per line).
```

### Type (required)

| Type | When to use | semver impact |
|------|-------------|---------------|
| `feat` | New component or new prop/event on existing component | MINOR |
| `fix` | Bug fix in existing component | PATCH |
| `refactor` | Code change that neither fixes a bug nor adds a feature | none |
| `style` | Formatting, whitespace, missing semicolons — no logic change | none |
| `perf` | Performance improvement | PATCH |
| `test` | Adding or correcting tests | none |
| `docs` | Documentation only (README, stories, JSDoc) | none |
| `build` | Build system or dependency changes | none |
| `ci` | CI configuration changes | none |
| `chore` | Other changes that don't modify src or test files | none |
| `revert` | Reverts a previous commit | depends |

### Scope (recommended)

Use the component name in kebab-case, matching the changed component:

```
feat(x-tag-input): add clearable prop
fix(x-form-drop-down): correct label alignment in error state
refactor(x-input): extract validation logic to composable
test(x-amount-input): add jest-axe accessibility assertion
docs(x-form-button): update story with disabled variant
```

For cross-cutting changes with no single component scope, omit scope:
```
chore: update @viax/ui-components-default-theme to v1.26.0
build: upgrade vue to 3.5.14
```

### Breaking Changes

```
feat(x-drop-down)!: rename value prop to model-value

BREAKING CHANGE: consumers must replace :value with v-model or :model-value
```

## Example Output

```
feat(x-tag-input): add x-tag-input and x-form-tag-input components

Introduce tag input components allowing users to create and remove
string tags. x-form-tag-input wraps x-tag-input with label, validation,
and error state support.
```

```
fix(x-form-checkbox): correct focus ring visibility in dark mode

Theme token --color-focus-ring was not applied on the wrapper element,
causing keyboard focus to be invisible in dark theme contexts.
```

## Workflow

When invoked:

1. **Analyze Changes** — run these bash commands, nothing else:
   - `git status`
   - `git diff`
   - `git diff --cached`
   - `git branch --show-current`

2. **Determine Type and Scope**
   - Identify primary nature of change (new feature, bug fix, refactor, etc.)
   - Extract component name(s) from changed file paths as scope
   - If multiple unrelated components changed, consider separate commits or omit scope

3. **Generate Message**
   - Subject line: type(scope): imperative description — max 100 chars
   - Body (optional): what changed and why, max 100 chars per line
   - Footer: BREAKING CHANGE: if applicable; ticket reference if known (e.g. Refs: VX-1570)

4. **Present to User**
   - Output the commit message as plain text in your response
   - Ask if user wants to use it, modify it, or create the commit

> **IMPORTANT:** Only use bash for the four git commands listed in step 1.
> Do NOT run echo, printf, or any other bash command to display output.
> All output must be plain text in your response, never via bash.

## Message Guidelines

- Use imperative mood: "add" not "added" or "adds"
- Subject line describes WHAT changed; body explains WHY
- Scope = component name in kebab-case (e.g. x-input, x-form-drop-down, x-tag-input)
- Do not end subject line with a period
- Do not include file paths or technical internals in the subject

## Restrictions

DO NOT include:
- [branch-name] prefix — this project uses Conventional Commits, not branch prefixes
- "Generated with Claude Code" attribution
- "Co-Authored-By: Claude" lines
- Implementation details or code snippets in the subject line

## Notes

- feat and fix types trigger a new npm release via semantic-release
- feat → MINOR version bump; fix/perf → PATCH version bump
- BREAKING CHANGE footer → MAJOR version bump
- Commit messages feed directly into the published CHANGELOG

ARGUMENTS: $ARGUMENTS