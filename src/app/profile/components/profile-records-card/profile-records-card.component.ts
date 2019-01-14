import { Component, OnInit } from '@angular/core'

import { rotateAnimation, heightAnimation } from 'src/app/animations'
import { Input } from '@angular/core'
import { Affiliation } from '../../../types/affiliations.endpoint'
import { ProfileService } from 'src/app/core'
import { mergeMap } from 'rxjs/operators'
import { combineLatest } from 'rxjs'
import { OrgDisambiguated, AffiliationsDetails } from '../../../types'

@Component({
  selector: 'app-profile-records-card',
  templateUrl: './profile-records-card.component.html',
  styleUrls: ['./profile-records-card.component.scss'],
  animations: [rotateAnimation, heightAnimation],
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

  state = 'close'
  detailShowLoader = 'close'
  detailShowData = 'close'
  orgDisambiguated: OrgDisambiguated
  affiliationDetails: AffiliationsDetails
  constructor(private _profileService: ProfileService) {}

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

      combined.subscribe(response => {
        this.orgDisambiguated = response[0]
        this.affiliationDetails = response[1]
        this.detailShowLoader = 'close-with-none-opacity'
        this.detailShowData = 'open'
      })
    } else {
      this.detailShowLoader = 'close'
      this.detailShowData = 'close'
    }
  }
}
