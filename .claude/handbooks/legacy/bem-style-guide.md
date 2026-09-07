# BEM Style Guide — Viax UI Component Library

This project uses the **Two Underscores BEM variant** — a deliberate, stable convention.
Do not migrate to double-dash (`--`) modifiers: the scope of change would be a breaking
change for downstream consumers and provides no functional benefit.

All component styles live in `@viax/ui-components-default-theme` — not inside `.vue` files.

---

## Differences from Canonical BEM

| Aspect | Canonical BEM | This project |
|--------|--------------|--------------|
| Modifier separator | `block--modifier` | `x-block_modifier` |
| Modifier key+value | `block--type-primary` | `x-block_type_primary` (two `_`) |
| Block namespace | none | `x-` prefix on every block |
| Boolean states | `block--disabled` (modifier) | `.is-disabled` (SMACSS-style global) |

**Why these choices are permanent:**
- `_` modifier: Two Underscores style — an officially documented BEM variant, consistent across all 92 SCSS files and 89 components
- `x-` prefix: prevents collisions with native HTML elements and third-party libraries
- `.is-*` states: avoids duplicating state modifiers on every block; one class covers all components

---

## Naming Pattern

```
.x-block__element_modifier_value
 │    │       │         │
 │    │       │         └─ modifier value (underscore-separated, no hyphens)
 │    │       └─────────── element (double underscore __)
 │    └─────────────────── block name (kebab-case, matches component file name)
 └──────────────────────── x- prefix (all viax components)
```

### Block

The root element of a component. Always `x-` prefixed, kebab-case matching the
component file name.

```scss
.x-input { }
.x-button { }
.x-drop-down { }
.x-form-checkbox { }
```

### Element

A part of a block. Separated with double underscore `__`.

```scss
.x-input__label { }
.x-input__field { }
.x-input__icon { }
.x-button__text { }
.x-button__icon { }
.x-drop-down__list-item { }
```

### Modifier

A variation of a block or element. Separated with single underscore `_`.

**Block modifier:**
```scss
.x-form-checkbox_vertical { }
.x-form-checkbox_list { }
```

**Element modifier:**
```scss
.x-input__field_none-left-shift { }
.x-drop-down__icon_position-left { }
.x-drop-down__list-item_top { }
```

**Modifier with value** (key_value pattern — underscores, NOT hyphens in value):
```scss
.x-button_type_primary { }
.x-button_type_secondary { }
.x-button_color_danger { }
.x-button_color_success { }
```

---

## State Classes (`.is-` prefix)

Transient or boolean states use a global `.is-` prefix — NOT BEM modifiers.
These are applied programmatically via Vue bindings.

```scss
.is-disabled { }
.is-clearable { }
.is-loading { }
.is-fullwidth { }
.is-small { }
.is-icon-only { }
.is-plain { }
.is-indeterminate { }
```

```html
<!-- Vue usage -->
<div
  class="x-button"
  :class="{
    [`x-button_type_${type}`]: true,
    'is-disabled': disabled,
    'is-loading': loading,
  }"
>
```

---

## SCSS Authoring Conventions

### Always store parent selector in `$this`

```scss
.x-input {
  $this: &;

  &__field {
    padding: var(--padding-ms);
  }

  // Use $this for cross-element references inside state classes
  &.is-disabled {
    #{$this}__field {
      cursor: default;
      color: var(--text-disable);
    }

    #{$this}__icon {
      opacity: 0.4;
    }
  }
}
```

### Nesting order within a block

```scss
.x-button {
  $this: &;

  // 1. Block-level properties
  display: inline-flex;
  padding: var(--padding-s) var(--padding-m);

  // 2. Elements (__) in DOM order
  &__icon { }
  &__text { }
  &__loading { }

  // 3. Block modifiers (_)
  &_type_primary { }
  &_type_secondary { }
  &_color_danger { }

  // 4. State classes (.is-)
  &.is-disabled { }
  &.is-loading { }

  // 5. Pseudo-classes and pseudo-elements
  &:hover { }
  &:focus { }
  &::before { }

  // 6. Dark mode (at the end)
  html[data-theme="dark"] & { }
}
```

