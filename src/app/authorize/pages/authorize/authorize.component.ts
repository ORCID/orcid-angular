import { Component } from '@angular/core'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'
import { UserService } from 'src/app/core'

@Component({
  templateUrl: './authorize.component.html',
  styleUrls: ['./authorize.component.scss'],
  preserveWhitespaces: true,
})
export class AuthorizeComponent {
  platform: PlatformInfo
  showAuthorizationComponent: boolean

  constructor(_user: UserService, private _platformInfo: PlatformInfoService) {
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
}
