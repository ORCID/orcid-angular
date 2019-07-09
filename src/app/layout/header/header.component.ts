import { Component, OnInit, Inject } from '@angular/core'
import { NavigationEnd, Router, NavigationStart } from '@angular/router'
import { filter } from 'rxjs/operators'
import { PlatformInfoService, WINDOW, UserService } from 'src/app/core'
import { PlatformInfo, ApplicationMenuItem, UserInfo } from 'src/app/types'
import { menu } from './menu'
import {
  ApplicationMenuItemBasic,
  MenuItemRequirement,
} from 'src/app/types/menu.local'
import { environment } from 'src/environments/environment'
import { TogglzService } from 'src/app/core/togglz/togglz.service'
import { Config } from 'src/app/types/togglz.endpoint'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  currentRoute
  platform: PlatformInfo
  mobileMenuState = false
  menu: ApplicationMenuItem[] = this.createMenuList(menu)
  user: UserInfo
  togglz: Config

  constructor(
    _router: Router,
    _platform: PlatformInfoService,
    @Inject(WINDOW) private window: Window,
    _userInfo: UserService,
    _togglz: TogglzService
  ) {
    _router.events
      .pipe(filter((event: any) => event instanceof NavigationStart))
      .subscribe((val: NavigationStart) => {
        this.currentRoute = _router.url
        this.setChildOfCurrentRouteAsSecondaryMenu()
      })

    _platform.get().subscribe(data => {
      this.platform = data
    })
    _userInfo.getUserInfoOnEachStatusUpdate().subscribe(data => {
      this.user = data.userInfo
    })
    _togglz.getTogglz().subscribe(data => {
      this.togglz = data
    })
  }

  ngOnInit() {}

  mouseLeave() {
    if (this.platform.columns12) {
      this.setChildOfCurrentRouteAsSecondaryMenu()
    }
  }

  setChildOfCurrentRouteAsSecondaryMenu() {
    this.menu.forEach(button => {
      if (button.activeRoute != null) {
        button.hover = '/' + button.activeRoute === this.currentRoute
      } else {
        button.hover = '/' + button.route === this.currentRoute
      }
    })
  }

  click(treeLocation: string[], button: ApplicationMenuItem) {
    if (!this.platform.columns12) {
      if (button.route && (!button.buttons || !button.buttons.length)) {
        this.window.location.href = button.route
      } else {
        this.updateMenu(this.menu, treeLocation, true)
      }
    } else if (button.route) {
      this.window.location.href = environment.BASE_URL + button.route
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
        menuToUpdate.forEach(button => {
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
    menuDefinition.forEach(item => {
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
    }
    return true
  }
}
