import { Component, Inject } from '@angular/core'
import { cloneDeep } from 'lodash'
import { Observable, forkJoin, NEVER } from 'rxjs'
import { first, take, tap } from 'rxjs/operators'
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
  showAuthorizationComponent: boolean
  showAuthorizationError: boolean
  showInterstital: boolean
  originalEmailsBackendCopy: EmailsEndpoint
  userHasPrivateDomains = false
  oauthDomainsInterstitialEnabled: boolean
  organizationName: string
  domainInterstitialHasBeenViewed: boolean
  userIsNotImpersonating: boolean
  insidePopUpWindows: boolean
  userHasPublicDomains: boolean
  loading = true
  constructor(
    private _user: UserService,
    private _platformInfo: PlatformInfoService,
    private _recordEmails: RecordEmailsService,
    private _togglz: TogglzService,
    private _interstitials: InterstitialsService,
    @Inject(WINDOW) private window: Window,
    private _googleTagManagerService: GoogleTagManagerService,
    private _errorHandler: ErrorHandlerService
  ) {}

  ngOnInit() {
    this.loading = true
    this.insidePopUpWindows = this.window.opener !== null

    forkJoin({
      userSession: this.loadUserSession(),
      platform: this.loadPlatformInfo(),
      interstitial: this.loadInterstitialViewed(),
      togglz: this.loadTogglzState(),
      emails: this.loadEmails(),
    }).subscribe(({ userSession }) => {
      this.processUserSession(userSession)
    })
  }

  userHasPublicEmails(value: EmailsEndpoint): any {
    return !!value.emailDomains?.find(
      (domain) => domain.visibility === 'PUBLIC'
    )
  }

  userHasPrivateEmails(value: EmailsEndpoint): boolean {
    return !!value.emailDomains?.find(
      (domain) => domain.visibility !== 'PUBLIC'
    )
  }

  handleRedirect(url: string) {
    this.redirectUrl = url
    if (url && this.userCanSeeInterstitial()) {
      this.displayDomainInterstitial()
    } else {
      this.finishRedirect()
    }
  }

  private displayDomainInterstitial() {
    this.showAuthorizationComponent = false
    this.showInterstital = true
    this._interstitials
      .setInterstitialsViewed('DOMAIN_INTERSTITIAL')
      .subscribe()
  }

  private userCanSeeInterstitial(): boolean {
    return (
      this.userHasPrivateDomains &&
      !this.userHasPublicDomains &&
      this.oauthDomainsInterstitialEnabled &&
      !this.domainInterstitialHasBeenViewed &&
      this.userIsNotImpersonating &&
      !this.insidePopUpWindows
    )
  }

  reportAlreadyAuthorize(request: RequestInfoForm) {
    const analyticsReports: Observable<void>[] = []
    analyticsReports.push(
      this._googleTagManagerService.reportEvent(`Reauthorize`, request)
    )

    return forkJoin(analyticsReports).subscribe(
      () => {},
      (error) => {
        this._errorHandler.handleError(
          error,
          ERROR_REPORT.STANDARD_NO_VERBOSE_NO_GA
        )
        return this.finishRedirectObs(request)
      }
    )
  }

  finishRedirect() {
    ;(this.window as any).outOfRouterNavigation(this.redirectUrl)
  }

  finishRedirectObs(oauthSession: RequestInfoForm): Observable<boolean> {
    ;(this.window as any).outOfRouterNavigation(oauthSession.redirectUrl)
    return NEVER
  }

  /**
   * Loads the user session.
   */
  private loadUserSession() {
    return this._user.getUserSession().pipe(first())
  }

  /**
   * Loads the platform information and stores it in a component property.
   */
  private loadPlatformInfo() {
    return this._platformInfo.get().pipe(
      first(),
      tap((platform) => {
        this.platform = platform
      })
    )
  }

  /**
   * Loads the interstitial viewed status and assigns it to the component property.
   */
  private loadInterstitialViewed() {
    return this._interstitials
      .getInterstitialsViewed('DOMAIN_INTERSTITIAL')
      .pipe(
        first(),
        tap((interstitial) => {
          this.domainInterstitialHasBeenViewed = interstitial
        })
      )
  }

  /**
   * Loads the state for the OAuth domains interstitial flag.
   */
  private loadTogglzState() {
    return this._togglz.getStateOf('OAUTH_DOMAINS_INTERSTITIAL').pipe(
      take(1),
      tap((togglz) => {
        this.oauthDomainsInterstitialEnabled = togglz
      })
    )
  }

  /**
   * Loads the emails and derives private/public domain flags.
   */
  private loadEmails() {
    return this._recordEmails.getEmails().pipe(
      first(),
      tap((emails) => {
        this.originalEmailsBackendCopy = cloneDeep(emails)
        this.userHasPrivateDomains = this.userHasPrivateEmails(emails)
        this.userHasPublicDomains = this.userHasPublicEmails(emails)
      })
    )
  }

  /**
   * Processes the user session and determines whether to display the interstitial
   * or move directly to the authorization logic.
   */
  private processUserSession(userSession: any) {
    // Independent assignment: Check if the user is impersonating.
    this.userIsNotImpersonating =
      userSession.userInfo.REAL_USER_ORCID ===
      userSession.userInfo.EFFECTIVE_USER_ORCID

    const oauthSession = userSession.oauthSession

    if (this.userWasAlreadyAuthorize(oauthSession)) {
      if (this.userCanSeeInterstitial()) {
        this.redirectUrl = oauthSession.redirectUrl
        this.displayDomainInterstitial()
        this.loading = false
      } else {
        this.reportAlreadyAuthorize(oauthSession)
      }
    } else if (oauthSession && oauthSession.error) {
      this.showAuthorizationError = true
      this.loading = false
    } else {
      this.showAuthorizationComponent = true
      this.loading = false
    }
  }

  private userWasAlreadyAuthorize(oauthSession: any) {
    return (
      oauthSession &&
      oauthSession.redirectUrl &&
      oauthSession.responseType &&
      oauthSession.redirectUrl.includes(oauthSession.responseType + '=')
    )
  }
}
