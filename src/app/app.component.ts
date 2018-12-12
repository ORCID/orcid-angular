import { Component } from '@angular/core'
import { BreakpointObserver } from '@angular/cdk/layout'
import { Breakpoints } from '@angular/cdk/layout'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ng-orcid'
  tablet
  handset
  constructor(private _breakpointObserver: BreakpointObserver) {
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
