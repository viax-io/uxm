# TimelineEntry

A single row in a vertical activity timeline — a status dot on a rail to the left, a bordered content card on the right.

`TimelineEntry` renders a `<div className="uxm-timeline-entry uxm-timeline-entry--{state}">` with two children: a `rail` column carrying optional `before`/`after` connector lines plus a status `dot`, and a `content` column carrying a title row (`title` + optional `trailing`), an optional `meta` paragraph, and an optional free-form `children` body. The component is a one-row primitive — composing a list of entries into a timeline is the consumer's responsibility (typically a stack with `lineBefore` off on the first entry and `lineAfter` off on the last).

## Usage

```tsx
import { TimelineEntry } from '@viax/uxm';

function Example() {
  return (
    <>
      <TimelineEntry
        title="Account created"
        meta="Mar 12, 09:42"
        trailing="3 days ago"
        state="active"
        lineBefore={false}
      />
      <TimelineEntry
        title="Onboarding completed"
        meta="Mar 13, 14:08"
        state="idle"
        lineAfter={false}
      >
        Synced 14 records from CRM.
      </TimelineEntry>
    </>
  );
}
```

## Props

Extends `Omit<HTMLAttributes<HTMLDivElement>, 'title'>` — `title` is reclaimed as a `ReactNode` content prop; all other native div attributes are spread to the root.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `ReactNode` | – | **Required.** Bold title text in the content card. |
| `meta` | `ReactNode` | – | Optional muted caption rendered below the title. |
| `trailing` | `ReactNode` | – | Optional right-aligned element in the title row (e.g. timestamp, badge). |
| `state` | `'active' \| 'idle'` | `'active'` | Dot tint. `active` uses accent; `idle` uses subtle text colour. |
| `lineBefore` | `boolean` | `true` | Render the rail connector above the dot. Turn off for the first entry. |
| `lineAfter` | `boolean` | `true` | Render the rail connector below the dot. Turn off for the last entry. |
| `children` | `ReactNode` | – | Optional free-form body content rendered below `meta`. |
| `className` | `string` | – | Merged with the root class via `cn`. |
| _(any native div attribute)_ | – | – | Spread onto the root `<div>`. |

The `TimelineDotState` union (`'active' \| 'idle'`) is exported.

## Design tokens (MODO-configurable)

The component has no `--uxm-timeline-entry-*` overrides — colours and surfaces wire directly to the global token layer.

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-border` | Borders / Border | Rail connector lines + content card border. |
| `--color-card` | Surfaces / Card | Content card background + dot halo (the 2px `box-shadow` ring around the dot). |
| `--color-accent` | Accent / Accent | Active dot fill. |
| `--color-text-subtle` | Text / Text Subtle | Idle dot fill + trailing element text. |
| `--color-text` | Text / Text | Title text. |
| `--color-text-muted` | Text / Text Muted | Meta caption + body text. |

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Dot: `active` | `state="active"` (default) | Dot painted with `--color-accent`. |
| Dot: `idle` | `state="idle"` | Dot painted with `--color-text-subtle`. |
| Line above | `lineBefore` true | 2px vertical bar drawn from the top of the rail down to the dot. |
| Line below | `lineAfter` true | 2px vertical bar drawn from just below the dot to the bottom of the rail. |
| Trailing | `trailing` set | Right-aligned element in the title row (`margin-left: auto`). |
| Meta | `meta` set | Small muted paragraph under the title row. |
| Body | `children` set | Larger muted paragraph below meta. |

## Accessibility

- The rail (dot + connector lines) is wrapped in `aria-hidden="true"` — assistive tech reads only the textual content.
- Renders semantic `<span>` / `<p>` / `<div>` text — title, meta, trailing, and body surface in DOM order.
- The dot colour is the only visual cue for `state`; pair `idle` entries with a textual marker (e.g. `meta="pending"` or a `trailing` badge) so the state is conveyed without colour.
- The component is non-interactive; clickable entries should wrap the whole component in an `<a>` or `<button>` and supply an accessible label.
- No ARIA list semantics are imposed — wrap a series of entries in your preferred semantic container (`<ol>`, `<ul>`, `role="list"`, etc.) if list semantics matter for your context.
