import { Component, Inject } from '@angular/core'
import { log } from 'console'
import { cloneDeep, takeWhile } from 'lodash'
import { Observable, forkJoin, NEVER, of, EMPTY } from 'rxjs'
import { first, switchMap, take, tap } from 'rxjs/operators'
import { InterstitialsService } from 'src/app/cdk/interstitials/interstitials.service'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'
import { WINDOW } from 'src/app/cdk/window'
import { UserService } from 'src/app/core'
import { ErrorHandlerService } from 'src/app/core/error-handler/error-handler.service'
import { GoogleTagManagerService } from 'src/app/core/google-tag-manager/google-tag-manager.service'
import { RecordEmailsService } from 'src/app/core/record-emails/record-emails.service'
import { TogglzService } from 'src/app/core/togglz/togglz.service'
import { ERROR_REPORT } from 'src/app/errors'
import { EmailsEndpoint, RequestInfoForm } from 'src/app/types'

@Component({
  templateUrl: './authorize.component.html',
  styleUrls: ['./authorize.component.scss'],
  preserveWhitespaces: true,
})
export class AuthorizeComponent {
  redirectUrl: string

  platform: PlatformInfo
  showAuthorizationComponent = false
  showAuthorizationError = false
  showInterstital = false
  loading = true

  originalEmailsBackendCopy: EmailsEndpoint
  oauthSession: any

  // Domain / Interstitial properties
  hasPrivateDomains = false
  hasPublicDomains = false
  isOAuthDomainsInterstitialEnabled = false
  hasDomainInterstitialBeenViewed = false

  // User session properties
  isNotImpersonating = false
  insidePopUpWindows = false
  redirectByReportAlreadyAuthorize = false

  constructor(
    private userService: UserService,
    private platformInfoService: PlatformInfoService,
    private recordEmailsService: RecordEmailsService,
    private togglzService: TogglzService,
    private interstitialsService: InterstitialsService,
    @Inject(WINDOW) private window: Window,
    private googleTagManagerService: GoogleTagManagerService,
    private errorHandlerService: ErrorHandlerService
  ) {}

  /**
   * Lifecycle hook. Initiates data loading and handles session logic.
   */
  ngOnInit(): void {
    this.loading = true
    this.insidePopUpWindows = !!this.window.opener

    forkJoin({
      userSession: this.loadUserSession(),
      platform: this.loadPlatformInfo(),
      interstitial: this.loadInterstitialViewed(),
      togglz: this.loadTogglzState(),
      emails: this.loadEmails(),
    }).subscribe(({ userSession }) => {
      this.handleUserSession(userSession)
    })
  }

  /**
   * Called by template to handle final redirection.
   */
  handleRedirect(url: string): void {
    this.redirectUrl = url
    if (url && this.canShowDomainInterstitial()) {
      this.showDomainInterstitial()
    } else {
      this.finishRedirect()
    }
  }

  /**
   * Reports re-authorization to Google Tag Manager (async),
   * then triggers a redirect after the report completes or on error.
   */
  reportReAuthorization(request: RequestInfoForm): void {
    const analyticsReport: Observable<void> =
      this.googleTagManagerService.reportEvent('Reauthorize', request)

    forkJoin([analyticsReport]).subscribe({
      next: () => {
        // After successful reporting, proceed
        this.finishRedirectObs(request)
      },
      error: (error) => {
        // If error happens, handle it, then proceed
        this.errorHandlerService.handleError(
          error,
          ERROR_REPORT.STANDARD_NO_VERBOSE_NO_GA
        )
        this.finishRedirectObs(request)
      },
    })
  }

  /**
   * Internal method to finalize redirection (non-observable variant).
   */
  finishRedirect(): void {
    if (this.redirectByReportAlreadyAuthorize) {
      this.reportReAuthorization(this.oauthSession)
    } else {
      ;(this.window as any).outOfRouterNavigation(this.redirectUrl)
    }
  }

  /*
   * ─────────────────────────────────────────────────────────────
   * Private methods below
   * ─────────────────────────────────────────────────────────────
   */

  /**
   * Finalize redirection returning an Observable (for chaining).
   */
  private finishRedirectObs(
    oauthSession: RequestInfoForm
  ): Observable<boolean> {
    ;(this.window as any).outOfRouterNavigation(oauthSession.redirectUrl)
    return NEVER
  }

