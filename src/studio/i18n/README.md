# Studio i18n

Translates the **workbench's own furniture** — the sidebar, the canvas chrome, the properties
panel, component names, knob labels, section headings, brand-token names. It is shipped by the
library because it belongs to the library: a consuming app cannot reach these strings.

**This is not the atoms' copy.** A `Button`'s label, a `DateInput`'s `clearLabel`, a
`FileUpload`'s messages — those stay the consuming app's job and arrive through each component's
props, exactly as [`src/ui/locale/README.md`](../../ui/locale/README.md) describes. The split is
the whole design: the app owns the words its users read, the library owns the words its
*designers* read.

## How a host turns it on

```tsx
<UxmApp locale="de" persistence={persistence} />
```

That is the entire integration. **The host decides what the locale is; the library never works
it out.** UXM has no backend, no storage and no business guessing a user's language — whatever
resolved it in the hosting app (a stored user preference, a realm default, a URL segment) passes
the answer down. `uxm-studio` gets it from its own backend and forwards it; a static portal can
hardcode one.

The same tag also reaches the atoms rendered inside the previews via `UxmLocaleProvider`, so a
calendar in the canvas formats in the language the panel around it is labelled in.

## Resolution — three links, then English

The shipped list is **closed and library-owned** ([`catalog.ts`](./catalog.ts)), which is why
there is no negotiation with a backend and no `getSupportedLocales` anywhere near this:

1. **exact** — `de` → `de`, `pt-BR` → `pt-BR`
2. **base language** — `de-AT` → `de`
3. **region sibling** — `pt-PT` → `pt-BR` (the only Portuguese shipped)
4. **source** — anything else renders English

It never throws and never returns a tag with no dictionary behind it.

## Keys are the English source strings

`t('label', 'Text Color')`, not `t('studio.panel.textColor')`. The registry carries its labels
as **data** (`label: 'Text Color'` on ~2 200 call sites), so keying by the English text left
every one of them untouched, and a missing translation falls back to readable English instead of
a dotted code on screen. The namespace (`chrome`, `category`, `component`, `label`, `section`,
`token`, `description`) disambiguates the cases where one English word needs two translations.

Counted strings go through `tp`, which selects by the locale's own `Intl.PluralRules` — Ukrainian
gets `one`/`few`/`many`/`other`, Japanese gets a single `other`, instead of both being forced
into English's pair.

## Changing a string

New studio code is always translated. Any text a user can see in the studio — labels,
headings, buttons, menu items, tooltips, `aria-label`, `title`, placeholders, empty and error
messages — goes through `t()` (or `tp()` for counted strings). A string literal rendered
directly is a bug even though the gate passes: the extractor only finds `t()` calls and registry
data, so a raw literal is invisible to it.

Any change to a registry label, a component name, a section heading or a `t()` call is done in
the same commit as its translations:

```bash
node scripts/extract-studio-i18n.mjs      # refresh source-catalog.json
node scripts/gen-studio-locales.mjs       # add the new keys to every dictionary as null
# …fill the new nulls in every locale…
npm run check:studio-i18n                 # the gate
```

**The AI agent making the change writes the translations.** It fills every new `null` in all
shipped locales itself, in the same change. Translations are not deferred to a human translator
and English is not left in place. Before translating, look up how the dictionary already
translates the same or related terms (for example `Trailing` before translating `Leading`) and
keep them consistent. Batch the work with `--from` (below): one JSON file per locale.

The gate is not optional politeness. A knob added without this renders its English label in
every locale and **nothing anywhere says so** — the fallback is doing its job, which is exactly
what makes the gap invisible. Two releases of that and the dictionaries are decorative.

A translator can work in JSON instead:
`node scripts/gen-studio-locales.mjs de --from batch.json` merges
`{ "<namespace>": { "<english>": "<translation>" } }` over what the dictionary already has.
Keys absent from the batch keep their current value, so a partial hand-back is safe.

## What ships

`en` (source) plus ten complete dictionaries:

`de` · `es` · `fr` · `it` · `ja` · `nl` · `pl` · `pt-BR` · `tr` · `uk`

