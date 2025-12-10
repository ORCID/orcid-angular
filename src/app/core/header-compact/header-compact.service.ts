import { Injectable, Inject } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { combineLatest, fromEvent, Observable } from 'rxjs'
import {
  distinctUntilChanged,
  filter,
  map,
  startWith,
  shareReplay,
} from 'rxjs/operators'
import { TogglzService } from '../togglz/togglz.service'
import { TogglzFlag } from '../togglz/togglz-flags.enum'
import { isValidOrcidFormat } from 'src/app/constants'
import { WINDOW } from 'src/app/cdk/window'

/**
 * Service that determines when the compact header mode should be active
 * based on scroll position and route eligibility.
 */
@Injectable({ providedIn: 'root' })
export class HeaderCompactService {
  // Threshold for when compact mode should activate (scroll position relative to main-content)
  private readonly scrollThreshold = -175

  /**
   * Single observable that emits true when compact mode should be active.
   * Combines eligibility (public ORCID page) with scroll position.
   */
  readonly compactActive$: Observable<boolean>

  constructor(
    private router: Router,
    private togglz: TogglzService,
    @Inject(WINDOW) private window: Window
  ) {
    // Check if current route is eligible (public ORCID page with feature flag enabled)
    const eligible$ = combineLatest([
      this.togglz
        .getStateOf(TogglzFlag.HEADER_COMPACT)
        .pipe(startWith(false), distinctUntilChanged()),
      this.router.events.pipe(
        filter((e) => e instanceof NavigationEnd),
        startWith<NavigationEnd | null>(null),
        map(() => this.router.url),
        distinctUntilChanged()
      ),
    ]).pipe(
      map(([flagEnabled, url]) => {
        const clean = (url || '/').split('?')[0].split('#')[0]
        const base = clean.split('/')[1] || ''
        return flagEnabled && isValidOrcidFormat(base)
      }),
      distinctUntilChanged()
    )

    // Track scroll position
    // Initialize with a value below threshold to prevent compact mode on page load
    const scrollY$ = fromEvent(this.window, 'scroll').pipe(
      map(() => this.getScrollY()),
      startWith(this.scrollThreshold - 1),
      distinctUntilChanged()
    )

    // Combine eligibility and scroll position to determine compact mode
    this.compactActive$ = combineLatest([eligible$, scrollY$]).pipe(
      map(([eligible, scrollY]) => {
        if (!eligible) {
          return false
        }
        return scrollY >= this.scrollThreshold
      }),
      distinctUntilChanged(),
      shareReplay(1)
    )
  }

  private getScrollY(): number {
    if (!this.window) {
      return 0
    }

    const doc = this.window.document
    const mainContainer = doc?.querySelector(
      '.main-content'
    ) as HTMLElement | null

    // Fallback to global scroll if we can't find the main container
    const globalScrollY =
      this.window.scrollY || (this.window as any).pageYOffset || 0

    if (!mainContainer) {
      return globalScrollY
    }

    const rect = mainContainer.getBoundingClientRect()

    // Distance scrolled relative to the top of .main-container
    const distanceFromMainTop = -rect.top

    return distanceFromMainTop
  }
}
