import { ComponentType } from '@angular/cdk/portal'
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
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
import { Affiliation } from 'src/app/types/record-affiliation.endpoint'
import { Funding } from 'src/app/types/record-funding.endpoint'
import { PeerReview } from '../../../types/record-peer-review.endpoint'
import { Work } from 'src/app/types/record-works.endpoint'
import { FormControl, FormGroup } from '@angular/forms'
import { RecordAffiliationService } from '../../../core/record-affiliations/record-affiliations.service'
import { RecordFundingsService } from '../../../core/record-fundings/record-fundings.service'
import { RecordWorksService } from '../../../core/record-works/record-works.service'
import { RecordPeerReviewService } from '../../../core/record-peer-review/record-peer-review.service'
import { RecordResearchResourceService } from '../../../core/record-research-resource/record-research-resource.service'
import { MatCheckboxChange } from '@angular/material/checkbox'
import { VerificationEmailModalService } from '../../../core/verification-email-modal/verification-email-modal.service'

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
    | Funding
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
  @Input() selectable = false
  @Input() checkbox = false
  _displayTheStack: boolean
  @Input()
  set displayTheStack(value: boolean) {
    this._displayTheStack = value
    this.displayTheStackChange.emit(value)
  }
  get displayTheStack(): boolean {
    return this._displayTheStack
  }
  @Output() displayTheStackChange = new EventEmitter<boolean>()
  @Output() openStateChange = new EventEmitter<boolean>()
  @Output() checkboxChangePanel = new EventEmitter<any>()

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

  @Input() isUserSource = false
  @Input() hasExternalIds: boolean
  @Input() userVersionPresent: boolean

  @Input() id: string
  @Input() email = false
  @Input() names = false
  selected: boolean

  formVisibility: FormGroup
  tooltipLabelEdit = $localize`:@@shared.edit:Edit`
  tooltipLabelMakeCopy = $localize`:@@shared.makeCopy:Make a copy and edit`
  tooltipLabelOpenSources = $localize`:@@shared.openSourceToEdit:Open sources to edit you own version`
  tooltipLabelYourOwnVersion = $localize`:@@shared.youCanOnlyEditYour:You can only edit your own version`

  panelForm: FormGroup

  constructor(
    private _dialog: MatDialog,
    private _platform: PlatformInfoService,
    private _affiliationService: RecordAffiliationService,
    private _fundingService: RecordFundingsService,
    private _peerReviewService: RecordPeerReviewService,
    private _researchResourcesService: RecordResearchResourceService,
    private _worksService: RecordWorksService,
    private _verificationEmailModalService: VerificationEmailModalService
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
    obj:
      | Assertion[]
      | Value
      | Address
      | Affiliation
      | Funding
      | PeerReview
      | Work
  ) {
    return Array.isArray(obj) && obj.length > 0
  }

  valueIsNotNull(obj: any) {
    return obj && (obj.value || obj.putCode)
  }

  openModal(options?: { createACopy: boolean }) {
    const primaryEmail = this.userRecord?.emails?.emails.find(
      (email) => email.primary
    )
    if (!primaryEmail?.verified) {
      if (this.email || this.names) {
        this.open(options)
      } else {
        this._verificationEmailModalService.openVerificationEmailModal(
          primaryEmail.value
        )
      }
    } else {
      this.open(options)
    }
  }

  open(options?: { createACopy: boolean }) {
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
          modalComponent.componentInstance.id = this.id
          modalComponent.componentInstance.options = options
          modalComponent.componentInstance.type = this.type
          modalComponent.componentInstance.affiliation = this.elements
          modalComponent.componentInstance.funding = this.elements
          modalComponent.componentInstance.work = this.elements
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

  checked(event: MatCheckboxChange) {
    this.checkboxChangePanel.emit({
      putCode: this.putCode,
      checked: event.checked,
    })
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
