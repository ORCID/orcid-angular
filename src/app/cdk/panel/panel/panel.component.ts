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
  @Input() expandButtonsPosition: 'right' | 'left' = 'right'
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
  @Input() editable = true
  @Output() openStateChange = new EventEmitter<boolean>()

  _isPublicRecord: string
  @Input() set isPublicRecord(value: string) {
    this._isPublicRecord = value
    if (this._isPublicRecord) {
      this.editable = false
    }
  }
  get isPublicRecord() {
    return this._isPublicRecord
  }

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

  toggle() {
    this.openState = !this.openState
    this.openStateChange.next(this.openState)
  }
}
