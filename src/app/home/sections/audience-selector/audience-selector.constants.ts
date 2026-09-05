/**
 * The two numbers the audience selector is not allowed to disagree with itself
 * about (spec-v2 5.5, 7.2).
 *
 * Both are duplicated once into `audience-selector-section.component.scss`,
 * because Sass cannot read a TypeScript module. Each duplicate is pinned by a
 * spec that reads the value back out of the rendered DOM, so the two copies
 * cannot drift silently.
 */

/**
 * The width at or above which the selector is a tab strip rather than an
 * accordion.
 *
 * 1024 because six wrapping labels need roughly 1000px in the longest
 * supported locale, and because the live orcid.org page flips at the same
 * width, so a side-by-side comparison at any viewport is honest. The accordion
 * is the safe side of the boundary: if this number is wrong the failure mode is
 * "a wide screen shows an accordion", not "a narrow screen shows a scrolling
 * tab strip with pagination arrows", which is what ships today.
 */
export const AUDIENCE_TABS_MIN_WIDTH = 1024

/** The media query built from it, shared by the component and its specs. */
export const AUDIENCE_TABS_QUERY = `(min-width: ${AUDIENCE_TABS_MIN_WIDTH}px)`

/**
 * The scrim laid over an audience's background photograph.
 *
 * The alpha is a component constant and no content field can lower it: an
 * editor chooses the photograph, so the renderer has to guarantee the contrast
 * of the white text on top of it whatever they choose. axe cannot check this —
 * its `color-contrast` rule returns *incomplete*, never *fail*, when text
 * overlaps an image — so `hero-scrim.spec.ts` is the only safety net, and it
 * does the compositing arithmetic itself.
 *
 * Written as sRGB channels rather than as `#003449` because
 * `scripts/check-home-styles.sh` fails the build on a hex literal anywhere
 * under `src/app/home/**` outside `sections/_tone.scss`. The colour is
 * `--orcid-color-brand-secondary-darkest`; the stylesheet uses that token and
 * never this array.
 */
export const HERO_SCRIM_BASE_RGB: readonly [number, number, number] = [
  0, 52, 73,
]

/** 0.75 gives 6.16:1 for white text over a pure-white photograph. */
export const HERO_SCRIM_ALPHA = 0.75

/** `prefers-contrast: more` raises it (spec-v2 5.6). */
export const HERO_SCRIM_ALPHA_MORE_CONTRAST = 0.92
