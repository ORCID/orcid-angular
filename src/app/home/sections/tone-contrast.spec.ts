import { HeadingComponent } from '../components/heading/heading.component'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'

import { SectionShellComponent } from '../components/section-shell/section-shell.component'
import { Tone } from '../../types/homepage-content.v2'

const TONES: Tone[] = ['default', 'surface', 'brand-dark', 'brand-tint']

/** WCAG 2.1 minimum for body text (SC 1.4.3). */
const MINIMUM_RATIO = 4.5

@Component({
  standalone: true,
  imports: [HeadingComponent, SectionShellComponent],
  template: `
    <app-section-shell
      sectionId="tone-probe"
      [tone]="tone"
      labelledBy="tone-probe-heading"
    >
      <app-heading [level]="2" id="tone-probe-heading">Tone probe</app-heading>
    </app-section-shell>
  `,
})
class ToneProbeComponent {
  tone: Tone = 'default'
}

/**
 * Parses whatever the browser hands back from getComputedStyle. Colours come
 * out as `rgb(r, g, b)` or `rgba(r, g, b, a)` in every engine we support, so
 * this reads the numbers rather than trying to resolve a token by name — the
 * whole point is to measure what a reader would actually see.
 */
function toChannels(computed: string): [number, number, number] {
  const numbers = computed.match(/[\d.]+/g)
  if (!numbers || numbers.length < 3) {
    throw new Error(`Not a resolved colour: "${computed}"`)
  }
  const alpha = numbers.length > 3 ? parseFloat(numbers[3]) : 1
  if (alpha !== 1) {
    // A translucent tone would have to be composited against whatever is
    // behind it, which makes the pair unverifiable. Tones are opaque by rule.
    throw new Error(`Tone colour is not opaque: "${computed}"`)
  }
  return [
    parseFloat(numbers[0]),
    parseFloat(numbers[1]),
    parseFloat(numbers[2]),
  ]
}

/** WCAG 2.1 relative luminance, computed here so a token change breaks it. */
function relativeLuminance(channels: [number, number, number]): number {
  const [r, g, b] = channels.map((channel) => {
    const srgb = channel / 255
    return srgb <= 0.03928
      ? srgb / 12.92
      : Math.pow((srgb + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrastRatio(foreground: string, background: string): number {
  const light = relativeLuminance(toChannels(foreground))
  const dark = relativeLuminance(toChannels(background))
  const lighter = Math.max(light, dark)
  const darker = Math.min(light, dark)
  return (lighter + 0.05) / (darker + 0.05)
}

describe('homepage tone pairs', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToneProbeComponent],
    }).compileComponents()
  })

  function paint(tone: Tone): { foreground: string; background: string } {
    const fixture = TestBed.createComponent(ToneProbeComponent)
    fixture.componentInstance.tone = tone
    fixture.detectChanges()

    // The probe has to be in the document: a detached element resolves custom
    // properties against nothing, so every tone would come back "unset".
    document.body.appendChild(fixture.nativeElement)
    const section = (fixture.nativeElement as HTMLElement).querySelector(
      'section'
    ) as HTMLElement
    const computed = getComputedStyle(section)
    const paint = {
      foreground: computed.color,
      background: computed.backgroundColor,
    }
    fixture.destroy()
    return paint
  }

  it('sanity-checks the contrast maths against the two WCAG endpoints', () => {
    // Black on white is 21:1 and a colour on itself is 1:1. If these drift the
    // ratios below mean nothing.
    expect(contrastRatio('rgb(0, 0, 0)', 'rgb(255, 255, 255)')).toBeCloseTo(
      21,
      5
    )
    expect(contrastRatio('rgb(46, 127, 159)', 'rgb(46, 127, 159)')).toBeCloseTo(
      1,
      5
    )
  })

  TONES.forEach((tone) => {
    it(`keeps text on the "${tone}" tone readable at 4.5:1 or better`, () => {
      const { foreground, background } = paint(tone)
      const ratio = contrastRatio(foreground, background)

      expect(ratio)
        .withContext(
          `tone "${tone}": ${foreground} on ${background} is ` +
            `${ratio.toFixed(2)}:1`
        )
        .toBeGreaterThanOrEqual(MINIMUM_RATIO)
    })
  })
})
