import { Component, Inject, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { forkJoin, Observable, Subject } from 'rxjs'
import { switchMap, take, takeUntil, map } from 'rxjs/operators'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { WINDOW } from 'src/app/cdk/window'
import { UserService } from 'src/app/core'
import { GoogleAnalyticsService } from 'src/app/core/google-analytics/google-analytics.service'
import { OauthService } from 'src/app/core/oauth/oauth.service'
import { SignInService } from 'src/app/core/sign-in/sign-in.service'
import { TrustedIndividualsService } from 'src/app/core/trusted-individuals/trusted-individuals.service'
import { ScopesStrings } from 'src/app/types/common.endpoint'
import {
  RequestInfoForm,
  Scope,
} from 'src/app/types/request-info-form.endpoint'
import {
  Delegator,
  TrustedIndividuals,
} from 'src/app/types/trusted-individuals.endpoint'
import { UserInfo } from 'os'
import { UserSession } from 'src/app/types/session.local'

@Component({
  selector: 'app-authorize',
  templateUrl: './authorize.component.html',
  styleUrls: ['./authorize.component.scss'],
  preserveWhitespaces: true,
})
export class AuthorizeComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()
  orcidUrl: string
  userName: string
  loadingUserInfo = true
  loadingTrustedIndividuals = true

  oauthRequest: RequestInfoForm
  trustedIndividuals: TrustedIndividuals
  constructor(
    @Inject(WINDOW) private window: Window,
    private _user: UserService,
    private _oauth: OauthService,
    private _gtag: GoogleAnalyticsService,
    private _trustedIndividuals: TrustedIndividualsService,
    private _signingService: SignInService,
    private _platformInfo: PlatformInfoService,
    private _router: Router
  ) {
    this._user
      .getUserSession()
      .pipe(
        takeUntil(this.$destroy),
        map((userInfo) => this.removeScopesWithSameDescription(userInfo))
      )
      .subscribe((userInfo) => {
        this.loadingUserInfo = false
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
              this._router.navigate(['/signin'], {
                queryParams: platform.queryParameters,
              })
            )
        }
      })
    this._trustedIndividuals
      .getTrustedIndividuals()
      .pipe(takeUntil(this.$destroy))
      .subscribe((data) => {
        this.loadingTrustedIndividuals = false
        this.trustedIndividuals = data
      })
  }

  ngOnInit(): void {}

  navigateTo(val) {
    this.window.location.href = val
  }

  signOut() {
    this._signingService
      .singOut()
      .pipe(switchMap(() => this._platformInfo.get().pipe(take(1))))
      .subscribe((platform) => {
        this._router.navigate(['/signin'], {
          queryParams: platform.queryParameters,
        })
      })
  }

  authorize(value = true) {
    this._oauth.authorize(value).subscribe((data) => {
      let analyticsReports: Observable<void>[] = []

      if (value) {
        // Create a GA event for each scope
        analyticsReports = data.scopes.map((scope) =>
          this._gtag.reportEvent(
            'RegGrowth',
            `AuthorizeP_${scope.name}`,
            this.oauthRequest
          )
        )
      } else {
        // Create a GA for deny access
        analyticsReports.push(
          this._gtag.reportEvent(
            'Disengagement',
            `Authorize_Deny`,
            this.oauthRequest
          )
        )
      }
      forkJoin(analyticsReports).subscribe(
        () => (this.window.location.href = data.redirectUrl),
        () => (this.window.location.href = data.redirectUrl)
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
    this._trustedIndividuals.switchAccount(delegator).subscribe()
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
