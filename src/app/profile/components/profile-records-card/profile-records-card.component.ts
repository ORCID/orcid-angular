import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core'
import { combineLatest } from 'rxjs'
import {
  heightAnimation,
  rotateAnimation,
  heightAnimationDefaultOpen,
} from 'src/app/animations'
import { PlatformInfoService, ProfileService } from 'src/app/core'
import { AnimationEvent } from '@angular/animations'
import {
  AffiliationsDetails,
  OrgDisambiguated,
  Affiliation,
} from 'src/app/types'
import { HostListener } from '@angular/core'
import { Output } from '@angular/core'
import { EventEmitter } from '@angular/core'

@Component({
  selector: 'app-profile-records-card',
  templateUrl: './profile-records-card.component.html',
  styleUrls: ['./profile-records-card.component.scss'],
  animations: [rotateAnimation, heightAnimation, heightAnimationDefaultOpen],
})
export class ProfileRecordsCardComponent implements OnInit {
  @Input() id
  @Input() title
  @Input() subtitle
  @Input() startDate
  @Input() date
  @Input() endDate
  @Input() sourceName
  @Input() role
  @Input() type
  @Input() department
  @Input() disambiguationSource
  @Input() disambiguatedAffiliationSourceId
  @Input() putCode
  @Input() affiliationType
  @Input() stackState = 'open'
  @Input() state = 'close'
  @Input() isPreferred = true
  @Input() stackLength
  @Output() toggleDetails = new EventEmitter()
  detailShowOffline = 'close'
  detailShowLoader = 'close'
  detailShowData = 'close'
  orgDisambiguated: OrgDisambiguated
  affiliationDetails: AffiliationsDetails
  isHanset
  _stackMode

  @Output() stackModeChange = new EventEmitter()
  @Input()
  set stackMode(value) {
    this._stackMode = value
    this.stackModeChange.emit(value)
  }
  get stackMode() {
    return this._stackMode
  }

  constructor(
    private _profileService: ProfileService,
    private _platformInfo: PlatformInfoService,
    private ref: ChangeDetectorRef
  ) {
    this._platformInfo.getPlatformInfo().subscribe(info => {
      this.isHanset = info.handset
    })
  }

  ngOnInit() {}

  toggleStack() {
    this.stackState = this.stackState === 'open' ? 'close' : 'open'
  }

  toggleStackMode() {
    if (this.stackLength > 1) {
      this.stackMode = !this.stackMode
    }
  }
}
