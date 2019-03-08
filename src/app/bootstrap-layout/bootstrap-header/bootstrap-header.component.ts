import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core'
import { environment } from 'src/environments/environment'
import { Router, NavigationEnd } from '@angular/router'
import { PlatformInfoService } from 'src/app/core'
import { filter } from 'rxjs/operators'

@Component({
  selector: 'app-bootstrap-header',
  templateUrl: './bootstrap-header.component.html',
  styleUrls: ['./bootstrap-header.component.scss'],
})
export class BootstrapHeaderComponent implements OnInit {
  currentRoute
  tabletOrHandset
  menu = {
    researchers: {
      route: '/',
      buttons: {
        signIn: {},
        signUp: {},
        learMore: {},
      },
    },
    organizations: {
      route: '.',
      hover: false,
      active: false,
      buttons: {
        funders: {},
        publishers: {},
        organizations: {},
        outreach: {},
        api: {},
      },
    },
    about: {
      route: '.',
      hover: false,
      active: false,
      buttons: {
        what: {},
        are: {},
        serve: {},
        membership: {},
        events: {},
      },
    },
    help: {
      route: '.',
      hover: false,
      active: false,
      buttons: {
        help: {},
        faq: {},
        base: {},
        feedback: {},
      },
    },
    signIn: {
      route: '.',
      hover: false,
      active: false,
    },
  }

  languageMenuOptions = environment.LANGUAGE_MENU_OPTIONS

  constructor(
    _router: Router,
    _platformInfo: PlatformInfoService,
    @Inject(LOCALE_ID) public locale: string
  ) {
    _router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe(val => {
        this.currentRoute = _router.url
        this.setChildOfCurrentRouteAsSecondaryMenu()
      })

    _platformInfo.get().subscribe(platformInfo => {
      console.log(platformInfo)
      this.tabletOrHandset = platformInfo.tabletOrHandset
    })
  }

  ngOnInit() {}

  mouseEnter(ul: string) {
    Object.keys(this.menu).forEach(button => {
      if (button === ul) {
        this.menu[button].hover = true
      } else {
        this.menu[button].hover = false
      }
    })
    this.menu[ul].hover = true
  }

  mouseLeave() {
    this.setChildOfCurrentRouteAsSecondaryMenu()
  }

  setChildOfCurrentRouteAsSecondaryMenu() {
    Object.keys(this.menu).forEach(button => {
      this.menu[button].hover = this.menu[button].route === this.currentRoute
    })
  }

  click(ul: string) {}

  changeLanguage(languageKey: string) {
    window.location.href = '/' + languageKey + '/'
  }
}