### File header convention

```scss
/** @define x-component-name */
.x-component-name {
  // ...
}
```

---

## CSS Custom Properties (theme tokens)

All visual values MUST use CSS variables from `@viax/ui-components-default-theme`.
**Never hardcode** colors, spacing, typography, radii, or shadows.

For the full token reference — including semantic vs primitive distinction and dark mode rules —
see `.claude/handbooks/design-tokens.md`.

```scss
// ✅ correct — semantic tokens adapt to dark mode automatically
color: var(--text-regular);
background-color: var(--background-surface);
border-color: var(--border-default);
padding: var(--padding-m);
border-radius: var(--radius-m);
font-size: var(--font-size-lg);
box-shadow: var(--shadow-input);

// ❌ wrong
color: #333;
background-color: white;
color: var(--dark-default);       // primitive — no dark mode switch
border-color: var(--neutral-3);   // primitive — use --border-default
```

---

## Dark Mode

**Prefer semantic tokens** — they switch automatically, no dark mode block needed.
Only add `html[data-theme="dark"] &` when using primitive tokens or custom values.

```scss
// ✅ semantic tokens — dark mode is automatic, no override block needed
.x-input {
  background-color: var(--background-default);   // #FFF → #0E0E0E
  color: var(--text-regular);                    // #0E0E0E → #FFF
  border-color: var(--border-default);           // #D4D4D4 → #ADADAD
}

// ⚠️ primitive token used — manual dark override required
.x-input {
  $this: &;

  &__badge {
    background-color: var(--primary-light-1);    // primitive, no auto-switch

    html[data-theme="dark"] & {
      background-color: var(--primary-dark-3);   // manual dark value
    }
  }
}
```

See `.claude/handbooks/design-tokens.md` for all semantic token values in light/dark.

---

## Mixins

Available in `src/scss/components/mixins/`. Use instead of duplicating patterns:

```scss
@include scroll();         // custom scrollbar styling
```

---

## Complete Example

```scss
/** @define x-drop-down */
.x-drop-down {
  $this: &;

  position: relative;
  display: flex;
  flex-direction: column;

  // Elements
  &__label {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
    margin-bottom: var(--padding-s);
  }

  &__field {
    display: flex;
    align-items: center;
    padding: var(--padding-s) var(--padding-m);
    border-radius: var(--radius-m);
    border: 1px solid var(--border-default);
    cursor: pointer;
    transition: border 0.2s;

    &_none-left-shift {
      padding-left: 0;
    }
  }

  &__icon {
    color: var(--text-secondary);

    &_position-left {
      margin-right: var(--padding-s);
    }

    &_position-right {
      margin-left: auto;
    }
  }

  &__list-item {
    padding: var(--padding-s) var(--padding-m);

    &_top { border-radius: var(--radius-m) var(--radius-m) 0 0; }
    &_bottom { border-radius: 0 0 var(--radius-m) var(--radius-m); }
  }

  // State classes
  &.is-disabled {
    cursor: default;
    pointer-events: none;

    #{$this}__field {
      color: var(--text-disable);        // semantic — auto dark mode
      border-color: var(--border-light); // semantic — auto dark mode
    }
  }

  // Pseudo-classes
  &:hover:not(.is-disabled) {
    #{$this}__field {
      border-color: var(--border-accent); // semantic — auto dark mode
    }
  }

  // No dark mode block needed — all semantic tokens above switch automatically
}
```

---

## Quick Reference: Do / Don't

| ✅ Do | ❌ Don't |
|-------|---------|
| `.x-button_type_primary` | `.x-button--type-primary` (double dash) |
| `.x-button__icon` | `.x-button-icon` (no separator) |
| `.is-disabled` for state | `.x-button_disabled` for state |
| `var(--padding-m)` | `8px` hardcoded |
| `$this: &;` for cross-refs | Deep nesting without `$this` |
| Modifier values with `_` | `.x-button_type-primary` (hyphen in value) |
| Style in theme submodule | Style inside `.vue` file |