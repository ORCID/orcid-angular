import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import {
  Component,
  DestroyRef,
  EventEmitter,
  Inject,
  Input,
  LOCALE_ID,
  OnInit,
  Output,
} from '@angular/core'
import { SkeletonPlaceholderComponent } from '@orcid/ui'
import { of } from 'rxjs'
import { catchError, timeout } from 'rxjs/operators'
import { NewsService } from 'src/app/core'

import { NewsFeedSection } from '../../../types/homepage-content.v2'
import { HeadingComponent } from '../../components/heading/heading.component'
import {
  headingId,
  HeadingLevel,
  nextLevel,
  SECTION_HEADING_LEVEL,
} from '../../heading-level'

/** spec-v2 1.7. Longer titles are cut here, never by the feed. */
export const NEWS_FEED_TITLE_MAX = 120

/**
 * `NewsService` never completes when xml2js fails to parse the feed: the inner
 * Observable calls `ErrorHandlerService.xml2jsParser`, which only logs, and
 * then neither `next` nor `complete` is ever called. Without a deadline the
 * section would show its skeletons forever, which is exactly the state
 * spec-v2 1.7 says must not be reachable.
 */
export const NEWS_FEED_TIMEOUT_MS = 10000

const DEFAULT_MAX_ITEMS = 3
const MIN_MAX_ITEMS = 2
const LIMIT_MAX_ITEMS = 6

type FeedState = 'loading' | 'ready' | 'empty'

/** One feed entry, already reduced to the strings the template prints. */
export interface RenderedArticle {
  /** Stable within one render; the feed carries no id we can trust. */
  key: string
  /** At most `NEWS_FEED_TITLE_MAX` characters. */
  title: string
  /** The untruncated title, present only when the title was actually cut. */
  fullTitle?: string
  href: string
  /** Machine-readable date for `<time datetime>`; absent when unparseable. */
  isoDate?: string
  /** The same instant written for a reader in the page's locale. */
  displayDate?: string
}

/**
 * `news-feed` - the WordPress news strip, as a section (spec-v2 1.7).
 *
 * `<app-news>` renders the same feed today but sits outside the content model,
 * so it cannot be reordered, retitled or removed and the CMS preview cannot
 * see it. This component is the same fetch (`NewsService`, unchanged and
 * unduplicated) behind the section contract.
 *
 * Everything the feed supplies is third-party text this application does not
 * control. It reaches the DOM only through interpolation, which Angular emits
 * as text nodes - there is no `[innerHTML]` here and no sanitizer bypass, so a
 * `<script>` or an `onerror=` in a WordPress title is printed, not run.
 */
@Component({
  selector: 'app-news-feed-section',
  standalone: true,
  imports: [HeadingComponent, SkeletonPlaceholderComponent],
  templateUrl: './news-feed-section.component.html',
  styleUrls: ['./news-feed-section.component.scss'],
})
export class NewsFeedSectionComponent implements OnInit {
  @Input({ required: true }) section!: NewsFeedSection

  /** Computed by the host from the section's position; never authored. */
  @Input() headingLevel: HeadingLevel = SECTION_HEADING_LEVEL

  /**
   * Whether this section has anything to show.
   *
   * spec-v2 1.7: a failed or empty feed renders nothing at all - not an empty
   * named region. This component can only empty its own contents; the
   * surrounding `app-section-shell` belongs to the host, so the host has to
   * hear about it or it will emit a `<section aria-labelledby>` pointing at a
   * heading that no longer exists. Emitted on a microtask so a host that binds
   * it in a template does not trip ExpressionChangedAfterItHasBeenChecked.
   */
  @Output() hasContent = new EventEmitter<boolean>()

  state: FeedState = 'loading'
  articles: RenderedArticle[] = []

  readonly loadingLabel = $localize`:@@home.news_loading:Loading the latest news`
  readonly opensInNewTab = $localize`:@@home.opens_in_new_tab:(opens in a new tab)`

  constructor(
    private news: NewsService,
    private destroyRef: DestroyRef,
    @Inject(LOCALE_ID) private locale: string
  ) {}

  get titleId(): string {
    return headingId(this.section.id)
  }

  get hasTitle(): boolean {
    return !!this.section.title && this.section.title.trim() !== ''
  }

  /**
   * What the host should pass to `app-section-shell`'s `labelledBy`.
   *
   * `undefined` when no heading is rendered, so the shell falls back to a
   * plain `<div>` instead of a `<section aria-labelledby>` pointing at an id
   * that is not in the document - a reference that fails silently.
   */
  get labelledBy(): string | undefined {
    return this.hasTitle ? this.titleId : undefined
  }

