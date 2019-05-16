import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { Platform } from '@angular/cdk/platform'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { PlatformInfo } from 'src/app/types/platform-info.local'
import { GRID_GUTTER, GRID_COLUMNS, GRID_MARGINS } from 'src/app/constants'

@Injectable({
  providedIn: 'root',
})
export class PlatformInfoService {
  platformSubject = new BehaviorSubject<PlatformInfo>(null)

  platform: PlatformInfo = {
    desktop: false,
    tabletOrHandset: false,
    tablet: false,
    handset: false,
    edge: false,
    ie: false,
    firefox: false,
    safary: false,
    colums4: false,
    colums8: false,
    colums12: false,
  }

  constructor(
    private _breakpointObserver: BreakpointObserver,
    private _platform: Platform
  ) {
    this.platform.firefox = _platform.FIREFOX
    this.platform.safary = _platform.SAFARI
    this.platform.ie = _platform.TRIDENT
    this.platform.edge = _platform.EDGE
    this.platformSubject.next(this.platform)

    this._breakpointObserver.observe([Breakpoints.Handset]).subscribe(state => {
      if (state.matches) {
        this.platform.handset = true
      } else {
        this.platform.handset = false
      }
      this.platformSubject.next(this.platform)
    })
    this._breakpointObserver.observe([Breakpoints.Tablet]).subscribe(state => {
      if (state.matches) {
        this.platform.tablet = true
      } else {
        this.platform.tablet = false
      }
      this.platformSubject.next(this.platform)
    })
    this._breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe(state => {
        if (state.matches) {
          this.platform.tabletOrHandset = true
          this.platform.desktop = false
        } else {
          this.platform.tabletOrHandset = false
          this.platform.desktop = true
        }
        this.platformSubject.next(this.platform)
      })

    this._breakpointObserver
      .observe(['(min-width: 839.99px)', '(min-width: 599.99px)'])
      .subscribe(state => {
        if (state.breakpoints['(min-width: 839.99px)']) {
          this.platform.colums8 = false
          this.platform.colums12 = true
          this.platform.colums4 = false
        } else if (state.breakpoints['(min-width: 599.99px)']) {
          this.platform.colums8 = true
          this.platform.colums12 = false
          this.platform.colums4 = false
        } else {
          this.platform.colums8 = false
          this.platform.colums12 = false
          this.platform.colums4 = true
        }
        this.platformSubject.next(this.platform)
      })
  }

  public get(): Observable<PlatformInfo> {
    return this.platformSubject.asObservable()
  }
}
