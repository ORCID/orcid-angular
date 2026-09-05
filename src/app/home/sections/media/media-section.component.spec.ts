import { Component } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import {
  InformativeImage,
  MediaSection,
  MediaVariant,
  Tone,
  VARIANTS,
  Video,
} from '../../../types/homepage-content.v2'
import { headingId, HeadingLevel } from '../../heading-level'
import { MediaSectionComponent } from './media-section.component'

const POSTER: InformativeImage = {
  src: '/assets/poster.jpg',
  alt: 'A researcher at a laptop',
}

const VIDEO: Video = {
  provider: 'vimeo',
  videoId: '1198760040',
  title: 'What is ORCID?',
  poster: POSTER,
  captions: { available: true, locales: ['en'] },
  audioDescription: { status: 'not-needed' },
  transcript: 'ORCID gives every researcher a persistent identifier.',
}

const PICTURE: InformativeImage = {
  src: '/assets/researchers.jpg',
  alt: 'Three researchers comparing notes',
}

function videoSection(overrides: Partial<MediaSection> = {}): MediaSection {
  return {
    id: 'featured',
    type: 'media',
    variant: 'media-end',
    layout: { span: 'full', spacing: 'normal', tone: 'default' },
    kicker: 'Featured news',
    title: 'ORCID in one minute',
    body: 'A short film about persistent identifiers.',
    mediaKind: 'video',
    video: VIDEO,
    ...overrides,
  }
}

function imageSection(overrides: Partial<MediaSection> = {}): MediaSection {
  return {
    ...videoSection(),
    mediaKind: 'image',
    video: undefined,
    image: PICTURE,
    ...overrides,
  }
}

@Component({
  standalone: true,
  imports: [MediaSectionComponent],
  template: `
    <app-media-section
      [section]="section"
      [headingLevel]="headingLevel"
    ></app-media-section>
  `,
})
class HostComponent {
  section: MediaSection = videoSection()
  headingLevel: HeadingLevel = 2
}

