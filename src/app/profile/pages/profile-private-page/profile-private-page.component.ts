import { Component, HostBinding, OnInit } from '@angular/core'

@Component({
  selector: 'app-profile-private-page',
  templateUrl: './profile-private-page.component.html',
  styleUrls: ['./profile-private-page.component.scss'],
})
export class ProfilePrivatePageComponent implements OnInit {
  @HostBinding('class.mdc-layout-grid__inner') grid = true

  constructor() {}

  ngOnInit() {}
}
