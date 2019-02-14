import { Component, OnInit, Input } from '@angular/core'
import { Affiliation, AffiliationGroup } from 'src/app/types'
import { ProfileService, OrganizationsService } from 'src/app/core'
import { combineLatest } from 'rxjs'
import { nestedListAnimation, itemMarginAnimation } from 'src/app/animations'
import { AffiliationsService } from '../../../core/affiliations/affiliations.service'
import { first } from 'rxjs/operators'

@Component({
  selector: 'app-profile-activities-affiliation',
  templateUrl: './profile-activities-affiliation.component.html',
  styleUrls: ['./profile-activities-affiliation.component.scss'],
  animations: [nestedListAnimation, itemMarginAnimation],
})
export class ProfileRecordsAffiliationComponent implements OnInit {
  _affiliationStack
  @Input()
  set affiliationStack(value: AffiliationGroup) {
    this._affiliationStack = value
    value.affiliations.forEach(affiliation => {
      this.affiliationCardState[affiliation.putCode.value] = {
        stackState: this.isPrefered(affiliation) ? 'open' : 'close',
      }
      this.affiliationDetailsState[affiliation.putCode.value] = {
        detailShowData: 'close',
        detailShowLoader: 'close',
        detailShowOffline: 'close',
        state: 'close',
      }
    })
  }

  get affiliationStack(): AffiliationGroup {
    return this._affiliationStack
  }
  @Input() id
  detailShowData: string
  detailShowLoader: string
  affiliationDetailsState = {}
  affiliationCardState = {}
  orgDisambiguated = {}
  detailShowOffline
  stackMode = false

  constructor(
    private _affiliationService: AffiliationsService,
    private _organizationsService: OrganizationsService
  ) {}

  ngOnInit() {}

  isPrefered(affiliation: Affiliation) {
    const response =
      affiliation && this.affiliationStack
        ? this.affiliationStack.defaultAffiliation.putCode.value ===
          affiliation.putCode.value
        : false
    return response
  }

  onClick(affiliation) {
    Object.keys(this.affiliationCardState).forEach(key => {
      this.affiliationCardState[key].stackState = 'close'
    })
    this.affiliationCardState[affiliation.putCode.value].stackState =
      this.affiliationCardState[affiliation.putCode.value].stackState === 'open'
        ? 'close'
        : 'open'
  }

  toggleDetails(id: string, affiliation: Affiliation) {
    const putCode = affiliation.putCode.value
    this.affiliationDetailsState[putCode].state =
      this.affiliationDetailsState[putCode].state === 'close' ? 'open' : 'close'
    if (this.affiliationDetailsState[putCode].state === 'open') {
      this.affiliationDetailsState[putCode].detailShowLoader = 'open'
      this.affiliationDetailsState[putCode].detailShowData = 'close'

      const combined = combineLatest(
        this._organizationsService.getOrgDisambiguated(
          affiliation.disambiguationSource.value,
          affiliation.disambiguatedAffiliationSourceId.value
        ),
        this._affiliationService.getAffiliationsDetails(
          id,
          affiliation.affiliationType.value,
          putCode
        )
      )

      combined.pipe(first()).subscribe(
        response => {
          this.orgDisambiguated[putCode] = response[0]
          this.affiliationDetailsState[putCode].detailShowLoader =
            'close-with-none-opacity'
          this.affiliationDetailsState[putCode].detailShowData = 'open'
          this.affiliationDetailsState[putCode].detailShowOffline = 'close'
        },
        error => {
          if (error.status === 0) {
            this.affiliationDetailsState[putCode].detailShowOffline = 'open'
            this.affiliationDetailsState[putCode].detailShowLoader = 'close'
            this.affiliationDetailsState[putCode].detailShowData = 'close'
          }
        }
      )
    } else {
      this.affiliationDetailsState[putCode].detailShowLoader = 'close'
      this.affiliationDetailsState[putCode].detailShowData = 'close'
      this.affiliationDetailsState[putCode].detailShowOffline = 'close'
    }
  }

  /**
   * RegEx funtion to check if the elements contains a URL
   */
  isUrl(element) {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi
    const regex = new RegExp(expression)
    return element.match(regex)
  }
}