describe('MediaSectionComponent', () => {
  let fixture: ComponentFixture<HostComponent>
  let host: HostComponent

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(HostComponent)
    host = fixture.componentInstance
  })

  /** `fixture.nativeElement` is `any`; going through a typed handle keeps the
   * assertions honest about what they are reading. */
  function page(): HTMLElement {
    return fixture.nativeElement as HTMLElement
  }

  function root(): HTMLElement {
    return page().querySelector('.media') as HTMLElement
  }

  function headingOutline(): string[] {
    return Array.from(
      page().querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, h6')
    ).map((heading) => `${heading.tagName} ${heading.textContent?.trim()}`)
  }

  const variants = VARIANTS['media'] as readonly MediaVariant[]

  it('renders the media in every variant the catalogue declares', () => {
    for (const variant of variants) {
      host.section = videoSection({ variant })
      fixture.detectChanges()

      expect(root().classList)
        .withContext(variant)
        .toContain(`media--${variant}`)
      expect(page().querySelector('app-video-embed'))
        .withContext(variant)
        .not.toBeNull()
    }
  })

  it('announces the same heading outline whichever variant is chosen', () => {
    const outlines = variants.map((variant) => {
      host.section = videoSection({ variant })
      fixture.detectChanges()
      return headingOutline()
    })

    expect(outlines[0]).toEqual(['H2 ORCID in one minute'])
    for (const outline of outlines) {
      expect(outline).toEqual(outlines[0])
    }
  })

  it('reads out the prose before the media in every variant', () => {
    for (const variant of variants) {
      host.section = videoSection({ variant })
      fixture.detectChanges()

      const children = Array.from(root().children)
      expect(children.length).withContext(variant).toBe(2)
      expect(children[0].classList)
        .withContext(variant)
        .toContain('media__prose')
      expect(children[1].classList)
        .withContext(variant)
        .toContain('media__media')
    }
  })

  // A sighted user seeing the media first while a keyboard user reaches it
  // last is exactly the failure `media-start` was rejected to prevent, and it
  // is invisible in a DOM assertion because it lives in the stylesheet.
  it('never moves the media ahead of the prose with CSS', () => {
    fixture.detectChanges()

    const sheets = Array.from(
      document.querySelectorAll<HTMLStyleElement>('style')
    )
      .map((style) => style.textContent ?? '')
      .filter((css) => css.includes('.media__prose'))

    expect(sheets.length).toBeGreaterThan(0)
    for (const css of sheets) {
      expect(css).not.toMatch(/row-reverse|column-reverse/)
      expect(css).not.toMatch(/(^|[;{\s])order\s*:/)
    }
  })

  it('renders the section title at the level the host computed', () => {
    host.headingLevel = 2
    fixture.detectChanges()
    expect(headingOutline()).toEqual(['H2 ORCID in one minute'])

    host.headingLevel = 3
    fixture.detectChanges()
    expect(headingOutline()).toEqual(['H3 ORCID in one minute'])
  })

  // `media` declares `emitsItemHeadings: false`: the section's own title is the
  // only heading it can contribute, so an untitled section contributes none and
  // cannot open a gap in the page outline.
  it('contributes no heading at all when the section has no title', () => {
    host.section = videoSection({ title: undefined })
    fixture.detectChanges()

    expect(headingOutline()).toEqual([])
    expect(page().querySelector('.media__kicker').textContent).toContain(
      'Featured news'
    )
  })

  it('gives the heading the id the section landmark points at', () => {
    fixture.detectChanges()

    const heading = page().querySelector('h2') as HTMLElement
    expect(heading.id).toBe(headingId('featured'))
  })

  it('renders the kicker as a paragraph, never as a heading', () => {
    fixture.detectChanges()

    const kicker = page().querySelector('.media__kicker') as HTMLElement
    expect(kicker.tagName).toBe('P')
    expect(headingOutline()).not.toContain(
      jasmine.stringMatching('Featured news')
    )
  })

  it('leaves the kicker in the casing the editor typed', () => {
    fixture.detectChanges()

    const kicker = page().querySelector('.media__kicker')
    expect(getComputedStyle(kicker).textTransform).toBe('none')
    expect(kicker.textContent.trim()).toBe('Featured news')
  })

  it('drops the kicker letter-spacing in Arabic so the letters still join', () => {
    fixture.detectChanges()

    const kicker = page().querySelector('.media__kicker')
    expect(getComputedStyle(kicker).letterSpacing).not.toBe('normal')

    page().setAttribute('lang', 'ar')
    fixture.detectChanges()
    expect(getComputedStyle(kicker).letterSpacing).toBe('normal')
  })

  it('labels a picture with the alt text its editor wrote', () => {
    host.section = imageSection()
    fixture.detectChanges()

    const img = page().querySelector('img') as HTMLImageElement
    expect(img.getAttribute('alt')).toBe('Three researchers comparing notes')
    expect(img.getAttribute('aria-hidden')).toBeNull()
    expect(page().querySelectorAll('[data-a11y-error]').length).toBe(0)
  })

  it('leaves out the media column when the section carries no media', () => {
    host.section = imageSection({ image: undefined })
    fixture.detectChanges()

    expect(page().querySelector('.media__media')).toBeNull()
    expect(page().querySelector('img')).toBeNull()
    expect(root().children.length).toBe(1)
  })

  it('keeps a media-only caption the editor wrote instead of dropping it', () => {
    host.section = imageSection({
      variant: 'media-only',
      title: undefined,
      body: undefined,
      kicker: 'Members at work',
    })
    fixture.detectChanges()

    expect(page().querySelector('.media__kicker').textContent.trim()).toBe(
      'Members at work'
    )
    expect(headingOutline()).toEqual([])
  })

  it('gives every action a target no smaller than 44 by 44', () => {
    host.section = videoSection({
      actions: [
        {
          id: 'go',
          label: 'Go',
          href: 'https://orcid.org/signin',
          style: 'primary',
        },
        {
          id: 'more',
          label: 'Read more',
          href: 'https://info.orcid.org/news',
          style: 'secondary',
        },
      ],
    })
    fixture.detectChanges()

    const actions = Array.from(
      page().querySelectorAll<HTMLAnchorElement>('.media__action')
    )
    expect(actions.length).toBe(2)
    for (const action of actions) {
      const box = action.getBoundingClientRect()
      expect(box.height)
        .withContext(action.textContent ?? '')
        .toBeGreaterThanOrEqual(44)
      expect(box.width)
        .withContext(action.textContent ?? '')
        .toBeGreaterThanOrEqual(44)
    }
  })

  it('says out loud that an action leaves ORCID in a new tab', () => {
    host.section = videoSection({
      actions: [
        {
          id: 'watch',
          label: 'Watch on Vimeo',
          href: 'https://vimeo.com/1198760040',
          style: 'secondary',
        },
      ],
    })
    fixture.detectChanges()

    const action = page().querySelector('.media__action') as HTMLAnchorElement
    expect(action.getAttribute('target')).toBe('_blank')
    expect(action.getAttribute('rel')).toBe('noopener noreferrer')
    expect(action.textContent).toContain('opens in a new tab')
  })

  it('leaves an ORCID action in the tab the reader is already in', () => {
    host.section = videoSection({
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

    const action = page().querySelector('.media__action') as HTMLAnchorElement
    expect(action.getAttribute('target')).toBeNull()
    expect(action.getAttribute('rel')).toBeNull()
    expect(action.textContent).not.toContain('opens in a new tab')
  })

  it('inverts a primary action on the brand-dark band so it keeps an edge', () => {
    const tone: Tone = 'brand-dark'
    host.section = videoSection({
      layout: { span: 'full', spacing: 'normal', tone },
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

    const action = page().querySelector('.media__action')
    expect(action.classList).toContain('media__action--inverse')
  })
})
