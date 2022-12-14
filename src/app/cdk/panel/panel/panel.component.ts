import { ComponentType } from '@angular/cdk/portal'
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core'
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
import { RecordAffiliationService } from '../../../core/record-affiliations/record-affiliations.service'
import { RecordFundingsService } from '../../../core/record-fundings/record-fundings.service'
import { RecordWorksService } from '../../../core/record-works/record-works.service'
import { RecordPeerReviewService } from '../../../core/record-peer-review/record-peer-review.service'
import { RecordResearchResourceService } from '../../../core/record-research-resource/record-research-resource.service'
import { MatCheckboxChange } from '@angular/material/checkbox'
import { VerificationEmailModalService } from '../../../core/verification-email-modal/verification-email-modal.service'
import { UserService } from 'src/app/core'
import { WINDOW } from 'src/app/cdk/window'
import { TogglzService } from '../../../core/togglz/togglz.service'
import { getAriaLabelledBy } from '../../../constants'

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss', 'panel.component.scss-theme.scss'],
})
export class PanelComponent implements OnInit {
  @Input() panelId
  @Input() showVisibilityControl = false
  @Input() stackSiblings: any[]
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
  @Input() defaultPutCode: any
  @Input() putCode: any
  @Input() visibility: VisibilityStrings
  @Input() visibilityError: boolean

  @Input() hasNestedPanels: false
  @Input() customControls = false
  @Input() openState = true
  @Input() editable = true
  @Input() selectable = false
  @Input() selectAll = false
  @Input() checkbox = false
  @Input() panelTitle: any
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
  togglzPeerReviews: boolean

  tooltipLabelEdit = $localize`:@@shared.edit:Edit`
  tooltipLabelMakeCopy = $localize`:@@shared.makeCopy:Make a copy and edit`
  tooltipLabelOpenSources = $localize`:@@shared.openSourceToEdit:Open sources to edit you own version`
  tooltipLabelYourOwnVersion = $localize`:@@shared.youCanOnlyEditYour:You can only edit your own version`
  tooltipLabelVisibilityError = $localize`:@@peerReview.dataInconsistency:Data inconsistency found. Please click your preferred visibility setting to fix`
  openOtherSources = $localize`:@@record.openOtherSources:Open other sources`

  constructor(
    private _togglz: TogglzService,
    private _dialog: MatDialog,
    private _platform: PlatformInfoService,
    private _userService: UserService,
    private _affiliationService: RecordAffiliationService,
    private _fundingService: RecordFundingsService,
    private _peerReviewService: RecordPeerReviewService,
    private _researchResourcesService: RecordResearchResourceService,
    private _worksService: RecordWorksService,
    private _verificationEmailModalService: VerificationEmailModalService,
    @Inject(WINDOW) private _window: Window
  ) {}

  ngOnInit(): void {
    this._togglz
      .getStateOf('ORCID_ANGULAR_LAZY_LOAD_PEER_REVIEWS')
      .subscribe((value) => (this.togglzPeerReviews = value))
    if (!this.panelTitle) {
      this.panelTitle = ''
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
    const primaryEmail = this.userRecord?.emails?.emails?.find(
      (email) => email.primary
    )
    if (primaryEmail && !primaryEmail.verified) {
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
            maxWidth: platform.tabletOrHandset ? '99%' : '80vw',
            data: this.userRecord,
            ariaLabelledBy: getAriaLabelledBy(
              this.editModalComponent,
              this.type
            ),
          })
          modalComponent.componentInstance.id = this.id
          modalComponent.componentInstance.options = options
          modalComponent.componentInstance.type = this.type
          modalComponent.componentInstance.affiliation = this.elements
          modalComponent.componentInstance.funding = this.elements
          modalComponent.componentInstance.work = this.elements
          modalComponent.componentInstance.userRecord = this.userRecord
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

  updateVisibility(visibility: VisibilityStrings) {
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
            this.stackSiblings.reduce(
              (p, c) => p + (c.putCode as Value).value + `,`,
              ''
            ),
            visibility
          )
          .subscribe()
        break
      case 'funding':
        this._fundingService
          .updateVisibility(
            this.stackSiblings.reduce(
              (p, c) => p + (c.putCode as Value).value + `,`,
              ''
            ),
            visibility
          )
          .subscribe()
        break
      case 'works':
        this._worksService
          .updateVisibility(
            this.stackSiblings.reduce(
              (p, c) => p + (c.putCode as Value).value + `,`,
              ''
            ),
            visibility
          )
          .subscribe()
        break
      case 'research-resources':
        this._researchResourcesService
          .updateVisibility(
            this.stackSiblings.reduce(
              (p, c) => p + (c.putCode as Value) + `,`,
              ''
            ),
            visibility
          )
          .subscribe()
        break
      case 'peer-review':
        const peerReviewPutCodes = []
        if (this.elements) {
          if (this.togglzPeerReviews) {
            this.elements.putCodes.forEach((putCode) => {
              peerReviewPutCodes.push(putCode)
            })
          } else {
            this.elements.peerReviewDuplicateGroups.forEach(
              (peerReviewDuplicateGroup) => {
                peerReviewDuplicateGroup.peerReviews.forEach((peerReview) => {
                  peerReviewPutCodes.push(peerReview.putCode.value)
                })
              }
            )
          }
        }
        this._peerReviewService
          .updateVisibility(
            peerReviewPutCodes.join(),
            visibility,
            this.elements?.groupId
          )
          .subscribe()
        break
    }
  }
}
