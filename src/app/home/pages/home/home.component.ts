import { Component, OnInit } from '@angular/core'
import { HostBinding } from '@angular/core'
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout'
import { trigger } from '@angular/animations'
import { transition } from '@angular/animations'
import { query } from '@angular/animations'
import { style } from '@angular/animations'
import { stagger } from '@angular/animations'
import { animate } from '@angular/animations'

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
