import { Location } from '@angular/common'
import {
  Component,
  Inject,
  Input,
  OnInit,
  HostListener,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core'
import { NavigationStart, Router } from '@angular/router'
import { filter, map, switchMap, tap } from 'rxjs/operators'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'
import { WINDOW } from 'src/app/cdk/window'
import { UserService } from 'src/app/core'
import { TogglzService } from 'src/app/core/togglz/togglz.service'
import { TogglzFlag } from 'src/app/core/togglz/togglz-flags.enum'
import { ApplicationMenuItem, UserInfo } from 'src/app/types'
import {
  ApplicationMenuItemBasic,
  MenuItemRequirement,
} from 'src/app/types/menu.local'
import { Config } from 'src/app/types/togglz.endpoint'

import { ApplicationRoutes } from '../../constants'
import { menu } from './menu'
import { of, Observable } from 'rxjs'
import { HeaderCompactService } from 'src/app/core/header-compact/header-compact.service'
import { RecordHeaderStateService } from 'src/app/core/record-header-state/record-header-state.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss-theme.scss', './header.component.scss'],
  standalone: false,
})
export class HeaderComponent implements OnInit, AfterViewInit {
  hideMainMenu = false
  _currentRoute: string
  notWordpressDisplay: boolean
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
  labelLogo = $localize`:@@layout.ariaLabelConnectingResearchers:Connecting research and researchers`
  labelMenu = $localize`:@@layout.ariaLabelMenu:main menu`

  // Compact header (feature-flagged) state
  compactEligible = false
  isCompactActive = false

  // Record header state consumed when compact header is active
  loadingUserRecord$: Observable<boolean> =
    this._recordHeaderState.loadingUserRecord$
  isPublicRecord$: Observable<string | null> =
    this._recordHeaderState.isPublicRecord$
  affiliations$: Observable<number> = this._recordHeaderState.affiliations$
  displaySideBar$: Observable<boolean> = this._recordHeaderState.displaySideBar$
  displayBiography$: Observable<boolean> =
    this._recordHeaderState.displayBiography$
  recordSummaryOpen$: Observable<boolean> =
    this._recordHeaderState.recordSummaryOpen$

  constructor(
    private _router: Router,
    _platform: PlatformInfoService,
    @Inject(WINDOW) private window: Window,
    _userInfo: UserService,
    _togglz: TogglzService,
    location: Location,
    private _user: UserService,
    private _compactService: HeaderCompactService,
    private _recordHeaderState: RecordHeaderStateService
  ) {
    _router.events
      .pipe(filter((event: any) => event instanceof NavigationStart))
      .subscribe((val: NavigationStart) => {
        this.currentRoute = _router.url
        this.setChildOfCurrentRouteAsSecondaryMenu()
      })

    _platform.get().subscribe((data) => (this.platform = data))
    _userInfo.getUserSession().subscribe((data) => {
      this.user = data.userInfo
    })
    _togglz.getTogglz().subscribe((data) => {
      this.togglz = data
    })
    _togglz
      .getStateOf(TogglzFlag.WORDPRESS_HOME_PAGE)
      .pipe(
        tap((state) => {
          this.notWordpressDisplay = !state
        })
      )
      .subscribe()

    // Subscribe to compact header eligibility (shared service)
    this._compactService.eligible$.subscribe((eligible) => {
      this.compactEligible = eligible
    })
    this._compactService.compactActive$.subscribe(
      (active) => (this.isCompactActive = active)
    )

    _router.events.subscribe(() => {
      const path = location.path()
      this.signinRegisterButton =
        path !== `/${ApplicationRoutes.signin}` &&
        path !== `/${ApplicationRoutes.register}`
      this.hideMainMenu = path.indexOf(`/${ApplicationRoutes.home}`) !== -1
    })
  }

  ngOnInit() {}

  ngAfterViewInit() {}

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
        this.goto(button.route)
      } else {
        this.updateMenu(this.menu, treeLocation, true)
      }
    } else if (button.route !== undefined) {
      this.goto(button.route)
    }
  }

  onRecordSummaryOpenChange(val: boolean) {
    this._recordHeaderState.setRecordSummaryOpen(val)
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
      : 'null'
  }

  goto(route: string) {
    if (route === 'signin') {
      this._router.navigate([ApplicationRoutes.signin])
      this.mobileMenuState = false
    } else if (route === 'signout') {
      if (runtimeEnvironment.proxyMode) {
        this._user.noRedirectLogout().subscribe()
      }
      this.window.location.href = route
    } else {
      ;(this.window as any).outOfRouterNavigation(
        runtimeEnvironment.INFO_SITE + route
      )
    }
  }
}
