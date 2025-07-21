import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'

@Component({
  selector: 'app-panel-expand-buttons',
  templateUrl: './panel-expand-buttons.component.html',
  styleUrls: ['./panel-expand-buttons.component.scss'],
})
export class PanelExpandButtonsComponent implements OnInit {
  tooltipLabelShowDetails = $localize`:@@shared.showDetails:Show details`
  tooltipLabelHideDetails = $localize`:@@shared.hideDetails:Hide details`
  @Input() panelId: string
  @Input() type: boolean
  @Input() openState: boolean
  @Output() toggle = new EventEmitter<void>()
  @Input() panelTitle: string
  @Input() panelType:
    | 'top-bar'
    | 'side-bar'
    | 'affiliations'
    | 'employment'
    | 'education'
    | 'qualification'
    | 'invited-position'
    | 'distinction'
    | 'membership'
    | 'service'
    | 'peer-review'
    | 'sub-peer-review'
    | 'main'
    | 'works'
    | 'featured-works'
    | 'activities'
    | 'funding'
    | 'research-resources'
    | 'research-resources-stack'
    | 'professional-activities'
  constructor() {}

  ngOnInit(): void {}
}
