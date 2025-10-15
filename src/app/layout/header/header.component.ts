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

import { ApplicationRoutes, isValidOrcidFormat } from '../../constants'
import { menu } from './menu'
import { of } from 'rxjs'

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
  compactFeatureEnabled = false // feature flag
  compactEligible = false // flag + is a public page
  isCompactActive = false // scroll-based state
  @ViewChild('headerEl') headerEl: ElementRef<HTMLElement>
  private expandedHeaderHeight = 0 // snapshot of header height in expanded state

  constructor(
    private _router: Router,
    _platform: PlatformInfoService,
    @Inject(WINDOW) private window: Window,
    private _hostEl: ElementRef<HTMLElement>,
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
      // Recalculate scroll state when platform (breakpoint) changes
      this.updateCompactScrollState()
      // Refresh snapshot when not compact to keep compensation accurate
      if (!this.isCompactActive) {
        this.measureExpandedHeaderHeight()
      }
    })
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

    // Subscribe to compact header feature flag
    _togglz
      .getStateOf(TogglzFlag.HEADER_COMPACT)
      .pipe(
        tap((state) => {
          this.compactFeatureEnabled = state
          // Re-evaluate eligibility and scroll state on flag changes
          this.updateCompactEligibilityFromPath(this._router.url)
          this.updateCompactScrollState()
        })
      )
      .subscribe()

    _router.events.subscribe(() => {
      const path = location.path()
      this.signinRegisterButton =
        path !== `/${ApplicationRoutes.signin}` &&
        path !== `/${ApplicationRoutes.register}`
      this.hideMainMenu = path.indexOf(`/${ApplicationRoutes.home}`) !== -1
      // Re-evaluate eligibility on route changes and update scroll state
      this.updateCompactEligibilityFromPath(this._router.url)
      this.updateCompactScrollState()
    })
  }

  ngOnInit() {}

  ngAfterViewInit() {
    // Snapshot the expanded header height after first render
    Promise.resolve().then(() => this.measureExpandedHeaderHeight())
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.updateCompactScrollState()
  }

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

  private updateCompactEligibilityFromPath(path: string) {
    // Derive first segment (base path) without query/hash
    const clean = (path || '/').split('?')[0].split('#')[0]
    const base = clean.split('/')[1] || ''
    this.compactEligible =
      this.compactFeatureEnabled && isValidOrcidFormat(base)
  }

  private updateCompactScrollState() {
    if (!this.compactEligible) {
      this.isCompactActive = false
      return
    }
    const threshold = this.platform && this.platform.columns12 ? 142 : 138
    const y =
      (this.window &&
        (this.window.scrollY || (this.window as any).pageYOffset)) ||
      0
    // When the header toggles compact state, its height changes which
    // modifies the browser's scrollY.
    // We compensate by adding the difference between the expanded and compact header heights while compact is active.
    const adjustedY = this.getAdjustedScrollY(y)
    // Simple hysteresis to avoid jitter
    const buffer = 3
    const enter = threshold + buffer
    const exit = threshold - buffer
    const nextState = this.isCompactActive
      ? adjustedY > exit
      : adjustedY >= enter
    if (nextState !== this.isCompactActive) {
      this.isCompactActive = nextState
    }
  }

  private getAdjustedScrollY(rawY: number): number {
    // If we haven't measured the expanded height yet, use rawY.
    if (!this.expandedHeaderHeight) return rawY
    const compactHeight = 72
    // Delta is the constant difference between expanded and compact heights.
    const delta = Math.max(0, this.expandedHeaderHeight - compactHeight)
    // Only compensate while compact is active
    return this.isCompactActive ? rawY + delta : rawY
  }

  private measureExpandedHeaderHeight() {
    // Measure only when not compact to capture the expanded state height accurately.
    if (this.isCompactActive) return
    // On mobile, use the entire component host (app-header) height so the
    // measurement includes mobile-only elements outside the inner <header>.
    if (!this.platform || !this.platform.columns12) {
      this.expandedHeaderHeight =
        this._hostEl.nativeElement.getBoundingClientRect().height
      return
    }
    if (this.headerEl && this.headerEl.nativeElement) {
      this.expandedHeaderHeight =
        this.headerEl.nativeElement.getBoundingClientRect().height
    }
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
