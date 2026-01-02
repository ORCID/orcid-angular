import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import { Router } from '@angular/router'
import { forkJoin, Observable, Subject } from 'rxjs'
import {
  catchError,
  map,
  take,
  takeUntil,
  switchMap,
  tap,
} from 'rxjs/operators'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'
import { WINDOW } from 'src/app/cdk/window'
import { ApplicationRoutes } from 'src/app/constants'
import { UserService } from 'src/app/core'
import { ErrorHandlerService } from 'src/app/core/error-handler/error-handler.service'
import { OauthService } from 'src/app/core/oauth/oauth.service'
import { SignInService } from 'src/app/core/sign-in/sign-in.service'
import { TrustedIndividualsService } from 'src/app/core/trusted-individuals/trusted-individuals.service'
import { ERROR_REPORT } from 'src/app/errors'
import { Scope } from 'src/app/types'
import { LegacyOauthRequestInfoForm as RequestInfoForm } from 'src/app/types/request-info-form.endpoint'
import { UserSession } from 'src/app/types/session.local'
import {
  Delegator,
  TrustedIndividuals,
} from 'src/app/types/trusted-individuals.endpoint'
import { GoogleTagManagerService } from '../../../core/google-tag-manager/google-tag-manager.service'
import { Title } from '@angular/platform-browser'
import { TogglzService } from 'src/app/core/togglz/togglz.service'
import { OauthURLSessionManagerService } from 'src/app/core/oauth-urlsession-manager/oauth-urlsession-manager.service'
import { TogglzFlag } from 'src/app/types/config.endpoint'

@Component({
  selector: 'app-form-authorize',
  templateUrl: './form-authorize.component.html',
  styleUrls: [
    './form-authorize.component.scss',
    './form-authorize.component.scss-theme.scss',
  ],
  preserveWhitespaces: true,
  standalone: false,
})
export class FormAuthorizeComponent implements OnInit, OnDestroy {
  @Output() redirectUrl = new EventEmitter<string>()
  environment = runtimeEnvironment
  $destroy: Subject<boolean> = new Subject<boolean>()
  orcidUrl: string
  userName: string
  loadingUserInfo = true
  loadingTrustedIndividuals = true
  loadingAuthorizeEndpoint = false

  oauthRequest: RequestInfoForm
  trustedIndividuals: TrustedIndividuals
  platformInfo: PlatformInfo

  authorizeAccessFor = $localize`:@@authorize.authorizeAccessFor:Authorize access for`
  orcid = $localize`:@@authorize.dashOrcid:- ORCID`
  OAUTH_AUTHORIZATION: boolean

  constructor(
    @Inject(WINDOW) private window: Window,
    private _user: UserService,
    private _oauth: OauthService,
    private _platformInfo: PlatformInfoService,
    private _router: Router,
    private _trustedIndividuals: TrustedIndividualsService,
    private _titleService: Title,
    private _togglz: TogglzService,
    private _oauthURLSessionManagerService: OauthURLSessionManagerService
  ) {}

  ngOnInit(): void {
    this._togglz
      .getStateOf(TogglzFlag.OAUTH_AUTHORIZATION)
      .pipe(take(1))
      .subscribe((OAUTH_AUTHORIZATION) => {
        this.OAUTH_AUTHORIZATION = OAUTH_AUTHORIZATION
      })

    this._platformInfo
      .get()
      .pipe(take(1))
      .subscribe((platform) => (this.platformInfo = platform))

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

    setTimeout(() => {
      this._titleService.setTitle(
        this.authorizeAccessFor +
          ' ' +
          this.oauthRequest?.clientName +
          ' ' +
          this.orcid
      )
    }, 1000)
  }

  logout() {
    if (this.OAUTH_AUTHORIZATION) {
      this._user
        .noRedirectLogout()
        .pipe(
          take(1),
          catchError((error) => {
            this.performRedirect()
            return []
          })
        )
        .subscribe(() => {
          this.performRedirect()
        })
    } else {
      this.window.location.href = '/signout'
    }
  }

  private performRedirect() {
    // Redirect to login with current url params using hard reload
    const queryParams = this.platformInfo.queryParameters
      ? new URLSearchParams(this.platformInfo.queryParameters).toString()
      : ''
    const signinUrl = queryParams ? `/signin?${queryParams}` : '/signin'
    this.window.location.href = signinUrl
  }

  authorize(value = true) {
    this.loadingAuthorizeEndpoint = true

    this._togglz
      .getStateOf(TogglzFlag.OAUTH_AUTHORIZATION)
      .pipe(
        tap((useAuthServerFlag) => {
          if (useAuthServerFlag === true) {
            this._oauth
              .authorizeOnAuthServer(this.oauthRequest, value)
              .subscribe((redirectUrl) => {
                this.redirectUrl.next(redirectUrl)
              })
          } else {
            this._oauth.authorize(value).subscribe((data) => {
              this.redirectUrl.next(data.redirectUrl)
            })
          }
        })
      )
      .subscribe()
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
      return $localize`:@@authorize.addUpdateInformation:Add/update information about you (country, keywords, etc.)`
    }

    if (scope === '/activities/update') {
      return $localize`:@@authorize.addUpdateReseachActivities:Add/update your research activities (works, affiliations, etc.)`
    }

    if (scope === '/read-limited') {
      return $localize`:@@authorize.readInfomationVisibilityTrustedParties:Read your information with visibility set to Trusted parties`
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
    userInfo.oauthSession.scopes = userInfo.oauthSession?.scopes.filter(
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
