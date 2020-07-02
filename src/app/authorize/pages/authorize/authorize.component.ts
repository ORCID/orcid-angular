import { Component, OnInit, Inject, OnDestroy } from '@angular/core'
import { WINDOW } from 'src/app/cdk/window'
import { OauthService } from 'src/app/core/oauth/oauth.service'
import { RequestInfoForm } from 'src/app/types/request-info-form.endpoint'
import { UserService } from 'src/app/core'
import { Subject, forkJoin, Observable } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { ScopesStrings } from 'src/app/types/common.endpoint'
import { GoogleAnalyticsService } from 'src/app/core/google-analytics/google-analytics.service'
import { TrustedIndividualsService } from 'src/app/core/trusted-individuals/trusted-individuals.service'
import {
  TrustedIndividuals,
  Delegator,
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

  oauthRequest: RequestInfoForm
  trustedIndividuals: TrustedIndividuals
  constructor(
    @Inject(WINDOW) private window: Window,
    private _user: UserService,
    private _oauth: OauthService,
    private _gtag: GoogleAnalyticsService,
    private _trustedIndividuals: TrustedIndividualsService
  ) {
    _oauth.loadRequestInfoFormFromMemory().subscribe((data) => {
      this.oauthRequest = data
    })

    this._user
      .getUserInfoOnEachStatusUpdate()
      .pipe(takeUntil(this.$destroy))
      .subscribe((userInfo) => {
        this.userName = userInfo.displayName
        this.orcidUrl = userInfo.orcidUrl
      })
    this._trustedIndividuals.getTrustedIndividuals().subscribe((data) => {
      this.trustedIndividuals = data
    })
  }

  ngOnInit(): void {}

  navigateTo(val) {
    this.window.location.href = val
  }

  signout() {}

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
    this._trustedIndividuals.switchAccount(delegator).subscribe()
  }
  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
