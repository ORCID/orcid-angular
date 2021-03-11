import { ComponentType } from '@angular/cdk/portal'
import { Component, Input, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Assertion } from '../../../types'
import {
  Address,
  Value,
  VisibilityStrings,
} from '../../../types/common.endpoint'
import { UserRecord } from '../../../types/record.local'
import { PlatformInfoService } from '../../platform-info'
import { first } from 'rxjs/operators'
import {
  Affiliation,
  AffiliationGroup,
} from 'src/app/types/record-affiliation.endpoint'

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss', 'panel.component.scss-theme.scss'],
})
export class PanelComponent implements OnInit {
  @Input() editModalComponent: ComponentType<any>
  @Input() elements: Assertion[] | Value | Address | Affiliation
  @Input() type: 'top-bar' | 'side-bar' | 'affiliations' | 'main'
  @Input() userRecord: UserRecord
  @Input() visibility: VisibilityStrings
  @Input() hasNestedPanels: false

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

  isArrayAndIsNotEmpty(obj: Assertion[] | Value | Address | Affiliation) {
    return Array.isArray(obj) && obj.length > 0
  }

  valueIsNotNull(obj: any) {
    return obj && (obj.value || obj.putCode)
  }

  openModal() {
    this._platform
      .get()
      .pipe(first())
      .subscribe((platform) => {
        if (this.editModalComponent) {
          this._dialog.open(this.editModalComponent, {
            width: '850px',
            maxWidth: platform.tabletOrHandset ? '95vw' : '80vw',
            data: this.userRecord,
          })
        }
      })
  }
}
