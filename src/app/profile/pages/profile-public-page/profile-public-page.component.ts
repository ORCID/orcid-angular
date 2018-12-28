import { Component, OnInit } from '@angular/core'
import { HostBinding } from '@angular/core'

@Component({
  selector: 'app-profile-public-page',
  templateUrl: './profile-public-page.component.html',
  styleUrls: ['./profile-public-page.component.scss'],
})
export class ProfilePublicPageComponent implements OnInit {
  @HostBinding('class.mdc-layout-grid__inner') grid = true
  constructor() {}

  ngOnInit() {}
}
