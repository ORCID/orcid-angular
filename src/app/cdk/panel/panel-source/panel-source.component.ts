import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { PlatformInfoService } from '../../platform-info'
import { first } from 'rxjs/operators'
import { Affiliation } from '../../../types/record-affiliation.endpoint'
import { MatDialog } from '@angular/material/dialog'
import { ModalDeleteItemsComponent } from '../../../record/components/modals/modal-delete-item/modal-delete-items.component'
import { Funding } from '../../../types/record-funding.endpoint'
import { ResearchResource } from '../../../types/record-research-resources.endpoint'
import { Work } from '../../../types/record-works.endpoint'
import { PeerReview } from '../../../types/record-peer-review.endpoint'
import { VerificationEmailModalService } from 'src/app/core/verification-email-modal/verification-email-modal.service'

@Component({
  selector: 'app-panel-source',
  templateUrl: './panel-source.component.html',
  styleUrls: ['./panel-source.component.scss'],
  preserveWhitespaces: true,
})
export class PanelSourceComponent implements OnInit {
  @Input() isPublicRecord
  @Input() isPreferred = true
  @Input() sourceName
  @Input() assertionOriginOrcid
  @Input() assertionOriginName
  @Input() stackLength
  @Input() item: Affiliation | Funding | ResearchResource | Work | PeerReview
  @Input() type:
    | 'employment'
    | 'education'
    | 'qualification'
    | 'invited-position'
    | 'distinction'
    | 'membership'
    | 'service'
    | 'funding'
    | 'works'
    | 'activities'
    | 'research-resources'
    | 'peer-review'
  _displayTheStack
  _displayAsMainStackCard
  @Input()
  set displayTheStack(value: boolean) {
    this._displayTheStack = value
    this.displayTheStackChange.emit(value)
  }
  get displayTheStack(): boolean {
    return this._displayTheStack
  }
  @Output() displayTheStackChange = new EventEmitter<boolean>()
  isHandset: boolean

  @Output() makePrimary = new EventEmitter<void>()
  @Input() topPanelOfTheStackMode: boolean
  @Input() clickableSource = true
  @Input() userRecord
  @Output() topPanelOfTheStackModeChange = new EventEmitter<void>()

  labelDeleteButton = $localize`:@@shared.delete:Delete`

  constructor(
    private _verificationEmailModalService: VerificationEmailModalService,
    private _dialog: MatDialog,
    private _platformInfo: PlatformInfoService
  ) {
    this._platformInfo.get().subscribe((person) => {
      this.isHandset = person.handset
    })
  }
  ngOnInit(): void {}

  toggleStackMode() {
    if (this.stackLength > 1) {
      this.displayTheStack = !this.displayTheStack
    }
  }

  clickMakePrimary() {
    this.makePrimary.next()
  }

  clickDisplayAsTopPanelOfTheStack() {
    this.topPanelOfTheStackModeChange.next()
  }

  delete() {
    const primaryEmail = this.userRecord?.emails?.emails?.find(
      (email) => email.primary
    )
    if (primaryEmail && !primaryEmail.verified) {
      this._verificationEmailModalService.openVerificationEmailModal(
        primaryEmail.value
      )
    } else {
      this._platformInfo
        .get()
        .pipe(first())
        .subscribe((platform) => {
          let modalComponent
          modalComponent = this._dialog.open(ModalDeleteItemsComponent, {
            width: '850px',
            maxWidth: platform.tabletOrHandset ? '99%' : '80vw',
          })

          modalComponent.componentInstance.type = this.type
          modalComponent.componentInstance.item = this.item
        })
    }
  }
}
