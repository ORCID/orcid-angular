import { Component } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import {
  QuickLinksSection,
  QuickLinksVariant,
} from '../../../types/homepage-content.v2'
import { HeadingLevel } from '../../heading-level'
import { QuickLinksSectionComponent } from './quick-links-section.component'

const VARIANTS: QuickLinksVariant[] = ['bar', 'grid', 'list']

function quickLinks(
  variant: QuickLinksVariant,
  overrides: Partial<QuickLinksSection> = {}
): QuickLinksSection {
  return {
    id: 'quick-links',
    type: 'quick-links',
    variant,
    layout: { span: 'full', spacing: 'loose', tone: 'brand-tint' },
    title: 'Get started with ORCID',
    titleHidden: true,
    links: [
      {
        id: 'get-id',
        label: 'Get my ORCID iD and record',
        href: 'https://orcid.org/signin',
        description: 'Register in under a minute.',
        icon: { src: 'assets/quick-links/id.png', focalPoint: 'center' },
      },
      {
        id: 'troubleshoot',
        label: 'Troubleshoot my record',
        href: 'https://support.orcid.org/hc/en-us',
        description: 'Fix a duplicate or a locked account.',
      },
      {
        id: 'standards',
        label: 'Read the standards',
        href: 'https://www.niso.org/',
        description: 'How persistent identifiers work.',
      },
    ],
    ...overrides,
  }
}

@Component({
  standalone: true,
  imports: [QuickLinksSectionComponent],
  template: `
    <app-quick-links-section
      [section]="section"
      [headingLevel]="headingLevel"
    />
  `,
})
class HostComponent {
  section: QuickLinksSection = quickLinks('bar')
  headingLevel: HeadingLevel = 2
}

