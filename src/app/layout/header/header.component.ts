import { Component, OnInit } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { filter } from 'rxjs/operators'
import { PlatformInfoService } from 'src/app/core'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  currentRoute
  platformInfo
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

  constructor(_router: Router, _platformInfo: PlatformInfoService) {
    _router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe(val => {
        this.currentRoute = _router.url
        this.setChildOfCurrentRouteAsSecondaryMenu()
      })

    _platformInfo.get().subscribe(platformInfo => {
      this.platformInfo = platformInfo
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
}
