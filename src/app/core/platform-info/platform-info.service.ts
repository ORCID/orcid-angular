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
    gridGutter: 12,
    gridColums: 12,
    gridMargin: '0 0',
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
        this.platform.gridGutter = GRID_GUTTER.handset
        this.platform.gridColums = GRID_COLUMNS.handset
        this.platform.gridMargin = this.gridMarginFromNumber(
          GRID_MARGINS.handset
        )
      } else {
        this.platform.handset = false
      }
      this.platformSubject.next(this.platform)
    })
    this._breakpointObserver.observe([Breakpoints.Tablet]).subscribe(state => {
      if (state.matches) {
        this.platform.tablet = true
        this.platform.gridGutter = GRID_GUTTER.tablet
        this.platform.gridColums = GRID_COLUMNS.tablet
        this.platform.gridMargin = this.gridMarginFromNumber(
          GRID_MARGINS.tablet
        )
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
          this.platform.gridGutter = GRID_GUTTER.desktop
          this.platform.gridColums = GRID_COLUMNS.desktop
          this.platform.gridMargin = this.gridMarginFromNumber(
            GRID_MARGINS.desktop
          )
        }
        this.platformSubject.next(this.platform)
      })
  }

  public gridMarginFromNumber(margin: number): string {
    return '0 ' + margin + 'px'
  }

  public get(): Observable<PlatformInfo> {
    return this.platformSubject.asObservable()
  }
}
