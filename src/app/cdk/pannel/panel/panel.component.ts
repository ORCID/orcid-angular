import { ComponentType } from '@angular/cdk/portal'
import { Component, Input, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'

import { Assertion } from '../../../types'
import { PlatformInfoService } from '../../platform-info'

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss', 'panel.component.scss-theme.scss'],
})
export class PanelComponent implements OnInit {
  @Input() elements: Assertion[]
  @Input() editModalComponent: ComponentType<any>
  tooltipLabelShowDetails = $localize`:@@shared.showDetails:Show details`
  tooltipLabelHideDetails = $localize`:@@shared.hideDetails:Hide details`
  tooltipLabelEdit = $localize`:@@shared.edit:Edit`
  openState = false
  editable = true
  constructor(
    private _dialog: MatDialog,
    private _platform: PlatformInfoService
  ) {}

  ngOnInit(): void {}

  openModal() {
    if (this.editModalComponent) {
      this._dialog.open(this.editModalComponent)
    }
  }
}
