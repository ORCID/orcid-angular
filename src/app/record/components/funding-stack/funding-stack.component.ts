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
  selector: 'app-fundings',
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
    this.setFundingsInitialStates(value)
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
  private setDefaultPanelDetailsState(funding: Funding, force = false) {
    if (
      this.panelDetailsState[funding.putCode.value] === undefined ||
      force
    ) {
      this.panelDetailsState[funding.putCode.value] = {
        state: false,
      }
    }
  }

  /**
   * On start, set the preferred source as the top panel of the stack
   */
  private setDefaultPanelsDisplay(funding: Funding, force = false) {
    if (
      this.stackPanelsDisplay[funding.putCode.value] === undefined ||
      force
    ) {
      this.stackPanelsDisplay[funding.putCode.value] = {
        topPanelOfTheStack: this.isPreferred(funding) ? true : false,
      }
    }
  }

  isPreferred(funding: Funding) {
    const response =
      funding && this.fundingStack
        ? this.fundingStack.defaultFunding.putCode.value ===
          funding.putCode.value
        : false
    return response
  }

  /**
   * Show and hide details of the panel
   */
  toggleDetails(funding: Funding) {
    const putCode = funding.putCode.value
    this.panelDetailsState[putCode].state = !this.panelDetailsState[putCode]
      .state

    if (this.panelDetailsState[putCode].state) {
      this.getMoreDetailsAndOrganizationDisambiguatedFromTheServer(
        funding
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
    funding: Funding
  ): Observable<[false | OrgDisambiguated, Funding]> {
    const putCode = funding.putCode.value

    let $fundingDisambiguationSource: Observable<
      false | OrgDisambiguated
    > = of(false)
    // Adds call for disambiguationSource if the funding has
    if (funding.disambiguationSource) {
      $fundingDisambiguationSource = this._organizationsService.getOrgDisambiguated(
        funding.disambiguationSource.value,
        funding.disambiguatedFundingSourceId.value
      )
    }
    const $fundingDetails = this._fundingsService.getFundingDetails(
      putCode
    )

    // Call http requests at the same time
    return combineLatest([
      $fundingDisambiguationSource,
      $fundingDetails,
    ]).pipe(first())
  }

  makePrimaryCard(funding: Funding) {
    // TODO
    console.log(this.stackPanelsDisplay)
  }

  changeTopPanelOfTheStack(funding: Funding) {
    Object.keys(this.stackPanelsDisplay).forEach((key) => {
      this.stackPanelsDisplay[key].topPanelOfTheStack = false
    })
    this.stackPanelsDisplay[funding.putCode.value].topPanelOfTheStack = true
  }

  trackByFundingStack(index, item: Funding) {
    return item.putCode.value
  }

  ngOnInit(): void {}
}
