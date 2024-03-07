import { Component, OnInit } from '@angular/core'
import { take } from 'rxjs/operators'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'
import { UserService } from 'src/app/core'
import { TogglzService } from 'src/app/core/togglz/togglz.service'

@Component({
  templateUrl: './authorize.component.html',
  styleUrls: ['./authorize.component.scss'],
  preserveWhitespaces: true,
})
export class AuthorizeComponent implements OnInit {
  platform: PlatformInfo
  showAuthorizationComponent: boolean
  signInUpdatesV1Togglz = false

  constructor(
    _user: UserService,
    private _platformInfo: PlatformInfoService,
    private _togglz: TogglzService
  ) {
    _user.getUserSession().subscribe((session) => {
      if (session.oauthSession && session.oauthSession.error) {
        this.showAuthorizationComponent = false
      } else {
        this.showAuthorizationComponent = true
      }
    })
    _platformInfo.get().subscribe((platformInfo) => {
      this.platform = platformInfo
    })
  }

  ngOnInit(): void {
    this._togglz
      .getStateOf('SIGN_IN_UPDATES_V1')
      .pipe(take(1))
      .subscribe((value) => (this.signInUpdatesV1Togglz = value))
  }
}
