import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'

@Component({
  selector: 'app-panel-expand-buttons',
  templateUrl: './panel-expand-buttons.component.html',
  styleUrls: ['./panel-expand-buttons.component.scss'],
})
export class PanelExpandButtonsComponent implements OnInit {
  tooltipLabelShowDetails = $localize`:@@shared.showDetails:Show details`
  tooltipLabelHideDetails = $localize`:@@shared.hideDetails:Hide details`

  @Input() type: boolean
  @Input() openState: boolean
  @Output() toggle = new EventEmitter<void>()
  constructor() {}

  ngOnInit(): void {}
}
