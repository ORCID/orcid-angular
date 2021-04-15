import { ComponentType } from '@angular/cdk/portal'
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Assertion, Work } from '../../../types'
import {
  Address,
  Value,
  VisibilityStrings,
} from '../../../types/common.endpoint'
import { UserRecord } from '../../../types/record.local'
import { PlatformInfoService } from '../../platform-info'
import { first } from 'rxjs/operators'
import { Affiliation } from 'src/app/types/record-affiliation.endpoint'
import { PeerReview } from '../../../types/record-peer-review.endpoint'

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss', 'panel.component.scss-theme.scss'],
})
export class PanelComponent implements OnInit {
  @Input() editModalComponent: ComponentType<any>
  @Input() elements:
    | Assertion[]
    | Value
    | Address
    | Affiliation
    | PeerReview
    | Work
    | any
  @Input() type:
    | 'top-bar'
    | 'side-bar'
    | 'affiliations'
    | 'peer-review'
    | 'main'
  @Input() userRecord: UserRecord
  @Input() visibility: VisibilityStrings
  @Input() hasNestedPanels: false
  @Input() customControls = false
  @Input() openState = true
  @Input() editable: boolean = true
  @Output() openStateChange = new EventEmitter<boolean>()

  @Input() isPublicRecord: string

  tooltipLabelShowDetails = $localize`:@@shared.showDetails:Show details`
  tooltipLabelHideDetails = $localize`:@@shared.hideDetails:Hide details`
  tooltipLabelEdit = $localize`:@@shared.edit:Edit`

  constructor(
    private _dialog: MatDialog,
    private _platform: PlatformInfoService
  ) {}

  ngOnInit(): void {}

  isArrayAndIsNotEmpty(
    obj: Assertion[] | Value | Address | Affiliation | PeerReview | Work
  ) {
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

  collapse() {
    this.openState = !this.openState
    this.openStateChange.next(this.openState)
  }
}
