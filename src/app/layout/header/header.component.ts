import { Location } from '@angular/common'
import { Component, Inject, Input, OnInit } from '@angular/core'
import { NavigationStart, Router } from '@angular/router'
import { filter } from 'rxjs/operators'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'
import { WINDOW } from 'src/app/cdk/window'
import { UserService } from 'src/app/core'
import { SignInService } from 'src/app/core/sign-in/sign-in.service'
import { TogglzService } from 'src/app/core/togglz/togglz.service'
import { ApplicationMenuItem, UserInfo } from 'src/app/types'
import {
  ApplicationMenuItemBasic,
  MenuItemRequirement,
} from 'src/app/types/menu.local'
import { Config } from 'src/app/types/togglz.endpoint'

import { environment } from '../../../environments/environment'
import { ApplicationRoutes, ORCID_REGEXP } from '../../constants'
import { menu } from './menu'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss-theme.scss', './header.component.scss'],
})
export class HeaderComponent implements OnInit {
  hideMainMenu = false
  _currentRoute: string
  @Input() set currentRoute(value) {
    this._currentRoute = value
    this.setChildOfCurrentRouteAsSecondaryMenu()
  }
  get currentRoute() {
    return this._currentRoute
  }
  platform: PlatformInfo
  mobileMenuState = false
  menu: ApplicationMenuItem[] = this.createMenuList(menu)
  user: UserInfo
  togglz: Config
  signinRegisterButton = true
  labelLogo = $localize`:@@layout.ariaLabelLogo:orcid mini logo`
  labelMenu = $localize`:@@layout.ariaLabelMenu:main menu`

  constructor(
    private _router: Router,
    _platform: PlatformInfoService,
    @Inject(WINDOW) private window: Window,
    _userInfo: UserService,
    _togglz: TogglzService,
    location: Location,
    private _user: UserService
  ) {
    _router.events
      .pipe(filter((event: any) => event instanceof NavigationStart))
      .subscribe((val: NavigationStart) => {
        this.currentRoute = _router.url
        this.setChildOfCurrentRouteAsSecondaryMenu()
      })

    _platform.get().subscribe((data) => {
      this.platform = data
    })
    _userInfo.getUserSession().subscribe((data) => {
      this.user = data.userInfo
    })
    _togglz.getTogglz().subscribe((data) => {
      this.togglz = data
    })
    _router.events.subscribe(() => {
      const path = location.path()
      this.signinRegisterButton = path !== `/${ApplicationRoutes.signin}`
      this.hideMainMenu =
        ORCID_REGEXP.test(path) ||
        path === `/${ApplicationRoutes.myOrcid}` ||
        path === `/${ApplicationRoutes.account}` ||
        path === `/${ApplicationRoutes.trustedParties}` ||
        path === `/${ApplicationRoutes.selfService}` ||
        path === `/${ApplicationRoutes.inbox}`
    })
  }

  ngOnInit() {}

  mouseLeave() {
    if (this.platform.columns12) {
      this.setChildOfCurrentRouteAsSecondaryMenu()
    }
  }

  setChildOfCurrentRouteAsSecondaryMenu() {
    // Check all first level menu items
    this.menu.forEach((button) => {
      // If the activeRoute of the button is equal to the current route show it as hover
      // Excepts if the current route is the home page
      if (button.activeRoute != null && this.currentRoute !== '/') {
        button.hover = '/' + button.activeRoute === this.currentRoute
      } else {
        button.hover = '/' + button.route === this.currentRoute
      }
    })
  }

  click(treeLocation: string[], button: ApplicationMenuItem) {
    if (!this.platform.columns12) {
      if (
        button.route !== undefined &&
        (!button.buttons || !button.buttons.length)
      ) {
        this.preNavigate(button.route)
      } else {
        this.updateMenu(this.menu, treeLocation, true)
      }
    } else if (button.route !== undefined) {
      this.preNavigate(button.route)
    }
  }

  mouseEnter(treeLocation: string[]) {
    if (this.platform.columns12) {
      this.updateMenu(this.menu, treeLocation)
    }
  }

