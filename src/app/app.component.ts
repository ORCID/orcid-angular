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
  mobile
  constructor(private _breakpointObserver: BreakpointObserver) {
    this._breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe(state => {
        if (state.matches) {
          this.mobile = true
        } else {
          this.mobile = false
        }
      })
  }
}
