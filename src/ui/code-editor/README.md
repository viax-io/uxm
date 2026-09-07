# Code Editor

A monospace code surface for developer tooling — query consoles, payload editors, expression fields. Ships as two exports over one themeable surface: `CodeEditor` (editable, a real `<textarea>`) and `CodeBlock` (read-only, a `<pre><code>`).

## What it is not

**There is no syntax highlighting, and there cannot be inside this atom.** A `<textarea>` renders one uniform text run — the browser gives you no way to colour a token inside it. The usual workaround is a `<pre>` overlay behind transparent text plus a tokenizer, which is a different component with a different failure surface; if highlighting becomes a real requirement, build that, don't add a prop here.

**It is not a wrapper over CodeMirror or Monaco.** `@viax.io/uxm` ships zero runtime dependencies by constitutional rule (`dependencies` is `{}`; peers are `react` / `react-dom` only). The upside of staying native is everything that comes free with a real form control: IME composition, undo/redo, form participation, mobile keyboards, and a screen-reader contract that already works.

## Why it isn't `<Textarea variant="code">`

1. **Studio theming is per-component-id.** Every `styleProperty` maps to one `--uxm-<id>-*` variable and `layoutVariants` are ephemeral display states, so a variant could not carry its own font size — setting the mono surface to 12.5px would drag every prose textarea in the app with it.
2. **Tab-to-indent is the point of a code field and a keyboard trap in a prose one.** Gating it behind a prop gives one component two keyboard contracts.
3. **The input family already splits by purpose** — password, number, currency, date, time and phone are each their own atom rather than a mode on `TextInput`.

## Usage

```tsx
import { CodeBlock, CodeEditor } from '@viax.io/uxm';

function QueryConsole() {
  const [query, setQuery] = useState(DEFAULT_QUERY);

  return (
    <>
      <CodeEditor
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          // Claim a key before the atom sees it — preventDefault is the signal.
          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault();
            run(query);
          }
        }}
        lineNumbers
        aria-label="GraphQL query"
      />
      <CodeBlock lineNumbers>{JSON.stringify(result, null, 2)}</CodeBlock>
    </>
  );
}
```

## Keyboard

| Key | Behaviour |
|-----|-----------|
| `Tab` | Inserts one indent level at the caret. With a selection, indents every touched line and keeps the selection. |
| `Shift`+`Tab` | Outdents the current line, or every line in the selection. Removes one tab or up to `indentSize` spaces — never a real character. |
| `Escape` then `Tab` | Moves focus out of the field. Escape still bubbles, so an enclosing `Modal` or `Popover` also closes. |
| `Enter` | Carries the current line's leading whitespace onto the new line, plus one extra level after an opening `{`, `[` or `(`. |
| ⌘/Ctrl/Alt + `Tab` | Never intercepted — browser and OS shortcuts pass through. |
| Any key mid-composition | Never intercepted. While an IME is composing, `Enter` commits the candidate and `Tab` cycles candidates — both belong to the IME. |

A selection that **ends at column 0** does not drag that line into an indent: selecting `alpha\n` in `alpha\nbeta` indents only `alpha`. Blank lines inside a selection are skipped too, so indenting a block never leaves whitespace-only lines.

**The field is never a keyboard trap.** `Escape` releases the next `Tab`; any other keystroke re-arms indenting. That is CodeMirror's convention, and it is the reason `indentWithTab` can default to `true` without failing WCAG 2.1.1. Set `indentWithTab={false}` when the editor sits in a form whose primary interaction is tabbing between fields.

Edits made by the atom go through `document.execCommand('insertText')` — deprecated, but the only API that writes into a `<textarea>` while preserving the browser's native undo stack, so ⌘Z after an auto-indent still works. Engines that refuse it fall back to the native value setter plus a synthetic `input` event; that path loses undo history but keeps the value correct.

## `CodeEditor` props

Extends `TextareaHTMLAttributes<HTMLTextAreaElement>` (minus `wrap`, which is re-typed as a boolean).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | – | Controlled source text. |
| `defaultValue` | `string` | – | Initial text when uncontrolled. |
| `onChange` | `(e: ChangeEvent<HTMLTextAreaElement>) => void` | – | Fires on every edit, including Tab-indent and auto-indent. |
| `onKeyDown` | `(e: KeyboardEvent<HTMLTextAreaElement>) => void` | – | Runs **before** the atom's own handling. Call `preventDefault()` to claim a key. |
| `indentSize` | `number` | `2` | Spaces typed per indent level, and the maximum stripped per outdent. Affects what the editor **types**; rendering of literal tab characters is `--uxm-code-editor-tab-size`. |
| `indentWithTab` | `boolean` | `true` | Tab / Shift+Tab indent instead of moving focus. See Keyboard above. |
| `autoIndent` | `boolean` | `true` | Enter carries the previous line's indent. |
| `lineNumbers` | `boolean` | `false` | Line-number gutter down the left edge. |
| `wrap` | `boolean` | `false` | Soft-wrap long lines. **Mutually exclusive with `lineNumbers`** — a wrapped line occupies several rows, which no per-line gutter can track, so setting both drops the gutter and warns. |
| `error` | `string` | – | Validation message below the field; also sets `aria-invalid` and the `--error` visual. |
| `textareaRef` | `Ref<HTMLTextAreaElement>` | – | Handle to the underlying element, merged with the atom's own ref. A plain React `ref` on `<CodeEditor>` does **not** reach it. |
| `spellCheck` | `boolean` | `false` | Off by default — code is not prose. `autoCorrect`, `autoCapitalize` and `autoComplete` are forced off and not configurable. |
| `className` | `string` | – | Merged onto the root wrapper, not the `<textarea>`. |
| `style` | `CSSProperties` | – | Also the root wrapper, so a per-instance `--uxm-code-editor-*` override reaches the chrome and the gutter. Every other prop is forwarded to the `<textarea>`. |

