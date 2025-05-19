import { ComponentType } from '@angular/cdk/overlay'
import { Component, Inject, ViewChild } from '@angular/core'
import { cloneDeep } from 'lodash'
import { Observable, forkJoin, NEVER, of } from 'rxjs'
import {
  filter,
  finalize,
  first,
  map,
  switchMap,
  take,
  tap,
} from 'rxjs/operators'
import { InterstitialsService } from 'src/app/cdk/interstitials/interstitials.service'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'
import { WINDOW } from 'src/app/cdk/window'
import { UserService } from 'src/app/core'
import { ErrorHandlerService } from 'src/app/core/error-handler/error-handler.service'
import { GoogleTagManagerService } from 'src/app/core/google-tag-manager/google-tag-manager.service'
import { LoginMainInterstitialsManagerService } from 'src/app/core/login-interstitials-manager/login-main-interstitials-manager.service'
import { RecordEmailsService } from 'src/app/core/record-emails/record-emails.service'
import { RecordService } from 'src/app/core/record/record.service'
import { TogglzService } from 'src/app/core/togglz/togglz.service'
import { ERROR_REPORT } from 'src/app/errors'
import { EmailsEndpoint, RequestInfoForm } from 'src/app/types'
import { UserRecord } from 'src/app/types/record.local'
import { UserSession } from 'src/app/types/session.local'
import { CdkPortalOutlet, ComponentPortal, Portal } from '@angular/cdk/portal'

@Component({
  templateUrl: './authorize.component.html',
  styleUrls: ['./authorize.component.scss'],
  preserveWhitespaces: true,
})
export class AuthorizeComponent {
  @ViewChild('interstitialOutlet', { static: false, read: CdkPortalOutlet })
  outlet!: CdkPortalOutlet

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
  interstitialComponent: ComponentType<any>
  redirectByReportAlreadyAuthorize: boolean

  constructor(
    private userService: UserService,
    private platformInfoService: PlatformInfoService,
    @Inject(WINDOW) private window: Window,
    private googleTagManagerService: GoogleTagManagerService,
    private errorHandlerService: ErrorHandlerService,
    private recordService: RecordService,
    private loginMainInterstitialsManagerService: LoginMainInterstitialsManagerService
  ) {}

  /**
   * Lifecycle hook. Initiates data loading and handles session logic.
   */
  ngOnInit(): void {
    this.loading = true
    this.insidePopUpWindows = !!this.window.opener

    forkJoin({
      platform: this.loadPlatformInfo(),
      userSession: this.loadUserSession(),
      userRecord: this.recordService.getRecord({}).pipe(
        filter((userRecord: UserRecord) => {
          return (
            !!userRecord &&
            !!userRecord?.userInfo &&
            !!userRecord?.emails &&
            !!userRecord?.affiliations?.length
          )
        }),
        take(1)
      ),
    })
      .pipe(
        switchMap((record) => {
          return this.loginMainInterstitialsManagerService
            .checkLoginInterstitials(record.userRecord, {
              returnType: 'component',
              togglzPrefix: 'OAUTH',
            })
            .pipe(
              take(1),
              map((interstitial) => {
                this.interstitialComponent = interstitial
              }),
              switchMap(() => {
                return of(record.userSession)
              }),
              finalize(() => {
                this.handleUserSession(record.userSession)
              })
            )
        })
      )
      .subscribe()
  }

  /**
   * Called by template to handle final redirection.
   */
  handleRedirect(url: string): void {
    this.redirectUrl = url
    if (this.redirectUrl && this.isThereInterstitialToShow()) {
      this.showInterstitial()
    } else {
      this.finishRedirect()
    }
  }

  /**
   * Internal method to finalize redirection (non-observable variant).
   */
  finishRedirect(): void {
    ;(this.window as any).outOfRouterNavigation(this.redirectUrl)
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
   * Determines whether a interstitial should be displayed
   */
  private isThereInterstitialToShow(): boolean {
    return !!this.interstitialComponent
  }

  /**
   * Displays the interstitial
   */
  private showInterstitial(): void {
    const portal = new ComponentPortal(this.interstitialComponent)

    const componentRef = this.outlet.attachComponentPortal(portal)

    componentRef.instance.finish.subscribe(() => {
      this.finishRedirect()
    })

    componentRef.changeDetectorRef.detectChanges()

    this.showAuthorizationComponent = false
    this.showInterstital = true
  }

  /**
   * Loads the user session data.
   */
  private loadUserSession(): Observable<UserSession> {
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
   * After loading forkJoin data, decide on final flow:
   * show error, show domain interstitial, or show authorization screen.
   */
  private handleUserSession(userSession: UserSession): void {
    this.oauthSession = userSession.oauthSession

    // 1. If the backend returned an error
    if (this.oauthSession && this.oauthSession.error) {
      this.debugLog(`Oauth session error: ${this.oauthSession.error}`)
      this.showAuthorizationError = true
      this.loading = false
      return
    }

    // 2. If the user was already authorized, we might show domain interstitial or just redirect
    if (this.isUserAlreadyAuthorized(this.oauthSession)) {
      this.debugLog('User alreay authorized this app')
      if (this.isThereInterstitialToShow()) {
        this.redirectByReportAlreadyAuthorize = true
        this.showInterstitial()
        this.loading = false
        this.redirectUrl = this.oauthSession.redirectUrl
      } else {
        this.finishRedirectObs(this.oauthSession)
      }
      return
    } else {
      this.debugLog('User has not authorized this app')
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

  private debugLog(message: string): void {
    if (runtimeEnvironment.debugger) {
      console.info('[OAuth]', message)
    }
  }
}
