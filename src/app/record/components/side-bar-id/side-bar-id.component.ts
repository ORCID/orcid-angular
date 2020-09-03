import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'app-side-bar-id',
  templateUrl: './side-bar-id.component.html',
  styleUrls: [
    './side-bar-id.component.scss',
    './side-bar-id.component-scss-theme.scss',
  ],
})
export class SideBarIdComponent implements OnInit {
  @Input() id: string
  privateView = true
  constructor() {}

  ngOnInit(): void {}
}
