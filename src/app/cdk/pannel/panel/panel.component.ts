import { ComponentType } from '@angular/cdk/portal'
import { Component, OnInit, Input } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Assertion } from '../../../types'
import { ModalComponent } from '../../modal/modal/modal.component'

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
  constructor(private _dialog: MatDialog) {}

  ngOnInit(): void {
    if (this.editModalComponent){
      this._dialog.open(this.editModalComponent)
    }
  }

  openModal() {
    console.log('OPEN MODAL')
    this._dialog.open(this.editModalComponent)
  }
}