**A locale is listed only once its dictionary is complete.** That is the rule the short list
exists to keep: a half-filled language is worse than an absent one, because the English fallback
hides precisely the gaps the user is staring at — they pick their language, get a panel that is
two-thirds English, and nothing explains why. An unlisted tag degrades to English predictably.

### Adding one

1. A row in `STUDIO_LOCALES` ([`catalog.ts`](./catalog.ts)).
2. A loader entry in [`loaders.ts`](./loaders.ts).
3. `node scripts/gen-studio-locales.mjs <tag>` to scaffold the file.
4. Fill it — directly, or hand a translator the JSON and merge it back with `--from`.
5. `npm run check:studio-i18n` must pass before the row from step 1 is committed.

`dir` is honoured end to end (the studio root carries it), but **no RTL locale ships today**.
Adding Arabic, Hebrew or Persian means auditing the workbench's own layout — the resizer, the
dock-left/right affordances, the canvas rulers — not just dropping in a dictionary.

### Review status

The ten shipped dictionaries were produced in-house and have **not been reviewed by native
speakers**. They are design vocabulary rather than prose, and a slightly-off `Border Radius` is a
minor annoyance next to a mis-worded `aria-label` — but before a release that advertises a
language, get a speaker to read its file.

| Reviewed | Locales |
|---|---|
| — | all ten |

## The previews: editors are translated, demos are not

A preview is one of two things, and they are treated differently.

**Demos** — the great majority. A Button preview reading `Save`, a StatCard reading
`$84,500`: that text exists to show *where* copy lands and at what size. It is a placeholder.
Translating it would imply the library picks the word, when in a real app the host passes it in
as a prop and the library has no opinion at all. **Demo copy stays English**, and there are
~114 such literals across `src/ui/**/*-preview.tsx` that are deliberately left alone.

**Editors** — previews that are really studio UI wearing a preview's clothes. Today that is
`brand-settings-preview` (asset uploads, typography, palette) and the logo-upload affordance in
`login-page-preview`. A designer operates these; their labels are chrome and are translated.

### How, given the layer boundary

`src/previews` may not import `src/studio` (`import/no-restricted-paths`), so a preview cannot
reach for `useStudioT`. The studio hands the translator **down** instead, on the same
`PreviewShellContext` that already carries `brand`, `setBrand` and `uploadAsset`:

```ts
shell.t?.('Brand color')          // one argument — always the `chrome` namespace
```

Absent — a host with no dictionaries, or a preview rendered outside the studio — the source
renders as written. Inside a preview, `const t = shell.t ?? ((s) => s);`.

The extractor knows this call shape and harvests it into `chrome`. Option sets that live as
module data (`brand-settings-options.ts`) are bundled and harvested the same way
`SECTION_LABELS` is — and that file is explicit about which fields are chrome (`title`, `hint`,
`label`, `short`) and which are specimen text (`sample`, font names, numeric weights) that must
never be collected.

## What is deliberately NOT translated

`description` is **not** on this list any more. The blurbs were shipped empty at first, on the
argument that prose churns with every registry refactor — a sound argument that produced a hole
directly under the canvas heading, in the most visible place on the screen. They are gated now:
a reworded blurb costs ten files, which is simply the price of having them translated.


- **`description`** — the one-line component blurbs. Translatable (the namespace exists) but
  **ungated**: they are prose, they churn with every registry refactor, and holding every locale
  to them would turn a wording tweak into a ten-file change. Shipped empty; they render English.
- **Demo preview copy** — see above. `Save` on a sample button, `$84,500` on a StatCard, the
  preview modal's fake company names and KPI rows: placeholders, not chrome.
- **`AAA` / `AA` / `AA-large`** — WCAG conformance codes. The same in every language, and a
  translated one would stop matching the spec a designer is checking against. Only the `Fail`
  verdict is translated.
- **Component **ids** and the `name` used in code** — `button-primary` stays `button-primary`.
  Only the display name is translated, and the sidebar search matches **both** the translated
  text and the English source, so a designer typing "Schaltfläche" and a developer typing
  "button" both find it.
