import { Component, HostBinding, Input, OnInit } from '@angular/core'
import { combineLatest, Observable, of, Subject } from 'rxjs'
import { first, takeUntil } from 'rxjs/operators'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'
import { OrganizationsService, UserService } from 'src/app/core'
import { RecordAffiliationService } from 'src/app/core/record-affiliations/record-affiliations.service'
import { RecordPeerReviewService } from 'src/app/core/record-peer-review/record-peer-review.service'
import { RecordWorksService } from 'src/app/core/record-works/record-works.service'
import { RecordService } from 'src/app/core/record/record.service'
import { OrgDisambiguated } from 'src/app/types'
import { VisibilityStrings } from 'src/app/types/common.endpoint'
import {
  WorkGroup,
  Work,
  WorksEndpoint,
} from 'src/app/types/record-works.endpoint'
import { UserSession } from 'src/app/types/session.local'

@Component({
  selector: 'app-work-stack',
  templateUrl: './work-stack.component.html',
  styleUrls: ['./work-stack.component.scss'],
})
export class WorkStackComponent implements OnInit {
  @HostBinding('class.display-the-stack') displayTheStackClass = false
  _workStack: WorkGroup
  visibility: VisibilityStrings
  @Input()
  set workStack(value: WorkGroup) {
    this._workStack = value
    this.setInitialStates(value)
  }
  get workStack(): WorkGroup {
    return this._workStack
  }

  _displayTheStack = false
  set displayTheStack(mode: boolean) {
    this._displayTheStack = mode
    this.displayTheStackClass = this._displayTheStack
    this.setInitialStates(this.workStack, true)
  }
  get displayTheStack(): boolean {
    return this._displayTheStack
  }

  // orgDisambiguated: { [key: string]: OrgDisambiguated | null } = {}
  stackPanelsDisplay: { [key: string]: { topPanelOfTheStack: boolean } } = {}
  panelDetailsState: {
    [key: string]: {
      state: boolean
    }
  } = {}

  constructor(
    private _workService: RecordWorksService,
    private _organizationsService: OrganizationsService
  ) {}

  /**
   * Set the panelDetails and top of the stack card to default mode
   */
  private setInitialStates(group: WorkGroup, force = false) {
    group.works.forEach((work) => {
      this.setDefaultPanelsDisplay(work, force)
      this.setDefaultPanelDetailsState(work, force)
    })
  }

  /**
   * On start, hide the details for all the panels
   */
  private setDefaultPanelDetailsState(work: Work, force = false) {
    if (this.panelDetailsState[work.putCode.value] === undefined || force) {
      this.panelDetailsState[work.putCode.value] = {
        state: false,
      }
    }
  }

  /**
   * On start, set the preferred source as the top panel of the stack
   */
  private setDefaultPanelsDisplay(work: Work, force = false) {
    if (this.stackPanelsDisplay[work.putCode.value] === undefined || force) {
      this.stackPanelsDisplay[work.putCode.value] = {
        topPanelOfTheStack: this.isPreferred(work) ? true : false,
      }
    }
  }

  isPreferred(affiliation: Work) {
    const response =
      affiliation && this.workStack
        ? this.workStack.defaultPutCode.toString() === affiliation.putCode.value
        : false
    return response
  }

  /**
   * Show and hide details of the panel
   */
  toggleDetails(work: Work) {
    const putCode = work.putCode.value
    this.panelDetailsState[putCode].state = !this.panelDetailsState[putCode]
      .state

    if (this.panelDetailsState[putCode].state) {
      this.getDetails(work).subscribe((response) => {
        // this.orgDisambiguated[putCode] = response[0] || null
      })
    }
  }

  /**
   * Get require extra backend data to display on the panel details
   */
  private getDetails(
    work: Work
  ): Observable<[false | OrgDisambiguated, WorksEndpoint]> {
    const putCode = work.putCode.value

    let $affiliationDisambiguationSource: Observable<
      false | OrgDisambiguated
    > = of(false)
    // // Adds call for disambiguationSource if the affiliation has
    // if (work.disambiguationSource) {
    //   $affiliationDisambiguationSource = this._organizationsService.getOrgDisambiguated(
    //     affiliation.disambiguationSource.value,
    //     affiliation.disambiguatedAffiliationSourceId.value
    //   )
    // }
    const $workDetails = this._workService.getDetails(putCode)

    // Call http requests at the same time
    return combineLatest([$affiliationDisambiguationSource, $workDetails]).pipe(
      first()
    )
  }

  makePrimaryCard(affiliation: Work) {
    // TODO
    console.log(this.stackPanelsDisplay)
  }

  changeTopPanelOfTheStack(work: Work) {
    Object.keys(this.stackPanelsDisplay).forEach((key) => {
      this.stackPanelsDisplay[key].topPanelOfTheStack = false
    })
    this.stackPanelsDisplay[work.putCode.value].topPanelOfTheStack = true
  }

  trackByWorkStack(index, item: Work) {
    return item.putCode.value
  }

  ngOnInit(): void {}
}
