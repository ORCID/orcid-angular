# Translation experiment - reviewer packets

Blinded comparison images for the ORCID translation experiment.

## What to send

Send **only** the images in `packets/`. One image per language and feature:

```
packets/es/es-register.png
packets/es/es-two-factor.png
packets/es/es-developer-tools.png
...
```

Each image shows the same screen four times: the English source on the left,
then three translations labelled **A**, **B** and **C**. One of A/B/C is the
current professional human translation; the other two are AI translations
(Claude Sonnet 5 and Claude Opus 4.8). The letters are shuffled independently
for every language and every feature, so `A` does not mean the same thing on
two different images.

## Message to send with them

`messages/{lang}.txt` is a ready-to-paste note for the reviewer of that
language, already filled in with the language name. `messages/_template.txt`
is the same text with a `{LANGUAGE}` placeholder.

It asks each reviewer, per image, to pick whichever reads most natural and
correct (one, two, or none) and whichever feels wrong (one, two, or none), and
invites free-form comments - noting that everything they say goes into the
final report, credited to them.

## The grey square on the two-factor images

That is where the QR code was. It rendered fully in the human captures but only
partly in the AI ones, which made the human panel the obvious odd one out. The
QR encodes a throwaway one-time-password secret and contains no translated
words, so it is blanked in all four panels and nothing under review is lost.
Details in `verification/spot-check-report.md`.

## The grey rectangle on the developer-tools images

That is where a floating blue "Help" support bubble sat. It appears in 40 of
the 48 AI screenshots and in **none** of the 24 human ones, so left in it would
have marked the human panel as the one without a bubble. It also covered a few
words of one paragraph, which cannot be recovered from the capture - so the
same rectangle is blanked in all three candidate panels, an identical loss for
each. The English reference panel is left intact, and `register` is unaffected
(there the bubble falls outside the cropped card).

To remove both grey boxes properly, re-capture the screenshots with the support
widget suppressed and the QR image fully loaded, then re-run this script.

## What NOT to send

- `answers/` - the letter to source mapping, plus a per-language sheet for
  recording each reviewer's verdict.
- `answers/images/` - the **answer-key images**: the same four panels, but with
  each one named (human / Sonnet / Opus) and priced. Useful for the write-up
  once voting is finished; do not let a reviewer see one first.
- `manifest.json` - the same mapping in machine-readable form.
- `verification/` - internal QA of the screenshots.

## Tallying results

`answers/answers.csv` has one row per language/feature/letter. Record verdicts
in the per-language markdown sheets, then count how often each source was
picked as "best" and how often the human translation was correctly identified.
If reviewers cannot reliably pick out the human translation, the AI output is
at parity for these screens.

## Regenerating

```
scripts/.venv/bin/python scripts/build_evaluation_packets.py
```

The shuffle is seeded, so re-running reproduces exactly the same letters.
