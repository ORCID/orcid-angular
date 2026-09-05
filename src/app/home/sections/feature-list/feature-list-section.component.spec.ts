import { Component, Input } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import {
  FeatureListSection,
  FeatureListVariant,
  Tone,
} from '../../../types/homepage-content.v2'
import { SectionShellComponent } from '../../components/section-shell/section-shell.component'
import { HeadingLevel, SECTION_HEADING_LEVEL } from '../../heading-level'
import { FeatureListSectionComponent } from './feature-list-section.component'

const VARIANTS: FeatureListVariant[] = [
  'cards',
  'columns',
  'panel',
  'checklist',
]
const TONES: Tone[] = ['default', 'surface', 'brand-dark', 'brand-tint']

/**
 * A 1x1 transparent GIF, inline. A path under /assets would 404 through the
 * Karma web server and bury the real output in warnings; nothing here depends
 * on the bytes, only on the element the renderer emits for them.
 */
const ICON_SRC =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

/** SC 1.4.11: a boundary that carries meaning needs 3:1 against its backdrop. */
const MINIMUM_NON_TEXT_RATIO = 3

function section(
  overrides: Partial<FeatureListSection> = {}
): FeatureListSection {
  return {
    id: 'integrate',
    type: 'feature-list',
    variant: 'cards',
    layout: { span: 'full', spacing: 'normal', tone: 'default' },
    title: 'Integrate with ORCID',
    items: [
      {
        id: 'hub',
        title: 'One hub for research activity',
        body: 'ORCID connects people with their research activities.',
        icon: { src: ICON_SRC },
        link: {
          label: 'Read the Crossref documentation',
          href: 'https://www.crossref.org/documentation/',
        },
      },
      {
        id: 'certified',
        title: 'Certified service providers',
        body: 'Find ORCID-enabled scholarly service providers.',
      },
      {
        id: 'start',
        title: 'Getting started',
        body: 'Getting started is easier than it might seem.',
      },
    ],
    ...overrides,
  }
}

@Component({
  standalone: true,
  imports: [FeatureListSectionComponent, SectionShellComponent],
  template: `
    <app-section-shell
      [sectionId]="content.id"
      [tone]="tone"
      [spacing]="content.layout.spacing"
      [labelledBy]="'section-' + content.id + '-title'"
      sectionType="feature-list"
      [sectionVariant]="content.variant"
    >
      <app-feature-list-section
        [section]="content"
        [headingLevel]="headingLevel"
      />
    </app-section-shell>
  `,
})
class HostComponent {
  @Input() content: FeatureListSection = section()
  @Input() headingLevel: HeadingLevel = SECTION_HEADING_LEVEL
  @Input() tone: Tone = 'default'
}

/**
 * Reads whatever the browser hands back from getComputedStyle. `color-mix()`
 * resolves to `rgb(...)` in some engines and to `color(srgb r g b)` — channels
 * in 0-1 — in others, and the point of the assertion is the colour a reader
 * actually sees, so both spellings are accepted rather than one being assumed.
 */
function toChannels(computed: string): [number, number, number] {
  const numbers = computed.match(/[\d.]+/g)
  if (!numbers || numbers.length < 3) {
    throw new Error(`Not a resolved colour: "${computed}"`)
  }
  const scale = computed.startsWith('color(') ? 255 : 1
  const alpha = numbers.length > 3 ? parseFloat(numbers[3]) : 1
  if (alpha !== 1) {
    // A translucent rule would have to be composited against whatever is behind
    // it, which makes its contrast unverifiable from one measurement.
    throw new Error(`Separator colour is not opaque: "${computed}"`)
  }
  return [
    parseFloat(numbers[0]) * scale,
    parseFloat(numbers[1]) * scale,
    parseFloat(numbers[2]) * scale,
  ]
}

/** WCAG 2.1 relative luminance, recomputed here so a token change breaks it. */
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
  return (Math.max(light, dark) + 0.05) / (Math.min(light, dark) + 0.05)
}

