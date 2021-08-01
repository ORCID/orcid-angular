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
import { FormControl, FormGroup } from '@angular/forms'
import { RecordAffiliationService } from '../../../core/record-affiliations/record-affiliations.service'
import { RecordFundingsService } from '../../../core/record-fundings/record-fundings.service'
import { RecordWorksService } from '../../../core/record-works/record-works.service'
import { RecordPeerReviewService } from '../../../core/record-peer-review/record-peer-review.service'
import { RecordResearchResourceService } from '../../../core/record-research-resource/record-research-resource.service'

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss', 'panel.component.scss-theme.scss'],
})
export class PanelComponent implements OnInit {
  @Input() stackedHeader = false
  @Input() expandButtonsPosition: 'right' | 'left' = null
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
    | 'employment'
    | 'education'
    | 'qualification'
    | 'invited-position'
    | 'distinction'
    | 'membership'
    | 'service'
    | 'peer-review'
    | 'main'
    | 'works'
    | 'activities'
    | 'funding'
    | 'research-resources'
  @Input() userRecord: UserRecord
  @Input() putCode: any
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

  formVisibility: FormGroup
  tooltipLabelEdit = $localize`:@@shared.edit:Edit`

  constructor(
    private _dialog: MatDialog,
    private _platform: PlatformInfoService,
    private _affiliationService: RecordAffiliationService,
    private _fundingService: RecordFundingsService,
    private _peerReviewService: RecordPeerReviewService,
    private _researchResourcesService: RecordResearchResourceService,
    private _worksService: RecordWorksService
  ) {}

  ngOnInit(): void {
    if (this.type === 'peer-review' && this.elements) {
      this.putCode = []
      this.elements.peerReviewDuplicateGroups.forEach(
        (peerReviewDuplicateGroup) => {
          this.putCode.push(
            peerReviewDuplicateGroup.peerReviews[0].putCode.value
          )
          this.visibility =
            peerReviewDuplicateGroup.peerReviews[0].visibility.visibility
        }
      )
    }

    if (this.visibility) {
      this.formVisibility = new FormGroup({
        visibility: new FormControl(this.visibility),
      })
    }
  }

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
        let modalComponent
        if (this.editModalComponent) {
          modalComponent = this._dialog.open(this.editModalComponent, {
            width: '850px',
            maxWidth: platform.tabletOrHandset ? '95vw' : '80vw',
            data: this.userRecord,
          })
          modalComponent.componentInstance.type = this.type
          modalComponent.componentInstance.affiliation = this.elements
        }
      })
  }

  isAffiliation(): boolean {
    return (
      this.type === 'employment' ||
      this.type === 'education' ||
      this.type === 'qualification' ||
      this.type === 'invited-position' ||
      this.type === 'distinction' ||
      this.type === 'membership' ||
      this.type === 'service' ||
      this.type === 'funding' ||
      this.type === 'works' ||
      this.type === 'research-resources' ||
      this.type === 'peer-review'
    )
  }

  toggle() {
    this.openState = !this.openState
    this.openStateChange.next(this.openState)
  }

  updateVisibility() {
    switch (this.type) {
      case 'employment':
      case 'education':
      case 'qualification':
      case 'invited-position':
      case 'distinction':
      case 'membership':
      case 'service':
        this._affiliationService
          .updateVisibility(
            this.putCode,
            this.formVisibility.get('visibility').value
          )
          .subscribe()
        break
      case 'funding':
        this._fundingService
          .updateVisibility(
            this.putCode,
            this.formVisibility.get('visibility').value
          )
          .subscribe()
        break
      case 'works':
        this._worksService
          .updateVisibility(
            this.putCode,
            this.formVisibility.get('visibility').value
          )
          .subscribe()
        break
      case 'research-resources':
        this._researchResourcesService
          .updateVisibility(
            this.putCode,
            this.formVisibility.get('visibility').value
          )
          .subscribe()
        break
      case 'peer-review':
        this._peerReviewService
          .updateVisibility(
            this.putCode.join(),
            this.formVisibility.get('visibility').value
          )
          .subscribe()
        break
    }
  }
}
