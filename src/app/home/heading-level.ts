/**
 * The heading-level rule for the composed homepage (spec-v2 §4.4).
 *
 * Levels are computed from position, never authored: the content catalogue has
 * no `level`, `headingLevel` or `tag` field, and the meta-schema forbids one
 * being added. This module is the single place the arithmetic lives, so the
 * outline is a property of the renderer rather than of an editor's care.
 *
 *   h1                         = page.title (exactly one, always first)
 *   section title (if present) = 2
 *   item title in a section    = section.title ? 3 : 2
 *   sub-item title             = item title level + 1
 */

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

/** Sections sit directly under the page `h1`, so they start at 2. */
export const SECTION_HEADING_LEVEL: HeadingLevel = 2

/**
 * Clamps any number into the range HTML actually has elements for.
 *
 * Deeply nested content would otherwise ask for an `h7`, which does not exist;
 * repeating `h6` is what the HTML spec leaves us and is what screen readers
 * announce sanely.
 */
export function clampLevel(level: number): HeadingLevel {
  return Math.min(6, Math.max(1, Math.trunc(level))) as HeadingLevel
}

/**
 * The level a child heading takes under a parent at `level`.
 *
 * The increment applies *only* when the parent actually rendered a title. An
 * untitled ancestor therefore contributes no level and so cannot open a gap in
 * the outline — an untitled section promotes its children instead of orphaning
 * them. This asks nothing of the editor, which is why it is stronger than a
 * guideline saying "a section with sub-headings must have a title".
 */
export function nextLevel(
  level: HeadingLevel,
  parentHasTitle: boolean
): HeadingLevel {
  return parentHasTitle ? clampLevel(level + 1) : level
}

/**
 * Escapes one content id into something safe to put in an HTML `id`.
 *
 * Content ids are linted against `^[a-z][a-z0-9-]{0,59}$` in the CMS repository,
 * so in practice this is the identity function. It exists because `id` and
 * `aria-labelledby` are *space-separated token lists*: one id containing a
 * space would not fail loudly, it would silently make the reference point at
 * nothing. The escape is reversible (any `_` in the output opens a `_<hex>_`
 * escape), so two different ids can never collapse onto the same heading id.
 */
function escapeIdPart(part: string): string {
  return part.replace(
    /[^a-zA-Z0-9-]/gu,
    (character) => `_${character.codePointAt(0)!.toString(16)}_`
  )
}

/**
 * The id of a heading, derived from content ids and never from heading text.
 *
 * `aria-labelledby` on a section points at this. Deriving it from the ids means
 * the reference survives translation (the text changes, the id does not) and
 * reordering (the id does not encode position).
 */
export function headingId(sectionId: string, itemId?: string): string {
  const section = escapeIdPart(sectionId)
  return itemId === undefined
    ? `section-${section}-title`
    : `section-${section}-${escapeIdPart(itemId)}-title`
}
