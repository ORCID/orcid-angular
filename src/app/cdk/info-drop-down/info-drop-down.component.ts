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
  @Input() signInUpdatesV1Togglz: boolean
  show = false

  ariaLabelShowDetailsFor = $localize`:@@shared.showDetailsFor:Show details for`
  ariaLabelHideDetailsFor = $localize`:@@shared.hideDetailsFor:Hide details for`



  constructor() {}

  ngOnInit(): void {}
}