## `CodeBlock` props

Extends `HTMLAttributes<HTMLDivElement>` (minus `onScroll`, re-typed below).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | – | Source text, rendered verbatim. |
| `lineNumbers` | `boolean` | `false` | Gutter. Requires a **string** child and `wrap` off — a non-string child cannot be counted and a wrapped line cannot be tracked, so the gutter stays off rather than showing a wrong count. |
| `wrap` | `boolean` | `false` | Soft-wrap long lines. Turns the gutter off, as above. |
| `onScroll` | `(e: UIEvent<HTMLPreElement>) => void` | – | Fires on the inner `<pre>` — the element that actually scrolls. Re-typed from the root's `HTMLDivElement` for that reason. |

`CodeBlock` is a `<pre><code>` rather than `<CodeEditor readOnly>` on purpose: it sizes to its content, stays out of the tab order, and assistive tech announces it as code instead of as an editable field the user cannot edit.

## CSS variables

`CodeBlock` reads the **same** `--uxm-code-editor-*` variables and has no registry entry of its own. That is deliberate — an output panel that didn't match the query typed above it would be a bug, so the two are one themeable surface with one set of knobs.

| Variable | Fallback | Default | Affects |
|----------|----------|---------|---------|
| `--uxm-code-editor-bg` | `--color-surface-alt` | – | Root background (both atoms). |
| `--uxm-code-editor-border-color` | `--color-border` | – | Root border. |
| `--uxm-code-editor-color` | `--color-text` | – | Code text. |
| `--uxm-code-editor-border-radius` | – | `8px` | Root radius. |
| `--uxm-code-editor-font-family` | – | `ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace` | Typeface for code **and** gutter. |
| `--uxm-code-editor-font-size` | – | `12.5px` | Multiplied by `--type-scale`. |
| `--uxm-code-editor-line-height` | – | `1.6` | Unitless on purpose — see below. |
| `--uxm-code-editor-tab-size` | – | `2` | Render width of a literal tab character. |
| `--uxm-code-editor-padding-x` | – | `14px` | Horizontal padding on code and gutter. |
| `--uxm-code-editor-padding-y` | – | `12px` | Vertical padding, shared by code and gutter. |
| `--uxm-code-editor-min-height` | – | `140px` | Editor only. |
| `--uxm-code-editor-resize` | – | `vertical` | Textarea resize handle. |
| `--uxm-code-editor-gutter-width` | – | `2ch` | Minimum gutter width. |
| `--uxm-code-editor-gutter-gap` | – | `12px` | Space between numbers and the divider. |
| `--uxm-code-editor-gutter-color` | `--color-text-muted` | – | Line numbers. |
| `--uxm-code-editor-gutter-bg` | – | `transparent` | Gutter background. |
| `--uxm-code-editor-gutter-border` | `--color-border` | – | Divider between gutter and code. |
| `--uxm-code-editor-hover-border` | `--color-accent` | – | Hover border. |
| `--uxm-code-editor-focus-border` | `--color-accent` | – | Focus border (`:focus-within`). |
| `--uxm-code-editor-focus-ring` | `--color-accent` | – | Focus outline. |
| `--uxm-code-editor-disabled-bg` / `-border` / `-color` / `-opacity` | `--color-surface-alt` / `--color-border` / `--color-text-muted` / – | – / – / – / `0.6` | Disabled state. |
| `--uxm-code-editor-error-border` / `-error-color` | `--color-danger-text` | – | Error state and message. |
| `--uxm-code-editor-error-message-size` | – | `12px` | Message size; multiplied by `--type-scale`. |
| `--uxm-code-block-max-height` | – | `460px` | The one thing `CodeBlock` owns — an editor grows to its content, a result dump has to be capped. |

**Alignment is load-bearing.** The gutter and the code are separate boxes, so line *N* only lines up with number *N* while `font-size`, `line-height` and the vertical padding resolve identically on both. All three are shared variables read by both boxes — never style one side directly. This is also why `--uxm-code-editor-line-height` is unitless: a `px` line-height desyncs the gutter the moment the font size changes.
