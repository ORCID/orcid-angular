import { Component, OnInit, Input } from '@angular/core'
import { Affiliation } from 'src/app/types'
import { ProfileService } from 'src/app/core'
import { combineLatest } from 'rxjs'
import { nestedListAnimation } from 'src/app/animations'

@Component({
  selector: 'app-profile-records-wrapper-affiliations',
  templateUrl: './profile-records-wrapper-affiliations.component.html',
  styleUrls: ['./profile-records-wrapper-affiliations.component.scss'],
  animations: [nestedListAnimation],
})
export class ProfileRecordsWrapperAffiliationsComponent implements OnInit {
  detailShowData: string
  detailShowLoader: string
  state = 'close'
  _affiliation
  @Input()
  set affiliation(value) {
    this._affiliation = value
    this.type = this.affiliation.defaultAffiliation.affiliationType.value
    this.disambiguatedAffiliationSourceId = this.affiliation.defaultAffiliation
      .disambiguatedAffiliationSourceId
      ? this.affiliation.defaultAffiliation.disambiguatedAffiliationSourceId
          .value
      : ''

    this.disambiguationSource = this.affiliation.defaultAffiliation
      .disambiguationSource
      ? this.affiliation.defaultAffiliation.disambiguationSource.value
      : ''

    this.putCode = this.affiliation.defaultAffiliation.putCode.value
  }

  get affiliation() {
    return this._affiliation
  }
  type
  disambiguationSource
  disambiguatedAffiliationSourceId
  @Input() putCode
  @Input() id
  @Input() orgDisambiguated
  @Input() detailShowOffline
  @Input() affiliationDetails

  constructor(private _profileService: ProfileService) {}

  ngOnInit() {}

  toggleDetails() {
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
}