  /**
   * `news-feed` always has a title (the schema requires one), so an article
   * heading always sits one level under it. The arithmetic still goes through
   * `nextLevel` rather than `headingLevel + 1` so that the clamp at h6 and the
   * untitled-parent rule stay in one place.
   */
  get articleLevel(): HeadingLevel {
    return nextLevel(this.headingLevel, this.hasTitle)
  }

  get maxItems(): number {
    return clampMaxItems(this.section.maxItems)
  }

  /** One skeleton per item the section is about to show, so nothing jumps. */
  get placeholders(): number[] {
    const slots: number[] = []
    for (let index = 0; index < this.maxItems; index++) {
      slots.push(index)
    }
    return slots
  }

  get feedClasses(): string {
    return `news-feed news-feed--${this.section.variant}`
  }

  ngOnInit(): void {
    this.news
      .getNews()
      .pipe(
        timeout(NEWS_FEED_TIMEOUT_MS),
        // A feed nobody can read is not the visitor's problem: it collapses
        // the section rather than announcing anything.
        catchError(() => of([] as unknown[])),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((items) => {
        this.articles = toArticles(items, this.maxItems, this.locale)
        this.state = this.articles.length > 0 ? 'ready' : 'empty'
        const available = this.state !== 'empty'
        Promise.resolve().then(() => this.hasContent.emit(available))
      })
  }
}

function clampMaxItems(requested: number | undefined): number {
  if (typeof requested !== 'number' || !Number.isFinite(requested)) {
    return DEFAULT_MAX_ITEMS
  }
  return Math.min(
    LIMIT_MAX_ITEMS,
    Math.max(MIN_MAX_ITEMS, Math.trunc(requested))
  )
}

/**
 * xml2js gives every RSS field as an array of strings, which is why the v1
 * template reads `new.pubDate[0]`. Reducing that here means the template never
 * indexes into untrusted data.
 */
function firstString(value: unknown): string {
  if (typeof value === 'string') {
    return value
  }
  if (Array.isArray(value) && typeof value[0] === 'string') {
    return value[0]
  }
  return ''
}

/**
 * The feed's own link, accepted only if it is one a browser should follow.
 *
 * No base URL is supplied on purpose: a relative href in a third-party feed
 * would otherwise resolve against orcid.org and send a visitor to a page ORCID
 * appears to vouch for. `javascript:` and `data:` fail the protocol test.
 */
function safeFeedHref(raw: string): string {
  const trimmed = raw.trim()
  if (trimmed === '') {
    return ''
  }
  try {
    const url = new URL(trimmed)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : ''
  } catch {
    return ''
  }
}

function truncateTitle(title: string): { title: string; fullTitle?: string } {
  if (title.length <= NEWS_FEED_TITLE_MAX) {
    return { title }
  }
  // One character of the budget goes to the ellipsis, so the rendered string
  // is exactly at the cap rather than one over it.
  const cut = title.slice(0, NEWS_FEED_TITLE_MAX - 1).trimEnd()
  return { title: `${cut}…`, fullTitle: title }
}

function toDateParts(
  raw: string,
  locale: string
): { isoDate?: string; displayDate?: string } {
  const parsed = new Date(raw)
  if (Number.isNaN(parsed.getTime())) {
    // A date we cannot parse gets no <time> element at all. A `datetime` that
    // lies is worse than an absent one, because a machine believes it.
    return {}
  }
  let displayDate: string
  try {
    displayDate = new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(parsed)
  } catch {
    // Intl, not Angular's formatDate: formatDate throws for any locale whose
    // data was not registered, and the homepage ships in fifteen languages.
    displayDate = parsed.toISOString().slice(0, 10)
  }
  return { isoDate: parsed.toISOString(), displayDate }
}

function toArticles(
  items: unknown,
  maxItems: number,
  locale: string
): RenderedArticle[] {
  if (!Array.isArray(items)) {
    return []
  }
  const articles: RenderedArticle[] = []
  items.forEach((item, index) => {
    if (
      articles.length >= maxItems ||
      item === null ||
      typeof item !== 'object'
    ) {
      return
    }
    const record = item as Record<string, unknown>
    const rawTitle = firstString(record['title']).trim()
    const href = safeFeedHref(firstString(record['link']))
    // An entry with no title has no accessible name, and one with no usable
    // link is not a link. Either way it is dropped rather than half-rendered.
    if (rawTitle === '' || href === '') {
      return
    }
    articles.push({
      key: `${index}-${href}`,
      href,
      ...truncateTitle(rawTitle),
      ...toDateParts(firstString(record['pubDate']), locale),
    })
  })
  return articles
}
