import { Component } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import {
  CtaBandSection,
  CtaBandVariant,
  Tone,
} from '../../../types/homepage-content.v2'
import { HeadingLevel } from '../../heading-level'
import { CtaBandSectionComponent } from './cta-band-section.component'

const VARIANTS: CtaBandVariant[] = ['band', 'panel', 'inline']

function content(overrides: Partial<CtaBandSection> = {}): CtaBandSection {
  return {
    id: 'get-started',
    type: 'cta-band',
    variant: 'band',
    layout: { span: 'full', spacing: 'normal', tone: 'default' },
    title: 'Distinguish yourself in three easy steps',
    body: 'Your iD travels with you. [Read the guide](https://info.orcid.org/)',
    actions: [
      {
        id: 'register',
        label: 'Register',
        href: 'https://orcid.org/register',
        style: 'primary',
      },
      {
        id: 'find-out-more',
        label: 'Find out more',
        href: 'https://info.orcid.org/what-is-orcid/',
        style: 'secondary',
      },
    ],
    ...overrides,
  }
}

@Component({
  standalone: true,
  imports: [CtaBandSectionComponent],
  // The tone pair is set here rather than pulled from _tone.scss because the
  // shell that normally supplies it is not part of this component's contract.
  template: `
    <div [style]="toneStyle">
      <app-cta-band-section
        [section]="section"
        [headingLevel]="headingLevel"
      ></app-cta-band-section>
    </div>
  `,
})
class HostComponent {
  section: CtaBandSection = content()
  headingLevel: HeadingLevel = 2
  toneStyle = '--home-tone-bg: rgb(0, 52, 73); --home-tone-fg: rgb(255,255,255)'
}

