import { Component, Input, OnInit } from '@angular/core'
import { heightAnimation } from 'src/app/animations'
import { AffiliationsDetails, OrgDisambiguated } from 'src/app/types'

@Component({
  selector: 'app-profile-records-card-detail',
  templateUrl: './profile-records-card-detail.component.html',
  styleUrls: ['./profile-records-card-detail.component.scss'],
  animations: [heightAnimation],
})
export class ProfileRecordsCardDetailComponent implements OnInit {
  _orgDisambiguated: OrgDisambiguated
  @Input() detailShowLoader
  @Input() detailShowData
  @Input() sourceType
  @Input() createdDate
  @Input() lastModified
  @Input() detailShowOffline
  @Input() url
  @Input('orgDisambiguated')
  set orgDisambiguated(value: OrgDisambiguated) {
    this._orgDisambiguated = value
    this.regionCityCountryPipe()
  }
  get orgDisambiguated(): OrgDisambiguated {
    return this._orgDisambiguated
  }

  @Input() affiliationDetails: AffiliationsDetails

  regionCityCountry
  constructor() {}

  ngOnInit() {}

  regionCityCountryPipe() {
    if (this.orgDisambiguated) {
      this.regionCityCountry = ''
      this.regionCityCountry += this.orgDisambiguated.region
        ? this.orgDisambiguated.region
        : ''
      this.regionCityCountry += this.orgDisambiguated.city
        ? this.orgDisambiguated.region
          ? ', ' + this.orgDisambiguated.city
          : this.orgDisambiguated.city
        : ''

      this.regionCityCountry += this.orgDisambiguated.country
        ? this.orgDisambiguated.city
          ? ', ' + this.orgDisambiguated.country
          : this.orgDisambiguated.country
        : ''
    }
  }

  isUrl(element) {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi
    const regex = new RegExp(expression)
    return element.match(regex)
  }
}
