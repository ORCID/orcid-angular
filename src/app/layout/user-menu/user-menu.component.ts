import { Component, OnInit, Inject } from '@angular/core'
import { UserService } from 'src/app/core'
import { environment } from 'src/environments/environment'
import { UserInfo, NameForm } from 'src/app/types'
import { PlatformInfoService, PlatformInfo } from 'src/app/cdk/platform-info'
import { WINDOW } from 'src/app/cdk/window'
import { TogglzService } from '../../core/togglz/togglz.service'
import { Router } from '@angular/router'
import { ApplicationRoutes } from 'src/app/constants'

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
  togglzOrcidAngularSignin: boolean
  togglzOrcidAngularInbox: boolean
  labelSigninRegister = $localize`:@@layout.ariaLabelSigninRegister:sign in or register`
  labelUserMenu = $localize`:@@layout.ariaLabelUserMenu:User menu`

  constructor(
    private _router: Router,
    _userInfo: UserService,
    @Inject(WINDOW) private window: Window,
    _platform: PlatformInfoService,
    _togglz: TogglzService
  ) {
    _userInfo.getUserSession().subscribe((data) => {
      if (data.loggedIn) {
        this.userInfo = data.userInfo
        this.displayName = data.displayName
      } else {
        this.userInfo = null
        this.displayName = null
      }
    })
    _platform.get().subscribe((data) => {
      this.platform = data
    })
    _togglz
      .getStateOf('ORCID_ANGULAR_SIGNIN')
      .subscribe((value) => (this.togglzOrcidAngularSignin = value))

    _togglz
      .getStateOf('ORCID_ANGULAR_INBOX')
      .subscribe((value) => (this.togglzOrcidAngularInbox = value))
  }

  ngOnInit() {}

  goto(url) {
    if (url === 'signin' && this.togglzOrcidAngularSignin) {
      this._router.navigate([ApplicationRoutes.signin])
    } else if (url === 'inbox' && this.togglzOrcidAngularInbox) {
      this._router.navigate([ApplicationRoutes.inbox])
    } else {
      this.window.location.href = environment.BASE_URL + url
    }
  }
}
