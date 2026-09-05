import { Component } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ProseSection, ProseVariant } from '../../../types/homepage-content.v2'
import { HeadingLevel } from '../../heading-level'
import { ProseSectionComponent } from './prose-section.component'

const VARIANTS: ProseVariant[] = ['default', 'lead', 'centered']

const BODY =
  'ORCID provides a **persistent digital identifier** that you own and ' +
  'control.\n\nRead the [ORCID for Researchers page](https://info.orcid.org/researchers/).'

function prose(
  variant: ProseVariant,
  overrides: Partial<ProseSection> = {}
): ProseSection {
  return {
    id: 'what-is-orcid',
    type: 'prose',
    variant,
    layout: { span: 'full', spacing: 'normal', tone: 'default' },
    title: 'What is ORCID?',
    body: BODY,
    ...overrides,
  }
}

@Component({
  standalone: true,
  imports: [ProseSectionComponent],
  template: `
    <app-prose-section [section]="section" [headingLevel]="headingLevel" />
  `,
})
class HostComponent {
  section: ProseSection = prose('default')
  headingLevel: HeadingLevel = 2
}

describe('ProseSectionComponent', () => {
  let fixture: ComponentFixture<HostComponent>
  let host: HostComponent

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(HostComponent)
    host = fixture.componentInstance
  })

  function element(): HTMLElement {
    return fixture.nativeElement as HTMLElement
  }

  function show(section: ProseSection): void {
    host.section = section
    fixture.detectChanges()
  }

  function block(): HTMLElement {
    const found = element().querySelector('.prose')
    expect(found).not.toBeNull()
    return found as HTMLElement
  }

  function outline(): string[] {
    return Array.from(element().querySelectorAll('h1,h2,h3,h4,h5,h6')).map(
      (heading) => `${heading.tagName}: ${heading.textContent?.trim()}`
    )
  }

  function paragraphs(): string[] {
    return Array.from(element().querySelectorAll('p')).map((p) =>
      (p.textContent ?? '').trim()
    )
  }

  /**
   * The width of `chars` characters in the element's own font, measured by the
   * browser. Comparing the resolved `max-width` against this is what makes the
   * measure assertion about the line a reader actually sees, rather than about
   * the string `68ch` appearing in a stylesheet.
   */
  function widthOfChars(el: HTMLElement, chars: number): number {
    const probe = document.createElement('span')
    probe.style.display = 'inline-block'
    probe.style.width = `${chars}ch`
    el.appendChild(probe)
    const width = probe.getBoundingClientRect().width
    probe.remove()
    return width
  }

  it('renders the heading and the body in each of the three variants', () => {
    for (const variant of VARIANTS) {
      show(prose(variant))

      expect(outline())
        .withContext(`variant ${variant}`)
        .toEqual(['H2: What is ORCID?'])
      expect(paragraphs())
        .withContext(`variant ${variant}`)
        .toEqual([
          'ORCID provides a persistent digital identifier that you own and control.',
          'Read the ORCID for Researchers page.',
        ])
    }
  })

  it('reads out identically whichever variant is chosen', () => {
    const readings = VARIANTS.map((variant) => {
      show(prose(variant))
      return [outline().join(' | '), paragraphs().join(' | ')].join(' || ')
    })

    expect(readings[1]).toBe(readings[0])
    expect(readings[2]).toBe(readings[0])
  })

  it('puts the title at the level it was given', () => {
    host.headingLevel = 3
    show(prose('lead'))

    expect(outline()).toEqual(['H3: What is ORCID?'])
  })

  it('emits no heading at all when the section has no title', () => {
    show(prose('default', { title: undefined }))

    expect(outline()).toEqual([])
    // The body is untouched: an untitled section is still a readable one, and
    // it is the absent heading id that tells the shell not to open a region.
    expect(paragraphs().length).toBe(2)
  })

  it('treats a whitespace-only title as no title', () => {
    show(prose('default', { title: '   ' }))

    expect(outline()).toEqual([])
  })

  it('holds the default variant to a 68-character measure', () => {
    show(prose('default'))

    const el = block()
    expect(
      getComputedStyle(el).getPropertyValue('--prose-measure').trim()
    ).toBe('68ch')
    expect(parseFloat(getComputedStyle(el).maxWidth)).toBeCloseTo(
      widthOfChars(el, 68),
      0
    )
  })

  it('narrows lead and centered to a 56-character measure', () => {
    for (const variant of ['lead', 'centered'] as ProseVariant[]) {
      show(prose(variant))

      const el = block()
      expect(getComputedStyle(el).getPropertyValue('--prose-measure').trim())
        .withContext(`variant ${variant}`)
        .toBe('56ch')
      expect(parseFloat(getComputedStyle(el).maxWidth))
        .withContext(`variant ${variant}`)
        .toBeCloseTo(widthOfChars(el, 56), 0)
    }
  })

  it('sets lead in larger type than the default variant', () => {
    show(prose('default'))
    const normal = parseFloat(getComputedStyle(block()).fontSize)

    show(prose('lead'))
    const lead = parseFloat(getComputedStyle(block()).fontSize)

    expect(lead).toBeGreaterThan(normal)
  })

  it('centres the centered variant and leaves the others reading from the start', () => {
    show(prose('centered'))
    const centered = getComputedStyle(block())
    expect(centered.textAlign).toBe('center')
    // `margin-inline: auto` resolves to the two halves of the leftover space,
    // which the browser reports to a thousandth of a pixel; equal to the
    // nearest pixel is what "centred" means to a reader.
    expect(parseFloat(centered.marginInlineStart)).toBeCloseTo(
      parseFloat(centered.marginInlineEnd),
      0
    )
    expect(parseFloat(centered.marginInlineStart)).toBeGreaterThan(0)

    show(prose('default'))
    const start = getComputedStyle(block())
    expect(start.textAlign).not.toBe('center')
    expect(parseFloat(start.marginInlineStart)).toBe(0)
  })

  it('builds the body from parsed nodes, so markup in the content stays text', () => {
    show(
      prose('default', {
        body: 'A **bold** claim and <b>not markup</b>.',
      })
    )

    expect(element().querySelector('strong')?.textContent).toBe('bold')
    // The angle brackets are the editor's literal characters. If this were
    // innerHTML there would be a <b> element here instead.
    expect(element().querySelector('b')).toBeNull()
    expect(paragraphs()).toEqual(['A bold claim and <b>not markup</b>.'])
  })

  it('keeps a body link a real anchor with its address intact', () => {
    show(prose('default'))

    const anchor = element().querySelector('a') as HTMLAnchorElement
    expect(anchor.getAttribute('href')).toBe(
      'https://info.orcid.org/researchers/'
    )
    expect(anchor.textContent?.trim()).toBe('ORCID for Researchers page')
  })
})
