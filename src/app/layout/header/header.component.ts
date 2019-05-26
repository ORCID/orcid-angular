import { Component, OnInit } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { filter } from 'rxjs/operators'
import { PlatformInfoService } from 'src/app/core'
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

  constructor(_router: Router, _platform: PlatformInfoService) {
    _router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe(val => {
        this.currentRoute = _router.url
        this.setChildOfCurrentRouteAsSecondaryMenu()
      })

    _platform.get().subscribe(data => {
      this.platform = data
    })
  }

  ngOnInit() {}

  mouseEnter(ul: string[]) {
    if (this.platform.columns12) {
      this.updateHover(this.menu, ul)
    }
  }

  mouseLeave() {
    this.setChildOfCurrentRouteAsSecondaryMenu()
  }

  setChildOfCurrentRouteAsSecondaryMenu() {
    Object.keys(this.menu).forEach(button => {
      this.menu[button].hover = this.menu[button].route === this.currentRoute
    })
  }

  click(ul: string[]) {
    if (!this.platform.columns12) {
      this.updateHover(this.menu, ul)
    }
  }

  updateHover(menuToUpdate: ApplicationMenuItem[], ul: string[]) {
    if (ul.length) {
      const current = ul.shift()
      if (menuToUpdate != null) {
        menuToUpdate.forEach(button => {
          if (button.id === current) {
            button.hover = true
            this.updateHover(button.buttons, ul)
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
