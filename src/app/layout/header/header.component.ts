import { Component, OnInit } from '@angular/core'
import { Router, NavigationEnd } from '@angular/router'
import { filter } from 'rxjs/operators'
import { BreakpointObserver } from '@angular/cdk/layout'
import { Breakpoints } from '@angular/cdk/layout'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  private currentRoute
  private mobile
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
  constructor(_router: Router, _breakpointObserver: BreakpointObserver) {
    _router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe(val => {
        this.currentRoute = _router.url
      })
    _breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe(state => {
        if (state.matches) {
          this.mobile = true
        } else {
          this.mobile = false
        }
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
