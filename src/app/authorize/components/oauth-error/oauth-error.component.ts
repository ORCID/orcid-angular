import { Component, Input, OnInit } from '@angular/core'
import { combineLatest, Subject } from 'rxjs'
import { first, map, takeUntil } from 'rxjs/operators'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'
import { UserService } from 'src/app/core'
import { ZendeskService } from 'src/app/core/zendesk/zendesk.service'
import { OauthParameters, RequestInfoForm } from 'src/app/types'
import { UserSession } from 'src/app/types/session.local'

@Component({
  selector: 'app-oauth-error',
  templateUrl: './oauth-error.component.html',
  styleUrls: ['./oauth-error.component.scss'],
  preserveWhitespaces: true,
})
export class OauthErrorComponent implements OnInit {
  $destroy: Subject<boolean> = new Subject<boolean>()

  error = ''
  errorDescription = ''
  queryParams: OauthParameters
  oauthSession : RequestInfoForm

  constructor(
    private _userInfo: UserService,
    private _platformInfo: PlatformInfoService,
    private _zendesk: ZendeskService
  ) {
    combineLatest([_userInfo.getUserSession(), this._platformInfo.get()])
      .pipe(takeUntil(this.$destroy))
      .subscribe(([session, platform]) => {
        session = session as UserSession
        platform = platform as PlatformInfo
        this.error = session.oauthSession.error
        this.errorDescription = session.oauthSession.errorDescription
        this.queryParams = platform.queryParameters as OauthParameters
        this.oauthSession = session.oauthSession
      })
  }

  ngOnInit(): void {
    this._zendesk.show()
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
