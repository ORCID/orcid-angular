import { Component, HostBinding, Input, OnInit } from '@angular/core'
import { Observable } from 'rxjs'
import { OrganizationsService } from 'src/app/core'
import { RecordFundingsService } from 'src/app/core/record-fundings/record-fundings.service'
import { OrgDisambiguated, UserInfo } from 'src/app/types'
import { Funding, FundingGroup } from 'src/app/types/record-funding.endpoint'
import { first } from 'rxjs/operators'

import { ModalFundingComponent } from '../funding-stacks-groups/modals/modal-funding/modal-funding.component'
import { UserRecord } from 'src/app/types/record.local'

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
  hasExternalIds: boolean
  @Input() userRecord: UserRecord
  @Input()
  set fundingStack(value: FundingGroup) {
    this.hasExternalIds = !!value.externalIdentifiers.length
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

  @Input() isPublicRecord: string
  @Input() userInfo: UserInfo

  orgDisambiguated: { [key: string]: OrgDisambiguated | null } = {}
  stackPanelsDisplay: { [key: string]: { topPanelOfTheStack: boolean } } = {}
  panelDetailsState: {
    [key: string]: {
      state: boolean
    }
  } = {}

  modalFundingComponent = ModalFundingComponent

  constructor(
    private _fundingService: RecordFundingsService,
    private _organizationsService: OrganizationsService
  ) {}

  /**
   * Set the panelDetails and top of the stack card to default mode
   */
  private setFundingsInitialStates(value: FundingGroup, force = false) {
    value.fundings.forEach((funding) => {
      this.setDefaultPanelDetailsState(funding, force)
      this.setDefaultPanelsDisplay(funding, force)
      this.fetchOrganizationData(funding, force)
    })
  }

  /**
   * On start, hide the details for all the panels
   */
  private setDefaultPanelDetailsState(funding: Funding, force = false) {
    if (this.panelDetailsState[funding.putCode.value] === undefined || force) {
      this.panelDetailsState[funding.putCode.value] = {
        state: false,
      }
    }
  }

  /**
   * On start, set the preferred source as the top panel of the stack
   */
  private setDefaultPanelsDisplay(funding: Funding, force = false) {
    if (this.stackPanelsDisplay[funding.putCode.value] === undefined || force) {
      this.stackPanelsDisplay[funding.putCode.value] = {
        topPanelOfTheStack: this.isPreferred(funding) ? true : false,
      }
    }
  }

  private fetchOrganizationData(funding: Funding, force = false) {
    if (funding.disambiguationSource) {
      this._organizationsService
        .getOrgDisambiguated(
          funding.disambiguationSource.value,
          funding.disambiguatedFundingSourceId.value
        )
        .subscribe((response) => {
          this.orgDisambiguated[funding.putCode.value] = response || null
        })
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
    this.panelDetailsState[putCode].state =
      !this.panelDetailsState[putCode].state
    const itemToUpdate = this._fundingStack.fundings.find(
      (x) => x.putCode.value === putCode
    )
    const index = this._fundingStack.fundings.indexOf(itemToUpdate)
    if (
      itemToUpdate.fullyLoaded === undefined ||
      itemToUpdate.fullyLoaded !== true
    ) {
      this.getMoreDetailsFromTheServer(funding)
        .pipe(first())
        .subscribe((response) => {
          this._fundingStack.fundings[index] = response
          this._fundingStack.fundings[index].fullyLoaded = true
        })
    }
  }

  /**
   * Get require extra backend data to display on the panel details
   */
  private getMoreDetailsFromTheServer(funding: Funding): Observable<Funding> {
    const putCode = funding.putCode.value
    if (this.isPublicRecord) {
      return this._fundingService.getPublicFundingDetails(
        this.isPublicRecord,
        putCode
      )
    } else {
      return this._fundingService.getFundingDetails(putCode)
    }
  }

  makePrimaryCard(funding: Funding) {
    this._fundingService
      .updatePreferredSource(funding.putCode.value)
      .subscribe()
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

  userIsSource(funding: Funding): boolean {
    if (this.userInfo) {
      return funding.source === this.userInfo.EFFECTIVE_USER_ORCID
    }
    return false
  }

  ngOnInit(): void {}
}
