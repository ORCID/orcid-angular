import { Component, OnDestroy, OnInit } from '@angular/core'
import { combineLatest, Subject } from 'rxjs'
import { switchMap, take, takeUntil, tap } from 'rxjs/operators'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'
import { UserService } from 'src/app/core'
import { TogglzService } from 'src/app/core/togglz/togglz.service'
import { ZendeskService } from 'src/app/core/zendesk/zendesk.service'
import { OauthParameters } from 'src/app/types'
import { LegacyOauthRequestInfoForm as RequestInfoForm } from 'src/app/types/request-info-form.endpoint'
import { UserSession } from 'src/app/types/session.local'
import { RumJourneyEventService } from 'src/app/rum/service/customEvent.service'
import { JourneyType } from 'src/app/rum/journeys/types'

@Component({
  selector: 'app-oauth-error',
  templateUrl: './oauth-error.component.html',
  styleUrls: ['./oauth-error.component.scss'],
  preserveWhitespaces: true,
  standalone: false,
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
  private oauthJourneyStarted = false

  constructor(
    private _userInfo: UserService,
    private _platformInfo: PlatformInfoService,
    private _zendesk: ZendeskService,
    private _togglz: TogglzService,
    private _observability: RumJourneyEventService
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

        // Initialize journey and record initial error context once
        if (!this.oauthJourneyStarted) {
          this._observability.startJourney('oauth_authorization', {
            client_id: this.queryParams?.client_id,
            redirect_uri: this.queryParams?.redirect_uri,
            response_type: this.queryParams?.response_type,
            scope: this.queryParams?.scope,
          })
          this._observability.recordEvent('oauth_authorization', 'error_page_loaded', {
            error: this.error,
            errorCode: this.errorCode,
            errorDescription: this.errorDescription,
          })
          this.oauthJourneyStarted = true
        }
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
          // Report feature flag status
          this._observability.recordEvent(
            'oauth_authorization',
            'flag_status',
            {
              OAUTH_AUTHORIZATION: this.TOGGLZ_OAUTH_AUTHORIZATION,
            }
          )
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
