import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'app-info-drop-down',
  templateUrl: './info-drop-down.component.html',
  styleUrls: [
    './info-drop-down.component.scss',
    './info-drop-down.component.scss-theme.scss',
  ],
})
export class InfoDropDownComponent implements OnInit {
  @Input() name
  @Input() description
  show = false
  constructor() {}

  ngOnInit(): void {}
}
