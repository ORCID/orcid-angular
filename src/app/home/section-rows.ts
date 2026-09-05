import { HomepageSection } from 'src/app/types/homepage-content.v2'

/**
 * Group sections into rows, pairing adjacent half-width ones.
 *
 * Greedy, left to right, adjacent only. The rules that follow from that are
 * deliberate and are what make the layout predictable rather than clever:
 * three consecutive halves pair the first two and leave the third full width,
 * a full-width section between two halves breaks the pair, and a half at the
 * end of the document is full width.
 *
 * `validate.mjs` in the content repository refuses to publish a half that this
 * function would widen, so an editor is told at review time rather than
 * discovering it on the page. Keeping the algorithm this simple is what lets
 * the validator predict it exactly.
 */
export function packSectionRows(
  sections: readonly HomepageSection[]
): HomepageSection[][] {
  const rows: HomepageSection[][] = []
  let index = 0

  while (index < sections.length) {
    const current = sections[index]
    const next = sections[index + 1]

    if (
      current.layout?.span === 'half' &&
      next !== undefined &&
      next.layout?.span === 'half'
    ) {
      rows.push([current, next])
      index += 2
    } else {
      rows.push([current])
      index += 1
    }
  }

  return rows
}
