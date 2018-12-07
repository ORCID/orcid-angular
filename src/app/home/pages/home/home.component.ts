import { Component, OnInit } from '@angular/core'
import { HostBinding } from '@angular/core'
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  tabletOrHandset
  constructor(_breakpointObserver: BreakpointObserver) {
    _breakpointObserver
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
