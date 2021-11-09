import { Component, OnInit, Inject } from '@angular/core'
import { UserService } from 'src/app/core'
import { environment } from 'src/environments/environment'
import { UserInfo } from 'src/app/types'
import { PlatformInfoService, PlatformInfo } from 'src/app/cdk/platform-info'
import { WINDOW } from 'src/app/cdk/window'
import { Router } from '@angular/router'
import { ApplicationRoutes } from 'src/app/constants'
import { SignInService } from 'src/app/core/sign-in/sign-in.service'
import { switchMap, take } from 'rxjs/operators'

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
  labelSigninRegister = $localize`:@@layout.ariaLabelSigninRegister:sign in or register`
  labelUserMenu = $localize`:@@layout.ariaLabelUserMenu:User menu`

  constructor(
    private _router: Router,
    _userInfo: UserService,
    @Inject(WINDOW) private window: Window,
    _platform: PlatformInfoService,
    private _signingService: SignInService,
    private _platformInfo: PlatformInfoService
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
  }

  ngOnInit() {}

  goto(url) {
    if (url === 'signin') {
      this._router.navigate([ApplicationRoutes.signin])
    } else if (url === 'inbox') {
      this._router.navigate([ApplicationRoutes.inbox])
    } else {
      this.window.location.href = environment.BASE_URL + url
    }
  }

  signOut() {
    this._signingService
      .singOut()
      .pipe(switchMap(() => this._platformInfo.get().pipe(take(1))))
      .subscribe((platform) => {
        this._router.navigate(['/signin'], {
          queryParams: platform.queryParameters,
        })
      })
  }
}
