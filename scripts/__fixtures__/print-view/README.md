# print-view localizer fixtures

Inputs for `scripts/print-view-localize.postbuild.ts`, which Babel-inlines
`$localize` once per `dist/<locale>/` folder. Tests point it here instead of at
the real 1400-line source and the 21 x ~20k-line `src/locale/messages.*.xlf`.

- `fetch-orcid.js` — stands in for `src/assets/print-view/fetch-orcid.js`:
  `printView.biography`, `printView.worksCount` (one `${count}:count:`
  placeholder), `printView.lastModified`.
- `messages.fr.xlf` — locale `fr`, whose folder name is its own XLF suffix.
- `messages.zh_CN.xlf` — folder `zh-CN` via `XLF_LOCALE_MAP`, like
  `pl`->`pl_PL`, `tr`->`tr_TR`, `zh-TW`->`zh_TW`.
- `messages.source.xlf` — folder `src`, mapped to suffix `source`.

No `messages.en.xlf` on purpose: `en` is the source locale, so
`getTranslations` returns null and the English source is inlined with
`missingTranslation: 'ignore'`; a stray en file would move the test onto the
other code path. `worksCount` uses a real `<x id="count"/>` element, never
literal `${expr}:name:` text — `scripts/normalize-xlf.prebuild.ts` throws on
that syntax, and the translate plugin needs a named placeholder.
