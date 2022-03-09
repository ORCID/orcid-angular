import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'

@Component({
  selector: 'app-settings-panels-expand-buttons',
  templateUrl: './settings-panels-expand-buttons.component.html',
  styleUrls: ['./settings-panels-expand-buttons.component.scss'],
})
export class PanelExpandButtonsComponent  {
  tooltipLabelShowDetails = $localize`:@@shared.showDetails:Show details`
  tooltipLabelHideDetails = $localize`:@@shared.hideDetails:Hide details`

  @Input() type: boolean
  @Input() openState: boolean
  @Output() toggle = new EventEmitter<void>()
  constructor() {}

}
