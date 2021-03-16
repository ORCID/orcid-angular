import { Component, HostBinding, Input, OnInit } from '@angular/core'
import { combineLatest, Observable, of } from 'rxjs'
import { first } from 'rxjs/operators'
import { OrganizationsService } from 'src/app/core'
import { RecordFundingsService } from 'src/app/core/record-fundings/record-fundings.service'
import { OrgDisambiguated } from 'src/app/types'
import {
  Funding,
  FundingGroup,  
} from 'src/app/types/record-funding.endpoint'

@Component({
  selector: 'app-funding-stack',
  templateUrl: './funding-stack.component.html',
  styleUrls: [
    './funding-stack.component.scss',
    './funding-stack.component.scss-theme.scss',
  ],
})
export class FundingStackComponent implements OnInit {
  @HostBinding('class.display-the-stack') displayTheStackClass = false
  _fundingStack: FundingGroup
  @Input()
  set fundingStack(value: FundingGroup) {
    this._fundingStack = value
    this.setFundingInitialStates(value)
  }
  get fundingStack(): FundingGroup {
    return this._fundingStack
  }

  _displayTheStack = false
  set displayTheStack(mode: boolean) {
    this._displayTheStack = mode
    this.displayTheStackClass = this._displayTheStack
    this.setFundingsInitialStates(this.fundingStack, true)
  }
  get displayTheStack(): boolean {
    return this._displayTheStack
  }

  orgDisambiguated: { [key: string]: OrgDisambiguated | null } = {}
  stackPanelsDisplay: { [key: string]: { topPanelOfTheStack: boolean } } = {}
  panelDetailsState: {
    [key: string]: {
      state: boolean
    }
  } = {}

  constructor(
    private _fundingsService: RecordFundingsService,
    private _organizationsService: OrganizationsService
  ) {}

  /**
   * Set the panelDetails and top of the stack card to default mode
   */
  private setFundingsInitialStates(value: FundingGroup, force = false) {
    value.fundings.forEach((funding) => {
      this.setDefaultPanelsDisplay(funding, force)
      this.setDefaultPanelDetailsState(funding, force)
    })
  }

  /**
   * On start, hide the details for all the panels
   */
  private setDefaultPanelDetailsState(affiliation: Affiliation, force = false) {
    if (
      this.panelDetailsState[affiliation.putCode.value] === undefined ||
      force
    ) {
      this.panelDetailsState[affiliation.putCode.value] = {
        state: false,
      }
    }
  }

  /**
   * On start, set the preferred source as the top panel of the stack
   */
  private setDefaultPanelsDisplay(affiliation: Affiliation, force = false) {
    if (
      this.stackPanelsDisplay[affiliation.putCode.value] === undefined ||
      force
    ) {
      this.stackPanelsDisplay[affiliation.putCode.value] = {
        topPanelOfTheStack: this.isPreferred(affiliation) ? true : false,
      }
    }
  }

  isPreferred(affiliation: Affiliation) {
    const response =
      affiliation && this.affiliationStack
        ? this.affiliationStack.defaultAffiliation.putCode.value ===
          affiliation.putCode.value
        : false
    return response
  }

  /**
   * Show and hide details of the panel
   */
  toggleDetails(affiliation: Affiliation) {
    const putCode = affiliation.putCode.value
    this.panelDetailsState[putCode].state = !this.panelDetailsState[putCode]
      .state

    if (this.panelDetailsState[putCode].state) {
      this.getMoreDetailsAndOrganizationDisambiguatedFromTheServer(
        affiliation
      ).subscribe((response) => {
        this.orgDisambiguated[putCode] = response[0] || null
      })
    } else {
    }
  }

  /**
   * Get require extra backend data to display on the panel details
   */
  private getMoreDetailsAndOrganizationDisambiguatedFromTheServer(
    affiliation: Affiliation
  ): Observable<[false | OrgDisambiguated, AffiliationUIGroup[]]> {
    const putCode = affiliation.putCode.value

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
    return combineLatest([
      $affiliationDisambiguationSource,
      $affiliationDetails,
    ]).pipe(first())
  }

  makePrimaryCard(affiliation: Affiliation) {
    // TODO
    console.log(this.stackPanelsDisplay)
  }

  changeTopPanelOfTheStack(affiliation: Affiliation) {
    Object.keys(this.stackPanelsDisplay).forEach((key) => {
      this.stackPanelsDisplay[key].topPanelOfTheStack = false
    })
    this.stackPanelsDisplay[affiliation.putCode.value].topPanelOfTheStack = true
  }

  trackByAffiliationStack(index, item: Affiliation) {
    return item.putCode.value
  }

  ngOnInit(): void {}
}