describe('QuickLinksSectionComponent', () => {
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

  function show(section: QuickLinksSection): void {
    host.section = section
    fixture.detectChanges()
  }

  function nav(): HTMLElement {
    const found = element().querySelector('nav')
    expect(found).not.toBeNull()
    return found as HTMLElement
  }

  function links(): HTMLAnchorElement[] {
    return Array.from(element().querySelectorAll('a'))
  }

  /** What a screen reader's heading list would show, in document order. */
  function outline(): string[] {
    return Array.from(element().querySelectorAll('h1,h2,h3,h4,h5,h6')).map(
      (heading) => `${heading.tagName}: ${heading.textContent?.trim()}`
    )
  }

  /** The text of whatever the navigation's name points at. */
  function accessibleNavName(): string {
    const id = nav().getAttribute('aria-labelledby')
    expect(id).toBeTruthy()
    const target = element().querySelector(`#${id}`)
    expect(target).not.toBeNull()
    return target?.textContent?.trim() ?? ''
  }

  /**
   * True when the element is clipped to the 1px box that leaves it in the
   * accessibility tree but off the screen. Written against the geometry rather
   * than against one recipe: `app-heading` uses the CDK's mixin (clip, no
   * clip-path) and this component defines its own rule for the new-tab
   * warning, and both must count as hidden.
   */
  function isVisuallyHidden(el: Element): boolean {
    const style = getComputedStyle(el)
    const box = el.getBoundingClientRect()
    const clipped =
      style.position === 'absolute' && box.height <= 1 && box.width <= 1

    if (clipped) {
      // Hidden from sight is not the same as hidden from a screen reader; if
      // either of these were true the text would be gone from the tree too.
      expect(style.display).not.toBe('none')
      expect(el.getAttribute('aria-hidden')).toBeNull()
      expect((el as HTMLElement).hidden).toBe(false)
    }
    return clipped
  }

  it('offers every link as a real anchor in each of the three variants', () => {
    for (const variant of VARIANTS) {
      show(quickLinks(variant))

      const anchors = links()
      expect(anchors.length).withContext(`variant ${variant}`).toBe(3)
      expect(anchors.map((a) => a.getAttribute('href'))).toEqual([
        'https://orcid.org/signin',
        'https://support.orcid.org/hc/en-us',
        'https://www.niso.org/',
      ])
      expect(
        anchors.map((a) => a.querySelector('.quick-links__label')?.textContent)
      ).toEqual([
        'Get my ORCID iD and record',
        'Troubleshoot my record',
        'Read the standards',
      ])
    }
  })

  it('announces the same heading outline whichever variant is chosen', () => {
    const outlines = VARIANTS.map((variant) => {
      show(quickLinks(variant))
      return outline()
    })

    expect(outlines[0]).toEqual(['H2: Get started with ORCID'])
    expect(outlines[1]).toEqual(outlines[0])
    expect(outlines[2]).toEqual(outlines[0])
  })

  it('puts the section title at the level it was given, and nothing else', () => {
    host.headingLevel = 4
    show(quickLinks('grid'))

    expect(outline()).toEqual(['H4: Get started with ORCID'])
    for (const anchor of links()) {
      expect(anchor.querySelector('h1,h2,h3,h4,h5,h6')).toBeNull()
    }
  })

  it('names the navigation after its heading in every variant', () => {
    for (const variant of VARIANTS) {
      show(quickLinks(variant))
      expect(accessibleNavName())
        .withContext(`variant ${variant}`)
        .toBe('Get started with ORCID')
    }
  })

  it('keeps the navigation named when the bar hides its heading from sight', () => {
    show(quickLinks('bar', { titleHidden: true }))

    const heading = element().querySelector('h2') as HTMLElement
    expect(isVisuallyHidden(heading)).toBe(true)
    expect(accessibleNavName()).toBe('Get started with ORCID')
  })

  it('shows the heading in grid and list even when the content asks to hide it', () => {
    for (const variant of ['grid', 'list'] as QuickLinksVariant[]) {
      show(quickLinks(variant, { titleHidden: true }))

      const heading = element().querySelector('h2') as HTMLElement
      expect(isVisuallyHidden(heading))
        .withContext(`variant ${variant}`)
        .toBe(false)
      expect(heading.getBoundingClientRect().height)
        .withContext(`variant ${variant}`)
        .toBeGreaterThan(1)
    }
  })

  it('gives every link a target of at least 44 by 44 CSS pixels', () => {
    for (const variant of VARIANTS) {
      show(quickLinks(variant))

      for (const anchor of links()) {
        const box = anchor.getBoundingClientRect()
        expect(box.height)
          .withContext(`${variant}: ${anchor.textContent?.trim()}`)
          .toBeGreaterThanOrEqual(44)
        expect(box.width)
          .withContext(`${variant}: ${anchor.textContent?.trim()}`)
          .toBeGreaterThanOrEqual(44)
      }
    }
  })

  it('gives a bar row at least the 48 pixels of height the narrow tier asks for', () => {
    show(quickLinks('bar'))

    for (const anchor of links()) {
      expect(anchor.getBoundingClientRect().height).toBeGreaterThanOrEqual(48)
    }
  })

  it('draws an icon as an image readers skip, never as a CSS background', () => {
    show(quickLinks('bar'))

    const icon = element().querySelector('img') as HTMLImageElement
    expect(icon).not.toBeNull()
    expect(icon.getAttribute('alt')).toBe('')
    expect(icon.getAttribute('aria-hidden')).toBe('true')
    // Intrinsic dimensions, so the row reserves its space before the bytes
    // arrive and the labels do not jump.
    expect(icon.getAttribute('width')).toBe('40')
    expect(icon.getAttribute('height')).toBe('40')

    // A CSS background-image is dropped entirely in Windows forced-colors
    // mode, which is how the live homepage loses these icons.
    for (const node of Array.from(element().querySelectorAll('*'))) {
      expect(getComputedStyle(node).backgroundImage)
        .withContext(node.className.toString())
        .toBe('none')
    }
  })

  it('warns of a new tab in the name of links that leave ORCID, and only those', () => {
    show(quickLinks('bar'))

    const [orcid, support, external] = links()

    expect(orcid.getAttribute('target')).toBeNull()
    expect(orcid.getAttribute('rel')).toBeNull()
    expect(orcid.textContent).not.toContain('opens in a new tab')

    // A support.orcid.org link is still ORCID's own, so it stays in the tab.
    expect(support.getAttribute('target')).toBeNull()

    expect(external.getAttribute('target')).toBe('_blank')
    expect(external.getAttribute('rel')).toBe('noopener noreferrer')
    expect(external.textContent).toContain('(opens in a new tab)')

    const warning = external.querySelector(
      '.cdk-visually-hidden'
    ) as HTMLElement
    expect(isVisuallyHidden(warning)).toBe(true)
  })

  /**
   * The `l` tier, and only that one. Media queries are answered by the real
   * viewport, which a unit test cannot resize, so the tier the karma window
   * happens to sit in is the tier that can be asserted. It reports as pending
   * rather than passing when the runner is narrower, so a green result never
   * means "this went unchecked".
   */
  function requireWideViewport(): boolean {
    if (window.innerWidth < 840) {
      pending(
        `needs the l tier: the karma window is ${window.innerWidth}px wide`
      )
      return false
    }
    return true
  }

  /** The distinct row positions the list items occupy. */
  function rowTops(): number[] {
    const tops = Array.from(element().querySelectorAll('li')).map((li) =>
      Math.round(li.getBoundingClientRect().top)
    )
    return Array.from(new Set(tops))
  }

  it('lays the bar out as one row once there is room for it', () => {
    if (!requireWideViewport()) return
    show(quickLinks('bar'))

    expect(rowTops().length).toBe(1)
    // Wrapping, not nowrap: a German label three times this long takes a
    // second line instead of pushing the strip past the viewport.
    const list = element().querySelector('.quick-links__list') as HTMLElement
    expect(getComputedStyle(list).flexWrap).toBe('wrap')
    expect(element().scrollWidth).toBeLessThanOrEqual(element().clientWidth + 1)
  })

  it('puts grid and list three across once there is room for it', () => {
    if (!requireWideViewport()) return

    for (const variant of ['grid', 'list'] as QuickLinksVariant[]) {
      show(quickLinks(variant))
      expect(rowTops().length).withContext(`variant ${variant}`).toBe(1)
    }
  })

  it('shows a link description only in the list variant', () => {
    show(quickLinks('list'))
    expect(
      Array.from(element().querySelectorAll('.quick-links__description')).map(
        (node) => node.textContent
      )
    ).toEqual([
      'Register in under a minute.',
      'Fix a duplicate or a locked account.',
      'How persistent identifiers work.',
    ])

    for (const variant of ['bar', 'grid'] as QuickLinksVariant[]) {
      show(quickLinks(variant))
      expect(element().querySelectorAll('.quick-links__description').length)
        .withContext(`variant ${variant}`)
        .toBe(0)
    }
  })
})
