import { Component, OnInit, Inject } from '@angular/core'
import { NavigationEnd, Router, NavigationStart } from '@angular/router'
import { filter } from 'rxjs/operators'
import { PlatformInfoService, WINDOW } from 'src/app/core'
import { PlatformInfo, ApplicationMenuItem } from 'src/app/types'
import { menu } from './menu'
import { ApplicationMenuItemBasic } from 'src/app/types/menu.local'

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

  constructor(
    _router: Router,
    _platform: PlatformInfoService,
    @Inject(WINDOW) private window: Window
  ) {
    _router.events
      .pipe(filter((event: any) => event instanceof NavigationStart))
      .subscribe((val: NavigationStart) => {
        console.log(val.url)
        this.currentRoute = _router.url
        this.setChildOfCurrentRouteAsSecondaryMenu()
      })

    _platform.get().subscribe(data => {
      this.platform = data
    })
  }

  ngOnInit() {}

  mouseLeave() {
    this.setChildOfCurrentRouteAsSecondaryMenu()
  }

  setChildOfCurrentRouteAsSecondaryMenu() {
    this.menu.forEach(button => {
      if (button.activeRoute) {
        button.hover = button.activeRoute === this.currentRoute
      } else {
        button.hover = button.route === this.currentRoute
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
      this.window.location.href = button.route
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
}
