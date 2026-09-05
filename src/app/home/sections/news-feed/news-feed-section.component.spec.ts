import { Component } from '@angular/core'
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing'
import { Observable, of, throwError } from 'rxjs'
import { NewsService } from 'src/app/core'

import {
  NewsFeedSection,
  NewsFeedVariant,
} from '../../../types/homepage-content.v2'
import { HeadingLevel } from '../../heading-level'
import {
  NEWS_FEED_TIMEOUT_MS,
  NEWS_FEED_TITLE_MAX,
  NewsFeedSectionComponent,
} from './news-feed-section.component'

const VARIANTS: NewsFeedVariant[] = ['grid', 'list']

/** The xml2js shape NewsService actually emits: every field an array. */
function entry(overrides: Record<string, unknown> = {}) {
  return {
    title: ['ORCID welcomes its ten thousandth member organization'],
    link: ['https://info.orcid.org/blog/ten-thousand/'],
    pubDate: ['Tue, 12 Aug 2025 10:00:00 +0000'],
    ...overrides,
  }
}

function content(overrides: Partial<NewsFeedSection> = {}): NewsFeedSection {
  return {
    id: 'latest-news',
    type: 'news-feed',
    variant: 'grid',
    layout: { span: 'full', spacing: 'normal', tone: 'default' },
    title: 'Latest news',
    source: 'orcid-blog',
    ...overrides,
  }
}

/**
 * Stands in for NewsService so a spec never reaches the live WordPress feed.
 * The real service is reused by the component; only its transport is replaced.
 */
class FakeNewsService {
  source: Observable<unknown> = of([entry()])

  getNews(): Observable<unknown> {
    return this.source
  }
}

@Component({
  standalone: true,
  imports: [NewsFeedSectionComponent],
  template: `
    <app-news-feed-section
      [section]="section"
      [headingLevel]="headingLevel"
      (hasContent)="lastHasContent = $event"
    ></app-news-feed-section>
  `,
})
class HostComponent {
  section: NewsFeedSection = content()
  headingLevel: HeadingLevel = 2
  lastHasContent?: boolean
}

