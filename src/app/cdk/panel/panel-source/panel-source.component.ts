import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { PlatformInfoService } from '../../platform-info'
import { RecordAffiliationService } from '../../../core/record-affiliations/record-affiliations.service'
import { first } from 'rxjs/operators'
import { RecordFundingsService } from '../../../core/record-fundings/record-fundings.service'
import { RecordWorksService } from '../../../core/record-works/record-works.service'
import { RecordResearchResourceService } from '../../../core/record-research-resource/record-research-resource.service'
import { RecordPeerReviewService } from '../../../core/record-peer-review/record-peer-review.service'

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
  @Input() assertionOriginClientId
  @Input() stackLength
  @Input() putCode: string
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
  @Output() topPanelOfTheStackModeChange = new EventEmitter<void>()

  labelDeleteButton = $localize`:@@shared.delete:Delete`

  constructor(
    private _platformInfo: PlatformInfoService,
    private _recordAffiliationService: RecordAffiliationService,
    private _recordFundingsService: RecordFundingsService,
    private _recordWorksService: RecordWorksService,
    private _recordResearchResourceService: RecordResearchResourceService,
    private _recordPeerReviewService: RecordPeerReviewService
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
    switch (this.type) {
      case 'employment':
      case 'education':
      case 'qualification':
      case 'invited-position':
      case 'distinction':
      case 'membership':
      case 'service':
        this._recordAffiliationService
          .delete(this.putCode)
          .pipe(first())
          .subscribe()
        break
      case 'funding':
        this._recordFundingsService
          .delete(this.putCode)
          .pipe(first())
          .subscribe()
        break
      case 'works':
        this._recordWorksService.delete(this.putCode).pipe(first()).subscribe()
        break
      case 'research-resources':
        this._recordResearchResourceService
          .delete(this.putCode)
          .pipe(first())
          .subscribe()
        break
      case 'peer-review':
        this._recordPeerReviewService
          .delete(this.putCode)
          .pipe(first())
          .subscribe()
        break
    }
  }
}
