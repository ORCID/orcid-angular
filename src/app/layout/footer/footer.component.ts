import { Component, OnInit } from '@angular/core'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  tabletOrHandset
  constructor(private _breakpointObserver: BreakpointObserver) {
    this._breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe(state => {
        if (state.matches) {
          this.tabletOrHandset = true
        } else {
          this.tabletOrHandset = false
        }
      })
  }

  ngOnInit() {}
}
