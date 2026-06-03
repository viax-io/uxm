# FilterTabs

A compact, label-only segmented control for switching between filtered views of the same dataset (e.g. "All / Active / Archived"). Renders as a horizontal pill track with an animated active-tab background.

`FilterTabs` is a single component that maps an `options` array to a `role="tablist"` of `<button role="tab">` elements. Selection works both controlled (`value` + `onChange`) and uncontrolled (`defaultValue`, internal `useState`). Per-tab `disabled` flags render as inert (clicks are dropped before reaching `onChange`).

## Usage

```tsx
import { FilterTabs } from '@viax/uxm';

function Example() {
  const [status, setStatus] = useState('all');

  return (
    <FilterTabs
      value={status}
      onChange={setStatus}
      options={[
        { value: 'all', label: 'All' },
        { value: 'active', label: 'Active' },
        { value: 'archived', label: 'Archived', disabled: true },
      ]}
    />
  );
}
```

## Props

### `FilterTabsProps`

Extends `Omit<HTMLAttributes<HTMLDivElement>, 'onChange'>` — any standard div attribute (id, style, data-*, aria-*) is forwarded to the root tablist.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `FilterTabsOption[]` | – | **Required.** Tab descriptors; render order matches array order. |
| `value` | `string` | – | Controlled selected value. When provided, internal state is ignored. |
| `defaultValue` | `string` | first non-disabled option's `value` | Uncontrolled initial selection. Ignored when `value` is provided. |
| `onChange` | `(value: string) => void` | – | Fires when a non-disabled tab is selected. |
| `className` | `string` | – | Merged with the root class via `cn`. |
| _(any native div attribute)_ | – | – | Spread onto the root `<div role="tablist">`. |

### `FilterTabsOption`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `value` | `string` | yes | Unique identifier; emitted to `onChange` and used as the React key. |
| `label` | `string` | yes | Visible tab text. |
| `disabled` | `boolean` | no | Inert tab; selection is a no-op and the native `disabled` attribute is forwarded. |

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-filter-tabs-track-bg` | `--color-surface` | – | Outer track background. |
| `--uxm-filter-tabs-track-border` | `--color-border` | – | Outer track border colour. |
| `--uxm-filter-tabs-track-radius` | – | `8px` | Outer track corner radius. |
| `--uxm-filter-tabs-track-padding` | – | `2px` | Inner padding around tabs. |
| `--uxm-filter-tabs-gap` | – | `0px` | Gap between tabs. |
| `--uxm-filter-tabs-tab-radius` | – | `6px` | Per-tab corner radius. |
| `--uxm-filter-tabs-padding-x` | – | `12px` | Horizontal tab padding. |
| `--uxm-filter-tabs-padding-y` | – | `6px` | Vertical tab padding. |
| `--uxm-filter-tabs-font-size` | – | `12px` | Tab label font size. |
| `--uxm-filter-tabs-font-weight` | – | `500` | Inactive tab font weight (active forced to `600`). |
| `--uxm-filter-tabs-inactive-text` | `--color-text-muted` | – | Inactive tab label colour. |
| `--uxm-filter-tabs-active-bg` | `--color-card` | – | Active tab background. |
| `--uxm-filter-tabs-active-text` | `--color-text` | – | Active tab label colour. |

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-surface` | Surfaces / Surface | Track background. |
| `--color-border` | Borders / Border | Track border. |
| `--color-text-muted` | Text / Text Muted | Inactive tab label. |
| `--color-card` | Surfaces / Card | Active tab background. |
| `--color-text` | Text / Text | Active tab label. |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Inactive | Default | Muted text, transparent background. |
| Active | `option.value === value` | Card-coloured pill behind label, `font-weight: 600`, `--shadow-xs` drop shadow. |
| Hover | `:hover` on tab | Background/colour transition (0.15s); no explicit hover colour — relies on transition baseline. |
| Disabled | `option.disabled` | Native `disabled` attribute; `onChange` not fired. |

## Accessibility

- Uses `role="tablist"` on the root and `role="tab"` + `aria-selected` on each button, matching the WAI-ARIA Tabs pattern.
- Each tab is a native `<button type="button">` — `Space` / `Enter` activates, `Tab` / `Shift+Tab` moves focus.
- **Missing:** the WAI-ARIA Tabs pattern also expects arrow-key navigation between tabs and `tabindex` management (only the active tab in the tab order). This component does not implement either — every tab is independently focusable. Acceptable for short tab lists; consider augmenting for longer ones.
- No `aria-controls` link to a tabpanel is rendered; if you're driving a panel, set `aria-controls` via the spread props or wrap the consumer in your own tabpanel structure.
- Disabled tabs forward the native `disabled` attribute, so they're removed from the tab order and announced as unavailable.
