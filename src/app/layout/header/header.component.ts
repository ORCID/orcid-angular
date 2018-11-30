import { Component, OnInit } from '@angular/core'
import { Router, NavigationEnd } from '@angular/router'
import { filter } from 'rxjs/operators'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  private currentRoute
  private menu = {
    researchers: {
      hover: true,
      route: '/',
      buttons: {
        signIn: {},
        signUp: {},
        learMore: {},
      },
    },
    organizations: {
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
      hover: false,
      active: false,
    },
  }
  constructor(router: Router) {
    router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe(val => {
        this.currentRoute = router.url
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
    Object.keys(this.menu).forEach(button => {
      this.menu[button].hover = this.menu[button].route === this.currentRoute
    })
  }

  click(ul: string) {}
}
