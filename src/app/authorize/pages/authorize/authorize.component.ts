import { Component, Inject, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { forkJoin, Observable, Subject } from 'rxjs'
import { switchMap, take, takeUntil } from 'rxjs/operators'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { WINDOW } from 'src/app/cdk/window'
import { UserService } from 'src/app/core'
import { GoogleAnalyticsService } from 'src/app/core/google-analytics/google-analytics.service'
import { OauthService } from 'src/app/core/oauth/oauth.service'
import { SignInService } from 'src/app/core/sign-in/sign-in.service'
import { TrustedIndividualsService } from 'src/app/core/trusted-individuals/trusted-individuals.service'
import { ScopesStrings } from 'src/app/types/common.endpoint'
import { RequestInfoForm } from 'src/app/types/request-info-form.endpoint'
import {
  Delegator,
  TrustedIndividuals,
} from 'src/app/types/trusted-individuals.endpoint'

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
    _oauth.loadRequestInfoFormFromMemory().subscribe((data) => {
      this.oauthRequest = data
    })

    this._user
      .getUserInfoOnEachStatusUpdate()
      .pipe(takeUntil(this.$destroy))
      .subscribe((userInfo) => {
        if (userInfo.loggedIn) {
          this.loadingUserInfo = false
          this.userName = userInfo.displayName
          this.orcidUrl = userInfo.orcidUrl
        } else {
          this.userName = null
          this.orcidUrl = null
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
    // TODO @leomendoza123 handle error with toaster
  }

  getIconName(scope: ScopesStrings): string {
    if (scope.indexOf('update') >= 0) {
      return 'updateIcon' // Eye material iconname
    }
    if (scope === 'openid' || scope === '/authenticate') {
      return 'orcidIcon'
    }
    if (scope === '/read-limited') {
      return 'viewIcon'
    }
  }
  changeAccount(delegator: Delegator) {
    this.loadingTrustedIndividuals = true
    this.loadingUserInfo = true
    this._trustedIndividuals.switchAccount(delegator).subscribe()
    // TODO @leomendoza123 handle error with toaster
  }
  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