  updateMenu(
    menuToUpdate: ApplicationMenuItem[],
    treeLocation: string[],
    switchState?: boolean
  ) {
    if (treeLocation.length) {
      const current = treeLocation.shift()
      if (menuToUpdate != null) {
        menuToUpdate.forEach((button) => {
          if (button.id === current) {
            if (treeLocation.length > 0) {
              button.hover = true
              this.updateMenu(button.buttons, treeLocation, switchState)
            } else {
              button.hover = switchState ? !button.hover : true
            }
          } else {
            button.hover = false
          }
        })
      }
    }
  }
  createMenuList(
    menuDefinition: ApplicationMenuItemBasic[]
  ): ApplicationMenuItem[] {
    const list: ApplicationMenuItem[] = []
    if (!menuDefinition || !menuDefinition.length) {
      return []
    }
    menuDefinition.forEach((item) => {
      const newItem: ApplicationMenuItem = {
        ...item,
        hover: false,
        active: false,
        buttons: this.createMenuList(item.buttons),
      }

      list.push(newItem)
    })

    return list
  }

  checkMenuItemRequirements(requirements: MenuItemRequirement) {
    if (!requirements) {
      return true
    } else if (
      typeof requirements.desktop !== 'undefined' &&
      requirements.desktop &&
      !this.platform.columns12
    ) {
      return false
    } else if (
      typeof requirements.desktop !== 'undefined' &&
      !requirements.desktop &&
      this.platform.columns12
    ) {
      return false
    } else if (
      typeof requirements.logging !== 'undefined' &&
      requirements.logging &&
      !this.user
    ) {
      return false
    } else if (
      typeof requirements.logging !== 'undefined' &&
      !requirements.logging &&
      this.user
    ) {
      return false
    } else if (requirements.requiresAll) {
      for (const accessKey of requirements.requiresAll) {
        const key = Object.keys(accessKey)[0]
        const value = accessKey[key]
        if (
          !this.user ||
          !(
            this.user[key] === value ||
            (typeof this.user[key] === 'undefined' && value === 'false')
          )
        ) {
          return false
        }
      }
    } else if (requirements.requiresAny) {
      for (const accessKey of requirements.requiresAny) {
        const key = Object.keys(accessKey)[0]
        const value = accessKey[key]
        if (
          this.user &&
          (this.user[key] === value ||
            (typeof this.user[key] === 'undefined' && value === 'false'))
        ) {
          return true
        }
      }
      return false
    } else if (typeof requirements.togglz !== 'undefined') {
      if (!this.togglz || !this.togglz.messages) {
        return false
      }
      let foundAnUnmeetTogglz = false
      Object.keys(requirements.togglz).forEach((key) => {
        if (Object.keys(this.togglz.messages).indexOf(key)) {
          if (this.togglz.messages[key] !== requirements.togglz[key]) {
            foundAnUnmeetTogglz = true
          }
        } else {
          foundAnUnmeetTogglz = true
        }
      })
      if (foundAnUnmeetTogglz) {
        return false
      }
    }
    return true
  }

  isDesktopThirdLevelMenu(parents: any[]) {
    return parents.length > 1 && this.platform.columns12
  }
  isDesktopSecondLevelMenu(parents: any[]) {
    return parents.length === 1 && this.platform.columns12
  }
  isMobileThirdLevelMenu(parents: any[]) {
    return parents.length > 1 && !this.platform.columns12
  }
  menuButtonColor(parents) {
    return this.isDesktopSecondLevelMenu(parents) ||
      this.isMobileThirdLevelMenu(parents)
      ? 'primary'
      : null
  }

  goto(url) {
    if (url === 'signin') {
      this._router.navigate([ApplicationRoutes.signin])
      this.mobileMenuState = false
    } else {
      ;(this.window as any).outOfRouterNavigation(environment.BASE_URL + url)
    }
  }

  preNavigate(route: string) {
    if (route.indexOf('://') >= 0) {
      this.navigateTo(route)
    } else {
      this.navigateTo(environment.INFO_SITE + route)
    }
  }

  navigateTo(val) {
    if (val === '/signout' && environment.proxyMode) {
      this._user.noRedirectLogout().subscribe()
    } else {
      ;(this.window as any).outOfRouterNavigation(val)
    }
  }
}
