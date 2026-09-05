import {
  AudienceSelectorSection,
  AudienceSelectorVariant,
} from '../../../types/homepage-content.v2'

/**
 * A controllable stand-in for the browser's `matchMedia`, used by the audience
 * selector's specs.
 *
 * The real `BreakpointObserver` is left in place and only its `MediaMatcher` is
 * replaced, so the specs exercise CDK's actual subscribe-emits-synchronously
 * behaviour rather than a hand-written substitute for it. That behaviour is the
 * whole reason the component subscribes in its constructor, so faking it away
 * would remove the thing under test.
 *
 * CDK listens through the legacy `addListener`/`removeListener` pair (some
 * browsers do not have `MediaQueryList` inherit from `EventTarget`), which is
 * why those, and not `addEventListener`, are what this implements.
 */
class FakeMediaQueryList {
  private listeners: Array<(event: { matches: boolean }) => void> = []

  constructor(public matches: boolean, public media: string) {}

  addListener(listener: (event: { matches: boolean }) => void): void {
    this.listeners.push(listener)
  }

  removeListener(listener: (event: { matches: boolean }) => void): void {
    this.listeners = this.listeners.filter((entry) => entry !== listener)
  }

  emit(matches: boolean): void {
    this.matches = matches
    for (const listener of [...this.listeners]) {
      listener({ matches })
    }
  }
}

export class FakeMediaMatcher {
  private readonly lists = new Map<string, FakeMediaQueryList>()

  constructor(private matches = false) {}

  matchMedia(query: string): MediaQueryList {
    let list = this.lists.get(query)
    if (!list) {
      list = new FakeMediaQueryList(this.matches, query)
      this.lists.set(query, list)
    }
    return list as unknown as MediaQueryList
  }

  /** Resizes the notional viewport across every query in play. */
  setMatches(matches: boolean): void {
    this.matches = matches
    this.lists.forEach((list) => list.emit(matches))
  }
}

/**
 * Six audiences, because six is what the live page has and six is what breaks
 * the current tab strip at 375px. Each carries a background, two features, an
 * icon and one external link, so a single fixture exercises every branch.
 */
export function audienceSelectorFixture(
  variant: AudienceSelectorVariant,
  title?: string
): AudienceSelectorSection {
  const labels = [
    'Researchers',
    'Universities & Research Institutes',
    'Funders & Facilities',
    'Publishers',
    'Employers',
    'Associations & Societies',
  ]

  return {
    id: 'who-we-serve',
    type: 'audience-selector',
    variant,
    layout: { span: 'full', spacing: 'normal', tone: 'brand-dark' },
    title,
    audiences: labels.map((label, index) => ({
      id: `audience-${index}`,
      label,
      intro: `What ORCID does for ${label}. [Learn more.](https://info.orcid.org/)`,
      background: { src: `images/audience-${index}.png`, focalPoint: 'top' },
      features: [
        {
          id: `feature-${index}-a`,
          title: `${label} feature one`,
          body: 'The first thing this audience gets.',
          icon: { src: 'images/icon.png', focalPoint: 'center' },
          // Deliberately off the orcid.org domain: this is the link the specs
          // use to check the new-tab treatment, and info.orcid.org is internal.
          link: {
            label: 'Read the case study',
            href: 'https://doi.org/10.5555/12345678',
          },
        },
        {
          id: `feature-${index}-b`,
          title: `${label} feature two`,
          body: 'The second thing this audience gets.',
        },
      ],
    })),
  }
}
