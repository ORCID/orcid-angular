import { Component, OnInit, Input } from '@angular/core'
import { Affiliation } from 'src/app/types'
import { ProfileService, OrganizationsService } from 'src/app/core'
import { combineLatest } from 'rxjs'
import { nestedListAnimation } from 'src/app/animations'
import { AffiliationsService } from '../../../core/affiliations/affiliations.service'

@Component({
  selector: 'app-profile-activities-affiliation',
  templateUrl: './profile-activities-affiliation.component.html',
  styleUrls: ['./profile-activities-affiliation.component.scss'],
  animations: [nestedListAnimation],
})
export class ProfileRecordsAffiliationComponent implements OnInit {
  detailShowData: string
  detailShowLoader: string
  state = 'close'
  _affiliation
  @Input()
  set affiliation(value) {
    // console.log(JSON.stringify(value.affiliations[0]))
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
  affiliationDetails

  constructor(
    private _affiliationService: AffiliationsService,
    private _organizationsService: OrganizationsService
  ) {}

  ngOnInit() {}

  toggleDetails() {
    this.state = this.state === 'close' ? 'open' : 'close'
    if (this.state === 'open') {
      this.detailShowLoader = 'open'
      this.detailShowData = 'close'

      const combined = combineLatest(
        this._organizationsService.getOrgDisambiguated(
          this.disambiguationSource,
          this.disambiguatedAffiliationSourceId
        ),
        this._affiliationService.getAffiliationDetails(
          this.id,
          this.type,
          this.putCode
        )
      )

      combined.subscribe(
        response => {
          // console.log(JSON.stringify(response[1]))
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
