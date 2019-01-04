import { animate, style, transition, trigger } from '@angular/animations'
import { Component, OnInit, Input } from '@angular/core'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('enterAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(400, style({ opacity: 1 })),
      ]),
    ]),
  ],
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
