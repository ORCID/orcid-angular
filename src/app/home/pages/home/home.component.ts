import { Component, OnInit } from '@angular/core'
import { HostBinding } from '@angular/core'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @HostBinding('class') class = 'mdc-layout-grid__inner'

  constructor() {}

  ngOnInit() {}
}
