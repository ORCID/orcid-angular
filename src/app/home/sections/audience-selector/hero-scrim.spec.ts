import {
  HERO_SCRIM_ALPHA,
  HERO_SCRIM_ALPHA_MORE_CONTRAST,
  HERO_SCRIM_BASE_RGB,
} from './audience-selector.constants'

/** WCAG 2.1 relative luminance, from the definition rather than a table. */
function relativeLuminance([r, g, b]: readonly number[]): number {
  const channel = (value: number): number => {
    const c = value / 255
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

function contrastRatio(a: readonly number[], b: readonly number[]): number {
  const [lighter, darker] = [relativeLuminance(a), relativeLuminance(b)].sort(
    (x, y) => y - x
  )
  return (lighter + 0.05) / (darker + 0.05)
}

/** Source-over compositing of an opaque colour at `alpha` onto an opaque one. */
function composite(
  over: readonly number[],
  under: readonly number[],
  alpha: number
): number[] {
  return over.map(
    (channel, index) => channel * alpha + under[index] * (1 - alpha)
  )
}

const WHITE = [255, 255, 255]

/**
 * The one contrast check no tool performs.
 *
 * axe's `color-contrast` rule returns *incomplete* — never *fail* — whenever
 * text overlaps an image, so an automated accessibility run over the rendered
 * homepage says nothing at all about the white text on an audience's
 * photograph. The editor chooses the photograph; the renderer therefore has to
 * hold the guarantee, and the worst case it must hold against is a photograph
 * that is pure white in the region behind the text.
 *
 * A designer who lightens the scrim breaks this spec, which is the intent.
 */
describe('the scrim over an audience photograph', () => {
  it('keeps white text readable over the brightest photograph anyone could upload', () => {
    const worstCase = composite(HERO_SCRIM_BASE_RGB, WHITE, HERO_SCRIM_ALPHA)
    const ratio = contrastRatio(WHITE, worstCase)

    expect(ratio).toBeGreaterThanOrEqual(4.5)
    expect(ratio).toBeCloseTo(6.16, 2)
  })

  it('only ever gets safer when a reader asks for more contrast', () => {
    const normal = contrastRatio(
      WHITE,
      composite(HERO_SCRIM_BASE_RGB, WHITE, HERO_SCRIM_ALPHA)
    )
    const raised = contrastRatio(
      WHITE,
      composite(HERO_SCRIM_BASE_RGB, WHITE, HERO_SCRIM_ALPHA_MORE_CONTRAST)
    )

    expect(raised).toBeGreaterThan(normal)
  })

  it('would fail if the alpha were softened to 0.6', () => {
    // The arithmetic, not the constant, is what this spec protects: it has to
    // be able to say no. 0.70 is the floor (5.28:1); 0.60 is 3.93:1.
    const softened = contrastRatio(
      WHITE,
      composite(HERO_SCRIM_BASE_RGB, WHITE, 0.6)
    )

    expect(softened).toBeLessThan(4.5)
  })

  it('measures a known pair correctly', () => {
    // Two endpoints, so a broken luminance function cannot pass by accident.
    expect(contrastRatio(WHITE, [0, 0, 0])).toBeCloseTo(21, 5)
    expect(contrastRatio(WHITE, WHITE)).toBeCloseTo(1, 5)
  })
})