describe('NewsFeedSectionComponent', () => {
  let fixture: ComponentFixture<HostComponent>
  let host: HostComponent
  let feed: FakeNewsService

  beforeEach(async () => {
    feed = new FakeNewsService()

    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [{ provide: NewsService, useValue: feed }],
    }).compileComponents()

    fixture = TestBed.createComponent(HostComponent)
    host = fixture.componentInstance
  })

  function element(): HTMLElement {
    return fixture.nativeElement as HTMLElement
  }

  function links(): HTMLAnchorElement[] {
    return Array.from(element().querySelectorAll('a.news-feed__link'))
  }

  /** The outline as assistive technology walks it: level and announced text. */
  function outline(): string[] {
    return Array.from(element().querySelectorAll('h1,h2,h3,h4,h5,h6')).map(
      (heading) => `${heading.tagName}:${(heading.textContent ?? '').trim()}`
    )
  }

  it('shows the section title and one article per feed entry, in every variant', () => {
    feed.source = of([entry(), entry({ title: ['A second story'] })])

    VARIANTS.forEach((variant) => {
      host.section = content({ variant })
      fixture.detectChanges()

      expect(element().textContent).toContain('Latest news')
      expect(links().length).toBe(2)
      expect(links()[1].textContent).toContain('A second story')
    })
  })

  it('reads out identically whichever variant is chosen', () => {
    feed.source = of([entry(), entry({ title: ['A second story'] })])

    const outlines = VARIANTS.map((variant) => {
      host.section = content({ variant })
      fixture.detectChanges()
      return outline().join('|')
    })

    // A variant is a layout choice; if it could change the outline, an editor
    // picking "list" over "grid" would silently change what a screen reader
    // hears.
    expect(outlines[0]).toBe(
      'H2:Latest news|H3:ORCID welcomes its ten thousandth member organization|H3:A second story'
    )
    expect(new Set(outlines).size).toBe(1)
  })

  it('puts each article heading one level below its own title', () => {
    host.headingLevel = 3
    fixture.detectChanges()

    expect(outline()).toEqual([
      'H3:Latest news',
      'H4:ORCID welcomes its ten thousandth member organization',
    ])
    expect(element().querySelector('h3')?.id).toBe('section-latest-news-title')
  })

  it('promotes the article headings when the section shows no title', () => {
    // The schema requires a title, so this is the backstop: an untitled
    // section must not open a gap in the outline by leaving its articles a
    // level deeper than anything above them.
    host.section = content({ title: '   ' })
    fixture.detectChanges()

    expect(outline()).toEqual([
      'H2:ORCID welcomes its ten thousandth member organization',
    ])
  })

  it('renders nothing at all when the feed fails', async () => {
    feed.source = throwError(() => new Error('502 from the blog'))
    fixture.detectChanges()
    await fixture.whenStable()
    fixture.detectChanges()

    // Not an empty named region and not an error a visitor never asked about.
    expect(element().querySelector('.news-feed')).toBeNull()
    expect(element().textContent?.trim()).toBe('')
    expect(outline()).toEqual([])
    expect(host.lastHasContent).toBe(false)
  })

  it('renders nothing at all when the feed comes back empty', async () => {
    feed.source = of([])
    fixture.detectChanges()
    await fixture.whenStable()
    fixture.detectChanges()

    expect(element().textContent?.trim()).toBe('')
    expect(host.lastHasContent).toBe(false)
  })

  it('gives up on a feed that never answers instead of loading forever', fakeAsync(() => {
    // NewsService never completes when xml2js fails to parse: it logs and then
    // neither emits nor errors. Without the deadline the skeletons would stay
    // on screen for the life of the page.
    feed.source = new Observable(() => undefined)
    fixture.detectChanges()

    expect(element().querySelector('[role="status"]')).not.toBeNull()

    tick(NEWS_FEED_TIMEOUT_MS)
    fixture.detectChanges()

    expect(element().textContent?.trim()).toBe('')
  }))

  it('says it is loading in a live region, and never shows a spinner', () => {
    feed.source = new Observable(() => undefined)
    fixture.detectChanges()

    const status = element().querySelector('[role="status"]')
    expect(status).not.toBeNull()
    expect(status?.textContent).toContain('Loading the latest news')

    // The v1 defect this replaces: a spinner outside any live region, so the
    // load finishing was a silent DOM change.
    expect(element().querySelector('mat-progress-spinner')).toBeNull()
    expect(
      element().querySelectorAll('orcid-skeleton-placeholder').length
    ).toBeGreaterThan(0)
    // The skeleton shapes are decoration; the sentence is the whole message.
    expect(
      status?.querySelector('.news-feed__items')?.getAttribute('aria-hidden')
    ).toBe('true')
  })

  it('cuts a long headline to 120 characters and keeps the full one in a title attribute', () => {
    const long = 'A'.repeat(150)
    feed.source = of([entry({ title: [long] })])
    fixture.detectChanges()

    const heading = element().querySelector('h3') as HTMLElement
    const rendered = (heading.textContent ?? '').trim()
    expect(rendered.length).toBe(NEWS_FEED_TITLE_MAX)
    expect(rendered.endsWith('…')).toBe(true)
    expect(links()[0].getAttribute('title')).toBe(long)
  })

  it('adds no redundant title attribute to a headline that already fits', () => {
    fixture.detectChanges()

    // A `title` repeating text that is already on screen is read out twice by
    // several screen readers, so it is set only when something was hidden.
    expect(links()[0].getAttribute('title')).toBeNull()
  })

  it('prints markup from the feed as text instead of running it', () => {
    feed.source = of([
      entry({ title: ['<img src=x onerror="window.alert(1)">Headline'] }),
    ])
    fixture.detectChanges()

    expect(element().querySelector('img')).toBeNull()
    expect(element().querySelector('h3')?.textContent).toContain(
      '<img src=x onerror="window.alert(1)">Headline'
    )
  })

  it('opens every article in a new tab and says so inside the link', () => {
    fixture.detectChanges()

    const link = links()[0]
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toBe('noopener noreferrer')
    // Inside the anchor, so it is part of the accessible name rather than a
    // glyph a screen reader never mentions.
    expect(link.textContent).toContain('(opens in a new tab)')
    expect(link.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true')
  })

  it('drops an entry whose link is not a web address', async () => {
    feed.source = of([
      entry({ title: ['Nasty'], link: ['javascript:window.alert(1)'] }),
      entry({ title: ['Also nasty'], link: ['/blog/relative'] }),
    ])
    fixture.detectChanges()
    await fixture.whenStable()
    fixture.detectChanges()

    // A relative href in a third-party feed would resolve against orcid.org
    // and send a visitor to a page ORCID appears to vouch for.
    expect(element().textContent?.trim()).toBe('')
  })

  it('gives each date a machine-readable time element', () => {
    fixture.detectChanges()

    const time = element().querySelector('time') as HTMLTimeElement
    expect(time.getAttribute('datetime')).toBe('2025-08-12T10:00:00.000Z')
    expect((time.textContent ?? '').trim().length).toBeGreaterThan(0)
  })

  it('shows no date rather than a date it had to guess', () => {
    feed.source = of([entry({ pubDate: ['sometime last summer'] })])
    fixture.detectChanges()

    // A `datetime` that lies is worse than an absent one, because a machine
    // believes it.
    expect(element().querySelector('time')).toBeNull()
    expect(links().length).toBe(1)
  })

  it('shows three articles when the section does not say how many', () => {
    feed.source = of(sixStories())
    fixture.detectChanges()

    expect(links().length).toBe(3)
  })

  it('shows no more articles than the section asked for', () => {
    feed.source = of(sixStories())
    host.section = content({ maxItems: 5 })
    fixture.detectChanges()

    expect(links().length).toBe(5)
  })

  it('tells the host it has something to show', async () => {
    fixture.detectChanges()
    await fixture.whenStable()

    // The host owns app-section-shell, so this is the only way it can know
    // whether to wrap the section in a landmark at all.
    expect(host.lastHasContent).toBe(true)
  })
})

function sixStories() {
  return [1, 2, 3, 4, 5, 6].map((n) =>
    entry({ title: [`Story ${n}`], link: [`https://info.orcid.org/${n}/`] })
  )
}
