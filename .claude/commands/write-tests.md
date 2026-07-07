# /write-tests Command

Write, fix, or review Jest unit tests for a component in `@viax/component-library`.

## Usage
```
/write-tests XComponentName
/write-tests XComponentName --fix
/write-tests XComponentName --review
```

## Examples
```
/write-tests XButton
/write-tests XDropDown --fix
/write-tests XTagInput --review
```

## Modes

### Default (no flag) — write tests
Spawns `jest-unit-testing` agent to write a complete `__tests__/XComponentName.spec.js` file.

### `--fix` — fix failing tests
Spawns `jest-unit-testing` agent to diagnose and fix failing tests in the existing spec file.
Runs `npm test -- --testPathPattern=ComponentName` first to capture errors.

### `--review` — review existing tests
Spawns `jest-unit-testing` agent to review an existing spec file for:
- Missing test cases (uncovered props, emits, states)
- Antipatterns (meaningless names, missing await, no mount helper)
- Missing accessibility test
- Missing dark mode tests (if component has theme-sensitive logic)

## Implementation

When invoked:

1. **Parse `$ARGUMENTS`**:
   - Extract component name (first argument, e.g. `XButton`)
   - Detect flags: `--fix`, `--review`
   - Derive spec file path: `src/components/[Name]/__tests__/[Name].spec.js`
   - Derive component path: `src/components/[Name]/[Name].vue`

2. **Spawn `jest-unit-testing` agent** with a task prompt based on mode:

   **Default (write):**
   ```
   Write a complete Jest unit test file for [Name].
   Component: src/components/[Name]/[Name].vue
   Spec file:  src/components/[Name]/__tests__/[Name].spec.js
   Read the component first, then write tests covering:
   accessibility (jest-axe), props, CSS classes, emits, slots,
   keyboard interactions, disabled state.
   Run: npm test -- --testPathPattern=[Name]
   All tests must pass before finishing.
   ```

   **`--fix`:**
   ```
   Fix failing tests in src/components/[Name]/__tests__/[Name].spec.js.
   Run: npm test -- --testPathPattern=[Name]
   Read the full error output, trace root causes, apply minimal fixes.
   Re-run after each fix to verify. All tests must pass before finishing.
   ```

   **`--review`:**
   ```
   Review the existing test file: src/components/[Name]/__tests__/[Name].spec.js
   Read the component at src/components/[Name]/[Name].vue for context.
   Report: missing test cases, antipatterns, missing accessibility/dark mode tests.
   Provide specific suggestions with code examples for each finding.
   ```

3. After the agent finishes, run `npm test -- --testPathPattern=$COMPONENT_NAME` to confirm all tests pass.

## Notes

- Component name must be in PascalCase (e.g. `XButton`, not `x-button`)
- If the spec file does not exist in `--fix` or `--review` mode, switch to default (write) mode
- Tests must pass `npm test` with zero failures before the task is complete

ARGUMENTS: $ARGUMENTS