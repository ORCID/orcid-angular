import { Injectable, Inject } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { BehaviorSubject, combineLatest, fromEvent } from 'rxjs'
import { distinctUntilChanged, filter, map, startWith } from 'rxjs/operators'
import { TogglzService } from '../togglz/togglz.service'
import { TogglzFlag } from '../togglz/togglz-flags.enum'
import { isValidOrcidFormat } from 'src/app/constants'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { WINDOW } from 'src/app/cdk/window'

/**
 * Centralizes the logic that determines whether the Header Compact mode
 * is eligible for the current route, and coordinates the current compact-active
 * state across components (e.g., Header and My ORCID).
 */
@Injectable({ providedIn: 'root' })
export class HeaderCompactService {
  private readonly _eligibleSubject = new BehaviorSubject<boolean>(false)
  private readonly _publicOrcidSubject = new BehaviorSubject<string | null>(
    null
  )
  private readonly _compactActiveSubject = new BehaviorSubject<boolean>(false)
  private readonly _isDesktopSubject = new BehaviorSubject<boolean>(true)
  private readonly _scrollYSubject = new BehaviorSubject<number>(-1000)
  private readonly _recordRestrictedSubject = new BehaviorSubject<boolean>(
    false
  )
  // Threshold configuration
  private readonly baseThresholdDesktop = -200
  private readonly baseThresholdMobile = -170
  private readonly hysteresisBuffer = 0

  readonly eligible$ = this._eligibleSubject.asObservable()
  readonly publicOrcid$ = this._publicOrcidSubject.asObservable()
  readonly compactActive$ = this._compactActiveSubject.asObservable()
  readonly isDesktop$ = this._isDesktopSubject.asObservable()

  constructor(
    private router: Router,
    private togglz: TogglzService,
    _platform: PlatformInfoService,
    @Inject(WINDOW) private window: Window
  ) {
    // React to router changes and the feature flag
    combineLatest([
      this.togglz
        .getStateOf(TogglzFlag.HEADER_COMPACT)
        .pipe(startWith(false), distinctUntilChanged()),
      this.router.events.pipe(
        filter((e) => e instanceof NavigationEnd),
        startWith<NavigationEnd | null>(null),
        map(() => this.router.url),
        distinctUntilChanged()
      ),
    ]).subscribe(([flagEnabled, url]) => {
      const { eligible, publicOrcid } = this.computeEligibilityFromUrl(
        flagEnabled,
        url || ''
      )
      this._eligibleSubject.next(eligible)
      this._publicOrcidSubject.next(publicOrcid)
    })

    // Track platform changes (desktop vs not)
    _platform.get().subscribe((platform) => {
      this._isDesktopSubject.next(!!platform?.columns12)
      // Re-evaluate compact state on platform change
      this.updateCompactState()
    })

    // Track scroll position
    fromEvent(this.window, 'scroll')
      .pipe(
        startWith(null as any),
        map(() => this.getScrollY()),
        distinctUntilChanged()
      )
      .subscribe((y) => {
        if (y !== 0) {
          this._scrollYSubject.next(y)
          this.updateCompactState()
        }
      })

    // Also recompute when eligibility toggles
    this.eligible$.subscribe(() => this.updateCompactState())
  }

  /**
   * Elegible only withing public Orcid pages
   */
  private computeEligibilityFromUrl(
    flagEnabled: boolean,
    url: string
  ): { eligible: boolean; publicOrcid: string | null } {
    const clean = (url || '/').split('?')[0].split('#')[0]
    const base = clean.split('/')[1] || ''
    const valid = flagEnabled && isValidOrcidFormat(base)
    return { eligible: !!valid, publicOrcid: valid ? base : null }
  }

  private updateCompactState() {
    const eligible = this._eligibleSubject.value
    if (!eligible) {
      if (this._compactActiveSubject.value !== false) {
        this._compactActiveSubject.next(false)
      }
      return
    }
    const restricted = this._recordRestrictedSubject.value
    if (restricted) {
      if (this._compactActiveSubject.value !== false) {
        this._compactActiveSubject.next(false)
      }
      return
    }
    const isDesktop = this._isDesktopSubject.value
    const y = this._scrollYSubject.value
    const threshold = isDesktop
      ? this.baseThresholdDesktop
      : this.baseThresholdMobile
    // Hysteresis buffer to avoid jitter
    const buffer = this.hysteresisBuffer
    const enter = threshold + buffer
    const exit = threshold - buffer
    const current = this._compactActiveSubject.value
    const next = current ? y > exit : y >= enter
    if (next !== current) {
      this._compactActiveSubject.next(next)
    }
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