  /**
   * Determines whether the domain interstitial should be displayed
   * based on user domain status, togglz, impersonation, etc.
   */
  private canShowDomainInterstitial(): boolean {
    return (
      this.hasPrivateDomains &&
      !this.hasPublicDomains &&
      this.isOAuthDomainsInterstitialEnabled &&
      !this.hasDomainInterstitialBeenViewed &&
      this.isNotImpersonating &&
      !this.insidePopUpWindows
    )
  }

  /**
   * Displays the domain interstitial and marks it as viewed.
   */
  private showDomainInterstitial(): void {
    this.showAuthorizationComponent = false
    this.showInterstital = true
    this.interstitialsService
      .setInterstitialsViewed('DOMAIN_INTERSTITIAL')
      .subscribe()
  }

  /**
   * Loads the user session data.
   */
  private loadUserSession(): Observable<any> {
    return this.userService.getUserSession().pipe(first())
  }

  /**
   * Loads the platform information and stores it in a component property.
   */
  private loadPlatformInfo(): Observable<PlatformInfo> {
    return this.platformInfoService.get().pipe(
      first(),
      tap((platform) => (this.platform = platform))
    )
  }

  /**
   * Checks if the domain interstitial was previously viewed by the user.
   */
  private loadInterstitialViewed(): Observable<boolean> {
    return this.interstitialsService
      .getInterstitialsViewed('DOMAIN_INTERSTITIAL')
      .pipe(
        first(),
        tap((wasViewed) => {
          this.hasDomainInterstitialBeenViewed = wasViewed
        })
      )
  }

  /**
   * Loads togglz (feature flag) state for the OAuth domains interstitial feature.
   */
  private loadTogglzState(): Observable<boolean> {
    return this.togglzService.getStateOf('OAUTH_DOMAINS_INTERSTITIAL').pipe(
      take(1),
      tap((state) => (this.isOAuthDomainsInterstitialEnabled = state))
    )
  }

  /**
   * Loads the user emails from the backend and determines public/private domain flags.
   */
  private loadEmails(): Observable<EmailsEndpoint> {
    return this.userService.getUserSession().pipe(
      take(1),
      switchMap((session) => {
        if (session.oauthSessionIsLoggedIn) {
          return this.recordEmailsService.getEmails().pipe(
            first(),
            tap((emails) => {
              this.originalEmailsBackendCopy = cloneDeep(emails)
            })
          )
        } else {
          this.originalEmailsBackendCopy = {
            emails: [],
            emailDomains: [],
            errors: [],
          }
          return of({} as EmailsEndpoint)
        }
      })
    )
  }

  /**
   * After loading forkJoin data, decide on final flow:
   * show error, show domain interstitial, or show authorization screen.
   */
  private handleUserSession(userSession: any): void {
    // Check if user is impersonating
    this.isNotImpersonating =
      userSession?.userInfo?.REAL_USER_ORCID ===
      userSession?.userInfo?.EFFECTIVE_USER_ORCID

    this.oauthSession = userSession.oauthSession

    // 1. If the backend returned an error
    if (this.oauthSession && this.oauthSession.error) {
      this.showAuthorizationError = true
      this.loading = false
      return
    }

    // 2. If the user was already authorized, we might show domain interstitial or just redirect
    if (this.isUserAlreadyAuthorized(this.oauthSession)) {
      if (this.canShowDomainInterstitial()) {
        this.redirectByReportAlreadyAuthorize = true
        this.showDomainInterstitial()
        this.loading = false
      } else {
        this.reportReAuthorization(this.oauthSession)
      }
      return
    }

    // 3. Otherwise, show the standard authorization component
    this.showAuthorizationComponent = true
    this.loading = false
  }

  /**
   * Determines if the user was already authorized based on OAuth session data.
   */
  private isUserAlreadyAuthorized(oauthSession: any): boolean {
    if (
      !oauthSession ||
      !oauthSession.redirectUrl ||
      !oauthSession.responseType
    ) {
      return false
    }
    return oauthSession.redirectUrl.includes(oauthSession.responseType + '=')
  }

  /**
   * Helper to check if at least one email domain is public.
   */
  private userHasPublicEmails(emails: EmailsEndpoint): boolean {
    return !!emails.emailDomains?.some(
      (domain) => domain.visibility === 'PUBLIC'
    )
  }

  /**
   * Helper to check if at least one email domain is private.
   */
  private userHasPrivateEmails(emails: EmailsEndpoint): boolean {
    return !!emails.emailDomains?.some(
      (domain) => domain.visibility !== 'PUBLIC'
    )
  }
}
