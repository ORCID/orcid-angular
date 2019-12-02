import { Component, OnInit, Inject } from '@angular/core'
import { UserService, WINDOW } from 'src/app/core'
import { environment } from 'src/environments/environment'
import { UserInfo, NameForm } from 'src/app/types'
import { PlatformInfoService, PlatformInfo } from 'src/app/cdk/platform-info'

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: [
    './user-menu.component.scss-theme.scss',
    './user-menu.component.scss',
  ],
})
export class UserMenuComponent implements OnInit {
  state = false
  userInfo: UserInfo
  displayName: string
  platform: PlatformInfo
  constructor(
    _userInfo: UserService,
    @Inject(WINDOW) private window: Window,
    _platform: PlatformInfoService
  ) {
    _userInfo.getUserInfoOnEachStatusUpdate().subscribe(data => {
      this.userInfo = data.userInfo
      this.displayName = data.displayName
    })
    _platform.get().subscribe(data => {
      this.platform = data
    })
  }

  ngOnInit() {}

  goto(url) {
    this.window.location.href = environment.BASE_URL + url
  }
}
