import { Component, Inject, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { forkJoin, Observable, Subject } from 'rxjs'
import { catchError, map, take, takeUntil } from 'rxjs/operators'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { WINDOW } from 'src/app/cdk/window'
import { ApplicationRoutes } from 'src/app/constants'
import { UserService } from 'src/app/core'
import { ErrorHandlerService } from 'src/app/core/error-handler/error-handler.service'
import { GoogleAnalyticsService } from 'src/app/core/google-analytics/google-analytics.service'
import { OauthService } from 'src/app/core/oauth/oauth.service'
import { SignInService } from 'src/app/core/sign-in/sign-in.service'
import { TrustedIndividualsService } from 'src/app/core/trusted-individuals/trusted-individuals.service'
import { ERROR_REPORT } from 'src/app/errors'
import { RequestInfoForm, Scope } from 'src/app/types'
import { UserSession } from 'src/app/types/session.local'
import {
  Delegator,
  TrustedIndividuals,
} from 'src/app/types/trusted-individuals.endpoint'
import { environment } from 'src/environments/environment'
import { GoogleTagManagerService } from '../../../core/google-tag-manager/google-tag-manager.service'

@Component({
  selector: 'app-form-authorize',
  templateUrl: './form-authorize.component.html',
  styleUrls: ['./form-authorize.component.scss'],
  preserveWhitespaces: true,
})
export class FormAuthorizeComponent implements OnInit, OnDestroy {
  environment = environment
  $destroy: Subject<boolean> = new Subject<boolean>()
  orcidUrl: string
  userName: string
  loadingUserInfo = true
  loadingTrustedIndividuals = true
  loadingAuthorizeEndpoint = false

  oauthRequest: RequestInfoForm
  trustedIndividuals: TrustedIndividuals
  constructor(
    @Inject(WINDOW) private window: Window,
    private _user: UserService,
    private _oauth: OauthService,
    private _gtag: GoogleAnalyticsService,
    private _googleTagManagerService: GoogleTagManagerService,
    private _signingService: SignInService,
    private _platformInfo: PlatformInfoService,
    private _router: Router,
    private _errorHandler: ErrorHandlerService,
    private _trustedIndividuals: TrustedIndividualsService
  ) {
    this._user
      .getUserSession()
      .pipe(
        takeUntil(this.$destroy),
        map((userInfo) => this.removeScopesWithSameDescription(userInfo))
      )
      .subscribe((userInfo) => {
        this.loadingUserInfo = false
        this.loadingTrustedIndividuals = false
        this.oauthRequest = userInfo.oauthSession
        if (userInfo.loggedIn) {
          this.userName = userInfo.displayName
          this.orcidUrl = userInfo.effectiveOrcidUrl
        } else {
          // if the user logouts in the middle of a oauth section on another tab
          this._platformInfo
            .get()
            .pipe(take(1))
            .subscribe((platform) =>
              this._router.navigate([ApplicationRoutes.signin], {
                queryParams: platform.queryParameters,
              })
            )
        }
      })

    this._trustedIndividuals.getTrustedIndividuals().subscribe((value) => {
      this.trustedIndividuals = value
    })
  }

  ngOnInit(): void {}

  navigateTo(val) {
    this.window.location.href = val
  }

  authorize(value = true) {
    this.loadingAuthorizeEndpoint = true
    this._oauth.authorize(value).subscribe((data) => {
      const analyticsReports: Observable<void>[] = []

      if (value) {
        analyticsReports.push(
          this._gtag.reportEvent(`Authorize`, 'RegGrowth', this.oauthRequest)
        )
        analyticsReports.push(
          this._googleTagManagerService.reportEvent(
            `Authorize`,
            'RegGrowth',
            this.oauthRequest
          )
        )
      } else {
        // Create a GA for deny access
        analyticsReports.push(
          this._gtag.reportEvent(
            `Authorize_Deny`,
            'Disengagement',
            this.oauthRequest
          )
        )
        analyticsReports.push(
          this._googleTagManagerService.reportEvent(
            `Authorize_Deny`,
            'Disengagement',
            this.oauthRequest
          )
        )
      }
      forkJoin(analyticsReports)
        .pipe(
          catchError((err) =>
            this._errorHandler.handleError(
              err,
              ERROR_REPORT.STANDARD_NO_VERBOSE_NO_GA
            )
          )
        )
        .subscribe(
          () => (this.window as any).outOfRouterNavigation(data.redirectUrl),
          () => (this.window as any).outOfRouterNavigation(data.redirectUrl)
        )
    })
  }

  getIconName(ScopeObject: Scope): string {
    const scope = ScopeObject.value
    if (scope === 'openid' || scope === '/authenticate') {
      return 'orcidIcon'
    }
    if (scope.indexOf('update') >= 0) {
      return 'updateIcon' // Eye material iconname
    }
    if (scope.indexOf('read') >= 0) {
      return 'viewIcon'
    }
  }

  getDescription(ScopeObject: Scope): string {
    const scope = ScopeObject.value
    if (scope === 'openid') {
      return $localize`:@@authorize.authenticate:Get your ORCID iD`
    }

    if (scope === '/authenticate') {
      return $localize`:@@authorize.authenticate:Get your ORCID iD`
    }

    if (scope === '/person/update') {
      return $localize`:@@authorize.personUpdate:Add/update other information about you (country, keywords, etc.)`
    }

    if (scope === '/activities/update') {
      return $localize`:@@authorize.activitiesUpdate:Add/update your research activities (works, affiliations, etc)`
    }

    if (scope === '/read-limited') {
      return $localize`:@@authorize.readLimited:Read your information with visibility set to Trusted Organizations`
    }

    // For any unreconized scope just use the description  from the backend
    return ScopeObject.description
  }

  getLongDescription(ScopeObject: Scope): string {
    const scope = ScopeObject.value
    if (scope === 'openid') {
      // tslint:disable-next-line: max-line-length
      return $localize`:@@authorize.authenticateLongDescription:Allow this organization or application to get your 16-character ORCID iD and read information on your ORCID record you have marked as public.`
    }
    if (scope === '/authenticate') {
      // tslint:disable-next-line: max-line-length
      return $localize`:@@authorize.authenticateLongDescription:Allow this organization or application to get your 16-character ORCID iD and read information on your ORCID record you have marked as public.`
    }

    if (scope === '/person/update') {
      // tslint:disable-next-line: max-line-length
      return $localize`:@@authorize.personUpdateLongDescription:Allow this organization or application to add information about you (for example, your country, key words, other identifiers - but not your biography) that is stored in their system(s) to the lefthand section of your ORCID record. They will also be able to update this and any other information they have added, but will not be able to edit information added by you or by another trusted organization.`
    }

    if (scope === '/activities/update') {
      // tslint:disable-next-line: max-line-length
      return $localize`:@@authorize.activitiesUpdateLongDescription:Allow this organization or application to add information about your research activities (for example, works, affiliations) that is stored in their system(s) to your ORCID record. They will also be able to update this and any other information they have added, but will not be able to edit information added by you or by another trusted organization.`
    }

    if (scope === '/read-limited') {
      // tslint:disable-next-line: max-line-length
      return $localize`:@@authorize.readLimitedLongDescription:Allow this organization or application to read any information from your record you have marked as limited access. They cannot read information you have marked as private.`
    }
    // For any unreconized scope just use the description  from the backend
    return ScopeObject.longDescription
  }

  changeAccount(delegator: Delegator) {
    this.loadingTrustedIndividuals = true
    this.loadingUserInfo = true

    this._user.switchAccount(delegator).subscribe(() => {
      this.window.location.reload()
    })
  }
  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }

  private removeScopesWithSameDescription(userInfo: UserSession) {
    let alreadyHasAuthenticateScope = false
    userInfo.oauthSession.scopes = userInfo.oauthSession.scopes.filter(
      (scope) => {
        if (
          (scope.value === '/authenticate' || scope.value === 'openid') &&
          !alreadyHasAuthenticateScope
        ) {
          alreadyHasAuthenticateScope = true
          return true
        } else if (
          (scope.value === '/authenticate' || scope.value === 'openid') &&
          alreadyHasAuthenticateScope
        ) {
          return false
        } else {
          return true
        }
      }
    )
    return userInfo
  }
}