describe('CtaBandSectionComponent', () => {
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

  function actions(): HTMLAnchorElement[] {
    return Array.from(element().querySelectorAll('a.cta-band__action'))
  }

  /** The outline as assistive technology walks it: level and announced text. */
  function outline(): string[] {
    return Array.from(element().querySelectorAll('h1,h2,h3,h4,h5,h6')).map(
      (heading) => `${heading.tagName}:${(heading.textContent ?? '').trim()}`
    )
  }

  it('shows the heading, the sentence and both actions in every variant', () => {
    VARIANTS.forEach((variant) => {
      host.section = content({ variant })
      fixture.detectChanges()

      expect(element().textContent).toContain(
        'Distinguish yourself in three easy steps'
      )
      expect(element().textContent).toContain('Your iD travels with you.')
      const labels = actions().map((a) => a.textContent ?? '')
      expect(labels.length).toBe(2)
      expect(labels[0]).toContain('Register')
      expect(labels[1]).toContain('Find out more')
    })
  })

  it('reads out identically whichever variant is chosen', () => {
    const outlines = VARIANTS.map((variant) => {
      host.section = content({ variant })
      fixture.detectChanges()
      return outline().join('|')
    })

    expect(outlines[0]).toBe('H2:Distinguish yourself in three easy steps')
    // A variant is a layout choice; if it could change the outline, an editor
    // picking "panel" over "band" would silently change what a screen reader
    // hears.
    expect(new Set(outlines).size).toBe(1)
  })

  it('puts its title at the level the page computed for it', () => {
    host.headingLevel = 3
    fixture.detectChanges()

    expect(outline()).toEqual(['H3:Distinguish yourself in three easy steps'])
    expect(element().querySelector('h3')?.id).toBe('section-get-started-title')
  })

  it('offers every action as a link, so it can be opened in a new tab', () => {
    fixture.detectChanges()

    // A <button (click)> or a routerLink="" + (click) breaks middle-click,
    // Ctrl-click and the browser's own "open in new tab" - which is what the
    // v1 static fallback did.
    expect(element().querySelector('button')).toBeNull()
    expect(actions().length).toBe(2)
    expect(actions()[0].getAttribute('href')).toBe('https://orcid.org/register')
  })

  it('gives every action a target at least 44 by 44 CSS pixels', () => {
    fixture.detectChanges()

    actions().forEach((action) => {
      const box = action.getBoundingClientRect()
      expect(box.height).toBeGreaterThanOrEqual(44)
      expect(box.width).toBeGreaterThanOrEqual(44)
    })
  })

  it('separates the two roles by fill and border, not by colour alone', () => {
    fixture.detectChanges()

    const [primary, secondary] = actions().map((a) => getComputedStyle(a))

    // Greyscale the page and the filled control is still the primary one.
    expect(primary.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    expect(secondary.backgroundColor).toBe('rgba(0, 0, 0, 0)')

    expect(parseFloat(secondary.borderTopWidth)).toBeGreaterThanOrEqual(1)
    expect(secondary.borderTopStyle).toBe('solid')
    expect(primary.color).not.toBe(secondary.color)
  })

  it('keeps the primary control visible on the brand-dark band', () => {
    host.section = content({
      layout: { span: 'full', spacing: 'normal', tone: 'brand-dark' as Tone },
    })
    fixture.detectChanges()

    const primary = actions()[0]
    const painted = getComputedStyle(primary)

    // The brand fill is ~1.7:1 against this band, which has no perceivable
    // boundary (SC 1.4.11 asks 3:1). The tone's own proved pair is used
    // inverted instead, so the fill still differs from the band behind it.
    expect(primary.classList).toContain('cta-band__action--inverse')
    expect(painted.backgroundColor).toBe('rgb(255, 255, 255)')
    expect(painted.color).toBe('rgb(0, 52, 73)')
  })

  it('announces that an off-site action opens a new tab', () => {
    // info.orcid.org is ORCID's own; a genuinely third-party host is what the
    // new-tab treatment is for.
    host.section = content({
      actions: [
        content().actions[0],
        {
          id: 'find-out-more',
          label: 'Find out more',
          href: 'https://www.crossref.org/blog/',
          style: 'secondary',
        },
      ],
    })
    fixture.detectChanges()

    const external = actions()[1]
    expect(external.getAttribute('target')).toBe('_blank')
    expect(external.getAttribute('rel')).toBe('noopener noreferrer')
    // The warning is inside the anchor, so it is part of the accessible name
    // rather than a glyph a screen reader never mentions.
    expect(external.textContent).toContain('(opens in a new tab)')
    expect(external.querySelector('svg')?.getAttribute('aria-hidden')).toBe(
      'true'
    )
  })

  it('leaves an orcid.org action in the same tab and strips no referrer', () => {
    fixture.detectChanges()

    // Both fixture actions are on orcid.org hosts - info.orcid.org included,
    // which a bare host comparison would have called external.
    actions().forEach((internal) => {
      expect(internal.getAttribute('target')).toBeNull()
      // rel="noopener noreferrer" belongs only with target="_blank"; applying
      // it unconditionally throws away same-site referrers for nothing.
      expect(internal.getAttribute('rel')).toBeNull()
      expect(internal.textContent).not.toContain('(opens in a new tab)')
    })
  })

  it('stacks the actions on a narrow screen and lines them up on a wide one', () => {
    fixture.detectChanges()

    const row = element().querySelector('.cta-band__actions') as HTMLElement
    const wide = window.matchMedia(
      'only screen and (min-width: 599.99px)'
    ).matches

    expect(getComputedStyle(row).flexDirection).toBe(wide ? 'row' : 'column')
  })

  it('renders a single action without inventing a second one', () => {
    host.section = content({
      actions: [
        {
          id: 'register',
          label: 'Register',
          href: 'https://orcid.org/register',
          style: 'primary',
        },
      ],
    })
    fixture.detectChanges()

    expect(actions().length).toBe(1)
  })

  it('renders no sentence when the content carries none', () => {
    host.section = content({ body: undefined })
    fixture.detectChanges()

    expect(element().querySelector('app-rich-text')).toBeNull()
    expect(outline()).toEqual(['H2:Distinguish yourself in three easy steps'])
  })
})
