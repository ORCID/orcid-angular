# Spot check - do the screenshots actually show the AI JSON?

Internal QA. Not for reviewers.

Scope agreed with the requester: 2 languages x 3 features x 2 models = **12 AI
screenshots**, checked by reading the rendered text and comparing it against
the model's own JSON file.

Languages: `es`, `de`. Models: `claude-sonnet-5`, `claude-opus-4-8`.

## Method

For every language and feature, the three candidate JSON files (human, Sonnet,
Opus) were diffed to isolate the keys where **all three differ**. Those keys are
the discriminators: if a screenshot were built from the wrong locale file, the
rendered string would match the wrong source and the mismatch would be obvious.
The rendered panels were then read and compared string by string against the
expected source for that letter, using the blinding map in `manifest.json`.

HTML entities were normalised before comparison (`&apos;` in JSON renders as
`'`).

## Result: PASS - 12 of 12

| Language | Feature | Discriminating keys | Sonnet | Opus | Human control |
| --- | --- | --- | --- | --- | --- |
| es | register | 12 | match | match | match |
| es | two-factor | 4 | match | match | match |
| es | developer-tools | 21 | match | match | match |
| de | register | 9 | match | match | match |
| de | two-factor | 2 | match | match | match |
| de | developer-tools | 18 | match | match | match |

Every panel rendered the strings from the JSON file it is credited with in the
answer sheet. No case was found of a screenshot showing another source's
wording, so the applied-XLF step was correct for these runs.

Sample of what was matched (de / developer-tools):

- `developerTools.performMachineSearch` - Sonnet "Öffentliche Daten in der
  ORCID-Registrierung durchsuchen" vs Opus "Öffentliche Daten im ORCID-Register
  durchsuchen" vs human "Öffentliche Daten in der ORCID-Datenbank suchen" -
  all three rendered on the panel credited with them.
- `developerTools.obtainHigher` - Sonnet "anonyme ORCID-API", Opus "ORCID
  Anonymous API", human "anonyme API von ORCID" - likewise.

## Expected absences (not defects)

Many in-scope keys are conditional strings that never render on a pristine
page, so they cannot be verified from a screenshot and were not counted as
failures:

- `register`: all validation and hint strings - `register.firstNameError`,
  `register.invalidEmail2`, the duplicate-email block
  (`theEmailAddress`/`isAssociatedWith`/`anExisting`/...), and the
  personal/professional email nudges.
- `two-factor`: the three `ngOrcid.signin.2fa.*` errors, which appear only
  after a failed submit.
- `developer-tools`: `youMustAcceptThePublicClientTermsOfService`,
  `youMustHaveAtLeastOneVerifiedEmail`, `noVerifiedEmailAddresses`.

## Issue found and handled: floating support-chat widget

Not a translation problem, but it would have invalidated the experiment.

A blue **"Help"** support bubble is burned into **40 of the 48 AI screenshots
and 0 of the 24 human ones**. All 24 language x feature groups were mixed, so
in every single packet the human panel would have been the one without a blue
bubble - a reviewer could have picked it out without reading a word.

Because the widget is `position: fixed`, a stitched full-page capture repeats it
once per scroll segment, at varying heights.

Handling in `build_evaluation_packets.py`:

- Occurrences are detected by colour. The bubble is `(32,70,155)`
  (blue-red 123, blue-green 85); ORCID's own teal links are `(40,91,116)`
  (blue-red 76, blue-green 25). Thresholds sit in that gap.
- They are always masked before the content bbox is measured, so they cannot
  inflate the crop window. That part is unconditional.

**Decision: the bubble is blanked out** (`REDACT_HELP_WIDGET = True`).

- `register`, `two-factor`: no redaction needed. Every occurrence falls outside
  the cropped card, so those 16 packets are untouched.
- `developer-tools`: one occurrence lands inside the crop and **covers a few
  words of the `publicClientApplicationsAreGranted2` paragraph**. That text is
  not recoverable from the PNG, so the same rectangle is blanked in all three
  candidate panels - identical loss for every candidate, no tell. The English
  reference panel is left intact.
- A build-time assertion fails the run if any bubble pixel survives into a
  finished crop.

Proper fix, if the developer-tools comparison needs to be pristine: re-capture
those screenshots with the support widget suppressed, then re-run the script.

## Issue found and handled: partly-rendered 2FA QR code

The second, and larger, blinding tell.

The 2FA QR image reserves a fixed 424px square. In the live-QA `human`
captures it is fully painted. In the local-build AI captures it was caught
mid-load, leaving only an 80-190px sliver at the top of the square:

| Language | human | Sonnet | Opus |
| --- | --- | --- | --- |
| de | 112 | (none) | 120 |
| es | 112 | 112 | 112 |
| fr | 328 | 120 | 192 |
| it | 424 | 80 | 80 |
| ja | 336 | 120 | 80 |
| pt | 200 | 112 | 112 |
| ru | 416 | 112 | 120 |
| zh_CN | 336 | 80 | 80 |

(painted height in px)

In 6 of the 8 languages the human panel showed a visibly larger QR than both
AI panels - the odd one out, spottable at a glance without reading any text.

Handling: the full 424px square is blanked in **all four panels** of every
two-factor packet. The QR encodes a per-session TOTP secret and carries no
translated string (`account.qrCodeAltText` is alt text, never rendered), so
nothing under review is lost, and the row now looks uniform.

Detection keys on the QR's fixed width rather than on darkness alone - dense
CJK text lines are as black as a QR but span the card, so a width filter is
what separates them. The rect is anchored on the single most complete
detection in the group instead of a union of all four, so a detection that
merged with a neighbouring text line cannot widen it.

## Other blinding checks

- Site header and footer are cropped off every panel, which also removes the
  language switcher, the signed-in username, the `qa.orcid.org` iD card, and
  the extra cookie banner that appears only in the live-QA `human` captures.
- Header rule and footer boundary were confirmed to sit at identical
  coordinates for human and AI captures of the same language, so the crop
  leaves no geometric tell.
- All four panels in a packet share one crop window, so panel width cannot
  hint at the source.
- Letter assignment: 24 groups, each with exactly one A, one B and one C
  mapped to three distinct sources; no language uses the same mapping for all
  three of its features.

## Answer-key images

`answers/images/{lang}/{lang}-{feature}-ANSWER.png` is the same composite as
the blind packet, but each panel band is colour-coded and named (human /
Sonnet / Opus) and carries the cost of translating that one screen into that
one language. Same crops, same redactions, same letters as the blind version -
only the labelling differs, so the two can be read side by side in the write-up.

Cost basis, all from the experiment README:

- **Human** - $0.0141 per source word per language (derived as $0.198/word
  across 14 languages from this account's e2f order history). Shown per screen
  as the marginal rate. It understates a real invoice: a 659-word job is far
  below the ~1,700-word threshold, so an actual order bills the **$340
  minimum**, which is what the bottom-line comparison should use.
- **AI** - GitHub AI credits at the $0.04 standard overage rate: Sonnet 147
  credits, Opus 164, for the whole 87-string x 8-language run. The per-screen
  figure is that run cost apportioned by the screen's share of source words,
  then divided across the 8 languages - an average, not a metered price.

Per language (all three screens, 659 source words): human $9.29, Sonnet $0.73,
Opus $0.82.
