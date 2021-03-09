import { ThrowStmt } from '@angular/compiler'
import { Component, Input, OnInit } from '@angular/core'
import { combineLatest, Observable, of } from 'rxjs'
import { first } from 'rxjs/operators'
import { OrganizationsService } from 'src/app/core'
import { RecordAffiliationService } from 'src/app/core/record-affiliations/record-affiliations.service'
import { OrgDisambiguated } from 'src/app/types'
import {
  Affiliation,
  AffiliationGroup,
} from 'src/app/types/record-affiliation.endpoint'

@Component({
  selector: 'app-affiliation-stack',
  templateUrl: './affiliation-stack.component.html',
  styleUrls: ['./affiliation-stack.component.scss'],
})
export class AffiliationStackComponent implements OnInit {
  _affiliationStack: AffiliationGroup
  affiliationDetailsState: {
    [key: string]: {
      detailShowData: boolean
      detailShowLoader: boolean
      state: boolean
    }
  } = {}
  stackCardsState: { [key: string]: { stackState: boolean } } = {}
  orgDisambiguated: { [key: string]: OrgDisambiguated | null } = {}
  stackMode = false

  constructor(
    private _affiliationService: RecordAffiliationService,
    private _organizationsService: OrganizationsService
  ) {}

  @Input()
  set affiliationStack(value: AffiliationGroup) {
    console.log('SET AFFILIATION STACK')

    this._affiliationStack = value
    value.affiliations.forEach((affiliation) => {
      if (this.stackCardsState[affiliation.putCode.value] === undefined){
        this.stackCardsState[affiliation.putCode.value] = {
          stackState: this.isPreferred(affiliation) ? true : false,
        }
      }
      if (
        this.affiliationDetailsState[affiliation.putCode.value] === undefined
      ) {
        this.affiliationDetailsState[affiliation.putCode.value] = {
          detailShowData: false,
          detailShowLoader: false,
          state: false,
        }
      }
    })
  }

  get affiliationStack(): AffiliationGroup {
    return this._affiliationStack
  }

  isPreferred(affiliation: Affiliation) {
    const response =
      affiliation && this.affiliationStack
        ? this.affiliationStack.defaultAffiliation.putCode.value ===
          affiliation.putCode.value
        : false
    return response
  }

  toggleDetails(affiliation: Affiliation) {
    console.log('TOGGLE DETAILS')

    const putCode = affiliation.putCode.value

    // Only if is not loading execute user request
    if (!this.affiliationDetailsState[putCode].detailShowLoader) {
      // Change current state
      this.affiliationDetailsState[putCode].state = !this
        .affiliationDetailsState[putCode].state

      // If is opening calls the server for the affiliation details
      if (this.affiliationDetailsState[putCode].state) {
        this.affiliationDetailsState[putCode].detailShowLoader = true
        this.affiliationDetailsState[putCode].detailShowData = true

        const combined = []

        let $affiliationDisambiguationSource: Observable<
          false | OrgDisambiguated
        > = of(false)
        // Adds call for disambiguationSource if the affiliation has
        if (affiliation.disambiguationSource) {
          $affiliationDisambiguationSource = this._organizationsService.getOrgDisambiguated(
            affiliation.disambiguationSource.value,
            affiliation.disambiguatedAffiliationSourceId.value
          )
        }
        const $affiliationDetails = this._affiliationService.getAffiliationsDetails(
          affiliation.affiliationType.value,
          putCode
        )

        // Call http requests at the same time
        combineLatest([$affiliationDisambiguationSource, $affiliationDetails])
          .pipe(first())
          .subscribe(
            (response) => {
              console.log(response)

              this.orgDisambiguated[putCode] = response[0] || null
              this.affiliationDetailsState[putCode].detailShowData = true
              this.affiliationDetailsState[putCode].detailShowLoader = false
            },
            (error) => {
              if (error.status === 0) {
                // this.affiliationDetailsState[putCode].detailShowLoader = false
                // this.affiliationDetailsState[putCode].detailShowData = false
              }
            }
          )
      } else {
        this.affiliationDetailsState[putCode].detailShowLoader = false
        this.affiliationDetailsState[putCode].detailShowData = false
      }
    }
  }

  makePrimaryCard(affiliation: Affiliation) {
    console.log(this.stackCardsState)
  }

  changeStackDisplayedCard(affiliation: Affiliation) {
    console.log(affiliation);
    
    Object.keys(this.stackCardsState).forEach((key) => {
      this.stackCardsState[key].stackState = false
    })
    this.stackCardsState[affiliation.putCode.value].stackState = true
  }

  /**
   * RegEx funtion to check if the elements contains a URL
   */
  isUrl(element) {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi
    const regex = new RegExp(expression)
    return element.match(regex)
  }

  trackByAffiliationStack(index, item: Affiliation) {
    return item.putCode.value
  }

  ngOnInit(): void {
    console.log('INIT ', this.affiliationStack.defaultAffiliation.putCode.value)
  }
}
