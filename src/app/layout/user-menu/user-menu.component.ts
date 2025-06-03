import { Component, OnInit, Inject } from '@angular/core'
import { UserService } from 'src/app/core'

import { UserInfo } from 'src/app/types'
import { PlatformInfoService, PlatformInfo } from 'src/app/cdk/platform-info'
import { WINDOW } from 'src/app/cdk/window'
import { Router } from '@angular/router'
import { ApplicationRoutes } from 'src/app/constants'
import { TogglzService } from 'src/app/core/togglz/togglz.service'
import { InboxService } from '../../core/inbox/inbox.service'
import { first } from 'rxjs/operators'
import { CustomEventService } from 'src/app/core/observability-events/observability-events.service'

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
  labelSigninRegister = $localize`:@@layout.ariaLabelSigninRegister:Sign in to ORCID or register for your ORCID iD`
  labelUserMenu = $localize`:@@layout.ariaLabelUserMenu:User menu`
  notificationTooltipActive = $localize`:@@layout.notificationTooltip:You have unread notifications`
  notificationTooltip = $localize`:@@layout.notificationTooltipInactive:Notifications inbox`
  isAccountDelegate: boolean
  inboxUnread = 0
  userJourney!: 'orcid_with_notifications' | 'orcid_without_notifications'

  constructor(
    private _router: Router,
    private _userInfo: UserService,
    @Inject(WINDOW) private window: Window,
    _platform: PlatformInfoService,
    private _inboxService: InboxService,
    private _togglz: TogglzService,
    private observabilityEventService: CustomEventService
  ) {
    _userInfo.getUserSession().subscribe((data) => {
      if (data.loggedIn) {
        this.userInfo = data.userInfo
        this.displayName = data.displayName
        this.isAccountDelegate =
          data.userInfo.REAL_USER_ORCID === data.userInfo.EFFECTIVE_USER_ORCID
      } else {
        this.userInfo = null
        this.displayName = null
      }
    })
    _platform.get().subscribe((data) => {
      this.platform = data
    })
  }

  ngOnInit() {
    this._inboxService
      .retrieveUnreadCount()
      .pipe(first())
      .subscribe((inboxUnread) => {
        ;(this.userJourney =
          inboxUnread > 0
            ? 'orcid_with_notifications'
            : 'orcid_without_notifications'),
          this.observabilityEventService.startJourney(
            this.userJourney,

            { inboxUnread }
          )
        this.inboxUnread = inboxUnread
      })
  }

  goto(url, from?: string) {
    if (url === 'my-orcid') {
      this._router.navigate([ApplicationRoutes.myOrcid])
    } else if (url === 'signin') {
      this._router.navigate([ApplicationRoutes.signin])
    } else if (url === 'inbox') {
      this.observabilityEventService.recordEvent(this.userJourney, from)
      this._router.navigate([ApplicationRoutes.inbox])
    } else if (url === 'account') {
      this._router.navigate([ApplicationRoutes.account])
    } else if (url === 'trusted-parties') {
      this._router.navigate([ApplicationRoutes.trustedParties])
    } else if (url === 'trusted-parties') {
      this._router.navigate([ApplicationRoutes.trustedParties])
    } else if (url === 'developer-tools') {
      this._router.navigate([ApplicationRoutes.developerTools])
    } else {
      this.window.location.href = runtimeEnvironment.BASE_URL + url
    }
  }

  navigateTo(val) {
    if (val === '/signout' && runtimeEnvironment.proxyMode) {
      this._userInfo.noRedirectLogout().subscribe()
    } else {
      this.window.location.href = val
    }
  }
}
