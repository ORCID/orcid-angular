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

  onAnimationEvent(event: AnimationEvent) {
    // This is a quick fix to solve the current Angular animation problem with ngFor animations on reordering actions.
    // https://github.com/angular/angular/issues/18847
    // The problem:
    // When a list display by a ngFor is reordered, the animation state of the repositioned
    // elements are going to change to void, this only happens the first time the element is moved.
    // More info about this problem can be found on src/animations.ts

    if (event.toState === 'void' && this.state === 'open') {
      console.log(event)
      this.state = 'close'
    }
    if (
      event.triggerName === 'heightAnimationDefaultOpenState' &&
      event.toState === 'void' &&
      this.stackState === 'close'
    ) {
      this.stackState = 'open'
    }
  }

  toggleStack() {
    this.stackState = this.stackState === 'open' ? 'close' : 'open'
  }

  toggleStackMode() {
    if (this.stackLength > 1) {
      this.stackMode = !this.stackMode
    }
  }
}
