import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'app-info-drop-down',
  templateUrl: './info-drop-down.component.html',
  styleUrls: [
    './info-drop-down.component.scss',
    './info-drop-down.component.scss-theme.scss',
  ],
})
export class InfoDropDownComponent  {
  @Input() name
  @Input() description
  show = false
  constructor() {}

}
