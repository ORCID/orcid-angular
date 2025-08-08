import { Component, OnDestroy, OnInit } from '@angular/core'
import { combineLatest, Subject } from 'rxjs'
import { switchMap, take, takeUntil, tap } from 'rxjs/operators'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'
import { UserService } from 'src/app/core'
import { TogglzService } from 'src/app/core/togglz/togglz.service'
import { ZendeskService } from 'src/app/core/zendesk/zendesk.service'
import { OauthParameters, RequestInfoForm } from 'src/app/types'
import { UserSession } from 'src/app/types/session.local'

@Component({
    selector: 'app-oauth-error',
    templateUrl: './oauth-error.component.html',
    styleUrls: ['./oauth-error.component.scss'],
    preserveWhitespaces: true,
    standalone: false
})
export class OauthErrorComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()

  error = ''
  errorCode = ''
  errorDescription = ''
  queryParams: OauthParameters
  oauthSession: RequestInfoForm
  userSession: UserSession
  TOGGLZ_OAUTH_AUTHORIZATION: boolean

  constructor(
    private _userInfo: UserService,
    private _platformInfo: PlatformInfoService,
    private _zendesk: ZendeskService,
    private _togglz: TogglzService
  ) {
    combineLatest([_userInfo.getUserSession(), this._platformInfo.get()])
      .pipe(takeUntil(this.$destroy))
      .subscribe(([session, platform]) => {
        session = session as UserSession
        platform = platform as PlatformInfo
        this.userSession = session
        this.error = session.oauthSession.error
        this.errorCode = session.oauthSession.errorCode
        this.errorDescription = session.oauthSession.errorDescription
        this.queryParams = platform.queryParameters as OauthParameters
        this.oauthSession = session.oauthSession
      })
  }

  ngOnInit(): void {
    this._togglz
      .getStateOf('OAUTH_AUTHORIZATION')
      .pipe(
        take(1),
        tap((state) => {
          if (state) {
            this.TOGGLZ_OAUTH_AUTHORIZATION = true
          } else {
            this.TOGGLZ_OAUTH_AUTHORIZATION = false
          }
        })
      )
      .subscribe()

    this._zendesk.show()
    this._zendesk.autofillTicketForm(
      this.userSession,
      'App Oauth URL with issues',
      this.error + '/' + this.errorDescription
    )
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
