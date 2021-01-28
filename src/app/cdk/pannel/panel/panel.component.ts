import { ComponentType } from '@angular/cdk/portal'
import { Component, OnInit, Input } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Platform } from 'puppeteer'
import { first } from 'rxjs/operators'
import { Assertion } from '../../../types'
import { ModalComponent } from '../../modal/modal/modal.component'
import { PlatformInfoService } from '../../platform-info'
import { ModalCountryComponent } from '../../side-bar/modals/modal-country/modal-country.component'

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

  ngOnInit(): void {
    if (this.editModalComponent == ModalCountryComponent) {
      this.openModal()
    }
  }

  openModal() {
    this._platform
      .get()
      .pipe(first())
      .subscribe((platform) => {
        if (this.editModalComponent) {
          this._dialog.open(this.editModalComponent, {
            maxWidth: platform.tabletOrHandset ? '95vw' : '80vw',
          })
        }
      })
  }
}
