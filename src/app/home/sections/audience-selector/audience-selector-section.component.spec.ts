import { Directionality } from '@angular/cdk/bidi'
import { MediaMatcher } from '@angular/cdk/layout'
import { Component } from '@angular/core'
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing'
import { Subject } from 'rxjs'

import {
  AudienceSelectorSection,
  AudienceSelectorVariant,
} from '../../../types/homepage-content.v2'
import { HeadingLevel } from '../../heading-level'
import { AudienceSelectorSectionComponent } from './audience-selector-section.component'
import {
  AUDIENCE_TABS_MIN_WIDTH,
  HERO_SCRIM_ALPHA,
} from './audience-selector.constants'
import {
  FakeMediaMatcher,
  audienceSelectorFixture,
} from './audience-selector.test-doubles'

@Component({
  standalone: true,
  imports: [AudienceSelectorSectionComponent],
  template: `
    <app-audience-selector-section
      [section]="section"
      [headingLevel]="headingLevel"
    />
  `,
})
class HostComponent {
  section: AudienceSelectorSection = audienceSelectorFixture('tabs-photo')
  headingLevel: HeadingLevel = 2
}

describe('AudienceSelectorSectionComponent', () => {
  let fixture: ComponentFixture<HostComponent>
  let host: HostComponent
  let matcher: FakeMediaMatcher
  let direction: { value: 'ltr' | 'rtl'; change: Subject<'ltr' | 'rtl'> }

  function configure(wide: boolean, dir: 'ltr' | 'rtl' = 'ltr'): void {
    // Reset first, so a spec that needs to see both modes can reconfigure.
    TestBed.resetTestingModule()
    matcher = new FakeMediaMatcher(wide)
    direction = { value: dir, change: new Subject<'ltr' | 'rtl'>() }
    TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [
        { provide: MediaMatcher, useValue: matcher },
        { provide: Directionality, useValue: direction },
      ],
    })
    fixture = TestBed.createComponent(HostComponent)
    host = fixture.componentInstance
  }

  afterEach(() => TestBed.resetTestingModule())

  function element(): HTMLElement {
    return fixture.nativeElement as HTMLElement
  }

  function all(selector: string): HTMLElement[] {
    return Array.from(element().querySelectorAll<HTMLElement>(selector))
  }

  /** What a screen reader's heading list would contain, in order. */
  function outline(): string[] {
    return all('h1, h2, h3, h4, h5, h6').map(
      (heading) =>
        `${heading.tagName.toLowerCase()}: ${heading.textContent?.trim()}`
    )
  }

  // -------------------------------------------------------------------------
  // Every variant renders
  // -------------------------------------------------------------------------

  const variants: AudienceSelectorVariant[] = [
    'tabs-photo',
    'tabs-flat',
    'stacked',
  ]

  for (const variant of variants) {
    it(`renders all six audiences in the ${variant} variant`, () => {
      configure(true)
      host.section = audienceSelectorFixture(variant)
      fixture.detectChanges()

      const text = element().textContent ?? ''
      for (const audience of host.section.audiences) {
        expect(text).withContext(audience.label).toContain(audience.label)
        expect(text).toContain('The first thing this audience gets.')
      }
    })
  }

  it('offers no widget at all in the stacked variant, at any width', () => {
    configure(true)
    host.section = audienceSelectorFixture('stacked')
    fixture.detectChanges()

    expect(all('[role="tablist"]').length).toBe(0)
    expect(all('[role="tab"]').length).toBe(0)
    expect(all('[aria-expanded]').length).toBe(0)
    // Nothing is hidden, so everything is findable, printable and crawlable.
    expect(all('[hidden]').length).toBe(0)
  })

  // -------------------------------------------------------------------------
  // The responsive switch
  // -------------------------------------------------------------------------

  it('stacks six audiences as accordion headers on a narrow screen', () => {
    configure(false)
    fixture.detectChanges()

    const headers = all('button[aria-expanded]')
    expect(headers.length).toBe(6)
    expect(all('[role="tab"]').length).toBe(0)
    // type="button", so a header inside a form never submits it.
    headers.forEach((header) =>
      expect(header.getAttribute('type')).toBe('button')
    )
  })

  it('offers a tab strip on a wide screen', () => {
    configure(true)
    fixture.detectChanges()

    expect(all('[role="tab"]').length).toBe(6)
    expect(all('button[aria-expanded]').length).toBe(0)
  })

  it('reads exactly the same heading outline in both modes', () => {
    configure(false)
    fixture.detectChanges()
    const accordion = outline()

    configure(true)
    fixture.detectChanges()
    const tabs = outline()

    expect(accordion.length).toBe(18) // 6 audiences x (1 label + 2 features)
    expect(tabs).toEqual(accordion)
  })

  it('agrees with the TypeScript flip point about where the flip point is', () => {
    configure(true)
    fixture.detectChanges()

    const published = getComputedStyle(
      element().querySelector('app-audience-selector-section') as HTMLElement
    ).getPropertyValue('--audience-tabs-min-width')

    expect(published.trim()).toBe(`${AUDIENCE_TABS_MIN_WIDTH}px`)
  })

  // -------------------------------------------------------------------------
  // Heading levels
  // -------------------------------------------------------------------------

  it('puts an audience one level below a section that has a title', () => {
    configure(false)
    host.section = audienceSelectorFixture('tabs-flat', 'ORCID is for…')
    fixture.detectChanges()

    expect(all('h2').length).toBe(1)
    expect(all('h2')[0].textContent?.trim()).toBe('ORCID is for…')
    expect(all('h3').length).toBe(6)
    expect(all('h4').length).toBe(12)
  })

  it('promotes the audiences when the section has no title of its own', () => {
    configure(false)
    fixture.detectChanges()

    // An untitled section contributes no level, so it cannot open a gap in the
    // outline that a reader would hear as a missing heading.
    expect(all('h2').length).toBe(6)
    expect(all('h3').length).toBe(12)
  })

  // -------------------------------------------------------------------------
  // The accordion contract
  // -------------------------------------------------------------------------

  it('opens exactly one audience and reaches its panel from its own header', () => {
    configure(false)
    fixture.detectChanges()

    const headers = all('button[aria-expanded]')
    const expanded = headers.filter(
      (header) => header.getAttribute('aria-expanded') === 'true'
    )
    expect(expanded.length).toBe(1)

    headers.forEach((header) => {
      const panelId = header.getAttribute('aria-controls') as string
      const panel = element().querySelector(`[id="${panelId}"]`) as HTMLElement
      expect(panel).withContext(panelId).not.toBeNull()
      expect(panel.getAttribute('role')).toBe('region')
      expect(panel.getAttribute('aria-labelledby')).toBe(header.id)
      expect(panel.hidden).toBe(
        header.getAttribute('aria-expanded') === 'false'
      )
    })
  })

  it('leaves the open header usable rather than disabling it', () => {
    configure(false)
    fixture.detectChanges()

    const open = all('button[aria-expanded="true"]')[0]
    open.click()
    fixture.detectChanges()

    // Clicking the open header is a no-op, but a control that stops responding
    // must not also stop being reachable.
    expect(open.getAttribute('aria-expanded')).toBe('true')
    expect(open.hasAttribute('aria-disabled')).toBe(false)
    expect(open.hasAttribute('disabled')).toBe(false)
    expect(open.tabIndex).toBe(0)
    expect(all('button[aria-expanded="true"]').length).toBe(1)
  })

  it('gives every accordion header a target big enough to hit', () => {
    configure(false)
    fixture.detectChanges()

    all('button[aria-expanded]').forEach((header) => {
      const minHeight = parseFloat(getComputedStyle(header).minHeight)
      expect(minHeight).toBeGreaterThanOrEqual(48)
    })
  })

  it('moves focus between headers with the arrow keys without opening them', () => {
    configure(false)
    fixture.detectChanges()

    const headers = all('button[aria-expanded]')
    headers[0].focus()
    headers[0].dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })
    )
    fixture.detectChanges()

    expect(document.activeElement).toBe(headers[1])
    // Focus is not selection: the first audience is still the open one.
    expect(headers[0].getAttribute('aria-expanded')).toBe('true')
    expect(headers[1].getAttribute('aria-expanded')).toBe('false')

    headers[1].dispatchEvent(
      new KeyboardEvent('keydown', { key: 'End', bubbles: true })
    )
    fixture.detectChanges()
    expect(document.activeElement).toBe(headers[5])
  })

  // -------------------------------------------------------------------------
  // The tab strip contract
  // -------------------------------------------------------------------------

  it('gives the tablist an accessible name a reader can act on', () => {
    configure(true)
    fixture.detectChanges()

    const tablist = element().querySelector('[role="tablist"]') as HTMLElement
    expect(tablist.getAttribute('aria-label')).toBe('Choose who you are')
  })

  it('pairs every tab with a panel that names it back', () => {
    configure(true)
    fixture.detectChanges()

    const tabs = all('[role="tab"]')
    expect(tabs.length).toBe(6)

    tabs.forEach((tab) => {
      const panelId = tab.getAttribute('aria-controls') as string
      const panel = element().querySelector(`[id="${panelId}"]`) as HTMLElement
      expect(panel).withContext(panelId).not.toBeNull()
      expect(panel.getAttribute('role')).toBe('tabpanel')
      expect(panel.getAttribute('aria-labelledby')).toBe(tab.id)
      // Always focusable, so Tab out of the strip lands in the panel even when
      // the panel holds no focusable content of its own.
      expect(panel.tabIndex).toBe(0)
    })
  })

  it('keeps every audience in the document while showing only one', () => {
    configure(true)
    fixture.detectChanges()

    const panels = all('[role="tabpanel"]')
    expect(panels.length).toBe(6)
    expect(panels.filter((panel) => !panel.hidden).length).toBe(1)

    // The words are there whether or not the panel is on screen: this is what
    // print, reader mode and a crawler see.
    panels.forEach((panel, index) => {
      expect(panel.textContent).toContain(host.section.audiences[index].label)
      expect(panel.textContent).toContain(
        'The second thing this audience gets.'
      )
    })
  })

  it('marks the selected tab with more than a colour', () => {
    configure(true)
    fixture.detectChanges()

    const tabs = all('[role="tab"]')
    const selected = tabs[0]
    const unselected = tabs[1]

    expect(selected.getAttribute('aria-selected')).toBe('true')
    expect(unselected.getAttribute('aria-selected')).toBe('false')

    const selectedStyle = getComputedStyle(selected)
    const unselectedStyle = getComputedStyle(unselected)
    expect(selectedStyle.borderBottomWidth).toBe('3px')
    expect(selectedStyle.borderBottomStyle).toBe('solid')
    expect(selectedStyle.borderBottomColor).not.toBe(
      unselectedStyle.borderBottomColor
    )
    expect(Number(selectedStyle.fontWeight)).toBeGreaterThan(
      Number(unselectedStyle.fontWeight)
    )
  })

  it('moves and activates with the arrow keys, and only one tab is a tab stop', () => {
    configure(true)
    fixture.detectChanges()

    const tabs = all('[role="tab"]')
    tabs[0].focus()
    tabs[0].dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
    )
    fixture.detectChanges()

    expect(document.activeElement).toBe(tabs[1])
    expect(tabs[1].getAttribute('aria-selected')).toBe('true')
    expect(tabs[0].tabIndex).toBe(-1)
    expect(tabs[1].tabIndex).toBe(0)
  })

  it('follows the reader when the reader reads right to left', () => {
    configure(true, 'rtl')
    fixture.detectChanges()

    const tabs = all('[role="tab"]')
    tabs[0].focus()
    // In an RTL page the *next* tab is to the left, so ArrowLeft advances.
    tabs[0].dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true })
    )
    fixture.detectChanges()

    expect(tabs[1].getAttribute('aria-selected')).toBe('true')
  })

  // -------------------------------------------------------------------------
  // Crossing the flip point
  // -------------------------------------------------------------------------

  it('keeps the chosen audience, and the focus, across the flip point', fakeAsync(() => {
    configure(false)
    fixture.detectChanges()

    const thirdHeader = all('button[aria-expanded]')[2]
    thirdHeader.click()
    thirdHeader.focus()
    fixture.detectChanges()
    expect(document.activeElement).toBe(thirdHeader)

    matcher.setMatches(true)
    tick() // BreakpointObserver debounces every emission after the first
    fixture.detectChanges()

    const tabs = all('[role="tab"]')
    expect(tabs.length).toBe(6)
    expect(tabs[2].getAttribute('aria-selected')).toBe('true')
    // SC 1.3.4: reflow must not cost a keyboard user their place.
    expect(document.activeElement).toBe(tabs[2])

    matcher.setMatches(false)
    tick()
    fixture.detectChanges()

    const headers = all('button[aria-expanded]')
    expect(headers[2].getAttribute('aria-expanded')).toBe('true')
    expect(document.activeElement).toBe(headers[2])
  }))

  // -------------------------------------------------------------------------
  // The photograph
  // -------------------------------------------------------------------------

  it('drops the background photograph on a narrow screen', () => {
    configure(false)
    fixture.detectChanges()

    // Not rendered rather than rendered and hidden: a phone should not pay for
    // six photographs it will never see.
    expect(all('.audience-panel__media').length).toBe(0)
  })

  it('lays a scrim over the photograph on a wide screen', () => {
    configure(true)
    fixture.detectChanges()

    expect(all('.audience-panel__media').length).toBe(6)
    expect(all('.audience-panel--photo').length).toBe(6)
    all('img').forEach((image) => {
      // A background photograph carries no meaning, so it is never announced.
      expect(image.getAttribute('alt')).toBe('')
      expect(image.getAttribute('aria-hidden')).toBe('true')
    })
  })

  it('actually paints the scrim layer, at the alpha the constant names', () => {
    configure(true)
    fixture.detectChanges()

    const panel = element().querySelector('.audience-panel') as HTMLElement
    const scrim = getComputedStyle(panel, '::before')

    // spec-v2's manual check 10 is "confirm the scrim is actually in the render
    // tree" — a scrim that is specified but not painted looks fine to every
    // automated tool and fails every reader.
    expect(scrim.content).not.toBe('none')
    expect(scrim.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    expect(Number(scrim.opacity)).toBeCloseTo(HERO_SCRIM_ALPHA, 5)
    expect(getComputedStyle(panel).backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
  })

  it('shows no photograph in the flat variant', () => {
    configure(true)
    host.section = audienceSelectorFixture('tabs-flat')
    fixture.detectChanges()

    expect(all('.audience-panel__media').length).toBe(0)
    expect(all('.audience-panel--photo').length).toBe(0)
  })

  it('publishes no accessibility error for any image it renders', () => {
    configure(true)
    fixture.detectChanges()

    expect(all('[data-a11y-error]').length).toBe(0)
  })

  it('sends an external feature link to a new tab and says so', () => {
    configure(true)
    fixture.detectChanges()

    const link = element().querySelector(
      '.feature-card__link'
    ) as HTMLAnchorElement
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toBe('noopener noreferrer')
    expect(link.textContent).toContain('(opens in a new tab)')
  })

  it('says "opens in a new tab" to a reader without printing it on the page', () => {
    configure(true)
    fixture.detectChanges()

    const note = element().querySelector('.cdk-visually-hidden') as HTMLElement
    const box = note.getBoundingClientRect()

    // In the accessibility tree, out of the layout: clipped to a 1px box rather
    // than display:none, which would remove it from the tree as well.
    expect(note.textContent).toBe('(opens in a new tab)')
    expect(getComputedStyle(note).display).not.toBe('none')
    expect(box.width).toBeLessThanOrEqual(1)
    expect(box.height).toBeLessThanOrEqual(1)
  })
})
