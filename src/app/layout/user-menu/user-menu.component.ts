import { Component, OnInit, Inject } from '@angular/core'
import { UserService, WINDOW, PlatformInfoService } from 'src/app/core'
import { environment } from 'src/environments/environment'
import { PlatformInfo, UserInfo } from 'src/app/types'

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
})
export class UserMenuComponent implements OnInit {
  state = false
  userInfo: UserInfo
  platform: PlatformInfo
  constructor(
    _userInfo: UserService,
    @Inject(WINDOW) private window: Window,
    _platform: PlatformInfoService
  ) {
    _userInfo.getUserInfoOnEachStatusUpdate().subscribe(data => {
      this.userInfo = data
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
