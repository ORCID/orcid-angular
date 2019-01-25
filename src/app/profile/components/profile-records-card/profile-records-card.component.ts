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

@Component({
  selector: 'app-profile-records-card',
  templateUrl: './profile-records-card.component.html',
  styleUrls: ['./profile-records-card.component.scss'],
  animations: [rotateAnimation, heightAnimation, heightAnimationDefaultOpen],
})
export class ProfileRecordsCardComponent implements OnInit {
  @Input() id
  @Input() title
  @Input() startDate
  @Input() endDate
  @Input() role
  @Input() type
  @Input() department
  @Input() disambiguationSource
  @Input() disambiguatedAffiliationSourceId
  @Input() putCode
  @Input() affiliationType
  @Input() lastModified
  @Input() createdDate
  @Input() stackMode = true
  @Input() stackState = 'open'
  state = 'close'
  detailShowOffline = 'close'
  detailShowLoader = 'close'
  detailShowData = 'close'
  orgDisambiguated: OrgDisambiguated
  affiliationDetails: AffiliationsDetails
  isHanset

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

  toggle(affiliation: Affiliation) {
    this.state = this.state === 'close' ? 'open' : 'close'
    if (this.state === 'open') {
      this.detailShowLoader = 'open'
      this.detailShowData = 'close'

      const combined = combineLatest(
        this._profileService.getOrgDisambiguated(
          this.disambiguationSource,
          this.disambiguatedAffiliationSourceId
        ),
        this._profileService.getAffiliationDetails(
          this.id,
          this.type,
          this.putCode
        )
      )

      combined.subscribe(
        response => {
          this.orgDisambiguated = response[0]
          this.affiliationDetails = response[1]
          this.detailShowLoader = 'close-with-none-opacity'
          this.detailShowData = 'open'
          this.detailShowOffline = 'close'
        },
        error => {
          if (error.status === 0) {
            this.detailShowOffline = 'open'
            this.detailShowLoader = 'close'
            this.detailShowData = 'close'
          }
        }
      )
    } else {
      this.detailShowLoader = 'close'
      this.detailShowData = 'close'
      this.detailShowOffline = 'close'
    }
  }

  onAnimationEvent(event: AnimationEvent) {
    // TODO add info about this quick fix for 'first sort' problems with animations
    if (event.toState === 'void' && this.state === 'open') {
      this.state = 'close'
    }
    if (
      event.triggerName === 'heightAnimationDefaultOpenState' &&
      event.toState === 'void' &&
      this.stackState === 'close'
    ) {
      console.log(event)
      this.stackState = 'open'
    }
  }

  toggleStack() {
    console.log('toggle!')
    this.stackState = this.stackState === 'open' ? 'close' : 'open'
  }
}
