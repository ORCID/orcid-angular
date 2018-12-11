import { Component } from '@angular/core'
import { BreakpointObserver } from '@angular/cdk/layout'
import { Breakpoints } from '@angular/cdk/layout'
import { Platform } from '@angular/cdk/platform'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ng-orcid'
  tablet
  handset
  ie
  edge
  constructor(
    private _breakpointObserver: BreakpointObserver,
    private _platform: Platform
  ) {
    this.ie = _platform.TRIDENT
    this.edge = _platform.EDGE
    console.log(_platform)
    this._breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe(state => {
        if (state.matches) {
          this.handset = true
        } else {
          this.handset = false
        }
      })
    this._breakpointObserver.observe([Breakpoints.Tablet]).subscribe(state => {
      if (state.matches) {
        this.tablet = true
      } else {
        this.tablet = false
      }
    })
  }
}