describe('FeatureListSectionComponent', () => {
  let fixture: ComponentFixture<HostComponent>
  let host: HostComponent
  const attached: HTMLElement[] = []

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(HostComponent)
    host = fixture.componentInstance
  })

  afterEach(() => {
    while (attached.length) {
      attached.pop()?.remove()
    }
  })

  function element(): HTMLElement {
    return fixture.nativeElement as HTMLElement
  }

  /** Layout and colour are only real once the fixture is in the document. */
  function attach(): HTMLElement {
    const node = element()
    document.body.appendChild(node)
    attached.push(node)
    return node
  }

  function render(overrides: Partial<FeatureListSection> = {}): void {
    host.content = section(overrides)
    fixture.detectChanges()
  }

  /** The outline as assistive technology would walk it: level, then text. */
  function outline(): string[] {
    return Array.from(element().querySelectorAll('h1, h2, h3, h4, h5, h6')).map(
      (heading) =>
        `${heading.tagName.toLowerCase()}:${heading.textContent?.trim()}`
    )
  }

  function items(): HTMLElement[] {
    return Array.from(element().querySelectorAll('li.feature-item'))
  }

  VARIANTS.forEach((variant) => {
    it(`renders every item of a "${variant}" list`, () => {
      render({ variant })

      expect(items().length).toBe(3)
      expect(element().textContent).toContain('One hub for research activity')
      expect(element().textContent).toContain('Certified service providers')
      expect(element().textContent).toContain('Getting started')
    })
  })

  it('reads out the same heading outline whichever variant is chosen', () => {
    const outlines = VARIANTS.map((variant) => {
      render({ variant })
      return outline()
    })

    expect(outlines[0]).toEqual([
      'h2:Integrate with ORCID',
      'h3:One hub for research activity',
      'h3:Certified service providers',
      'h3:Getting started',
    ])
    outlines.forEach((candidate, index) => {
      expect(candidate)
        .withContext(`variant "${VARIANTS[index]}"`)
        .toEqual(outlines[0])
    })
  })

  it('reads out the same content order whichever variant is chosen', () => {
    const orders = VARIANTS.map((variant) => {
      render({ variant })
      return items().map((item) =>
        item.textContent?.replace(/\s+/g, ' ').trim()
      )
    })

    orders.forEach((candidate, index) => {
      expect(candidate)
        .withContext(`variant "${VARIANTS[index]}"`)
        .toEqual(orders[0])
    })
  })

  it('puts item headings one level below a section that has a title', () => {
    render()

    expect(element().querySelector('h2')?.textContent).toBe(
      'Integrate with ORCID'
    )
    expect(
      Array.from(element().querySelectorAll('h3')).map((h) => h.textContent)
    ).toEqual([
      'One hub for research activity',
      'Certified service providers',
      'Getting started',
    ])
  })

  it('promotes item headings to the section level when there is no title', () => {
    render({ title: undefined })

    expect(element().querySelector('h3')).toBeNull()
    expect(
      Array.from(element().querySelectorAll('h2')).map((h) => h.textContent)
    ).toEqual([
      'One hub for research activity',
      'Certified service providers',
      'Getting started',
    ])
  })

  it('treats a whitespace-only title as no title at all', () => {
    render({ title: '   ' })

    expect(outline()).toEqual([
      'h2:One hub for research activity',
      'h2:Certified service providers',
      'h2:Getting started',
    ])
  })

  it('follows the level it is given rather than assuming it sits at the top', () => {
    host.headingLevel = 3
    render()

    expect(element().querySelector('h3')?.textContent).toBe(
      'Integrate with ORCID'
    )
    expect(element().querySelectorAll('h4').length).toBe(3)
  })

  it('emits no heading for an untitled item, rather than an empty one', () => {
    render({
      items: [
        { id: 'titled', title: 'Has a title', body: 'Body one.' },
        { id: 'untitled', body: 'Body two.' },
      ],
    })

    expect(outline()).toEqual(['h2:Integrate with ORCID', 'h3:Has a title'])
    element()
      .querySelectorAll('h1, h2, h3, h4, h5, h6')
      .forEach((heading) => {
        expect(heading.textContent?.trim()).not.toBe('')
      })
  })

  it('names the section region after its own title', () => {
    render()

    const region = element().querySelector('section')
    const labelledBy = region?.getAttribute('aria-labelledby')
    expect(labelledBy).toBe('section-integrate-title')
    expect(element().querySelector(`#${labelledBy}`)?.textContent).toBe(
      'Integrate with ORCID'
    )
  })

  it('gives every item heading an id derived from the content ids', () => {
    render()

    expect(
      element().querySelector('#section-integrate-hub-title')
    ).not.toBeNull()
    expect(
      element().querySelector('#section-integrate-certified-title')
    ).not.toBeNull()
  })

  it('links with the label as the whole link text, never the URL', () => {
    render()

    const link = element().querySelector('a.feature-item__link') as HTMLElement
    expect(link.textContent?.replace(/\s+/g, ' ').trim()).toBe(
      'Read the Crossref documentation (opens in a new tab)'
    )
    expect(link.getAttribute('href')).toBe(
      'https://www.crossref.org/documentation/'
    )
    expect(link.textContent).not.toContain('http')
  })

  it('opens an offsite link in a new tab and says so', () => {
    render()

    const link = element().querySelector('a.feature-item__link') as HTMLElement
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toBe('noopener noreferrer')
    expect(link.textContent).toContain('(opens in a new tab)')
  })

  it('keeps an ORCID link, a subdomain and a mailto in the same tab', () => {
    render({
      items: [
        {
          id: 'internal',
          body: 'Body.',
          link: { label: 'Register', href: 'https://orcid.org/register' },
        },
        {
          id: 'subdomain',
          body: 'Body.',
          link: {
            label: 'Documentation',
            href: 'https://info.orcid.org/documentation/',
          },
        },
        {
          id: 'mail',
          body: 'Body.',
          link: { label: 'Email support', href: 'mailto:support@orcid.org' },
        },
      ],
    })

    element()
      .querySelectorAll('a.feature-item__link')
      .forEach((link) => {
        expect(link.getAttribute('target')).toBeNull()
        expect(link.getAttribute('rel')).toBeNull()
        expect(link.textContent).not.toContain('opens in a new tab')
      })
  })

  it('hides a feature icon from assistive technology in every variant', () => {
    VARIANTS.forEach((variant) => {
      render({ variant })

      const image = element().querySelector(
        '.feature-item__icon img'
      ) as HTMLImageElement
      expect(image)
        .withContext(`variant "${variant}" dropped the icon from the DOM`)
        .not.toBeNull()
      expect(image.getAttribute('alt')).toBe('')
      expect(image.getAttribute('aria-hidden')).toBe('true')
    })
  })

  it('separates panel items with a real horizontal rule between them', () => {
    render({ variant: 'panel' })
    attach()

    const rules = Array.from(
      element().querySelectorAll('hr.feature-list__rule')
    ) as HTMLElement[]
    // Three items, two rules: a trailing rule would announce a separator with
    // nothing after it.
    expect(rules.length).toBe(2)
    rules.forEach((rule) => {
      expect(getComputedStyle(rule).display).not.toBe('none')
    })
  })

  it('shows no separator in the variants that are not panels', () => {
    ;(['cards', 'columns', 'checklist'] as FeatureListVariant[]).forEach(
      (variant) => {
        render({ variant })
        attach()

        element()
          .querySelectorAll('hr.feature-list__rule')
          .forEach((rule) => {
            expect(getComputedStyle(rule as HTMLElement).display)
              .withContext(`variant "${variant}"`)
              .toBe('none')
          })
      }
    )
  })

  it('sanity-checks the contrast maths against the two WCAG endpoints', () => {
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
    it(`keeps the panel separator visible at 3:1 on the "${tone}" tone`, () => {
      host.tone = tone
      render({ variant: 'panel' })
      attach()

      const rule = element().querySelector(
        'hr.feature-list__rule'
      ) as HTMLElement
      const backdrop = element().querySelector('section') as HTMLElement
      const ratio = contrastRatio(
        getComputedStyle(rule).borderTopColor,
        getComputedStyle(backdrop).backgroundColor
      )

      expect(ratio)
        .withContext(
          `tone "${tone}": rule ${getComputedStyle(rule).borderTopColor} on ${
            getComputedStyle(backdrop).backgroundColor
          } is ${ratio.toFixed(2)}:1`
        )
        .toBeGreaterThanOrEqual(MINIMUM_NON_TEXT_RATIO)
    })
  })

  it('never lays cards out in more columns than the editor asked for', () => {
    render({ variant: 'cards', columns: 2 })
    attach()

    const list = element().querySelector('.feature-list__items') as HTMLElement
    const tracks = getComputedStyle(list).gridTemplateColumns.split(/\s+/)
    expect(tracks.length).toBeLessThanOrEqual(2)
    // Equal tracks are what makes a ragged last row impossible: whatever is
    // left over stretches across the row instead of leaving a gap.
    expect(new Set(tracks).size).toBe(1)
  })

  it('keeps panel and checklist to a single column at every width', () => {
    ;(['panel', 'checklist'] as FeatureListVariant[]).forEach((variant) => {
      render({ variant })
      attach()

      const list = element().querySelector(
        '.feature-list__items'
      ) as HTMLElement
      expect(getComputedStyle(list).display)
        .withContext(`variant "${variant}"`)
        .not.toBe('grid')
    })
  })

  it('lets a long card grow instead of clipping the translation', () => {
    render({
      variant: 'cards',
      items: [
        {
          id: 'long',
          title: 'Ein Titel',
          body: 'Wissenschaftlerinnen und Wissenschaftler '.repeat(20),
        },
        { id: 'short', title: 'Kurz', body: 'Kurz.' },
      ],
    })
    attach()

    const card = element().querySelector('li.feature-item') as HTMLElement
    expect(getComputedStyle(card).overflow).toBe('visible')
    expect(getComputedStyle(card).height).not.toBe(
      getComputedStyle(card).minHeight
    )
    // Nothing is cut off: the box is at least as tall as its own content.
    expect(card.scrollHeight).toBeLessThanOrEqual(card.clientHeight + 1)
  })

  it('falls back to the first variant when the bundle names an unknown one', () => {
    render({ variant: 'carousel' as FeatureListVariant })

    expect(element().querySelector('.feature-list--cards')).not.toBeNull()
    expect(items().length).toBe(3)
  })

  it('hides the icon on narrow screens in the columns variant only', () => {
    // A Karma spec cannot change the viewport, so the tier rule is read from
    // the stylesheet the component actually shipped rather than asserted
    // through a resize that would silently never happen.
    const narrowSelectors: string[] = []
    Array.from(document.styleSheets).forEach((sheet) => {
      let rules: CSSRuleList
      try {
        rules = sheet.cssRules
      } catch {
        return
      }
      Array.from(rules).forEach((rule) => {
        if (
          rule instanceof CSSMediaRule &&
          rule.conditionText.includes('max-width') &&
          rule.cssText.includes('feature-item__icon')
        ) {
          Array.from(rule.cssRules).forEach((inner) => {
            if (inner instanceof CSSStyleRule) {
              narrowSelectors.push(inner.selectorText)
            }
          })
        }
      })
    })

    expect(narrowSelectors.length).toBeGreaterThan(0)
    narrowSelectors.forEach((selector) => {
      expect(selector).toContain('feature-list--columns')
      expect(selector).not.toContain('feature-list--cards')
      expect(selector).not.toContain('feature-list--checklist')
    })
  })
})
